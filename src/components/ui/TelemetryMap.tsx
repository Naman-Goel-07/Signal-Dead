import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMissionStore } from '@/store/missionStore'

// ── Auto-Tracking Camera ───────────────────────────────────────
// This sub-component forces the map to fly to the new city when searched
const MapController: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
	const map = useMap()
	useEffect(() => {
		map.flyTo([lat, lng], 11, {
			animate: true,
			duration: 1.5, // Cinematic slow pan
		})
	}, [lat, lng, map])
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
		iconAnchor: [20, 20], // Center the crosshair exactly on the coordinates
	})
}

export const TelemetryMap: React.FC = () => {
	const { missionData, isLoading } = useMissionStore()

	// Default to Null Island or a cool default location if no data
	const lat = missionData?.location.latitude ?? 0
	const lng = missionData?.location.longitude ?? 0

	// Dynamic Risk Styling
	let riskColor = '#00E5FF' // Neon Cyan (SAFE)
	if (missionData?.riskState === 'DEGRADED') riskColor = '#FFB300' // Amber
	if (missionData?.riskState === 'HIGH_RISK') riskColor = '#E63946' // Crimson

	// The degradation footprint expands based on the estimated accuracy
	// If accuracy is worse (higher number), the circle gets massive
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

			{/* Status Overlay */}
			<div className="absolute top-4 left-4 z-[400] bg-surface-0/80 backdrop-blur-md border border-white/10 px-3 py-1.5 font-mono text-xs uppercase tracking-widest">
				<span style={{ color: riskColor }}>
					LAT: {lat.toFixed(4)} // LNG: {lng.toFixed(4)}
				</span>
			</div>

			<MapContainer
				center={[lat, lng]}
				zoom={11}
				zoomControl={true}
				className="w-full h-full z-0"
			>
				<MapController lat={lat} lng={lng} />

				{/* Aerospace Dark Theme Tiles */}
				<TileLayer attribution='&copy; <a href="https://carto.com/">CartoDB</a>' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

				{/* The Degradation Footprint */}
				<Circle
					center={[lat, lng]}
					radius={footprintRadius}
					pathOptions={{
						color: riskColor,
						fillColor: riskColor,
						fillOpacity: 0.15,
						weight: 1,
						dashArray: '4 6', // Makes the border look like a dashed radar line
					}}
				/>

				{/* The HUD Target */}
				<Marker position={[lat, lng]} icon={createCrosshairIcon(riskColor)} />
			</MapContainer>

			{/* Scanline Overlay */}
			<div className="absolute inset-0 pointer-events-none z-[400] scan-line opacity-50" />
		</div>
	)
}
