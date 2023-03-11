import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBkmC-yE-HxywLBhMCVbGr_TFGMDqPx_Hk",
    authDomain: "versussweeper.firebaseapp.com",
    projectId: "versussweeper",
    storageBucket: "versussweeper.appspot.com",
    messagingSenderId: "291910899374",
    appId: "1:291910899374:web:9b78825beb7e067ed77f3f",
    measurementId: "G-QZV6P0Y1XH",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;