import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env.mjs";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { getLogger } from "../../logging/logging-util";
import type { IRawProperty, IRawPropertyWithFileInfo } from "../../types.js";

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
        const filesInDir = await readdir(scrapedDataPath);
        const jsonInDir = filesInDir.filter((file) => {
          return path.extname(file).toLocaleLowerCase() === ".json";
        });
        const allFileData = await Promise.all(
          jsonInDir.map(async (file) => {
            const fileData = await readFile(path.join(scrapedDataPath, file));
            const fileDataString = fileData.toString();
            const rawPropertyData = JSON.parse(fileDataString) as IRawProperty[];
            const enhancedPropertyData:IRawPropertyWithFileInfo[] = rawPropertyData.map((prop: IRawProperty) => {
              prop['filename'] = file;
              return prop as IRawPropertyWithFileInfo;
            });
            return enhancedPropertyData;
          })
        );
        logger.debug("Parsed all JSON")

        res.status(200).json(allFileData);
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
