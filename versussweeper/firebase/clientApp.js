import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBkmC-yE-HxywLBhMCVbGr_TFGMDqPx_Hk",
    authDomain: "versussweeper.firebaseapp.com",
    databaseURL: "https://versussweeper-default-rtdb.firebaseio.com",
    projectId: "versussweeper",
    storageBucket: "versussweeper.appspot.com",
    messagingSenderId: "291910899374",
    appId: "1:291910899374:web:882967760413dbcdd77f3f",
    measurementId: "G-RK2XGBT9SJ",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export default db;
