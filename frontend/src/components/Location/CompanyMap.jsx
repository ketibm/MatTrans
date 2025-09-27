import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const libraries = ["places"];

const CompanyMap = ({ coordinates, zoom = 18 }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries,
  });

  if (loadError) return <p>Error loading map</p>;
  if (!isLoaded) return <p>Loading map script...</p>;
  if (!location) return <p>No coordinates provided</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={coordinates}
      zoom={zoom}
    >
      <Marker position={coordinates} />
    </GoogleMap>
  );
};

export default CompanyMap;
