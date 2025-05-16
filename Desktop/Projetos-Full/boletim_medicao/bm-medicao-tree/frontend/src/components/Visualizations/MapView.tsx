import { Medicao } from '@/types/medicaoTypes'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import StatusBadge from '@/components/Badges/StatusBadge'

// Fix for default marker icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface MapViewProps {
  medicoes: Medicao[]
}

export default function MapView({ medicoes }: MapViewProps) {
  // Mock coordinates for demonstration
  const getMockCoordinates = (index: number) => ({
    lat: -23.5505 + (index * 0.01),
    lng: -46.6333 + (index * 0.01)
  })

  return (
    <div className="h-[500px] rounded-md overflow-hidden">
      <MapContainer 
        center={[-23.5505, -46.6333]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {medicoes.map((medicao, index) => {
          const coords = medicao.coordenadas || getMockCoordinates(index)
          return (
            <Marker 
              key={medicao.idSistema} 
              position={[coords.lat, coords.lng]} 
              icon={defaultIcon}
            >
              <Popup>
                <div className="space-y-1">
                  <h3 className="font-bold">{medicao.idSistema}</h3>
                  <p>{medicao.local}</p>
                  <StatusBadge status={medicao.status} />
                  <p className="text-sm">
                    Valor: {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(medicao.valorTotal)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}