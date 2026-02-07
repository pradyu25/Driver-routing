
import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin, Fuel, Home, Flag, Bed } from 'lucide-react';

// Fix Leaflet Default Icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const createIcon = (TypeIcon, color) => {
    const html = renderToStaticMarkup(
        <div style={{ color: color, background: 'white', borderRadius: '50%', padding: '4px', border: `2px solid ${color}` }}>
            <TypeIcon size={20} />
        </div>
    );
    return L.divIcon({
        html: html,
        className: 'custom-leaflet-icon', // Need css to reset default divIcon styles?
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
};

const ICONS = {
    'START': createIcon(Home, '#2563eb'),
    'PICKUP': createIcon(MapPin, '#16a34a'),
    'DROPOFF': createIcon(Flag, '#dc2626'),
    'FUEL': createIcon(Fuel, '#ea580c'),
    'REST': createIcon(Bed, '#9333ea')
};

const SetBounds = ({ coords }) => {
    const map = useMap();
    React.useEffect(() => {
        if (coords && coords.length > 0) {
            // Leaflet expects [lat, lon], GeoJSON is [lon, lat]
            const latLngs = coords.map(c => [c[1], c[0]]);
            const bounds = L.latLngBounds(latLngs);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [coords, map]);
    return null;
};

const MapView = ({ routeGeometry, markers }) => {
    // routeGeometry is GeoJSON LineString coordinates [[lon, lat], ...]
    // Or object { type: LineString, coordinates: ... }

    const coordinates = routeGeometry?.coordinates || routeGeometry || [];
    const positions = coordinates.map(c => [c[1], c[0]]); // Swap for Leaflet

    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300 shadow-sm relative z-0">
            <MapContainer center={[37.0902, -95.7129]} zoom={4} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {positions.length > 0 && <Polyline positions={positions} color="#3b82f6" weight={5} />}

                {markers && markers.map((m, idx) => (
                    <Marker
                        key={idx}
                        position={[m.lat, m.lon]}
                        icon={ICONS[m.type] || ICONS['START']}
                    >
                        <Popup>
                            <div className="text-sm font-bold">{m.type}</div>
                            {m.label && <div>{m.label}</div>}
                            {m.metadata?.distance_miles && <div>Mi: {Math.round(m.metadata.distance_miles)}</div>}
                        </Popup>
                    </Marker>
                ))}

                <SetBounds coords={coordinates} />
            </MapContainer>
        </div>
    );
};

export default MapView;
