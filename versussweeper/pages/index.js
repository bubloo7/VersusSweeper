import Header from "../components/Header";

export default function Home() {

    function navigateToCreate() {
        window.location.href = "/create";
    }

    return (
        <div>
            <Header />

            <br />

            <h2>Home</h2>

            {/* Create Game Button */}
            <button onClick={navigateToCreate}>Create Game</button>
            <button onClick={() => { window.location.href = "/LAJFA" }}>Public Games</button>

        </div>
    );
}
