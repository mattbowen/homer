import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env.mjs";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import path from "path";
import { getLogger } from "../../logging/logging-util";
import type {
  IRawProperty,
  IRawPropertyWithFileInfo,
  IRawZillowData,
} from "../../types.js";
import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const logger = getLogger("cron");

  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;
      const s3 = new S3Client({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      });
      if (authorization === `Bearer ${env.API_SECRET_KEY}`) {
        const prisma = new PrismaClient();
        const knownFiles = await prisma.rawZillowData.findMany({
          where: {},
          distinct: ["filename"],
          select: { filename: true },
        });
        const flatKnownFiles = knownFiles.map((result) => {
          return result.filename;
        });
        const filesInDir = await s3.send(
          new ListObjectsV2Command({
            Bucket: env.AWS_BUCKET_NAME,
          })
        );
        logger.debug(filesInDir);
        if (!filesInDir.Contents) {
          throw "No data in s3 bucket";
        }
        const jsonInDir = filesInDir.Contents.filter((file) => {
          const fileName = file.Key?.split("/").slice(-1)[0];
          if (file.Key && fileName) {
            return (
              path.extname(file.Key).toLocaleLowerCase() === ".json" &&
              !flatKnownFiles.includes(fileName)
            );
          }
        });
        const allFileData = await Promise.all(
          jsonInDir
            .filter((file) => !!file.Key)
            .map(async (file) => {
              const fileData = await s3.send(
                new GetObjectCommand({
                  Bucket: env.AWS_BUCKET_NAME,
                  Key: file.Key,
                })
              );
              const fileDataString = await fileData.Body?.transformToString();
              if (fileDataString) {
                const rawPropertyData = JSON.parse(
                  fileDataString
                ) as IRawProperty[];
                const enhancedPropertyData: IRawZillowData[] =
                  rawPropertyData.map((prop: IRawProperty) => {
                    if (file.Key) {
                      prop["filename"] = file.Key.split("/").slice(-1)[0];
                    }
                    const zillowData = new RawZillowData(
                      prop as IRawPropertyWithFileInfo
                    );
                    return zillowData.asObject();
                  });
                return enhancedPropertyData;
              }
              return null;
            })
        );

        logger.debug("Parsed all JSON");
        let totalRecords = 0;
        await Promise.all(
          allFileData.map(async (fileData) => {
            if (fileData) {
              const recordsCreated = await prisma.rawZillowData.createMany({
                data: fileData,
              });
              totalRecords += recordsCreated.count;
            }
          })
        );
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

class RawZillowData implements IRawZillowData {
  readonly address: string;
  readonly brokerName?: string | undefined;
  readonly currency?: string | undefined;
  readonly image?: string | undefined;
  readonly input?: string | undefined;
  readonly listingType?: string | undefined;
  readonly listingUrl?: string | undefined;
  readonly propertyUrl?: string | undefined;
  readonly filename: string;
  readonly propertyId: string;

  #rawData: IRawPropertyWithFileInfo;

  constructor(rawData: IRawPropertyWithFileInfo) {
    this.#rawData = rawData;
    this.address = rawData.address;
    this.brokerName = rawData.broker_name;
    this.currency = rawData.currency;
    this.image = rawData.image;
    this.input = rawData.input;
    this.listingType = rawData.listing_type;
    this.listingUrl = rawData.listing_url;
    this.propertyUrl = rawData.property_url;
    this.filename = rawData.filename;
    this.propertyId = rawData.property_id;
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

  get daysOnZillow() {
    return this.#rawData.days_on_zillow
      ? Number(this.#rawData.days_on_zillow)
      : undefined;
  }

  get isZillowOwned() {
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

  get rank() {
    return this.#rawData.rank ? Number(this.#rawData.rank) : undefined;
  }

  get rentZestimate() {
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
      brokerName: this.brokerName,
      currency: this.currency,
      daysOnZillow: this.daysOnZillow,
      image: this.image,
      input: this.input,
      isZillowOwned: this.isZillowOwned,
      latitude: this.latitude,
      listingType: this.listingType,
      listingUrl: this.listingUrl,
      longitude: this.longitude,
      price: this.price,
      propertyId: this.propertyId,
      propertyUrl: this.propertyUrl,
      rank: this.rank,
      rentZestimate: this.rentZestimate,
      zestimate: this.zestimate,
      filename: this.filename,
    };
  }
}
