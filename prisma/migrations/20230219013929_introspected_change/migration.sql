-- CreateTable
CREATE TABLE "howard_hs_2022" (
    "fid" SERIAL NOT NULL,
    "name" VARCHAR,
    "description" VARCHAR,
    "timestamp" TIMESTAMPTZ(6),
    "begin" TIMESTAMPTZ(6),
    "end" TIMESTAMPTZ(6),
    "altitudemode" VARCHAR,
    "tessellate" INTEGER,
    "extrude" INTEGER,
    "visibility" INTEGER,
    "draworder" INTEGER,
    "icon" VARCHAR,
    "hi_home" VARCHAR,
    "street1" VARCHAR,
    "street2" VARCHAR,
    "high_school_ratings_usn_md_rank" INTEGER,
    "high_school_ratings_usn_national_rank" INTEGER,
    "high_school_ratings_gs_overall" INTEGER,
    "high_school_ratings_gs_tests" INTEGER,
    "high_school_ratings_gs_college" INTEGER,
    "high_school_ratings_gs_equity" INTEGER,
    "high_school_composite_score" DOUBLE PRECISION,
    "geom" geometry,

    CONSTRAINT "howard_hs_2022_pkey" PRIMARY KEY ("fid")
);

-- CreateTable
CREATE TABLE "raw_zillow_data" (
    "address" TEXT,
    "area" TEXT,
    "bathrooms" BIGINT,
    "bedrooms" BIGINT,
    "broker_name" TEXT,
    "currency" TEXT,
    "days_on_zillow" TEXT,
    "image" TEXT,
    "input" TEXT,
    "is_zillow_owned" BOOLEAN,
    "land_area" TEXT,
    "latitude" DOUBLE PRECISION,
    "listing_type" TEXT,
    "listing_url" TEXT,
    "longitude" DOUBLE PRECISION,
    "price" BIGINT,
    "property_id" BIGINT NOT NULL,
    "property_url" TEXT,
    "rank" BIGINT,
    "rent_zestimate" BIGINT,
    "sold_date" TEXT,
    "zestimate" BIGINT,

    CONSTRAINT "raw_zillow_data_pkey" PRIMARY KEY ("property_id")
);

-- CreateIndex
CREATE INDEX "howard_hs_2022_geom_geom_idx" ON "howard_hs_2022" USING GIST ("geom");
