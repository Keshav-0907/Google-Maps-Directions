/* eslint-disable no-undef */
import React, { useRef, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const center = { lat: 28.7041, lng: 77.1025 };

const Main = () => {
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [mode, setmode] = useState("");

  console.log(duration);

  const originRef = useRef();
  const destinationRef = useRef();

  async function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    await directionsService
      .route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode[mode],
      })
      .then((results) => {
        setDirections(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);
      })
      // eslint-disable-next-line no-restricted-globals
      .catch((e) => window.alert("Error Encountered \n" + e));
  }

  function clearRoute() {
    setDirections("");
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_WEBSITE_NAME,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <p>Loading in Progress </p>;
  }

  return (
    <>
      <div className="bg-blue-50 h-screen flex flex-col justify-between">
        <div className="flex flex-col w-full text-center">
          <div className="text-2xl font-semibold">
            Google Maps Distance Finder 🗺️
          </div>

          <div className="text-blue-800 text-sm">
            Let's calculate <span className="font-bold"> distance </span> from
            Google maps
          </div>
        </div>

        <div className="flex ">

        <div className=" w-1/2 ">
            <div className="w-full h-full p-5">
              <GoogleMap
                center={center}
                zoom={10}
                mapContainerStyle={{ height: "100%" }}
                options={{
                  streetViewControl: false,
                  zoomControl: true,
                  fullscreenControl: false,
                  mapTypeControl: true,
                }}
              >
                <Marker position={center} />
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </div>
          </div>

          <div className="flex flex-col w-1/2">
            <div className="w-full">
              <div className="flex flex-col m-7">
                <label className="text-sm text-gray-900"> Origin </label>
                <Autocomplete>
                  <input
                    className=" p-2 w-full rounded-lg border border-gray-200"
                    placeholder="Enter Origin"
                    ref={originRef}
                  />
                </Autocomplete>
              </div>

              <div className="flex flex-col m-7">
                <label className="text-sm text-gray-900"> Stop </label>
                <Autocomplete>
                  <input
                    className="p-2 w-full rounded-lg border border-gray-200"
                    placeholder="Enter Stop(if any)"
                    id="userInput"
                  />
                </Autocomplete>
              </div>

              <div className="flex flex-col m-7">
                <label className="text-sm text-gray-900"> Destination </label>
                <Autocomplete>
                  <input
                    className="p-2 w-full rounded-lg border border-gray-200"
                    placeholder="Enter Destination"
                    ref={destinationRef}
                  />
                </Autocomplete>
              </div>

              <div className="flex flex-col m-7">
                <label className="text-sm text-gray-900"> Mode of Travel</label>

                <select
                  style={{ padding: "2px" }}
                  onChange={(e) => setmode(e.target.value)}
                >
                  <option> -- Select Transit Option -- </option>
                  <option value="DRIVING">Driving</option>
                  <option value="WALKING">Walking</option>
                  <option value="BICYCLING">Bi Cycling</option>
                  <option value="TRANSIT">Transit</option>
                </select>
              </div>

              <div className="flex justify-start items-cente">
                <div className="flex justify-around w-full">
                  <button
                    className="bg-blue-800 text-white py-1 px-5 rounded-full"
                    onClick={calculateRoute}
                  >
                    Calculate
                  </button>
                  {directions && (
                    <button
                      className="bg-blue-800 text-white py-1 px-5 rounded-full"
                      onClick={clearRoute}
                    >
                      Clear Path
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center ">
              <div className="m-2 w-3/4">
                <div className="bg-white rounded-tl-lg rounded-tr-lg">
                  <div className="flex justify-around">
                    <h3 className=" font-bold text-2xl p-3">Distance</h3>
                    <h3 className="text-blue-500 font-bold text-3xl p-3">
                      {directions ? distance : "0 km"}
                    </h3>
                  </div>
                </div>
                <div className="border border-gray-300 p-7 rounded-br-lg rounded-bl-lg bg-gre">
                  <p className="text-sm">
                    {" "}
                    The distance between{" "}
                    <span className="font-bold">
                      {" "}
                      {distance
                        ? originRef.current.value
                        : "( City Not slected )"}{" "}
                    </span>{" "}
                    and{" "}
                    <span className="font-bold">
                      {" "}
                      {distance
                        ? destinationRef.current.value
                        : "( City Not slected )"}{" "}
                    </span>{" "}
                    via the seleted route is{" "}
                    <span className="font-bold">
                      {directions ? distance : "0 km"}
                    </span>{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </>
  );
};

export default Main;
