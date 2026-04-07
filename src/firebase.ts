import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB375ZJml4M9b_Ihbqcumau-aatWRQ_3Ok",
  authDomain: "ravis-7620d.firebaseapp.com",
  projectId: "ravis-7620d",
  databaseURL: "https://ravis-7620d-default-rtdb.firebaseio.com",
  storageBucket: "ravis-7620d.firebasestorage.app",
  messagingSenderId: "117768183751",
  appId: "1:117768183751:web:9551676c84b1157ef6c3e2"
};

const app = initializeApp(firebaseConfig);
export const db: Database = getDatabase(app);
export const storage: FirebaseStorage = getStorage(app);
