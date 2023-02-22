/*
  Warnings:

  - You are about to drop the column `sold_date` on the `raw_zillow_data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "raw_zillow_data" DROP COLUMN "sold_date";
