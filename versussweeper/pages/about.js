import dynamic from "next/dynamic";
import Loading from "@/components/Loading";

const AboutPage = dynamic(() => import("../components/AboutPage"), {
  ssr: false,
  loading: Loading,
});

export default function About() {
  return <AboutPage />;
}
