import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import { env } from "../env.mjs";
import "maplibre-gl/dist/maplibre-gl.css";
import { api } from "../utils/api";
import { useState } from "react";
import type { ZillowDataView } from "@prisma/client";

const ICON = `M3 10v11h6v-7h6v7h6v-11L12,3z`;
const pinStyle = {
  cursor: "pointer",
  fill: "#0DF",
  stroke: "#000",
};

function Pin({ size = 40 }) {
  return (
    <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
      <path d={ICON} />
    </svg>
  );
}

const DeckMap = () => {
  const houses = api.houses.getAll.useQuery() as ZillowDataView[];
  const [popupInfo, setPopupInfo] = useState(null);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  return (
    <div style={{ width: "100%", height: "70vh" }}>
      <Map
        initialViewState={{
          longitude: -76.8227368,
          latitude: 39.2859917,
          zoom: 12,
        }}
        style={{ width: "100%", height: "50vh" }}
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              {popupInfo.address} <br />
              <strong>{String(formatter.format(popupInfo.price))}</strong>{" "}
              <br />
              <em>{popupInfo.school_name}</em> <br />
            </div>
            <a target="_new" href={popupInfo.propertyUrl}>
              <img width="100%" src={popupInfo.image} />
            </a>
          </Popup>
        )}
        {houses.data &&
          houses.data.map((datum) => {
            return (
              <Marker
                longitude={datum.longitude}
                latitude={datum.latitude}
                anchor="bottom"
                key={datum.id}
                onClick={(e) => {
                  // If we let the click event propagates to the map, it will immediately close the popup
                  // with `closeOnClick: true`
                  e.originalEvent.stopPropagation();
                  setPopupInfo(datum);
                }}
              >
                <Pin />
              </Marker>
            );
          })}
      </Map>
    </div>
  );
};

export default DeckMap;
