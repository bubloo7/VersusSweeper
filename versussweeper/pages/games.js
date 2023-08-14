import Loading from "../components/Loading";
import Head from "next/head";
import dynamic from "next/dynamic";

const PublicGames = dynamic(() => import("../components/publicGames/PublicGames"), {
    ssr: false,
    loading: () => <Loading />,
});

export default function Games() {
    return (
      <>
        <Head>
          <title>Public Games | Versus Sweeper</title>
        </Head>
        <PublicGames />
      </>
    );
}
