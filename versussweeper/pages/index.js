import dynamic from "next/dynamic";
import Loading from "@/components/Loading";

const HomePage = dynamic(() => import("../components/HomePage"), {
  ssr: false,
  loading: Loading,
});

export default function Home() {
  return <HomePage />;
}
