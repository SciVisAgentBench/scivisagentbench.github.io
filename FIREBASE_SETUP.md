# Firebase Setup Guide for SciVisAgentBench

This guide will walk you through setting up Firebase for your GitHub Pages website in **less than 30 minutes**.

## Step 1: Create Firebase Project (5 minutes)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Click **"Add project"** or **"Create a project"**

2. **Configure Project**
   - **Project name**: `SciVisAgentBench` (or your preferred name)
   - Click **Continue**
   - **Google Analytics**: Toggle OFF (optional, not needed for this project)
   - Click **Create project**
   - Wait for project creation (~30 seconds)
   - Click **Continue**

## Step 2: Register Your Web App (2 minutes)

1. **Add Web App**
   - On the project overview page, click the **Web icon** `</>`
   - **App nickname**: `SciVisAgentBench-Website`
   - **Firebase Hosting**: Leave UNCHECKED (we're using GitHub Pages)
   - Click **Register app**

2. **Copy Configuration**
   - You'll see a code snippet like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "scivisagentbench.firebaseapp.com",
     projectId: "scivisagentbench",
     storageBucket: "scivisagentbench.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```
   - **COPY THIS** - You'll need it in Step 4
   - Click **Continue to console**

## Step 3: Enable Firebase Services (5 minutes)

### 3A. Enable Firestore Database

1. **Navigate to Firestore**
   - In the left sidebar, click **"Build"** → **"Firestore Database"**
   - Click **"Create database"**

2. **Configure Firestore**
   - **Secure rules for production**: Select **"Start in production mode"**
   - Click **Next**
   - **Location**: Choose closest to your users (e.g., `us-central1`)
   - Click **Enable**
   - Wait for database creation (~1 minute)

3. **Set Security Rules**
   - Click the **"Rules"** tab
   - Replace the content with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Submissions collection
       match /submissions/{submissionId} {
         // Anyone can read submissions
         allow read: if true;

         // Anyone can create submissions with required fields
         allow create: if request.resource.data.keys().hasAll([
           'contributorName',
           'contributorEmail',
           'datasetName',
           'taskDescription'
         ]) && request.resource.data.contributorEmail.matches('.*@.*');

         // Nobody can update or delete (admin only via console)
         allow update, delete: if false;
       }
     }
   }
   ```
   - Click **Publish**

### 3B. Enable Cloud Storage

1. **Navigate to Storage**
   - In the left sidebar, click **"Build"** → **"Storage"**
   - Click **"Get started"**

2. **Configure Storage**
   - **Secure rules**: Select **"Start in production mode"**
   - Click **Next**
   - **Location**: Use the SAME location as Firestore
   - Click **Done**

3. **Set Storage Rules**
   - Click the **"Rules"** tab
   - Replace the content with:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Submissions folder
       match /submissions/{submissionId}/{allPaths=**} {
         // Anyone can read
         allow read: if true;

         // Allow uploads up to 500MB
         allow write: if request.resource.size < 500 * 1024 * 1024;
       }
     }
   }
   ```
   - Click **Publish**

## Step 4: Add Firebase to Your Website (10 minutes)

### 4A. Create Firebase Configuration File

Create a new file: `firebase-config.js`

```javascript
// Firebase Configuration
// Replace with YOUR configuration from Step 2
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const db = firebase.firestore();
const storage = firebase.storage();

console.log('Firebase initialized successfully!');
```

### 4B. Update index.html

Add these lines BEFORE the closing `</body>` tag and BEFORE `<script src="script.js"></script>`:

```html
    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js"></script>

    <!-- Your Firebase Configuration -->
    <script src="firebase-config.js"></script>

    <!-- Your App Logic -->
    <script src="firebase-integration.js"></script>
    <script src="script.js"></script>
</body>
```

## Step 5: Test Your Setup (5 minutes)

### 5A. Test Locally

1. **Start a local server**
   ```bash
   cd SciVisAgentBench-data_collection_page
   python3 -m http.server 8000
   ```

2. **Open browser**
   - Go to: `http://localhost:8000`
   - Open **Developer Console** (F12)
   - Look for: `Firebase initialized successfully!`
   - If you see it → SUCCESS! ✅

### 5B. Test Submission

1. Go to **Submit Dataset** page
2. Fill out the form (all required fields)
3. Upload a small test file
4. Click **Submit**
5. Check Firebase Console:
   - **Firestore**: Should see new document in `submissions` collection
   - **Storage**: Should see files in `submissions/` folder

## Step 6: Deploy to GitHub Pages (5 minutes)

1. **Commit changes**
   ```bash
   git add .
   git commit -m "Add Firebase integration"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repo on GitHub
   - **Settings** → **Pages**
   - **Source**: Deploy from main branch
   - Click **Save**

3. **Wait for deployment** (~2 minutes)
   - URL will be: `https://YOUR_USERNAME.github.io/REPO_NAME/`

4. **Update Firebase Settings**
   - Go back to Firebase Console
   - **Project Settings** (gear icon)
   - Scroll to **"Your apps"**
   - Under your web app, add your GitHub Pages URL to **Authorized domains**

## Troubleshooting

### Error: "Firebase is not defined"
**Solution**: Make sure Firebase SDK scripts load BEFORE your code:
```html
<!-- This order is important -->
<script src="firebase-app-compat.js"></script>
<script src="firebase-firestore-compat.js"></script>
<script src="firebase-storage-compat.js"></script>
<script src="firebase-config.js"></script>  <!-- Your config -->
<script src="script.js"></script>            <!-- Your code -->
```

### Error: "Permission denied" in Firestore
**Solution**: Check your security rules allow the operation

### Error: "Storage upload failed"
**Solution**:
1. Check file size < 500MB
2. Verify storage rules are published
3. Check browser console for specific error

### Files not uploading
**Solution**: Make sure you're using the Firebase Storage upload functions, not localStorage

## Security Notes

⚠️ **Important Security Information**

1. **API Key in Code**: It's OK for your Firebase API key to be public in client-side code. Firebase uses security rules to protect data, not API keys.

2. **Security Rules**: The rules we set up allow:
   - ✅ Anyone can READ submissions (for the dashboard)
   - ✅ Anyone can CREATE submissions (for the form)
   - ❌ Nobody can UPDATE or DELETE (admin only)

3. **File Uploads**: Limited to 500MB per file. Adjust in storage rules if needed.

4. **Rate Limiting**: Firebase has automatic rate limiting, but monitor usage in the console.

## Monitoring Usage

1. **Go to Firebase Console**
2. **Usage tab**: See reads, writes, storage usage
3. **Free tier limits**:
   - Firestore: 50k reads/day, 20k writes/day
   - Storage: 5GB stored, 1GB/day downloaded
   - Typically enough for 1000+ submissions

## Next Steps

After setup is complete:

1. ✅ Test form submission
2. ✅ Verify data in Firestore
3. ✅ Check files in Storage
4. ✅ Test dashboard loads submissions
5. ✅ Deploy to GitHub Pages

## Getting Help

- **Firebase Docs**: https://firebase.google.com/docs/web/setup
- **Firestore Docs**: https://firebase.google.com/docs/firestore
- **Storage Docs**: https://firebase.google.com/docs/storage

Need help? Open an issue on GitHub or check Firebase support!
