/*
  Warnings:

  - The primary key for the `raw_zillow_data` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `filename` to the `raw_zillow_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `raw_zillow_data` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `raw_zillow_data` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "raw_zillow_data" DROP CONSTRAINT "raw_zillow_data_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "id" BIGINT NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ADD CONSTRAINT "raw_zillow_data_pkey" PRIMARY KEY ("id");
