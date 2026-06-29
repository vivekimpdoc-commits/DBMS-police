import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, AlertTriangle, Crosshair } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function GISMap() {
  const center = [26.8467, 80.9462]; // Lucknow coordinates

  const vipRoute = [
    [26.8467, 80.9462],
    [26.8500, 80.9500],
    [26.8550, 80.9600]
  ];

  const highSecurityZone = [
    [26.8500, 80.9400],
    [26.8500, 80.9600],
    [26.8400, 80.9600],
    [26.8400, 80.9400]
  ];

  return (
    <div className="p-6 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Crosshair className="text-accent" size={28}/> GIS Command Map
          </h2>
          <p className="text-slate-500 text-sm mt-1">Live tracking of forces, routes, and security zones.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-slate-50 hover:bg-slate-700 text-slate-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-slate-200 transition-colors">
            <Layers size={18} /> Map Layers
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-50/50 backdrop-blur-md border border-slate-200 rounded-2xl overflow-hidden shadow-xl relative">
        {/* Map Overlays / Legend */}
        <div className="absolute top-4 right-4 z-[400] bg-white/90 border border-slate-200 p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <h4 className="text-slate-800 font-bold mb-3 text-sm border-b border-slate-200 pb-2">Map Legend</h4>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-300"></div> VIP Route</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500/20 border-2 border-red-500"></div> High Security Zone</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Checkpost</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500 flex items-center justify-center"><AlertTriangle size={8} className="text-white"/></div> Incident</div>
          </div>
        </div>

        <MapContainer center={center as any} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          <Polygon positions={highSecurityZone as any} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.1 }} />
          
          <Marker position={[26.8467, 80.9462]}>
            <Popup>
              <div className="text-slate-900 font-bold">Start Point</div>
              <div className="text-xs text-slate-600">VIP Movement Commencing</div>
            </Popup>
          </Marker>

          <Circle center={[26.8550, 80.9600]} radius={500} pathOptions={{ color: 'orange', fillColor: 'orange' }}>
            <Popup>Destination Venue Security Perimeter</Popup>
          </Circle>
        </MapContainer>
      </div>
    </div>
  )
}
