/*
  Warnings:

  - The primary key for the `raw_zillow_data` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `land_area` on the `raw_zillow_data` table. All the data in the column will be lost.
  - You are about to alter the column `bedrooms` on the `raw_zillow_data` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `price` on the `raw_zillow_data` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `property_id` on the `raw_zillow_data` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `rank` on the `raw_zillow_data` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `rent_zestimate` on the `raw_zillow_data` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `zestimate` on the `raw_zillow_data` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id` on the `raw_zillow_data` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `area` on the `raw_zillow_data` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `days_on_zillow` on the `raw_zillow_data` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "raw_zillow_data" DROP CONSTRAINT "raw_zillow_data_pkey",
DROP COLUMN "land_area",
ALTER COLUMN "bedrooms" SET DATA TYPE INTEGER,
ALTER COLUMN "price" SET DATA TYPE INTEGER,
ALTER COLUMN "property_id" SET DATA TYPE INTEGER,
ALTER COLUMN "rank" SET DATA TYPE INTEGER,
ALTER COLUMN "rent_zestimate" SET DATA TYPE INTEGER,
ALTER COLUMN "zestimate" SET DATA TYPE INTEGER,
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "area" SET DATA TYPE INTEGER,
ALTER COLUMN "days_on_zillow" SET DATA TYPE INTEGER,
ADD CONSTRAINT "raw_zillow_data_pkey" PRIMARY KEY ("id");
