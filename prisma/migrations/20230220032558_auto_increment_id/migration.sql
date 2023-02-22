-- AlterTable
CREATE SEQUENCE raw_zillow_data_id_seq;
ALTER TABLE "raw_zillow_data" ALTER COLUMN "id" SET DEFAULT nextval('raw_zillow_data_id_seq');
ALTER SEQUENCE raw_zillow_data_id_seq OWNED BY "raw_zillow_data"."id";
