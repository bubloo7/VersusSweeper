import CreateGame from "../components/createGame/CreateGame";
import Head from "next/head";

export default function Create() {
    return (
        <>
            <Head>
                <title>Create Game</title>
            </Head>
            <CreateGame />;
        </>
    );
}
