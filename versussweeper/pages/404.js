import dynamic from "next/dynamic";
import Loading from "@/components/Loading";

const Page404 = dynamic(() => import("../components/404Page"), {
  ssr: false,
  loading: Loading,
});

export default function Custom404() {
  return <Page404 />;
}
