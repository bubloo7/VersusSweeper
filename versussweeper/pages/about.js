import Head from "next/head";
import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <div style={{ height: "100vh" }}>
        <Head>
          <title>About</title>
        </Head>
        <h1>About</h1>
        <p>
          Versus Sweeper is a multiplayer version of the classic game
          Minesweeper. It is a work in progress, and is currently in beta.
        </p>
      </div>
    </Layout>
  );
}
