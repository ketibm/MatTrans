import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const libraries = ["places"];

const CompanyMap = ({ address, zoom = 18 }) => {
  const [location, setLocation] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && location) {
      window.google.maps.event.trigger(window, "resize");
    }
  }, [isLoaded, location]);

  useEffect(() => {
    if (!isLoaded || !address) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        setLocation({ lat: lat(), lng: lng() });
      } else {
        console.error("❌ Geocode failed:", status);
      }
    });
  }, [isLoaded, address]);

  if (loadError) return <p>Error loading map</p>;
  if (!isLoaded) return <p>Loading map script...</p>;
  if (!location) return <p>Loading location...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={zoom}>
      <Marker position={location} />
    </GoogleMap>
  );
};

export default CompanyMap;
