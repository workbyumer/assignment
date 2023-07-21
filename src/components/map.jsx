import React, { useState } from "react";
import { Box } from "@mui/material";
import MarkerIcon from "./map-marker.svg";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";

import Loaders from "../loaders";

const Maps = ({ data, top10Countries, countryInfo }) => {
  const [infoWindowOpen, setInfoWindowOpen] = useState({});
  const [countrySelected, setcountrySelected] = useState("");

  const showInfoWindow = () => {
    setInfoWindowOpen(true);
  };
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
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMarker = (country) => {
    setcountrySelected(country);
    console.log(country);
    setInfoWindowOpen({ [countrySelected]: !infoWindowOpen });
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
            zoom={1}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <MarkerF
              onClick={() => handleMarker(countryInfo.country)}
              position={{
                lat: data.lat,
                lng: data.lng,
              }}
            >
              {countrySelected === countryInfo.country && (
                <InfoWindow>
                  <Box>
                    <p>Country: {countryInfo.country}</p>
                    <p>Cases: {countryInfo.cases}</p>
                    <p>Deaths: {countryInfo.deaths}</p>
                    <p>Recovered: {countryInfo.recovered}</p>
                  </Box>
                </InfoWindow>
              )}
            </MarkerF>
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
                >
                  {countrySelected === m.country && (
                    <InfoWindow>
                      <Box>
                        <p>Country: {m.country}</p>
                        <p>Cases: {m.cases}</p>
                        <p>Deaths: {m.deaths}</p>
                        <p>Recovered: {m.recovered}</p>
                      </Box>
                    </InfoWindow>
                  )}
                </MarkerF>
              );
            })}
          </GoogleMap>
        ) : (
          <Loaders />
        )}
      </Box>
    </Box>
  );
};

export default Maps;
