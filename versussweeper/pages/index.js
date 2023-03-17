import db from "../firebase/clientApp";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Header from "../components/Header";

export default function Home() {
    // const [data, setData] = useState(null);
    // useEffect(() => {
    //     const q = query(collection(db, "rooms"));
    //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //         setData(querySnapshot.docs);
    //         console.log(querySnapshot.data, "querySnapshot")
    //     });
    //     return unsubscribe;
    // }, []);

    return (
        <div>
            <Header />

            <br />

            <h2>Home</h2>  
        </div>
    )
}
