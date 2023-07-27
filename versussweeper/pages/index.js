// import Header from "../components/Header";

export default function Home() {

    function navigateToCreate() {
        window.location.href = "/create";
    }

    function navigateToGames() {
        window.location.href = "/games";
    }

    return (
        <div>
            <Header />

            <br />

            <h2>Home</h2>

            {/* Create Game Button */}
            <button onClick={navigateToCreate}>Create Game</button>
            <button onClick={navigateToGames}>Public Games</button>

        </div>
    );
}
