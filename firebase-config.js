// Firebase Configuration
// Initialize Firebase for SciVisAgentBench Data Collection

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
let db, storage;

try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  storage = firebase.storage();

  console.log('✅ Firebase initialized');
  console.log('📦 Project:', firebaseConfig.projectId);

  // Make available globally
  window.firebaseDB = db;
  window.firebaseStorage = storage;
  window.firebaseReady = true;

} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  window.firebaseReady = false;
}
