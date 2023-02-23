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
CREATE TABLE "rawZillowData" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "area" INTEGER,
    "bathrooms" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "brokerName" TEXT,
    "currency" TEXT,
    "daysOnZillow" INTEGER,
    "image" TEXT,
    "input" TEXT,
    "isZillowOwned" BOOLEAN,
    "latitude" DOUBLE PRECISION,
    "listingType" TEXT,
    "listingUrl" TEXT,
    "longitude" DOUBLE PRECISION,
    "price" INTEGER,
    "propertyId" TEXT NOT NULL,
    "propertyUrl" TEXT,
    "rank" INTEGER,
    "rentZestimate" INTEGER,
    "zestimate" INTEGER,
    "filename" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rawZillowData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "howard_hs_2022_geom_geom_idx" ON "howard_hs_2022" USING GIST ("geom");

-- CreateIndex
CREATE INDEX "rawZillowData_filename_idx" ON "rawZillowData"("filename");

-- CreateIndex
CREATE INDEX "rawZillowData_propertyId_idx" ON "rawZillowData"("propertyId");
