import { useRouter } from "next/router";
import db from "../firebase/clientApp";
import { useState, useEffect } from "react";
import { collection, doc, query, onSnapshot, getDoc } from "firebase/firestore";

const Page = () => {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState({});
    const [playerHTML, setPlayerHTML] = useState("");

    useEffect(() => {
        if (id) {
            console.log(db, "db in thingy", id);
            const d = doc(db, "rooms", id);
            const roomGetter = getDoc(d).then((cdoc) => {
                setLoading(false);
                if (cdoc.exists()) {
                    console.log("Document data:", cdoc.data());
                    setData(cdoc.data());
                    const c = collection(db, "rooms", id, "players");
                    const listener = onSnapshot(c, (querySnapshot) => {
                        console.log(querySnapshot.docs, "querySnapshot");
                        const newPlayers = players;
                        console.log(newPlayers, "newPlayers")
                        querySnapshot.docChanges().forEach((change) => {
                            newPlayers[change.doc.id] = change.doc.data().score;
                            console.log(change.doc.id, " changed! now ", change.doc.data());
                        });
                        setPlayers(newPlayers);
                        const newPlayerHTML = Object.keys(newPlayers).map((key) => {
                            return (
                                <p>
                                    {key}: {newPlayers[key]}
                                </p>
                            );
                        });
                        setPlayerHTML(newPlayerHTML);
                    });
                    return listener;
                }
            });
            roomGetter.then((unsub) => {
                return unsub;
            });
        }
    }, [id]);

    if (loading) return <p>Loading...</p>;
    else {
        if (data) {
            return (
                <div>
                    <p>Game found!</p>
                    <p>Difficulty: {data.difficulty}</p>
                    <p>Public: {String(data.public)}</p>
                    <p>Timestamp: {String(data.timestamp.toDate())}</p>
                    {playerHTML}
                </div>
            );
        } else return <p>Game not found {"):"}</p>;
    }
};

export default Page;
