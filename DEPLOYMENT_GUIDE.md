# Deployment Guide: Connecting to Cloud Storage

This guide explains how to connect your GitHub Pages site to cloud storage for production use.

## Current Setup (Demo Mode)

The website currently uses **browser LocalStorage** for demonstration. This means:
- Data is stored only in the user's browser
- Data is lost when cache is cleared
- Files are not actually uploaded
- Not suitable for production use

## Production Options

### Option 1: Firebase (Recommended for Beginners) ⭐

**Pros:**
- Free tier: 5GB storage, 50,000 reads/day, 20,000 writes/day
- No backend server needed
- Works directly with GitHub Pages
- Built-in authentication
- Real-time database

**Cons:**
- Vendor lock-in
- Limited to 10GB file uploads

#### Setup Steps

1. **Create Firebase Project**
   ```bash
   # Go to https://console.firebase.google.com/
   # Click "Add project"
   # Name it "scivisagentbench"
   # Enable Google Analytics (optional)
   ```

2. **Enable Firebase Services**
   - **Firestore Database**: For storing submission metadata
   - **Storage**: For storing files (datasets, images)
   - **Authentication** (optional): For contributor accounts

3. **Install Firebase SDK**

   Add to your `index.html` before `</body>`:
   ```html
   <!-- Firebase SDK -->
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js"></script>

   <script>
     // Your Firebase configuration
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
     };

     // Initialize Firebase
     firebase.initializeApp(firebaseConfig);
     const db = firebase.firestore();
     const storage = firebase.storage();
   </script>
   ```

4. **Update JavaScript (replace localStorage)**

   Create `firebase-integration.js`:
   ```javascript
   // Save submission to Firestore
   async function saveSubmission(submission) {
       try {
           // Upload files to Storage
           const fileUrls = await uploadFiles(submission.files);

           // Save metadata to Firestore
           await db.collection('submissions').add({
               ...submission,
               files: fileUrls,
               createdAt: firebase.firestore.FieldValue.serverTimestamp()
           });

           console.log('Submission saved successfully');
           return true;
       } catch (error) {
           console.error('Error saving submission:', error);
           return false;
       }
   }

   // Upload files to Firebase Storage
   async function uploadFiles(files) {
       const uploadedFiles = {};
       const submissionId = Date.now().toString();

       // Upload source data
       if (files.sourceData) {
           const file = files.sourceData;
           const storageRef = storage.ref(`submissions/${submissionId}/source/${file.name}`);
           await storageRef.put(file);
           uploadedFiles.sourceData = await storageRef.getDownloadURL();
       }

       // Upload ground truth images
       if (files.groundTruthImages) {
           uploadedFiles.groundTruthImages = [];
           for (const file of files.groundTruthImages) {
               const storageRef = storage.ref(`submissions/${submissionId}/groundtruth/${file.name}`);
               await storageRef.put(file);
               const url = await storageRef.getDownloadURL();
               uploadedFiles.groundTruthImages.push(url);
           }
       }

       // Upload visualization state
       if (files.vizEngineState) {
           const file = files.vizEngineState;
           const storageRef = storage.ref(`submissions/${submissionId}/state/${file.name}`);
           await storageRef.put(file);
           uploadedFiles.vizEngineState = await storageRef.getDownloadURL();
       }

       // Upload metadata
       if (files.metadataFile) {
           const file = files.metadataFile;
           const storageRef = storage.ref(`submissions/${submissionId}/metadata/${file.name}`);
           await storageRef.put(file);
           uploadedFiles.metadataFile = await storageRef.getDownloadURL();
       }

       return uploadedFiles;
   }

   // Load submissions from Firestore
   async function loadSubmissions() {
       try {
           const snapshot = await db.collection('submissions').get();
           const submissions = [];
           snapshot.forEach(doc => {
               submissions.push({ id: doc.id, ...doc.data() });
           });
           appState.submissions = submissions;
           updateDashboard();
       } catch (error) {
           console.error('Error loading submissions:', error);
       }
   }
   ```

5. **Security Rules**

   In Firebase Console → Firestore Database → Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /submissions/{submission} {
         // Allow anyone to read
         allow read: if true;
         // Allow anyone to create (could add authentication later)
         allow create: if request.resource.data.keys().hasAll([
           'contributorName', 'contributorEmail', 'datasetName'
         ]);
         // Prevent updates and deletes from clients
         allow update, delete: if false;
       }
     }
   }
   ```

   In Firebase Console → Storage → Rules:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /submissions/{submissionId}/{allPaths=**} {
         // Allow uploads up to 500MB
         allow write: if request.resource.size < 500 * 1024 * 1024;
         // Allow anyone to read
         allow read: if true;
       }
     }
   }
   ```

6. **Update Form Submission**

   In `script.js`, replace `handleFormSubmission()`:
   ```javascript
   async function handleFormSubmission(form) {
       const formData = new FormData(form);
       const submission = {
           contributorName: formData.get('contributorName'),
           contributorEmail: formData.get('contributorEmail'),
           // ... collect all form fields
           dataType: formData.getAll('dataType'),
           attributeType: formData.getAll('attributeType'),
           taskTaxonomy: formData.getAll('taskTaxonomy')
       };

       // Collect files
       const files = {
           sourceData: document.getElementById('source-data').files[0],
           groundTruthImages: Array.from(document.getElementById('ground-truth-images').files),
           vizEngineState: document.getElementById('viz-engine-state').files[0],
           metadataFile: document.getElementById('metadata-file').files[0]
       };

       // Show loading message
       showInfo('Uploading files... This may take a few minutes.');

       // Save to Firebase
       const success = await saveSubmission({ ...submission, files });

       if (success) {
           showSuccess('Dataset submitted successfully!');
           form.reset();
           await loadSubmissions(); // Reload dashboard
           navigateToPage('dashboard');
       } else {
           showError('Submission failed. Please try again.');
       }
   }
   ```

---

### Option 2: Netlify + Netlify Functions

**Pros:**
- Free tier: 100GB bandwidth/month
- Serverless functions (backend code)
- Form handling built-in
- Easy GitHub integration

**Cons:**
- Need to write serverless functions
- File storage requires external service (AWS S3, Cloudinary)

#### Setup Steps

1. **Deploy to Netlify**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Initialize in your repo
   cd SciVisAgentBench-data_collection_page
   netlify init
   ```

2. **Create Netlify Function**

   Create `netlify/functions/submit-dataset.js`:
   ```javascript
   const AWS = require('aws-sdk');
   const { v4: uuidv4 } = require('uuid');

   const s3 = new AWS.S3({
       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
       region: process.env.AWS_REGION
   });

   exports.handler = async (event, context) => {
       if (event.httpMethod !== 'POST') {
           return { statusCode: 405, body: 'Method Not Allowed' };
       }

       try {
           const data = JSON.parse(event.body);
           const submissionId = uuidv4();

           // Save to S3 or your database
           // ... implementation here

           return {
               statusCode: 200,
               body: JSON.stringify({ success: true, id: submissionId })
           };
       } catch (error) {
           return {
               statusCode: 500,
               body: JSON.stringify({ error: error.message })
           };
       }
   };
   ```

3. **Update Frontend**
   ```javascript
   async function handleFormSubmission(form) {
       const formData = new FormData(form);

       const response = await fetch('/.netlify/functions/submit-dataset', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(Object.fromEntries(formData))
       });

       const result = await response.json();
       // Handle result
   }
   ```

---

### Option 3: GitHub + AWS S3 (Most Scalable)

**Pros:**
- Most control and flexibility
- Scalable to any size
- Industry standard

**Cons:**
- Most complex setup
- Requires backend server (AWS Lambda or separate server)
- Costs money (but cheap for small scale: ~$1-5/month)

#### Setup Steps

1. **Create AWS Account**
   - Sign up at https://aws.amazon.com
   - Create S3 bucket: `scivisagentbench-datasets`

2. **Set Up CORS on S3**
   ```json
   [
       {
           "AllowedHeaders": ["*"],
           "AllowedMethods": ["PUT", "POST", "GET"],
           "AllowedOrigins": ["https://yourusername.github.io"],
           "ExposeHeaders": ["ETag"]
       }
   ]
   ```

3. **Create AWS Lambda Function**

   Function to generate presigned URLs for uploads:
   ```javascript
   const AWS = require('aws-sdk');
   const s3 = new AWS.S3();

   exports.handler = async (event) => {
       const { fileName, fileType } = JSON.parse(event.body);

       const params = {
           Bucket: 'scivisagentbench-datasets',
           Key: `submissions/${Date.now()}-${fileName}`,
           Expires: 600, // 10 minutes
           ContentType: fileType
       };

       const uploadURL = await s3.getSignedUrlPromise('putObject', params);

       return {
           statusCode: 200,
           headers: { 'Access-Control-Allow-Origin': '*' },
           body: JSON.stringify({ uploadURL })
       };
   };
   ```

4. **Update Frontend**
   ```javascript
   async function uploadFile(file) {
       // Get presigned URL
       const response = await fetch('YOUR_LAMBDA_URL', {
           method: 'POST',
           body: JSON.stringify({
               fileName: file.name,
               fileType: file.type
           })
       });

       const { uploadURL } = await response.json();

       // Upload file directly to S3
       await fetch(uploadURL, {
           method: 'PUT',
           body: file,
           headers: { 'Content-Type': file.type }
       });

       return uploadURL.split('?')[0]; // Return file URL
   }
   ```

---

### Option 4: Formspree / Form Backends (Simplest)

**Pros:**
- Easiest setup (5 minutes)
- No coding required
- Free tier: 50 submissions/month

**Cons:**
- Limited file upload (10MB)
- No custom logic
- Not suitable for large datasets

#### Setup

1. Sign up at https://formspree.io
2. Create a form
3. Update HTML:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
       <!-- Your form fields -->
   </form>
   ```

**Not recommended for this project due to large file sizes.**

---

## Comparison Table

| Feature | Firebase | Netlify | AWS | Formspree |
|---------|----------|---------|-----|-----------|
| Ease of Setup | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Free Tier | 5GB storage | 100GB bandwidth | 5GB storage | 50 submissions |
| File Size Limit | 5GB | Unlimited* | Unlimited | 10MB |
| Cost (100 datasets) | Free | $0-5/mo | $2-10/mo | $10/mo |
| Backend Code | No | Yes (optional) | Yes | No |
| Database | Built-in | External | External | No |
| Best For | Quick start | Medium projects | Large scale | Small forms |

*Requires external storage

---

## Recommended Approach for Your Project

**For Production with GitHub Pages → Use Firebase**

### Why Firebase?
1. **No backend server needed** - Works directly from GitHub Pages
2. **Free tier is generous** - Suitable for 100-1000 submissions
3. **Built-in file storage** - No need for separate S3
4. **Real-time updates** - Dashboard updates automatically
5. **Authentication ready** - Can add login later if needed

### Quick Start (30 minutes)

1. Create Firebase project: https://console.firebase.google.com/
2. Add Firebase SDK to `index.html` (see code above)
3. Copy the `firebase-integration.js` code
4. Update security rules
5. Replace localStorage calls with Firebase calls
6. Push to GitHub

### Step-by-Step Tutorial

I can create a complete `FIREBASE_SETUP.md` with:
- Screenshots of Firebase console
- Complete code for integration
- Testing instructions
- Deployment checklist

Would you like me to create that detailed Firebase setup guide?

---

## Alternative: Self-Hosted Backend

If you want full control, you can deploy your own backend:

1. **DigitalOcean App Platform** ($5/month)
2. **Heroku** (Free tier discontinued, $5/month now)
3. **Railway** (Free $5 credit/month)
4. **Render** (Free tier available)

Let me know which option you'd like to pursue, and I can provide detailed implementation!
