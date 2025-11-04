// Firebase Configuration
// IMPORTANT: Replace these values with your actual Firebase project configuration
// Get this from: Firebase Console → Project Settings → Your apps → Web app

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);

  // Get Firebase services
  const db = firebase.firestore();
  const storage = firebase.storage();

  console.log('✅ Firebase initialized successfully!');
  console.log('Project ID:', firebaseConfig.projectId);

} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  console.log('Make sure to:');
  console.log('1. Replace the firebaseConfig values with your actual Firebase project config');
  console.log('2. Load Firebase SDK scripts before this file');
}

// HOW TO GET YOUR CONFIGURATION:
// 1. Go to https://console.firebase.google.com/
// 2. Select your project
// 3. Click the gear icon (⚙️) → Project settings
// 4. Scroll down to "Your apps" section
// 5. Click on your web app (or create one if you haven't)
// 6. Copy the configuration values and replace the "YOUR_*_HERE" placeholders above
