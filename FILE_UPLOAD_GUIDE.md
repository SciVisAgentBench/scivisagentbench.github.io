# File Upload Implementation Guide

This guide explains how file uploads work in the SciVisAgentBench data collection website and how to implement backend storage for production use.

## Current Implementation (Demo Mode)

The current website uses **browser LocalStorage** to simulate file uploads. This means:

- Files are NOT actually uploaded to a server
- File metadata (name, size, type) is stored in LocalStorage
- Data persists only in the user's browser
- Maximum storage: ~5-10MB (browser dependent)
- Data is lost if browser cache is cleared

### How Demo Mode Works

```javascript
// When user selects a file
const fileInput = document.getElementById('sourceData');
const file = fileInput.files[0];

// Store only metadata
const fileData = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
};

// Save to localStorage
localStorage.setItem('submission', JSON.stringify({
    ...formData,
    files: fileData
}));
```

**Important**: Demo mode is only suitable for testing the website interface, not for collecting actual datasets.

## Production Implementation Options

For production use, you need a backend server to handle file uploads and storage. Here are three recommended approaches:

### Option 1: Node.js + Express + AWS S3 (Recommended)

**Architecture**:
```
Browser → Express Server → AWS S3 Storage
                ↓
            PostgreSQL Database
```

**Advantages**:
- Scalable storage (unlimited size)
- Reliable and industry-standard
- Good for large scientific datasets
- Built-in access control

**Implementation Steps**:

1. **Install Dependencies**:
```bash
npm init -y
npm install express multer aws-sdk pg dotenv cors
```

2. **Create Backend Server** (`server.js`):
```javascript
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
});

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Configure PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// File upload endpoint
app.post('/api/submit-dataset',
    upload.fields([
        { name: 'sourceData', maxCount: 1 },
        { name: 'groundTruthImages', maxCount: 10 },
        { name: 'vizEngineState', maxCount: 1 },
        { name: 'metadataFile', maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const { body, files } = req;
            const submissionId = generateUniqueId();

            // Upload files to S3
            const fileUrls = {};
            for (const [fieldName, fileArray] of Object.entries(files)) {
                fileUrls[fieldName] = [];

                for (const file of fileArray) {
                    const key = `submissions/${submissionId}/${file.originalname}`;

                    await s3.upload({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: key,
                        Body: file.buffer,
                        ContentType: file.mimetype
                    }).promise();

                    fileUrls[fieldName].push({
                        filename: file.originalname,
                        s3Key: key,
                        size: file.size
                    });
                }
            }

            // Save metadata to database
            await pool.query(
                `INSERT INTO submissions
                (id, contributor_name, contributor_email, dataset_name,
                 data_source, data_type, vis_task, task_description,
                 eval_criteria, files, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
                [
                    submissionId,
                    body.contributorName,
                    body.contributorEmail,
                    body.datasetName,
                    body.dataSource,
                    JSON.stringify(body.dataType),
                    JSON.stringify(body.visTask),
                    body.taskDescription,
                    body.evalCriteria,
                    JSON.stringify(fileUrls)
                ]
            );

            res.json({
                success: true,
                submissionId,
                message: 'Dataset submitted successfully!'
            });

        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                success: false,
                message: 'Upload failed. Please try again.'
            });
        }
    }
);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

3. **Update Frontend** (`script.js`):
```javascript
async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const response = await fetch('https://your-api.com/api/submit-dataset', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showSuccessMessage('Dataset submitted successfully!');
            document.getElementById('submission-form').reset();
        } else {
            showErrorMessage(result.message);
        }
    } catch (error) {
        showErrorMessage('Upload failed. Please check your connection.');
    }
}
```

4. **Environment Variables** (`.env`):
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=scivisagentbench-datasets
DATABASE_URL=postgresql://user:password@localhost:5432/scivisagent
```

**File Size Limits**: AWS S3 supports files up to 5TB. Recommended limits:
- Per file: 500MB (configurable)
- Per submission: 1GB total
- Ground truth images: 50MB each

**Cost Estimate** (AWS S3):
- Storage: $0.023/GB per month
- Data transfer: $0.09/GB (first 10TB)
- For 100 submissions (~50GB): ~$2/month

### Option 2: GitHub Large File Storage (LFS)

**Architecture**:
```
Browser → GitHub API → GitHub LFS Storage
```

**Advantages**:
- Integrated with GitHub
- Simple authentication
- Good for open-source projects
- Version control for datasets

**Limitations**:
- 2GB per file limit
- 1GB per month free bandwidth
- Must install Git LFS

**Implementation Steps**:

1. **Enable Git LFS**:
```bash
git lfs install
git lfs track "*.vtk" "*.nii.gz" "*.h5" "*.png"
git add .gitattributes
```

2. **Backend Script** (`upload-to-github.js`):
```javascript
const { Octokit } = require('@octokit/rest');
const fs = require('fs');

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

async function uploadDataset(submission) {
    const owner = 'your-username';
    const repo = 'scivisagentbench-datasets';
    const branch = 'main';
    const path = `submissions/${submission.id}`;

    // Create directory structure
    await createDirectory(owner, repo, path);

    // Upload each file
    for (const file of submission.files) {
        const content = fs.readFileSync(file.path);

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: `${path}/${file.name}`,
            message: `Add dataset: ${submission.datasetName}`,
            content: content.toString('base64'),
            branch
        });
    }
}
```

**File Size Limits**:
- Individual file: 2GB maximum
- Repository: 10GB recommended
- LFS storage: 1GB free, then paid tiers

**Cost Estimate** (GitHub LFS):
- Free tier: 1GB storage + 1GB bandwidth/month
- Data pack: $5/month for 50GB storage + 50GB bandwidth

### Option 3: Self-Hosted with MinIO

**Architecture**:
```
Browser → Express Server → MinIO (S3-compatible)
```

**Advantages**:
- Full control over data
- No cloud costs
- S3-compatible API
- Good for institutional hosting

**Implementation Steps**:

1. **Install MinIO**:
```bash
# Docker deployment
docker run -p 9000:9000 -p 9001:9001 \
  --name minio \
  -v /mnt/data:/data \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=password" \
  minio/minio server /data --console-address ":9001"
```

2. **Backend Configuration** (similar to AWS S3 example):
```javascript
const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'admin',
    secretKey: 'password'
});

// Upload function
async function uploadToMinio(file, bucketName, objectName) {
    await minioClient.putObject(
        bucketName,
        objectName,
        file.buffer,
        file.size,
        {
            'Content-Type': file.mimetype
        }
    );
}
```

**File Size Limits**: No practical limit (depends on disk space)

**Cost**: Only infrastructure costs (server, storage)

## Database Schema

Regardless of storage backend, you need a database to store submission metadata:

```sql
CREATE TABLE submissions (
    id VARCHAR(50) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),

    -- Contributor info
    contributor_name VARCHAR(255) NOT NULL,
    contributor_email VARCHAR(255) NOT NULL,
    contributor_institution VARCHAR(255) NOT NULL,
    contributor_orcid VARCHAR(50),

    -- Dataset metadata
    dataset_name VARCHAR(255) NOT NULL,
    dataset_description TEXT NOT NULL,

    -- Classification
    data_source VARCHAR(50) NOT NULL,
    data_source_other VARCHAR(255),
    data_type JSONB NOT NULL,
    vis_task JSONB NOT NULL,
    vis_task_other VARCHAR(255),
    interaction JSONB,

    -- Task info
    complexity VARCHAR(20) NOT NULL,
    task_description TEXT NOT NULL,
    eval_criteria TEXT NOT NULL,
    use_image_metrics BOOLEAN DEFAULT false,

    -- Files (stored as JSON with S3 keys or URLs)
    files JSONB NOT NULL,

    -- Additional
    additional_notes TEXT,
    agree_to_terms BOOLEAN NOT NULL
);

CREATE TABLE contributors (
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    orcid VARCHAR(50),
    total_contributions INT DEFAULT 0,
    first_contribution TIMESTAMP DEFAULT NOW(),
    last_contribution TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_data_source ON submissions(data_source);
CREATE INDEX idx_complexity ON submissions(complexity);
CREATE INDEX idx_contributor ON submissions(contributor_email);
```

## API Endpoints

Your backend should provide these endpoints:

### POST /api/submit-dataset
Submit a new dataset with files.

**Request**: multipart/form-data
**Response**:
```json
{
    "success": true,
    "submissionId": "abc123",
    "message": "Dataset submitted successfully"
}
```

### GET /api/submissions
Get all submissions (for dashboard).

**Response**:
```json
{
    "submissions": [
        {
            "id": "abc123",
            "datasetName": "Brain MRI Volume",
            "contributor": "Dr. Jane Smith",
            "dataSource": "medical",
            "complexity": "medium",
            "createdAt": "2025-01-15T10:30:00Z"
        }
    ],
    "stats": {
        "totalSubmissions": 42,
        "contributors": 15,
        "categoryCounts": {
            "medical": 12,
            "simulation": 18,
            "molecular": 12
        }
    }
}
```

### GET /api/submissions/:id
Get details of a specific submission.

### GET /api/download/:id/:filename
Download a specific file from a submission.

### GET /api/contributors
Get contributor statistics.

## Security Considerations

1. **Authentication**: Use JWT tokens or OAuth for authenticated submissions
2. **File Validation**:
   - Check file types (whitelist: .vtk, .nii.gz, .png, etc.)
   - Scan for malware using ClamAV
   - Validate file size before upload
3. **Rate Limiting**: Prevent abuse with rate limiting (e.g., 5 submissions per hour per IP)
4. **CORS**: Configure properly for GitHub Pages origin
5. **Input Sanitization**: Validate all form inputs on backend

```javascript
// Example validation
const allowedExtensions = ['.vtk', '.vti', '.vtu', '.nii', '.nii.gz', '.h5', '.hdf5', '.png', '.jpg'];
const maxFileSize = 500 * 1024 * 1024; // 500MB

function validateFile(file) {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
        throw new Error(`File type ${ext} not allowed`);
    }

    if (file.size > maxFileSize) {
        throw new Error(`File size exceeds ${maxFileSize / (1024*1024)}MB limit`);
    }

    return true;
}
```

## Deployment Checklist

- [ ] Choose storage backend (AWS S3 / GitHub LFS / MinIO)
- [ ] Set up database (PostgreSQL recommended)
- [ ] Implement file upload API
- [ ] Add authentication/authorization
- [ ] Configure CORS for GitHub Pages
- [ ] Set file size limits
- [ ] Add file validation and security checks
- [ ] Implement rate limiting
- [ ] Set up backup strategy
- [ ] Configure monitoring and logging
- [ ] Test with large files
- [ ] Update frontend to use production API

## Recommended File Size Limits

| File Type | Recommended Limit | Maximum |
|-----------|------------------|---------|
| Source Data (VTK, NIfTI, etc.) | 200-500MB | 2GB |
| Ground Truth Images (PNG) | 10MB each | 50MB |
| Visualization State (ParaView) | 5MB | 20MB |
| Metadata (JSON) | 1MB | 5MB |
| **Total per submission** | **< 1GB** | **2GB** |

For larger datasets, consider:
- Compression (gzip for text formats)
- Downsampling for ground truth images
- Splitting large datasets into chunks
- Providing download links instead of direct uploads

## Access Patterns

After submission, datasets should be accessible via:

1. **Web Dashboard**: Browse and search submissions
2. **REST API**: Programmatic access for benchmark automation
3. **Direct Download**: Signed URLs for file downloads
4. **GitHub Release**: Periodic releases with all datasets bundled

Example directory structure:
```
scivisagentbench-datasets/
├── submissions/
│   ├── brain_mri_001/
│   │   ├── submission.json
│   │   ├── data/
│   │   │   └── brain_t1.nii.gz
│   │   ├── ground_truth/
│   │   │   ├── view_front.png
│   │   │   ├── view_side.png
│   │   │   └── view_top.png
│   │   └── state/
│   │       └── paraview_state.pvsm
│   └── fluid_sim_002/
│       └── ...
```

## Next Steps

1. Review the three backend options and choose one based on your needs
2. Set up the infrastructure (cloud account, database, etc.)
3. Implement the backend API following the examples above
4. Update the frontend JavaScript to connect to your API
5. Test thoroughly with various file sizes and types
6. Deploy to production and announce to the community

For questions or help with implementation, please open an issue on GitHub.
