import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env.mjs";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { getLogger } from "../../logging/logging-util";
import type {
  IRawProperty,
  IRawPropertyWithFileInfo,
  IRawZillowData,
} from "../../types.js";
import { PrismaClient } from "@prisma/client";
import { keys } from "ts-transformer-keys";

class RawZillowData implements IRawZillowData {
  readonly address: string;
  readonly broker_name?: string | undefined;
  readonly currency?: string | undefined;
  readonly image?: string | undefined;
  readonly input?: string | undefined;
  readonly listing_type?: string | undefined;
  readonly listing_url?: string | undefined;
  readonly property_url?: string | undefined;
  readonly filename: string;

  #rawData: IRawPropertyWithFileInfo;

  constructor(rawData: IRawPropertyWithFileInfo) {
    const logger = getLogger("cron");
    logger.debug(JSON.stringify(rawData, undefined, 2));
    this.#rawData = rawData;
    this.address = rawData.address;
    this.broker_name = rawData.broker_name;
    this.currency = rawData.currency;
    this.image = rawData.image;
    this.input = rawData.input;
    this.listing_type = rawData.listing_type;
    this.listing_url = rawData.listing_url;
    this.property_url = rawData.property_url;
    this.filename = rawData.filename;
  }
  get bathrooms() {
    if (this.#rawData.bathrooms) {
      return +this.#rawData.bathrooms;
    }
  }
  get bedrooms() {
    if (this.#rawData.bedrooms) {
      return +this.#rawData.bedrooms;
    }
  }
  get area() {
    return this.#rawData.area
      ? Number(this.#rawData.area.split(" ")[0])
      : undefined;
  }

  get days_on_zillow() {
    return this.#rawData.days_on_zillow
      ? Number(this.#rawData.days_on_zillow)
      : undefined;
  }

  get is_zillow_owned() {
    return this.#rawData.is_zillow_owned
      ? this.#rawData.is_zillow_owned === "True"
      : false;
  }

  get longitude() {
    return this.#rawData.longitude
      ? Number(this.#rawData.longitude)
      : undefined;
  }

  get latitude() {
    return this.#rawData.latitude ? Number(this.#rawData.latitude) : undefined;
  }

  get price() {
    return this.#rawData.price ? Number(this.#rawData.price) : undefined;
  }

  get property_id() {
    return Number(this.#rawData.property_id);
  }

  get rank() {
    return this.#rawData.rank ? Number(this.#rawData.rank) : undefined;
  }

  get rent_zestimate() {
    return this.#rawData.rent_zestimate
      ? Number(this.#rawData.rent_zestimate)
      : undefined;
  }

  get zestimate() {
    return this.#rawData.zestimate
      ? Number(this.#rawData.zestimate)
      : undefined;
  }

  asObject(): IRawZillowData {
    return {
      address: this.address,
      area: this.area,
      bathrooms: this.bathrooms,
      bedrooms: this.bedrooms,
      broker_name: this.broker_name,
      currency: this.currency,
      days_on_zillow: this.days_on_zillow,
      image: this.image,
      input: this.input,
      is_zillow_owned: this.is_zillow_owned,
      latitude: this.latitude,
      listing_type: this.listing_type,
      listing_url: this.listing_url,
      longitude: this.longitude,
      price: this.price,
      property_id: this.property_id,
      property_url: this.property_url,
      rank: this.rank,
      rent_zestimate: this.rent_zestimate,
      zestimate: this.zestimate,
      filename: this.filename,
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const logger = getLogger("cron");

  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;
      const scrapedDataPath =
        "/home/matt/Dropbox/Apps/ScrapeHero-Cloud/Zillow Scraper";
      if (authorization === `Bearer ${env.API_SECRET_KEY}`) {
        const prisma = new PrismaClient();
        const knownFiles = await prisma.raw_zillow_data.findMany({
          where: {},
          distinct: ["filename"],
          select: { filename: true },
        });
        const flatKnownFiles = knownFiles.map((result) => {
          return result.filename;
        });
        const filesInDir = await readdir(scrapedDataPath);
        const jsonInDir = filesInDir.filter((file) => {
          return (
            path.extname(file).toLocaleLowerCase() === ".json" &&
            !flatKnownFiles.includes(file)
          );
        });
        const allFileData = await Promise.all(
          jsonInDir.map(async (file) => {
            const fileData = await readFile(path.join(scrapedDataPath, file));
            const fileDataString = fileData.toString();
            const rawPropertyData = JSON.parse(
              fileDataString
            ) as IRawProperty[];
            const enhancedPropertyData: IRawZillowData[] = rawPropertyData.map(
              (prop: IRawProperty) => {
                prop["filename"] = file;
                const zillowData = new RawZillowData(
                  prop as IRawPropertyWithFileInfo
                );
                return zillowData.asObject();
              }
            );
            return enhancedPropertyData;
          })
        );
        logger.debug("Parsed all JSON");
        // const recordsCreated = await prisma.raw_zillow_data.createMany({
        //   data: allFileData,
        // });
        let totalRecords = 0;
        allFileData.map(async (fileData) => {
          const recordsCreated = await prisma.raw_zillow_data.createMany({
            data: fileData,
          });
          totalRecords += recordsCreated.count;
        });
        res.status(200).json(totalRecords);
      } else {
        res.status(401).json({ success: false });
      }
    } catch (err) {
      let message = null;
      if (err && typeof err == "object" && "message" in err) {
        message = err.message as string;
      }
      res.status(500).json({ statusCode: 500, message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
