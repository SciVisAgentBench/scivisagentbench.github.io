# Firebase Quick Start - 5 Steps

Complete Firebase setup in **less than 30 minutes**! Follow these 5 steps in order.

## ✅ Step 1: Create Firebase Project (5 min)

1. Go to https://console.firebase.google.com/
2. Click **"Add project"** → Name it `SciVisAgentBench`
3. Disable Google Analytics → Click **"Create project"**
4. Wait ~30 seconds → Click **"Continue"**

## ✅ Step 2: Register Web App (3 min)

1. On the project overview page, click the **Web icon** `</>`
2. **App nickname**: `SciVisAgentBench-Website`
3. **Hosting**: Leave UNCHECKED
4. Click **"Register app"**
5. **COPY the configuration code** (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIza....",
  authDomain: "scivisagentbench.firebaseapp.com",
  projectId: "scivisagentbench",
  storageBucket: "scivisagentbench.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123"
};
```

6. Click **"Continue to console"**

## ✅ Step 3: Enable Services (7 min)

### 3A. Firestore Database

1. Left sidebar → **"Firestore Database"** → **"Create database"**
2. **Start in production mode** → Next
3. **Location**: Choose `us-central1` (or closest to you) → Enable
4. Wait ~1 minute for creation
5. Click **"Rules"** tab → Paste this:

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

6. Click **"Publish"**

### 3B. Cloud Storage

1. Left sidebar → **"Storage"** → **"Get started"**
2. **Start in production mode** → Next
3. **Location**: Use SAME location as Firestore → Done
4. Click **"Rules"** tab → Paste this:

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

5. Click **"Publish"**

## ✅ Step 4: Update Your Code (10 min)

### 4A. Update `firebase-config.js`

Open `firebase-config.js` and **replace** the placeholder values with your config from Step 2:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",           // ← Paste your values here
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4B. Files Are Already Set Up! ✅

These files are ready to go:
- ✅ `index.html` - Firebase SDK scripts added
- ✅ `firebase-integration.js` - Upload/download logic
- ✅ `script.js` - Form handling updated

## ✅ Step 5: Test It! (5 min)

### Local Test

```bash
cd SciVisAgentBench-data_collection_page
python3 -m http.server 8000
```

Open browser: http://localhost:8000

**Check Console (F12):**
- Should see: `✅ Firebase initialized successfully!`
- Should see: `Firebase integration active`

### Test Submission

1. Go to **Submit Dataset** page
2. Fill required fields
3. Upload a small test file (< 10MB)
4. Click **Submit**
5. Watch progress bar!

### Verify in Firebase Console

1. **Firestore**: Check `submissions` collection → Should have 1 document
2. **Storage**: Check `submissions/` folder → Should see uploaded files

**SUCCESS!** 🎉

## Deploy to GitHub Pages

```bash
git add .
git commit -m "Add Firebase integration"
git push origin main
```

Then enable GitHub Pages:
- Repo Settings → Pages → Source: main branch → Save
- Wait ~2 minutes
- Visit: `https://YOUR_USERNAME.github.io/REPO_NAME/`

## Troubleshooting

### "Firebase is not defined"
→ Make sure `firebase-config.js` comes AFTER Firebase SDK scripts in `index.html`

### "Permission denied"
→ Check Firebase Console → Firestore → Rules are published

### Files not uploading
→ Check Firebase Console → Storage → Rules are published

### Still not working?
1. Open browser console (F12)
2. Look for red error messages
3. Copy error and search Firebase docs: https://firebase.google.com/docs

## What's Next?

After setup works:

1. **Monitor Usage**: Firebase Console → Usage tab
2. **View Data**: Firestore → submissions collection
3. **Download Files**: Storage → submissions folder
4. **Export Data**: Use the `exportSubmissions()` function in browser console

## Free Tier Limits

Your free tier includes:
- **Firestore**: 50k reads/day, 20k writes/day, 1GB storage
- **Storage**: 5GB stored, 1GB/day downloaded
- **Typical capacity**: ~1000 submissions before hitting limits

## Need Help?

- **Full Guide**: See `FIREBASE_SETUP.md`
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **Firebase Docs**: https://firebase.google.com/docs
- **GitHub Issues**: Open an issue if you're stuck!

---

**That's it!** You now have a fully functional cloud-backed website. 🚀
