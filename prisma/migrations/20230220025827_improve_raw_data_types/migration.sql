/*
  Warnings:

  - The `area` column on the `raw_zillow_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `land_area` column on the `raw_zillow_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sold_date` column on the `raw_zillow_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "raw_zillow_data" DROP COLUMN "area",
ADD COLUMN     "area" BIGINT,
ALTER COLUMN "bathrooms" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "land_area",
ADD COLUMN     "land_area" BIGINT,
DROP COLUMN "sold_date",
ADD COLUMN     "sold_date" TIMESTAMP(3);
