import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Circle, Marker, useMap, ZoomControl, useMapEvents } from 'react-leaflet'
import { useLocationStore } from '@/store/locationStore'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMissionStore } from '@/store/missionStore'
import { Crosshair } from 'lucide-react'

// ── Auto-Tracking Camera ───────────────────────────────────────
const MapController: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
	const map = useMap()
	useEffect(() => {
		map.flyTo([lat, lng], 11, {
			animate: true,
			duration: 1.5,
		})
	}, [lat, lng, map])
	return null
}

// ── Tactical Map Click Handler ─────────────────────────────────
const MapClickHandler: React.FC = () => {
	const { setLocation } = useLocationStore()
	const { launchOrbitalScan } = useMissionStore()

	useMapEvents({
		click: (e) => {
			const lat = e.latlng.lat
			const lng = e.latlng.lng

			// Create a custom location object based on the click
			const newTarget = {
				latitude: lat,
				longitude: lng,
				locationName: `COORD: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
			}

			// 1. Update the global location store
			setLocation(newTarget)

			// 2. Instantly fire the telemetry uplink for the new coordinates
			launchOrbitalScan(newTarget)
		},
	})

	return null
}

// ── Custom HUD Crosshair ───────────────────────────────────────
const createCrosshairIcon = (colorHex: string) => {
	return L.divIcon({
		className: 'bg-transparent',
		html: `
            <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; width: 100%; height: 1px; background: ${colorHex}; opacity: 0.5;"></div>
                <div style="position: absolute; width: 1px; height: 100%; background: ${colorHex}; opacity: 0.5;"></div>
                <div style="width: 12px; height: 12px; border: 2px solid ${colorHex}; border-radius: 50%; box-shadow: 0 0 10px ${colorHex};"></div>
            </div>
        `,
		iconSize: [40, 40],
		iconAnchor: [20, 20],
	})
}

export const TelemetryMap: React.FC = () => {
	const { missionData, isLoading } = useMissionStore()
	const mapRef = useRef<L.Map | null>(null)

	const lat = missionData?.location.latitude ?? 0
	const lng = missionData?.location.longitude ?? 0

	let riskColor = '#00E5FF' // Neon Cyan
	if (missionData?.riskState === 'DEGRADED') riskColor = '#FFB300' // Amber
	if (missionData?.riskState === 'HIGH_RISK') riskColor = '#E63946' // Crimson

	const footprintRadius = (missionData?.estimatedAccuracy || 4.0) * 800

	if (isLoading && !missionData) {
		return (
			<div className="w-full h-full bg-surface-2 border border-border-dim animate-pulse flex items-center justify-center font-mono text-neon-cyan/50 text-sm tracking-widest">
				INITIALIZING SATELLITE LINK...
			</div>
		)
	}

	return (
		<div className="relative w-full h-full min-h-[400px] border border-border-dim group overflow-hidden">
			{/* Top Left HUD Accent */}
			<div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20 z-[400] group-hover:border-neon-cyan transition-colors" />

			{/* HUD Overlay */}
			<div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
				<div className="bg-surface-0/80 backdrop-blur-md border border-white/10 px-3 py-1.5 font-mono text-xs uppercase tracking-widest">
					<span style={{ color: riskColor }}>
						LAT: {lat.toFixed(4)} // LNG: {lng.toFixed(4)}
					</span>
				</div>

				{/* Recenter Target Button */}
				<button
					onClick={() => mapRef.current?.flyTo([lat, lng], 11, { duration: 1.5 })}
					className="w-fit flex items-center gap-2 bg-surface-0/80 backdrop-blur-md border border-white/10 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-neon-cyan hover:border-neon-cyan/50 transition-all cursor-pointer"
				>
					<Crosshair className="w-3 h-3" />
					REACQUIRE TARGET
				</button>
			</div>

			<MapContainer ref={mapRef} center={[lat, lng]} zoom={11} zoomControl={false} className="w-full h-full z-0 cursor-crosshair">
				<ZoomControl position="bottomright" />

				<MapController lat={lat} lng={lng} />
				<MapClickHandler />

				<TileLayer attribution='&copy; <a href="https://carto.com/">CartoDB</a>' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

				<Circle
					center={[lat, lng]}
					radius={footprintRadius}
					pathOptions={{
						color: riskColor,
						fillColor: riskColor,
						fillOpacity: 0.15,
						weight: 1,
						dashArray: '4 6',
					}}
				/>

				<Marker position={[lat, lng]} icon={createCrosshairIcon(riskColor)} />
			</MapContainer>

			{/* Scanline Overlay */}
			<div className="absolute inset-0 pointer-events-none z-[400] scan-line opacity-50" />
		</div>
	)
}
