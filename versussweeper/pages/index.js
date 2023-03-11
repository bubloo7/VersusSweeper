import db from "../firebase/clientApp";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";

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

    return <div>Main index thingys</div>;
}
