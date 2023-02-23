-- This is an empty migration.
create view "ZillowDataView" AS
select
    zillow.*,
    hs.name as school_name
from
    "rawZillowData" zillow,
    howard_hs_2022 hs
where
    hs.high_school_ratings_usn_national_rank <= 1260
    and filename = (
        select
            max(filename)
        from
            "rawZillowData"
    )
    and ST_Within(
        ST_SetSRID(
            ST_MakePoint(zillow.longitude, zillow.latitude),
            4326
        ),
        hs.geom
    )