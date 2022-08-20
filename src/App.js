import React from "react";
import "./App.css";
// import axios from 'axios'
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import {googleMapsApiKey} from './engVariables'


function App() {
  const [data, setData] = React.useState(null);
  const [markersCoords, setMarkersCoords] = React.useState([])

  const containerStyle = {
    width: '60vw',
    height: '100vh'
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
  const [addressBarData, setAddressBar] = React.useState('react data')

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

  function addressBar (text ) {
       setAddressBar(text.target.value)
  }

  let sendAddress = () => {
    fetch ('/sendYelpAddress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({address: addressBarData})
    })
    .then((res) => res.json())
    .then((res) => {
      console.log( JSON.parse(res.message), 'res from addressbar')
      return JSON.parse(res.message).businesses.map((business) => {
        return {lat: business.coordinates.latitude, 
          lng: business.coordinates.longitude
      }
      })
    })
    .then((arr)=> {
      console.log('arr <<< ',  arr)
      setMarkersCoords(arr)
    })
  }

  return (
    <div className="App">
      <div id='mapOverlay'>
        <input label='Address you want to Search' onChange={(text) => addressBar(text)}></input>
        <button id='SearchGM' onClick={() => sendAddress()}>Search Address</button>
      </div>
      {
        // showMapD
        window.google ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={markersCoords[0] ? markersCoords[0] : center}
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