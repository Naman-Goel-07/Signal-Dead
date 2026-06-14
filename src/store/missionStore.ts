import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RiskState, MissionStatus, ForecastWindow, Location } from '@/types'
import { MissionStatusService } from '@/services/MissionStatusService'
import { ForecastService } from '@/services/ForecastService'

interface MissionState {
	/** The current calculated risk state of the mission */
	riskState: RiskState

	/** The live data payloads */
	missionData: MissionStatus | null
	forecastData: ForecastWindow | null

	/** UI State */
	isLoading: boolean
	error: string | null

	/** Set a new risk state and update global CSS */
	setRiskState: (state: RiskState) => void

	/** The main command to fetch everything for a location */
	launchOrbitalScan: (location: Location) => Promise<void>
}

export const useMissionStore = create<MissionState>()(
	persist(
		(set, get) => ({
			riskState: 'UNKNOWN',
			missionData: null,
			forecastData: null,
			isLoading: false,
			error: null,

			setRiskState: (state: RiskState) => {
				set({ riskState: state })

				// Architecture: Automatically apply the corresponding CSS class to the body element
				if (typeof window !== 'undefined') {
					document.body.classList.remove('risk-state-safe', 'risk-state-degraded', 'risk-state-high', 'risk-state-unknown')

					switch (state) {
						case 'SAFE':
							document.body.classList.add('risk-state-safe')
							break
						case 'DEGRADED':
							document.body.classList.add('risk-state-degraded')
							break
						case 'HIGH_RISK':
							document.body.classList.add('risk-state-high')
							break
						default:
							document.body.classList.add('risk-state-unknown')
					}
				}
			},

			launchOrbitalScan: async (location: Location) => {
				set({ isLoading: true, error: null })

				try {
					// Fire both API requests in parallel for maximum speed
					const [statusRes, forecastRes] = await Promise.all([MissionStatusService.getStatus(location), ForecastService.get24hForecast(location)])

					if (statusRes.error) throw new Error(statusRes.error)
					if (forecastRes.error) throw new Error(forecastRes.error)

					// Update the store with the fresh data
					set({
						missionData: statusRes.data,
						forecastData: forecastRes.data,
						isLoading: false,
					})

					// Update the global CSS state based on the new data
					if (statusRes.data) {
						get().setRiskState(statusRes.data.riskState)
					}
				} catch (error: any) {
					console.error('Orbital Scan Failed:', error)
					set({ error: error.message || 'Failed to establish orbital uplink', isLoading: false })
				}
			},
		}),
		{
			name: 'signal-dead-storage',

			// Rehydration Hook
			// When the app refreshes and loads the saved state, this forces
			// the DOM to re-apply the correct CSS theme instantly.
			onRehydrateStorage: () => (state) => {
				if (state && state.riskState) {
					state.setRiskState(state.riskState)
				}
			},
		},
	),
)
