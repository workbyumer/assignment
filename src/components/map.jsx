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
    width: "98.75vw",
    height: "100vh",
  };

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);
  const handleClickScroll = () => {
    const element = document.getElementById("table");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMarker = (country) => {
    setcountrySelected(country);
    handleClickScroll();
  };

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
        <Box id="table">
          <TableData data={dataTable} country={countrySelected} />
        </Box>
      </Box>
    </Box>
  );
};

export default Maps;
