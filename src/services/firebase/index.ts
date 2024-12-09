import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyDkMpALAjU9c2NI6Z0i5wwbZ-kWARZowzQ",
  authDomain: "spender-edf2c.firebaseapp.com",
  projectId: "spender-edf2c",
  storageBucket: "spender-edf2c.firebasestorage.app",
  messagingSenderId: "261448957214",
  appId: "1:261448957214:web:4ed130f5f9f999bafd1d0f",
  measurementId: "G-Y40D6F93MS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
    db,
    auth,
  }
  