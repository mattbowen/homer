import { type NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { getLogger } from "../logging/logging-util";
import { ZillowDataView } from "@prisma/client";
import { PrismaClient } from "@prisma/client";


const Home = ({houses}: {houses: ZillowDataView[]}) => {
  const logger = getLogger('home');
  const MapWithNoSSR = dynamic(() => import("../components/DeckMap"), {
    ssr: false,
  });
  logger.debug(houses);
  if (!houses) {
    throw "No database data available";
  }
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
          <MapWithNoSSR houses={houses} />
        </div>
      </main>
    </>
  );
};

function exclude<ZillowDataView, Key extends keyof ZillowDataView>(
  house: ZillowDataView,
  keys: Key[]
): Omit<ZillowDataView, Key> {
  for (const key of keys) {
    delete house[key]
  }
  return house
}

export const getServerSideProps = async () => {
  const prisma = new PrismaClient()
  const rawHouses = await prisma.zillowDataView.findMany();
  // TODO: Drop createdAt from the view entirely
  const houses = rawHouses.map((house) => exclude(house, ['createdAt']))
  return {
    props: {
      houses
    }
  }
}
export default Home;
