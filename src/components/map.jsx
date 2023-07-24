import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import MarkerIcon from "./map-marker.svg";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";

import Loaders from "./loaders";
import TableData from "./table";

const Maps = ({
  data,
  top10Countries,
  countryInfo,
  dataTable,
  countryTable,
}) => {
  const [countrySelected, setcountrySelected] = useState("");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDiEmXC03SOnnqDfcfAZCrRpAut6YxWN2E",
  });
  const containerStyle = {
    width: "99vw",
    height: "100vh",
  };

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds();

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMarker = (country) => {
    setcountrySelected(country);
  };
  const tableRef = useRef(null);
  const { lat, lng } = data;
  return (
    <Box>
      <Box>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: lat,
              lng: lng,
            }}
            zoom={3}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <MarkerF
              onClick={() => handleMarker(countryInfo.country)}
              position={{
                lat: data.lat,
                lng: data.lng,
              }}
            ></MarkerF>
            {top10Countries?.map((m, index) => {
              return (
                <MarkerF
                  key={index}
                  icon={MarkerIcon}
                  onClick={() => handleMarker(m.country)}
                  clickable={true}
                  position={{
                    lat: m.lat,
                    lng: m.lng,
                  }}
                ></MarkerF>
              );
            })}
          </GoogleMap>
        ) : (
          <Loaders />
        )}
        <TableData
          data={dataTable}
          country={countrySelected}
          tableRef={tableRef}
        />
      </Box>
    </Box>
  );
};

export default Maps;
