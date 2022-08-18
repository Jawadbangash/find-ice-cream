import React from "react";
import "./App.css";
// import axios from 'axios'
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import {googleMapsApiKey} from './engVariables'


function App() {
  const [data, setData] = React.useState(null);
  const [markersCoords, setMarkersCoords] = React.useState([])

  const containerStyle = {
    width: '400px',
    height: '400px'
  };
  
  const center = {
    lat: 38.6976631,
    lng: -9.4210653
  };
  
  const isLoaded  = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey
  })

  const [map, setMap] = React.useState(null)
  const [showMapD, setShowMap] = React.useState(false)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(markersCoords[0]?markersCoords[0]: center);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const showMap = () => {
    setShowMap(true)
  }
  
  React.useEffect(() => {

    fetch("/gMaps")
      .then((res) => res.json())
      .then((data) => setData(data.message));


    fetch("/api")
      .then((res) => res.json())
      // .then((res) => JSON.parse(res.message))
      .then((data)=> {
        console.log(JSON.parse(data.message))
        return JSON.parse(data.message).businesses.map((business) => {
          return {lat: business.coordinates.latitude, 
            lng: business.coordinates.longitude
        }
        })
      })
      .then((arr)=> {
        console.log('arr <<< ',  arr)
        setMarkersCoords(arr)
      })

  }, []);

  return (
    <div className="App">
      <button onClick={() => showMap()}>Show Map</button>
      {
        // showMapD
        window.google ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={markersCoords[0]}
            zoom={10}
            // onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {
              markersCoords.map(item => 
                <MarkerF position={item} />
              )
            }
            { /* Child components, such as markers, info windows, etc. */ }
            {/* <MarkerF style={{height: '10vh', width: '10vh'}}
              position={center}
            /> */}
            <></>
          </GoogleMap>
      ) : <></>

      }
              <p>{!data ? "Loading..." : data}</p>

    </div>

  )

      
  
}
export default App;