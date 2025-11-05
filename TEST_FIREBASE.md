# Test Your Firebase Setup

Your Firebase configuration is now ready! Follow these steps to test it.

## ✅ Configuration Complete

Your `firebase-config.js` has been updated with:
- **Project ID**: `scivisagentbench-datacollect`
- **API Key**: Configured ✅
- **Storage**: Ready ✅
- **Firestore**: Ready ✅

## Step 1: Test Locally (5 minutes)

### Start Local Server

Open terminal and run:

```bash
cd /Users/kuangshiai/Documents/ND-VIS/SciVisAgentBench-data_collection_page

# Start local server
python3 -m http.server 8000
```

**You should see:**
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

### Open in Browser

1. **Open**: http://localhost:8000
2. **Open Developer Console**: Press `F12` or `Cmd+Option+I` (Mac)
3. **Go to Console tab**

### ✅ Check for Success Messages

You should see these messages in the console:

```
✅ Firebase initialized successfully!
📦 Project ID: scivisagentbench-datacollect
🔥 Firestore ready
📁 Storage ready
Firebase integration active
```

**If you see these messages → SUCCESS!** 🎉

### ❌ If You See Errors

**Error: "Firebase is not defined"**
- Solution: Make sure you're using `http://localhost:8000` (not `file://`)
- Reload the page

**Error: "Firebase App named '[DEFAULT]' already exists"**
- Solution: This is OK, just refresh the page once

**Error: "Permission denied"**
- Solution: Your Firestore/Storage rules aren't set up yet (see Step 2 below)

## Step 2: Test Form Submission (10 minutes)

### 2A. Prepare a Test File

Create a small test file (< 5MB):
1. Open any text editor
2. Type some text: "Test data for SciVisAgentBench"
3. Save as `test-data.txt` on your desktop

### 2B. Fill Out the Form

1. **Navigate to "Submit Dataset"** page
2. **Fill in ALL required fields**:

   **Contributor Info:**
   - Name: `Test User`
   - Email: `test@example.com`
   - Institution: `Test University`

   **Dataset Info:**
   - Name: `Test Dataset Firebase`
   - Description: `Testing Firebase integration`

   **Application Domain:**
   - Select: `Simulation Data`

   **Data Type:**
   - Check: `Image Data`

   **Temporal Dimension:**
   - Select: `Static/Single-Timestep`

   **Attribute Types:**
   - Check: `Scalar Fields`

   **Task Taxonomy:**
   - Check: `Extraction & Subsetting`
   - Check: `Data Understanding & Exploration`

   **Task Complexity:**
   - Select: `Easy`

   **Task Description:**
   ```
   This is a test submission to verify Firebase integration is working correctly.
   ```

   **Evaluation Criteria:**
   ```
   Test criteria: 1) Upload successful (10 pts)
   ```

   **File Uploads:**
   - Source Data: Upload your `test-data.txt`
   - Ground Truth: Upload any small image (or same text file)

3. **Check the terms agreement box**

4. **Click "Submit Contribution"**

### 2C. Watch the Upload Progress

You should see:
1. **Progress bar appears** showing:
   - "Uploading files..." (10%)
   - "Uploading source data..." (30%)
   - "Uploading ground truth images..." (60%)
   - "Saving submission data..." (80%)
   - "Complete!" (100%)

2. **Success message**:
   ```
   Thank you for your contribution! Your dataset submission has been received.
   ```

3. **Redirected to Dashboard** automatically

### 2D. Check the Dashboard

The dashboard should now show:
- **Total Datasets**: 1
- **Total Contributors**: 1
- **Attribute Types**: Scalar Fields (1)
- **Atomic Operations**: Extraction & Subsetting (1), etc.
- **Contributors Table**: Shows "Test User" with 1 submission

**If you see this → Firebase is working!** 🎉

## Step 3: Verify in Firebase Console

### 3A. Check Firestore Database

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `scivisagentbench-datacollect`
3. **Click "Firestore Database"** (left sidebar)
4. **You should see**:
   - Collection: `submissions`
   - 1 Document with a random ID
   - Click on it to see your data

**Expected fields:**
```
contributorName: "Test User"
contributorEmail: "test@example.com"
datasetName: "Test Dataset Firebase"
applicationDomain: "simulation"
dataType: ["image-data"]
attributeType: ["scalar-fields"]
taskTaxonomy: ["extraction-subsetting", "data-exploration"]
timestamp: (current date/time)
files: { sourceData: {...}, groundTruthImages: [...] }
```

### 3B. Check Cloud Storage

1. **Click "Storage"** (left sidebar)
2. **Click on "submissions" folder**
3. **You should see**: A folder with a timestamp/ID name
4. **Click on it** to see:
   - `source/` folder with your uploaded data file
   - `groundtruth/` folder with your uploaded images

**Click on a file** → Should show download URL and details

**If you see your files → Complete success!** 🎉

## Step 4: Test from Another Browser/Device

This tests real cloud functionality:

1. **Open a different browser** (e.g., if you used Chrome, try Firefox)
   - Or use Incognito/Private mode
   - Or use your phone

2. **Go to**: http://localhost:8000

3. **Navigate to Dashboard**

4. **You should see the same data** - the test submission you just made!

**This proves data is in Firebase, not just localStorage!**

## Step 5: Clean Up Test Data (Optional)

If you want to delete the test submission:

### In Firebase Console:

1. **Firestore**: Select the test document → Click "Delete document"
2. **Storage**: Select the submission folder → Click "Delete"

### Or Keep It:

It's fine to keep the test submission! It shows Firebase is working.

## Troubleshooting

### Issue: Upload Never Completes

**Symptoms**: Progress bar stuck at "Uploading..."

**Solutions:**
1. Check file size < 500MB
2. Check Storage rules are set (see below)
3. Check browser console for errors

### Issue: "Permission denied" Error

**Cause**: Firestore/Storage rules not set up

**Solution - Set Firestore Rules:**

1. Firebase Console → Firestore Database → Rules tab
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{submissionId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll([
        'contributorName', 'contributorEmail', 'datasetName'
      ]);
      allow update, delete: if false;
    }
  }
}
```

3. Click **"Publish"**

**Solution - Set Storage Rules:**

1. Firebase Console → Storage → Rules tab
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /submissions/{submissionId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 500 * 1024 * 1024;
    }
  }
}
```

3. Click **"Publish"**

### Issue: Console Shows Errors

**Common errors and fixes:**

1. **"Failed to get document"**
   - Firestore rules not set
   - Set rules as shown above

2. **"storage/unauthorized"**
   - Storage rules not set
   - Set rules as shown above

3. **"quota-exceeded"**
   - Free tier limit reached (5GB)
   - Delete some test data or upgrade plan

## Success Checklist

Before deploying to GitHub, verify:

- [ ] Local server shows Firebase initialized ✅
- [ ] Console shows no errors ✅
- [ ] Form submission shows progress bar ✅
- [ ] Success message appears ✅
- [ ] Dashboard updates with new submission ✅
- [ ] Data visible in Firestore Console ✅
- [ ] Files visible in Storage Console ✅
- [ ] Data persists in different browser ✅

**All checked? You're ready to deploy!**

## Next Step: Deploy to GitHub

Once local testing works, deploy to GitHub:

```bash
# Commit the changes
git add .
git commit -m "Add Firebase configuration and integration"
git push

# Wait ~2 minutes for GitHub Pages to update
# Then visit: https://YOUR_USERNAME.github.io/SciVisAgentBench-data-collection/
```

Your live site will now have full Firebase functionality! 🚀

## Need Help?

**Still seeing issues?**
1. Take a screenshot of:
   - Browser console errors
   - Firebase Console (Firestore and Storage)
2. Check that you completed all steps in `FIREBASE_SETUP.md`
3. Verify rules are published (not just saved)

---

**Ready to deploy?** Follow the commands above and your site will be live with Firebase!
