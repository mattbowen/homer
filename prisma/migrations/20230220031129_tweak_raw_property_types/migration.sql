/*
  Warnings:

  - The `days_on_zillow` column on the `raw_zillow_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "raw_zillow_data" DROP COLUMN "days_on_zillow",
ADD COLUMN     "days_on_zillow" BIGINT;
