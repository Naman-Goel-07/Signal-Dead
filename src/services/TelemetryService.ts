import * as satellite from 'satellite.js'
import type { TelemetrySnapshot, ApiResponse, Location } from '@/types'

// CelesTrak endpoint for all active GNSS satellites (GPS, GLONASS, Galileo, Beidou)
const CELESTRAK_GNSS_URL = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=gnss&FORMAT=tle'
const NOAA_KP_URL = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'

export class TelemetryService {
	static async getTelemetry(location: Location): Promise<ApiResponse<TelemetrySnapshot>> {
		console.log(`[Telemetry] Initiating orbital scan for ${location.locationName}...`)

		try {
			// 1. Fetch NOAA Space Weather Data
			const noaaResponse = await fetch(NOAA_KP_URL)
			if (!noaaResponse.ok) throw new Error('NOAA Uplink Failed')
			const kpData = await noaaResponse.json()

			const latestRow = kpData[kpData.length - 1]
			const liveKp = latestRow ? parseFloat(latestRow[1]) : 2.0

			// 2. Fetch Live Orbital TLE Data from CelesTrak
			const tleResponse = await fetch(CELESTRAK_GNSS_URL)
			if (!tleResponse.ok) throw new Error('CelesTrak Uplink Failed')
			const tleText = await tleResponse.text()

			// 3. Calculate Satellites Overhead using satellite.js
			const lines = tleText
				.split('\n')
				.map((line) => line.trim())
				.filter((line) => line.length > 0)
			let visibleSatellites = 0
			const now = new Date()

			// Observer (User) location in radians
			const observerGd = {
				longitude: satellite.degreesToRadians(location.longitude),
				latitude: satellite.degreesToRadians(location.latitude),
				height: 0.0, // Assuming sea level for MVP
			}

			// TLE data comes in blocks of 3 lines (Name, Line 1, Line 2)
			for (let i = 0; i < lines.length; i += 3) {
				if (i + 2 >= lines.length) break

				const tleLine1 = lines[i + 1]
				const tleLine2 = lines[i + 2]

				try {
					// Initialize the satellite record
					const satrec = satellite.twoline2satrec(tleLine1, tleLine2)

					// Propagate satellite position to current time
					const positionAndVelocity = satellite.propagate(satrec, now)
					const positionEci = positionAndVelocity.position

					if (typeof positionEci !== 'boolean' && positionEci) {
						const gmst = satellite.gstime(now)

						// Calculate Look Angles (Azimuth, Elevation, Range) from Observer to Satellite
						const positionEcf = satellite.eciToEcf(positionEci, gmst)
						const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf)

						// Convert elevation to degrees
						const elevationDegrees = lookAngles.elevation * (180 / Math.PI)

						// If elevation is > 10 degrees, it is highly visible and useful for navigation
						if (elevationDegrees > 10) {
							visibleSatellites++
						}
					}
				} catch (err) {
					// Skip dead/malformed satellite records gracefully
					continue
				}
			}

			// 4. Calculate dynamic PDOP based on real visible satellites
			// Fewer satellites = Higher PDOP (worse accuracy). Below 4 is a blackout.
			let calculatedPdop = 99.9
			if (visibleSatellites >= 4) {
				calculatedPdop = parseFloat((Math.max(1.0, 10 / visibleSatellites) + liveKp * 0.1).toFixed(2))
			}

			const data: TelemetrySnapshot = {
				id: `tel_${Date.now()}`,
				timestamp: now.toISOString(),
				kpIndex: liveKp,
				satellitesOverhead: visibleSatellites,
				pdop: calculatedPdop,
				vdop: 1.2,
				hdop: 1.4,
				signalToNoise: Math.max(10, 45 - liveKp * 2 - (visibleSatellites < 8 ? 5 : 0)),
				latitude: location.latitude,
				longitude: location.longitude,
			}

			return { data, error: null, loading: false, timestamp: now.toISOString() }
		} catch (error: any) {
			console.error('[Telemetry Error]:', error)
			return { data: null, error: error.message, loading: false, timestamp: new Date().toISOString() }
		}
	}
}
