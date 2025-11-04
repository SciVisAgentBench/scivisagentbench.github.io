# Handling Large Files (> 500MB)

This guide explains how to handle datasets larger than Firebase's practical limits.

## Firebase Limits Summary

| Tier | Storage Limit | File Size Limit | Best For |
|------|---------------|-----------------|----------|
| Free | 5 GB total | 5 GB per file | Small datasets (< 500MB) |
| Paid | Unlimited | 5 GB per file | Medium datasets (< 2GB) |

## Recommended Approach: Hybrid Storage

### Strategy
- **Small files (< 100MB)**: Upload to Firebase
- **Medium files (100MB - 500MB)**: Firebase with warning
- **Large files (> 500MB)**: External storage (Zenodo, AWS S3, etc.)

## Implementation Options

### Option 1: Warn Users About Large Files

Add file size check to the form:

```javascript
// In script.js, add to form initialization
document.getElementById('source-data').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const sizeMB = file.size / (1024 * 1024);
    const warningDiv = document.getElementById('file-size-warning');

    if (sizeMB > 500) {
        warningDiv.innerHTML = `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 1rem; border-radius: 0.5rem; margin-top: 0.5rem;">
                <strong>⚠️ Large File Detected (${sizeMB.toFixed(0)} MB)</strong>
                <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem;">
                    This file is very large. Consider:
                    <ul style="margin: 0.5rem 0 0 1.5rem; font-size: 0.875rem;">
                        <li>Compressing the data</li>
                        <li>Uploading to Zenodo or Figshare and providing the link</li>
                        <li>Using a smaller representative subset</li>
                    </ul>
                </p>
            </div>
        `;
        warningDiv.style.display = 'block';
    } else if (sizeMB > 100) {
        warningDiv.innerHTML = `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 0.75rem; border-radius: 0.5rem; margin-top: 0.5rem;">
                <strong>📦 Medium File (${sizeMB.toFixed(0)} MB)</strong>
                <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem;">
                    Upload may take a few minutes. Please don't close this page.
                </p>
            </div>
        `;
        warningDiv.style.display = 'block';
    } else {
        warningDiv.style.display = 'none';
    }
});
```

Add this div to the HTML:
```html
<div class="form-group full-width">
    <label for="source-data">Source Data File *</label>
    <input type="file" id="source-data" name="sourceData" required>
    <small>Any format accepted (Max recommended: 500MB)</small>
    <div id="file-size-warning" style="display: none;"></div>
</div>
```

### Option 2: Add External Link Field

For datasets too large for Firebase, provide a URL field:

```html
<!-- Add to index.html in the File Uploads section -->
<div class="form-group full-width">
    <label for="external-data-url">Or Provide External Data Link</label>
    <input type="url" id="external-data-url" name="externalDataUrl"
           placeholder="https://zenodo.org/record/...">
    <small>For datasets > 500MB, upload to Zenodo/Figshare/etc. and provide the link here</small>
</div>
```

### Option 3: Automatic Large File Handling

Modify `firebase-integration.js` to automatically handle large files:

```javascript
// Add this constant at the top
const MAX_FIREBASE_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB

// Modify uploadFilesToStorage function
async function uploadFilesToStorage(submissionId, files) {
    const uploadedFiles = {
        sourceData: null,
        groundTruthImages: [],
        vizEngineState: null,
        metadataFile: null,
        requiresExternalStorage: false
    };

    // Check source data size
    if (files.sourceData) {
        if (files.sourceData.size > MAX_FIREBASE_UPLOAD_SIZE) {
            // Too large for Firebase
            uploadedFiles.sourceData = {
                name: files.sourceData.name,
                size: files.sourceData.size,
                type: files.sourceData.type,
                status: 'TOO_LARGE',
                message: 'File exceeds 100MB limit. Please upload to external storage and provide link.'
            };
            uploadedFiles.requiresExternalStorage = true;

            alert(`Source data file (${(files.sourceData.size / (1024*1024)).toFixed(0)}MB) is too large for automatic upload.\n\nPlease upload to Zenodo (zenodo.org) or Figshare (figshare.com) and provide the link.`);

            throw new Error('File too large for Firebase storage');
        } else {
            // Upload normally
            updateProgress('Uploading source data...', 10);
            const url = await uploadFile(
                files.sourceData,
                `submissions/${submissionId}/source/${files.sourceData.name}`
            );
            uploadedFiles.sourceData = {
                name: files.sourceData.name,
                url: url,
                size: files.sourceData.size,
                type: files.sourceData.type
            };
        }
    }

    // ... rest of the function
}
```

## External Storage Options

### Zenodo (Recommended for Academic Datasets)

**Pros:**
- Free, unlimited storage
- 50 GB per dataset
- DOI automatically assigned
- Versioning support
- Permanent archival
- Trusted by academic community

**How to use:**
1. Go to https://zenodo.org/
2. Sign up (free)
3. Click "Upload" → "New upload"
4. Upload your dataset
5. Fill in metadata
6. Publish (or keep draft)
7. Copy the DOI/URL
8. Paste into your submission form

**Example URL:**
```
https://zenodo.org/record/7654321
https://doi.org/10.5281/zenodo.7654321
```

### Figshare (Alternative)

**Pros:**
- Free, unlimited storage
- 20 GB per file
- DOI assigned
- Good for datasets and figures

**How to use:**
1. Go to https://figshare.com/
2. Upload dataset
3. Get DOI
4. Use in submission form

### AWS S3 (For Production Scale)

**Pros:**
- Virtually unlimited
- Very reliable
- Good for institutional hosting

**Cons:**
- Costs money (~$0.023/GB/month)
- Requires AWS account

**When to use:**
- Institutional deployment
- Many TB of data
- Need programmatic access

## Recommended File Size Guidelines

Update your form documentation:

```markdown
### File Size Recommendations

| File Type | Recommended | Maximum | Action if Larger |
|-----------|-------------|---------|------------------|
| Source Data | < 100 MB | 500 MB | Upload to Zenodo |
| Ground Truth Images | < 10 MB each | 50 MB | Compress images |
| Viz State | < 5 MB | 20 MB | OK as-is |
| Metadata | < 1 MB | 5 MB | OK as-is |

**For datasets > 500MB:**
1. Upload to Zenodo.org
2. Get the DOI/URL
3. Provide link in the "External Data Link" field
4. Still upload ground truth images (these are usually smaller)
```

## Update Info Box in HTML

```html
<div class="info-box">
    <h4>📁 About File Uploads & Size Limits</h4>
    <p>Currently, files are stored in Firebase Cloud Storage (free tier: 5GB total).</p>
    <ul>
        <li><strong>Recommended:</strong> Individual files &lt; 100MB</li>
        <li><strong>Maximum:</strong> 500MB per file</li>
        <li><strong>For larger datasets:</strong> Upload to <a href="https://zenodo.org" target="_blank">Zenodo</a> or <a href="https://figshare.com" target="_blank">Figshare</a> and provide the link</li>
        <li><strong>Ground truth images:</strong> PNG/JPG, 5-10MB each</li>
    </ul>
    <p style="margin-top: 0.5rem;"><strong>Why these limits?</strong> Firebase free tier provides 5GB total storage, suitable for ~50-100 datasets. For larger community use, consider upgrading to Firebase paid tier or using institutional storage.</p>
</div>
```

## Cost Analysis for Larger Scale

If you expect many large files, here are the costs:

### Firebase Blaze Plan (Pay-as-you-go)
```
100 datasets × 200MB = 20 GB
Cost: 20 GB × $0.026/GB = $0.52/month storage
     + download bandwidth charges
Total: ~$2-5/month for moderate use
```

### AWS S3
```
100 datasets × 200MB = 20 GB
Cost: 20 GB × $0.023/GB = $0.46/month storage
     + $0.09/GB download (first 10TB)
Total: ~$1-3/month for moderate use
```

### Zenodo
```
Unlimited datasets
Cost: FREE
Limit: 50 GB per upload
Total: $0/month
```

## Decision Matrix

| Scenario | Recommendation | Why |
|----------|----------------|-----|
| Small datasets (< 100MB) | Firebase free tier | Easy, no cost |
| Medium datasets (100-500MB) | Firebase paid tier | Still easy, low cost |
| Large datasets (> 500MB) | Zenodo + Firebase | Free, academic standard |
| Massive scale (TB+) | AWS S3 + metadata in Firebase | Scalable, professional |
| Academic research | Zenodo (data) + Firebase (metadata) | DOI, permanent, free |

## Implementation Checklist

To implement large file handling:

- [ ] Add file size check on form
- [ ] Add warning for files > 100MB
- [ ] Add "External Data Link" field
- [ ] Update info box with size limits
- [ ] Test with various file sizes
- [ ] Document Zenodo upload process
- [ ] Update CONTRIBUTING.md with guidelines

## Summary

**Current Setup:**
- ✅ Handles files up to 500MB (with Firebase free tier limits)
- ✅ Suitable for 50-100 submissions with typical scientific data
- ✅ No configuration needed

**For Larger Scale:**
- Use hybrid approach: Metadata in Firebase, large files on Zenodo
- Cost: Still mostly FREE
- Scalability: Handles datasets of any size

Would you like me to implement any of these large file handling options?
