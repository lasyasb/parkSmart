import React, { useState, useEffect } from 'react';
import { Car, Search, Navigation, ParkingMeter as Parking, Clock, CreditCard, ChevronRight, Shield, Zap, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for current location
const currentLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Sample parking data for Hyderabad
const parkingSpots = [
  { id: 1, name: "Kukatpally Parking Zone", lat: 17.4947, lng: 78.3996, available: 25, price: "₹40", distance: "0.2 km" },
  { id: 2, name: "KPHB Colony Parking", lat: 17.4920, lng: 78.3972, available: 15, price: "₹30", distance: "0.5 km" },
  { id: 3, name: "Forum Mall Parking", lat: 17.4937, lng: 78.3923, available: 50, price: "₹50", distance: "0.8 km" },
  { id: 4, name: "Metro Station Parking", lat: 17.4957, lng: 78.4008, available: 35, price: "₹20", distance: "0.3 km" }
];

function LocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <>
      <Marker position={position} icon={currentLocationIcon}>
        <Popup>You are here</Popup>
      </Marker>
      <Circle center={position} radius={100} pathOptions={{ color: 'blue', fillColor: 'blue' }} />
    </>
  );
}

function SearchBar() {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-[1000]">
      <div className="bg-white rounded-full shadow-lg flex items-center p-2">
        <Search className="h-5 w-5 text-gray-400 ml-3" />
        <input
          type="text"
          placeholder="Search for parking in Hyderabad..."
          className="flex-1 px-4 py-2 outline-none"
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
          Find Parking
        </button>
      </div>
    </div>
  );
}

function ParkingSpot({ name, distance, available, price }: {
  name: string;
  distance: string;
  available: number;
  price: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <span className="text-sm text-gray-500">{distance}</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center text-green-600">
          <Car className="h-4 w-4 mr-1" />
          {available} spots
        </span>
        <span className="flex items-center text-gray-600">
          <CreditCard className="h-4 w-4 mr-1" />
          {price}/hr
        </span>
      </div>
      <button className="mt-3 w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors flex items-center justify-center">
        <Navigation className="h-4 w-4 mr-2" />
        Navigate
      </button>
    </div>
  );
}

function MapView() {
  return (
    <div className="relative h-full">
      <MapContainer
        center={[17.4947, 78.3996]}
        zoom={14}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {parkingSpots.map((spot) => (
          <Marker key={spot.id} position={[spot.lat, spot.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{spot.name}</h3>
                <p className="text-sm text-green-600">{spot.available} spots available</p>
                <p className="text-sm text-gray-600">{spot.price}/hour</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="absolute top-20 right-4 w-80 space-y-3 z-[1000]">
        {parkingSpots.map((spot) => (
          <ParkingSpot
            key={spot.id}
            name={spot.name}
            distance={spot.distance}
            available={spot.available}
            price={spot.price}
          />
        ))}
      </div>

      <button 
        className="absolute bottom-4 right-4 z-[1000] bg-white p-3 rounded-full shadow-lg hover:bg-gray-50"
        onClick={() => {
          const map = document.querySelector('.leaflet-container')?._leaflet_map;
          if (map) {
            map.locate({ setView: true });
          }
        }}
      >
        <Crosshair className="h-6 w-6 text-gray-600" />
      </button>
    </div>
  );
}

function App() {
  const [view, setView] = useState<'map' | 'about'>('map');

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-[1001]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Parking className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">Park Smart 2.0</h1>
          </div>
          <nav className="flex space-x-4">
            <button
              onClick={() => setView('map')}
              className={`px-3 py-2 rounded-md ${
                view === 'map'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Find Parking
            </button>
            <button
              onClick={() => setView('about')}
              className={`px-3 py-2 rounded-md ${
                view === 'about'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              About
            </button>
          </nav>
        </div>
      </header>

      {view === 'map' ? (
        <main className="flex-1 relative">
          <SearchBar />
          <MapView />
        </main>
      ) : (
        <main className="flex-1 bg-gray-50">
          {/* About View */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Smart Parking for Smart Cities
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Park Smart 2.0 uses AI and IoT sensors to guide you to available parking
                spots in real-time, making parking hassle-free.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                <p className="text-gray-600">
                  Get instant updates on parking availability and navigate directly to open spots.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Navigation</h3>
                <p className="text-gray-600">
                  Turn-by-turn directions to the nearest available parking spot.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-gray-600">
                  Contactless payment for a seamless parking experience.
                </p>
              </div>
            </div>

            <div className="text-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center mx-auto hover:bg-blue-700 transition-colors">
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;