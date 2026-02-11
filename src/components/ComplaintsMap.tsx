import { MapContainer, TileLayer, GeoJSON, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import proj4 from 'proj4';

// Define UTM 36N projection
proj4.defs("EPSG:32636", "+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs");

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ComplaintsMapProps {
    onLocationSelect?: (location: string, latlng: [number, number]) => void;
    selectedLocation?: [number, number];
}

const LocationPicker = ({ onSelect }: { onSelect: (latlng: [number, number]) => void }) => {
    useMapEvents({
        click(e) {
            onSelect([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
};

const ComplaintsMap = ({ onLocationSelect, selectedLocation }: ComplaintsMapProps) => {
    const [buildingsData, setBuildingsData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const buildingsUrl = 'http://localhost:8080/geoserver/dpa/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dpa:Buildings — buidlings&outputFormat=application/json';
                const res = await fetch(buildingsUrl);
                const data = await res.json();

                // Transform coordinates from UTM 36N to LatLng
                const transformedFeatures = data.features.map((feature: any) => {
                    if (feature.geometry && feature.geometry.type === 'Point') {
                        const [x, y] = feature.geometry.coordinates;
                        const [lng, lat] = proj4("EPSG:32636", "EPSG:4326", [x, y]);
                        return {
                            ...feature,
                            geometry: { ...feature.geometry, coordinates: [lng, lat] }
                        };
                    }
                    return feature;
                });

                setBuildingsData({ ...data, features: transformedFeatures });
            } catch (err) {
                console.error('Error fetching buildings for complaints map:', err);
            }
        };
        fetchData();
    }, []);

    const buildingIcon = L.divIcon({
        html: `<div style="background-color: #ef4444; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
        className: 'complaint-building-icon',
        iconSize: [10, 10],
    });

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border">
            <MapContainer
                center={[31.44, 31.82]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {buildingsData && (
                    <GeoJSON
                        data={buildingsData}
                        pointToLayer={(feature, latlng) => L.marker(latlng, { icon: buildingIcon })}
                        onEachFeature={(feature, layer) => {
                            layer.on('click', (e) => {
                                if (onLocationSelect) {
                                    onLocationSelect(feature.properties.Name, [e.latlng.lat, e.latlng.lng]);
                                }
                            });
                            layer.bindTooltip(feature.properties.Name);
                        }}
                    />
                )}

                <LocationPicker onSelect={(latlng) => {
                    if (onLocationSelect) {
                        onLocationSelect(`${latlng[0].toFixed(5)}, ${latlng[1].toFixed(5)}`, latlng);
                    }
                }} />

                {selectedLocation && (
                    <Marker position={selectedLocation} />
                )}
            </MapContainer>
        </div>
    );
};

export default ComplaintsMap;
