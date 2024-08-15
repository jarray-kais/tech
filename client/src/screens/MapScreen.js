// src/screens/MapScreen.js
import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Context/CartContext';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { google } from '../API';

import Message from '../components/Message/Message';

const defaultLocation = { lat: 45.516, lng: -73.56 };
const libs = ['places'];




const MapScreen = () => {
  const { dispatch: ctxDispatch } = useContext(Store);
  
  const navigate = useNavigate();
  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);
  const[googleApiKey , setGoogleApiKey] = useState("")

  const mapRef = useRef(null);
  const placeRef = useRef(null);
  const markerRef = useRef(null);

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation os not supported by this browser');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };
 
  useEffect(()=>{
   const fetch = async()=>{
   const { googleApiKey} = await google()
   setGoogleApiKey(googleApiKey)
   getUserCurrentLocation()
  }
   
  fetch()
    ctxDispatch({
      type: 'SET_FULLBOX_ON',
    });
  },[ctxDispatch ])

  const onLoad = (map) => {
    mapRef.current = map;
  };
  const onIdle = () => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  };

  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };
  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setCenter({ lat: place.lat(), lng: place.lng() });
    setLocation({ lat: place.lat(), lng: place.lng() });
  };

  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };
  const onConfirm = () => {
    const places = placeRef.current.getPlaces() || [{}];
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION',
      payload: {
        lat: location.lat,
        lng: location.lng,
        address: places[0].formatted_address,
        name: places[0].name,
        vicinity: places[0].vicinity,
        googleAddressId: places[0].id,
      },
    });
    <Message variant="success">"location selected successfully."</Message>
    navigate('/shipping');
  };

  return (

    <div className="full-box">
    <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
      <GoogleMap
        id="smaple-map"
        mapContainerStyle={{ height: '100%', width: '100%' }}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onIdle={onIdle}
      >
        <StandaloneSearchBox
          onLoad={onLoadPlaces}
          onPlacesChanged={onPlacesChanged}
        >
          <div className="map-input-box">
            <input type="text" placeholder="Enter your address"></input>
            <button type="button" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </StandaloneSearchBox>
        <Marker position={location} onLoad={onMarkerLoad}></Marker>
      </GoogleMap>
    </LoadScript>
  </div>
  );
};

export default MapScreen;
