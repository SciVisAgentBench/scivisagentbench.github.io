// Firebase Configuration
// Project: scivisagentbench-datacollect
// Updated: 2025-01-04

const firebaseConfig = {
  apiKey: "AIzaSyAuGnZcdEJVC6txISHvYq58eVJCNzdxNdU",
  authDomain: "scivisagentbench-datacollect.firebaseapp.com",
  projectId: "scivisagentbench-datacollect",
  storageBucket: "scivisagentbench-datacollect.firebasestorage.app",
  messagingSenderId: "77652883230",
  appId: "1:77652883230:web:228e092d42ee0fe761fb0f",
  measurementId: "G-SHPZ3SXKWY"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);

  // Get Firebase services
  const db = firebase.firestore();
  const storage = firebase.storage();

  console.log('✅ Firebase initialized successfully!');
  console.log('📦 Project ID:', firebaseConfig.projectId);
  console.log('🔥 Firestore ready');
  console.log('📁 Storage ready');

} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  console.error('Error details:', error.message);
  alert('Firebase initialization failed. Check console for details.');
}
