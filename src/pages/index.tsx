import { type NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

const Home: NextPage = () => {
  const MapWithNoSSR = dynamic(() => import("../components/DeckMap"), {
    ssr: false,
  });
  return (
    <>
      <Head>
        <title>MAGI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Let&rsquo;s find a nice house!
          </h1>
        </div>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <MapWithNoSSR />
        </div>
      </main>
    </>
  );
};

export default Home;
