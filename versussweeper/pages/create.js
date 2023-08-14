import Loading from "../components/Loading";
import Head from "next/head";
import dynamic from "next/dynamic";

const CreateGame = dynamic(() => import("../components/createGame/CreateGame"), {
    ssr: false,
    loading: () => <Loading />,
});


export default function Create() {
    return (
      <>
        <Head>
          <title>Create Game | Versus Sweeper</title>
        </Head>
        <CreateGame />
      </>
    );
}
