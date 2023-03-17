import { useRouter } from "next/router";
import { useState, useEffect } from "react";
// import { firebase } from "../firebase/clientApp";
import { ref, onValue } from "firebase/database";
import db from "../firebase/clientApp";
import Minesweeper from "../components/minesweeper";

const Page = () => {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [gameFound, setGameFound] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (id) {
            // console.log("in id db", db);
            console.log("in useEffect");
            // get data stored in "game"
            const gameRef = ref(db, "game");
            onValue(gameRef, (snapshot) => {
                const data = snapshot.val();
                console.log("in onValue", data);
                if (data) {
                    setGameFound(true);
                    if (data.started) setGameStarted(true);
                    else setGameStarted(false);
                } else setGameFound(false);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) return <p>Loading...</p>;
    else {
        if (gameFound) {
            if (gameStarted) return <Minesweeper />;
            else return <p>Game not started</p>;
        } else return <Minesweeper />;
    }
};

export default Page;
