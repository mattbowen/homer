CREATE INDEX raw_zillow_data_st_points ON "rawZillowData" (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));
