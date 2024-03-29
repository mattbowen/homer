import type { MouseEvent } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { getLogger } from "../logging/logging-util";
import type { ZillowDataView } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Card, Checkbox, Label, RangeSlider, TextInput } from "flowbite-react";
import Nav from "../components/Nav";
import { useState } from "react";

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
    maximumFractionDigits: 0,
  });
  if (!houses) {
    throw "No database data available";
  }
  const housePrices = houses
    .map((house) => house.price)
    .filter((price) => price !== null) as number[];
  const minHousePrice = Math.min(...housePrices);
  const maxHousePrice = Math.max(...housePrices);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minHousePrice,
    675000,
  ]);
  const initialDistricts: { [key: string]: boolean } = {
    "Centennial HS": true,
    "Glenelg HS": true,
    "Marriotts Ridge HS": true,
    "River Hill HS": true,
    "Atholton HS": false,
  };
  const [districts, setDistricts] = useState<{ [key: string]: boolean }>(
    initialDistricts
  );
  const getFilteredHouseList = (currentDistricts: { [key: string]: boolean } = initialDistricts) => {
    const schoolNames = new Set(
      Object.keys(currentDistricts).filter((key) => !!districts[key])
    );
    const filteredHouses = houses.filter(
      (house) =>
        house.price &&
        house.price < priceRange[1] &&
        house.school_name &&
        schoolNames.has(house.school_name.trim())
    );
    return filteredHouses;
  };

  const [visibleHouses, setVisibleHouses] = useState<ZillowDataView[]>(
    getFilteredHouseList()
  );
  const updateDistricts = (e: MouseEvent<HTMLInputElement>) => {
    const targetId = e.currentTarget.id || "";
    const label =
      document.querySelector(`label[for=${targetId}]`)?.textContent || "";
    if (label in districts) {
      districts[label.trim()] = e.currentTarget.checked;
    }
    setDistricts(() => districts)
    setVisibleHouses(() => {
      return getFilteredHouseList();
    });
  };

  const cards = visibleHouses.map((house) => {
    if (house.propertyUrl) {
      const cardInners = (
        <div>
          <em>{house.school_name}</em> <br />
          {house.area} sqft |{" "}
          {house.price && (
            <strong>{String(formatter.format(house.price))}</strong>
          )}
          <br />
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
            className="mb-4"
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
            className="mb-4"
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
      <main className="container mx-auto grid grid-flow-row-dense grid-cols-4 grid-rows-1">
        <div className="ml-4 mr-4 grid-flow-col gap-8">
          <div>
            <div className="m4 block">
              <Label
                htmlFor="max-price-range"
                value={`Max Price (${formatter.format(priceRange[1])})`}
              />
            </div>
            <RangeSlider
              id="max-price-range"
              sizing="lg"
              min={minHousePrice}
              max={maxHousePrice}
              defaultValue={650000}
              onChange={(e) => {
                setPriceRange([0, Number(e.currentTarget.value)]);
                setVisibleHouses(() => {
                  return getFilteredHouseList();
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-4" id="checkbox">
            <span className="text-l mt-5 whitespace-nowrap font-semibold dark:text-white">
              Districts
            </span>
            <div className="flex items-center gap-2">
              <Checkbox
                id="centennial"
                defaultChecked={true}
                onClick={updateDistricts}
              />
              <Label htmlFor="centennial">Centennial HS</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="glenelg"
                defaultChecked={true}
                onClick={updateDistricts}
              />
              <Label htmlFor="glenelg">Glenelg HS</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="marriotts-ridge"
                defaultChecked={true}
                onClick={updateDistricts}
              />
              <Label htmlFor="marriotts-ridge">Marriotts Ridge HS</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="river-hill"
                defaultChecked={true}
                onClick={updateDistricts}
              />
              <Label htmlFor="river-hill">River Hill HS</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="atholton"
                defaultChecked={false}
                onClick={updateDistricts}
              />
              <Label htmlFor="atholton">Atholton HS</Label>
            </div>
          </div>
        </div>

        <div className="col-span-3 columns-1 gap-4 md:columns-2">

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
