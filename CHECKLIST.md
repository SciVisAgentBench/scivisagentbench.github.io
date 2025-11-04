# Firebase Setup Checklist

Use this checklist to track your Firebase setup progress.

## Phase 1: Firebase Console Setup

- [ ] **Create Firebase Project**
  - Go to https://console.firebase.google.com/
  - Click "Add project"
  - Name: `SciVisAgentBench`
  - Created successfully ✓

- [ ] **Register Web App**
  - Click web icon `</>`
  - Name: `SciVisAgentBench-Website`
  - Copy configuration code ✓

- [ ] **Enable Firestore Database**
  - Build → Firestore Database → Create
  - Mode: Production
  - Location: ___________ (e.g., us-central1)
  - Rules published ✓

- [ ] **Enable Cloud Storage**
  - Build → Storage → Get started
  - Mode: Production
  - Location: Same as Firestore
  - Rules published ✓

## Phase 2: Code Configuration

- [ ] **Update firebase-config.js**
  - Replace `apiKey` with your actual API key
  - Replace `authDomain` with your domain
  - Replace `projectId` with your project ID
  - Replace `storageBucket` with your bucket name
  - Replace `messagingSenderId` with your sender ID
  - Replace `appId` with your app ID

- [ ] **Verify Files Exist**
  - `firebase-config.js` ✓
  - `firebase-integration.js` ✓
  - `index.html` (updated with Firebase SDK) ✓
  - `script.js` (updated with async handlers) ✓

## Phase 3: Local Testing

- [ ] **Start Local Server**
  ```bash
  python3 -m http.server 8000
  ```

- [ ] **Open Browser**
  - URL: http://localhost:8000
  - Open Dev Console (F12)
  - Look for: `✅ Firebase initialized successfully!`
  - Look for: `Firebase integration active`

- [ ] **Test Form Submission**
  - Navigate to Submit Dataset
  - Fill all required fields
  - Upload test file (< 10MB)
  - Click Submit
  - See progress bar
  - See success message

- [ ] **Verify in Firebase Console**
  - Firestore → submissions collection → Has 1 document
  - Storage → submissions folder → Has uploaded files

## Phase 4: Deployment

- [ ] **Commit to Git**
  ```bash
  git add .
  git commit -m "Add Firebase integration"
  git push origin main
  ```

- [ ] **Enable GitHub Pages**
  - Repo Settings → Pages
  - Source: main branch
  - Save
  - Wait 2 minutes

- [ ] **Test Live Site**
  - Visit: https://YOUR_USERNAME.github.io/REPO_NAME/
  - Open console, check Firebase initialized
  - Submit test dataset
  - Verify in Firebase Console

- [ ] **Update Firebase Authorized Domains**
  - Firebase Console → Project Settings
  - Scroll to "Authorized domains"
  - Add: `YOUR_USERNAME.github.io`

## Phase 5: Verification

- [ ] **Dashboard Works**
  - Statistics show correct counts
  - Contributors table populates
  - Data loads from Firebase

- [ ] **File Uploads Work**
  - Source data uploads successfully
  - Ground truth images upload
  - Optional files upload (if provided)
  - Files visible in Firebase Storage

- [ ] **Data Persistence**
  - Close browser
  - Reopen website
  - Dashboard still shows submitted data

## Common Issues Checklist

If something doesn't work, check:

- [ ] Firebase SDK scripts load BEFORE firebase-config.js
- [ ] firebase-config.js has actual values (not "YOUR_API_KEY_HERE")
- [ ] Firestore rules are published
- [ ] Storage rules are published
- [ ] Browser console shows no errors
- [ ] Using http://localhost (not file://)

## Security Checklist

- [ ] Firestore rules allow read for everyone
- [ ] Firestore rules allow create with required fields
- [ ] Firestore rules DENY update/delete
- [ ] Storage rules allow read for everyone
- [ ] Storage rules limit upload to 500MB
- [ ] API key is in code (this is OK for client-side Firebase)

## Monitoring Checklist

After deployment, regularly check:

- [ ] Firebase Console → Usage tab
- [ ] Firestore document count
- [ ] Storage usage (GB)
- [ ] Free tier limits not exceeded

## Success Criteria

You're done when:

✅ Local test works
✅ Firebase Console shows data
✅ GitHub Pages site works
✅ Users can submit datasets
✅ Dashboard updates in real-time
✅ Files are stored in Firebase Storage

---

**Current Status:** _____ / 28 items completed

**Estimated Time:** 30-45 minutes total

**Got stuck?** See `FIREBASE_SETUP.md` for detailed instructions!
