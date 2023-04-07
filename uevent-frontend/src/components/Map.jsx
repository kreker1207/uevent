import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

const Map = (props) => {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [placeName, setPlaceName] = useState(null);

    const handleMapClick = event => {
        const geocoder = new window.google.maps.Geocoder();
        const latLng = new window.google.maps.LatLng(event.lat, event.lng);
        const { lat, lng }=  event;
        setSelectedPlace({ lat: lat, lng: lng }); 
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    setPlaceName (results[0].formatted_address);
                    props.onChildStateChange(results[0].formatted_address);
                } else {
                    console.log('No results found');
                }
            } else {
                console.log(`Geocoder failed due to: ${status}`)
            }
        });
    }

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDuHV2o8j_nfA8XMUC-15fN9vlDB9htW30' }}
        defaultCenter={{ lat: 50.00575764802797, lng: 36.229145464639906 }}
        defaultZoom={12}
        onClick={(event) => handleMapClick(event)}
        yesIWantToUseGoogleMapApiInternals={true}
        onGoogleApiLoaded={()=>{console.log('loaded')}}
      >
        {selectedPlace && (
          <Marker lat={selectedPlace.lat} lng={selectedPlace.lng} />
        )}
      </GoogleMapReact>
    </div>
  );
};

const Marker = () => <div style={{ color: 'red' }}>📍</div>;

export default Map;