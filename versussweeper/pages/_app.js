import "@/styles/globals.css";
import "../styles/fonts.css";
import "../styles/colors.css";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Home | Versus Sweeper</title>
                <meta
                    name="description"
                    content="Classic Minesweeper with a live multiplayer twist! Invite your friends and test your wits in a game of competitive Minesweeper."
                />
                <meta
                    name="keywords"
                    content="versussweeper, minesweeper, multiplayer, minesweeper multiplayer, minesweeper online, minesweeper versus, minesweeper versus online, minesweeper versus multiplayer, minesweeper versus live multiplayer, minesweeper versus live online"
                ></meta>
                <meta name="author" content="Versus Sweeper"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <link rel="icon" href="/3d-flag.ico" />
                {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
                <link rel="manifest" href="/manifest.json"></link> */}
                <meta name="theme-color" content="#f4f4f4"></meta>
                <meta name="google-site-verification" content="BbAGkliICQMkpdasGzBpv9qtLX1OwnCCmzYW5Un-FXg" />

                {/* <link
            rel="preload"
            href="../fonts/RobotoMono-Regular.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="../fonts/RobotoMono-Bold.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />
            <link
            rel="preload"
            href="..\fonts\mine-sweeper.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
            /> */}
            </Head>
            <Analytics />

            <Component {...pageProps} />
        </>
    );
}
