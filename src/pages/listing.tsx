import { type NextPage } from "next";
import Head from "next/head";
import { getLogger } from "../logging/logging-util";
import type { ZillowDataView } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Card } from "flowbite-react";
import Nav from "../components/Nav";

interface ListingPageProps {
  houses: ZillowDataView[];
}

const ListingPage: NextPage<ListingPageProps> = ({
  houses,
}: ListingPageProps) => {
  const logger = getLogger("home");
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  if (!houses) {
    throw "No database data available";
  }
  const cards = houses.map((house) => {
    if (house.propertyUrl) {
      const cardInners = (
        <div>
          <em>{house.school_name}</em> <br />
          {house.area} sqft | {house.price && (
            <strong>{String(formatter.format(house.price))}</strong>
          )}<br />
          {house.listingType}
        </div>
      );

      if (house.image) {
        return (
          <Card
            href={house.propertyUrl}
            key={`house-${house.id}`}
            imgSrc={house.image}
            imgAlt="The picture of the house"
            className="mb-4 max-w-lg"
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {house.address}
            </h5>
            {cardInners}
          </Card>
        );
      } else {
        return (
          <Card
            href={house.propertyUrl}
            key={`house-${house.id}`}
            className="mb-4 max-w-lg"
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {house.address}
            </h5>
            {cardInners}
          </Card>
        );
      }
    }
  });
  return (
    <>
      <Head>
        <title>Listings | Homer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        
        <Nav active="listings" />
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {cards}
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

export default ListingPage;
