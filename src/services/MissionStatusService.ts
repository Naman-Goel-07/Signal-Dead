import type { MissionStatus, ApiResponse, Location, RiskState, AdvisoryCard } from '@/types'
import { TelemetryService } from './TelemetryService'

export class MissionStatusService {
	static async getStatus(location: Location): Promise<ApiResponse<MissionStatus>> {
		try {
			// Pull the live Kp data from your Telemetry Service
			const telemetryRes = await TelemetryService.getTelemetry(location)

			if (!telemetryRes.data) throw new Error('Telemetry unavailable')

			const kp = telemetryRes.data.kpIndex || 2.0
			const timestamp = new Date().toISOString()

			// Calculate Risk Thresholds & Advisories
			let riskState: RiskState = 'SAFE'
			let readiness = 'GO'
			let advisories: AdvisoryCard[] = []

			if (kp >= 7) {
				riskState = 'HIGH_RISK'
				readiness = 'NO-GO'
				advisories.push({
					id: `adv_${Date.now()}_crit`,
					timestamp,
					severity: 'CRITICAL',
					title: 'ALL PRECISION OPERATIONS GROUNDED',
					body: 'GNSS signals are highly unreliable. Avoid drone mapping, precision surveying, and aviation training. Terrestrial navigation only.',
					source: 'GEOMAGNETIC',
				})
			} else if (kp >= 4 && kp < 7) {
				riskState = 'DEGRADED'
				readiness = 'CAUTION'
				advisories.push({
					id: `adv_${Date.now()}_warn`,
					timestamp,
					severity: 'WARNING',
					title: 'Precision Operations Restricted',
					body: 'Standard road navigation is acceptable. Avoid drone mapping and high-stakes surveying.',
					source: 'GEOMAGNETIC',
				})
			} else {
				riskState = 'SAFE'
				readiness = 'GO'
				advisories.push({
					id: `adv_${Date.now()}_nom`,
					timestamp,
					severity: 'NOMINAL',
					title: 'Conditions Nominal',
					body: 'All operations cleared. Drone mapping, surveying, and standard road navigation are safe.',
					source: 'GEOMAGNETIC',
				})
			}

			const riskScore = Math.min(100, Math.round(kp * 11.1))

			const data: MissionStatus = {
				id: `miss_${Date.now()}`,
				timestamp,
				riskScore,
				riskState,
				missionReadiness: readiness,
				reliabilityLevel: Math.max(10, 100 - kp * 10),
				estimatedAccuracy: kp > 5 ? 25.0 : 4.0,
				location,
				advisories, // Injected directly into the status payload
				// Inject the raw telemetry data here so the TelemetryPage can read it
				telemetry: {
					kpIndex: telemetryRes.data?.kpIndex ?? 2.0,
					satellitesOverhead: telemetryRes.data?.satellitesOverhead ?? 0,
					pdop: telemetryRes.data?.pdop ?? 99.9,
				},
				activeAlerts:
					kp > 4
						? [
								{
									id: `alt_${Date.now()}`,
									timestamp,
									severity: kp >= 7 ? 'CRITICAL' : 'WARNING',
									message: `Elevated Geomagnetic Activity Detected (Kp: ${kp}). GNSS degradation likely.`,
									acknowledged: false,
								},
							]
						: [],
			}

			return { data, error: null, loading: false, timestamp }
		} catch (error: any) {
			return { data: null, error: error.message, loading: false, timestamp: new Date().toISOString() }
		}
	}
}
