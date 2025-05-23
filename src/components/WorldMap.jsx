import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './WorldMap.css';
import axios from 'axios';

const WorldMap = ({ animals }) => {
    const [geoJsonData, setGeoJsonData] = useState(null);

    useEffect(() => {
        const loadStaticCoordinates = async () => {
            try {
                // Load static coordinates
                const res = await axios.get('/static-coordinates.json');
                const coordinates = res.data;

                // Match coordinates with animals
                const features = animals
                    .map(animal => {
                        const match = coordinates.find(coord => coord.binomialName === animal.binomialName);
                        if (!match || isNaN(match.lat) || isNaN(match.lng)) return null;

                        return {
                            type: "Feature",
                            properties: {
                                name: animal.commonName,
                                binomialName: animal.binomialName,
                                lastRecord: animal.lastRecord || "Unknown",
                                wikiLink: animal.wikiLink || null,
                            },
                            geometry: {
                                type: "Point",
                                coordinates: [match.lng, match.lat],
                            }
                        };
                    })
                    .filter(Boolean); // Remove nulls

                setGeoJsonData({
                    type: "FeatureCollection",
                    features,
                });
            } catch (err) {
                console.error("Failed to load static coordinates:", err);
            }
        };

        loadStaticCoordinates();
    }, [animals]);

    const onEachFeature = (feature, layer) => {
        if (feature.properties) {
            const { name, lastRecord } = feature.properties;
            let popupContent = `
                <div style="max-width: 200px;">
                    <strong>${name}</strong>
                    <p><b>Last seen:</b> ${lastRecord}</p>
                </div>
            `;
            layer.bindPopup(popupContent);
        }
    };

    return(
        <MapContainer 
            center={[20, 0]}  // Center the map around the equator
            zoom={2}          // Default zoom level
            minZoom={2}       // Prevents zooming out too far
            scrollWheelZoom={true}
            maxBounds={[[90, -180], [-90, 180]]} // Prevents infinite scrolling
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geoJsonData && <GeoJSON data={geoJsonData} onEachFeature={onEachFeature} />}
        </MapContainer>
	);
}

export default WorldMap;