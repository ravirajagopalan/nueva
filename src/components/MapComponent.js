'use client' // DO NOT REMOVE

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet' // Import Leaflet to create custom icons

const createCustomIcon = (venueName) => {
    return L.divIcon({
        html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <svg xmlns="http://www.w3.org/2000/svg" height="48px" width="48px" viewBox="0 -960 960 960" fill="#5f6368"><path d="M480-301q99-80 149.5-154T680-594q0-90-56-148t-144-58q-88 0-144 58t-56 148q0 65 50.5 139T480-301Zm0 101Q339-304 269.5-402T200-594q0-125 78-205.5T480-880q124 0 202 80.5T760-594q0 94-69.5 192T480-200Zm0-320q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520ZM200-80v-80h560v80H200Zm280-520Z"/></svg>
          <span style="
            font-size: 16px;  
            font-weight: bold; 
            margin-top: 6px;  
            background-color: white; 
            padding: 4px 8px; 
            border-radius: 4px;
            white-space: nowrap; 
            display: inline-block; 
          ">${venueName}</span>
        </div>
      `,
        iconSize: [48, 64], // Adjust icon size to accommodate the larger pin and text
        className: '', // No default styles, so we can customize
    })
}

export default function MapComponent({ latitude, longitude, venueName, fullAddress }) {
    return (
        <>
            <p className='text-xl font-semibold mb-1 sm:mb-2'>How do I get to {venueName}?</p>
            <div className='rounded-lg w-full mb-6'>
                <p className='text-base text-gray-600'>
                    Visiting {venueName} is straightforward, whether you&apos;re coming from around the corner or traveling from a distance.
                    You&apos;ll find {venueName} at:
                    <br />
                    <span className='font-bold'>{fullAddress}</span>, ensuring a smooth and easy arrival.
                </p>
            </div>
            <MapContainer
                center={[latitude, longitude]} // Set the initial center of the map
                zoom={17} // Increased zoom level for a closer view
                style={{ height: '400px', width: '100%' }} // Set the size of the map container
            >
                {/* TileLayer for OSM */}
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Marker with Custom Icon */}
                <Marker position={[latitude, longitude]} icon={createCustomIcon(venueName)} />
            </MapContainer>
        </>
    )
}
