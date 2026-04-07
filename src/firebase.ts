import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB375ZJml4M9b_Ihbqcumau-aatWRQ_3Ok",
  authDomain: "ravis-7620d.firebaseapp.com",
  projectId: "ravis-7620d",
  storageBucket: "ravis-7620d.firebasestorage.app",
  messagingSenderId: "117768183751",
  appId: "1:117768183751:web:9551676c84b1157ef6c3e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
