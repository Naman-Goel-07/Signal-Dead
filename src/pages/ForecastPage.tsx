import React from 'react'
import { motion } from 'framer-motion'
import { BackButton } from '@/components/layout/BackButton'
import { useMissionStore } from '@/store/missionStore'
import { EmptyState } from '@/components/ui/EmptyState'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export const ForecastPage: React.FC = () => {
	const { forecastData, isLoading, error } = useMissionStore()

	const getRiskColor = (state: string) => {
		switch (state) {
			case 'SAFE':
				return '#00E5FF' // neon-cyan
			case 'DEGRADED':
				return '#FFB300' // amber
			case 'HIGH_RISK':
				return '#E63946' // crimson
			default:
				return '#2D2E32'
		}
	}

	return (
		<div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto w-full">
			<BackButton />

			<header className="mb-12 border-b border-border-dim pb-6">
				<h1 className="font-heading text-3xl font-bold tracking-wider text-white uppercase flex items-center">
					<span className="w-3 h-3 bg-neon-cyan mr-4 hidden md:block"></span>
					24H Forecast
				</h1>
				<p className="font-body text-white/50 mt-2">Predictive timeline of expected GNSS degradation</p>
			</header>

			{error ? (
				<div className="p-4 border border-crimson/30 bg-crimson/10 rounded text-crimson text-sm font-mono uppercase tracking-widest">{error}</div>
			) : isLoading || !forecastData ? (
				<div className="space-y-8">
					<div className="flex justify-between text-xs font-mono text-white/40 px-2">
						<span>T+00:00</span>
						<span>T+12:00</span>
						<span>T+24:00</span>
					</div>
					{/* Your DNA Sequencer loading state architecture */}
					<div className="w-full h-8 flex rounded overflow-hidden opacity-50 border border-border-dim">
						{[...Array(24)].map((_, i) => (
							<motion.div
								key={i}
								className="flex-1 bg-surface-2 border-r border-surface-0 last:border-r-0"
								initial={{ opacity: 0.2 }}
								animate={{ opacity: [0.2, 0.5, 0.2] }}
								transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
							/>
						))}
					</div>
					<div className="text-center mt-12">
						<span className="inline-flex items-center text-xs font-heading tracking-widest text-neon-cyan uppercase animate-pulse">
							<svg className="w-4 h-4 mr-2 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							GENERATING PREDICTIVE MODEL
						</span>
					</div>
				</div>
			) : (
				<div className="space-y-12">
					<div className="bg-surface-1 border border-border-dim p-4 md:p-8 rounded-none shadow-card relative">
						<div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan/50" />
						<div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan/50" />

						<div className="flex justify-between text-xs font-mono text-white/40 mb-8 border-b border-border-dim pb-2 px-2 uppercase tracking-widest">
							<span>Current Time (T-0)</span>
							<span>T+12H</span>
							<span>T+24H</span>
						</div>

						<div className="h-64 md:h-80 w-full">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={forecastData.points} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
									<XAxis
										dataKey="label"
										axisLine={false}
										tickLine={false}
										tick={{ fill: '#4B5563', fontSize: 10, fontFamily: 'monospace' }}
										interval="preserveStartEnd"
									/>
									<YAxis hide domain={[0, 10]} />
									<Tooltip
										cursor={{ fill: '#2D2E32', opacity: 0.4 }}
										contentStyle={{ backgroundColor: '#08080A', border: '1px solid #2D2E32', borderRadius: '0px' }}
										labelStyle={{ color: '#00E5FF', fontFamily: 'monospace', marginBottom: '8px' }}
										itemStyle={{ fontFamily: 'monospace' }}
										formatter={(value: number, name: string, props: any) => [
											props.payload.riskState,
											`EST. KP: ${props.payload.predictedKp}`,
										]}
									/>
									<Bar dataKey="predictedKp" radius={[4, 4, 0, 0]}>
										{forecastData.points.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={getRiskColor(entry.riskState)} />
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						</div>

						<div className="flex justify-center gap-6 mt-8 font-mono text-xs tracking-widest uppercase">
							<span className="flex items-center gap-2">
								<div className="w-3 h-3 bg-neon-cyan" /> SAFE
							</span>
							<span className="flex items-center gap-2">
								<div className="w-3 h-3 bg-amber" /> DEGRADED
							</span>
							<span className="flex items-center gap-2">
								<div className="w-3 h-3 bg-crimson" /> CRITICAL RISK
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
