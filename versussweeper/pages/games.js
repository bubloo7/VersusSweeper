import PublicGames from "@/components/publicGames/PublicGames";
import Head from "next/head";
export default function Games() {
    return (
        <>
            <Head>
                <title>Public Games</title>
            </Head>
            <PublicGames />
        </>
    );
}
