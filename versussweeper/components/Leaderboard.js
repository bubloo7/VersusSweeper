import { useEffect, useState } from "react";

function compare(a, b) {
    // Compare the finish time property.
    if (a.finishTime < b.finishTime) {
        return -1;
    } else if (a.finishTime > b.finishTime) {
        return 1;
    } else {
        // The finish times are equal, so compare the clears property.
        if (a.clears > b.clears) {
            return -1;
        } else if (a.clears < b.clears) {
            return 1;
        } else {
            // The clears are equal, so compare the misses property.
            if (a.misses < b.misses) {
                return -1;
            } else if (a.misses > b.misses) {
                return 1;
            } else {
                // The misses are equal, so the objects are equal.
                return 0;
            }
        }
    }
}
{
    /* <Leaderboard hits={hits} misses={misses} players={players} name={name} /> */
}

export default function Leaderboard(props) {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        console.log("in use effect test");
        let temp_players = { ...props.players };
        temp_players[props.name].misses = props.misses;
        temp_players[props.name].clears = props.hits;
        let l = [...Object.values(temp_players)];
        console.log(l, "list before sort");
        l = l.sort(compare);
        console.log(l, "list post sort");
        setLeaderboard(
            l.map((player, index) => {
                return (
                    <div key={index}>
                        {index + 1}. {player.name} - {player.clears} clears, {player.misses} misses
                    </div>
                );
            })
        );
    }, [props.hits, props.misses, props.players]);

    return (
        <div>

            {leaderboard}
        </div>
    );
}
