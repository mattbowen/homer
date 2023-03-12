import { type NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { getLogger } from "../logging/logging-util";
import type { ZillowDataView } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import Nav from "../components/Nav";

interface HomepageProps {
  houses: ZillowDataView[];
}

const Home: NextPage<HomepageProps> = ({ houses }: HomepageProps) => {
  const logger = getLogger("home");
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
        <title>Homer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav active="map" />

      <main className="flex min-h-screen flex-col items-center justify-center">
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
    delete house[key];
  }
  return house;
}

export const getServerSideProps = async () => {
  const prisma = new PrismaClient();
  const rawHouses = await prisma.zillowDataView.findMany();
  // TODO: Drop createdAt from the view entirely
  const houses = rawHouses.map((house) => exclude(house, ["createdAt"]));
  return {
    props: {
      houses,
    },
  };
};
export default Home;
