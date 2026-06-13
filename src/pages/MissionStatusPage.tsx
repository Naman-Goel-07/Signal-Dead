import React from 'react'
import { motion } from 'framer-motion'
import { BackButton } from '@/components/layout/BackButton'
import { useMissionStore } from '@/store/missionStore'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { EmptyState } from '@/components/ui/EmptyState'
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react'

export const MissionStatusPage: React.FC = () => {
	const { missionData, isLoading, error } = useMissionStore()

	return (
		<div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto w-full">
			<BackButton />

			<header className="mb-8 border-b border-border-dim pb-6">
				<h1 className="font-heading text-3xl font-bold tracking-wider text-white uppercase flex items-center">
					<span className="w-3 h-3 bg-neon-cyan mr-4 hidden md:block"></span>
					Mission Status
				</h1>
				<p className="font-body text-white/50 mt-2 tracking-widest text-sm uppercase">Overall mission readiness and estimated accuracy</p>
			</header>

			{error ? (
				<div className="p-4 border border-crimson/30 bg-crimson/10 rounded-none text-crimson font-mono text-sm tracking-widest uppercase">{error}</div>
			) : isLoading || !missionData ? (
				<div className="space-y-6">
					<div className="bg-surface-1 border border-border-dim p-8 rounded-none h-64 flex flex-col justify-center">
						<SkeletonLoader width="w-48" height="h-6" className="mb-8" rounded="sm" />
						<SkeletonLoader width="w-full" height="h-20" className="mb-4" rounded="sm" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{[...Array(2)].map((_, i) => (
							<div key={i} className="bg-surface-1 border border-border-dim p-6 rounded-none">
								<SkeletonLoader width="w-24" height="h-4" className="mb-4" rounded="sm" />
								<SkeletonLoader width="w-full" height="h-12" rounded="sm" />
							</div>
						))}
					</div>
					<div className="text-center mt-8">
						<span className="inline-flex items-center text-xs font-mono tracking-widest text-neon-cyan uppercase animate-pulse">
							<svg className="w-4 h-4 mr-2 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							ANALYZING IONOSPHERIC INTERFERENCE...
						</span>
					</div>
				</div>
			) : (
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
					{/* Dynamic Theme Extraction */}
					{(() => {
						const isHighRisk = missionData.riskState === 'HIGH_RISK'
						const isDegraded = missionData.riskState === 'DEGRADED'

						const stateColor = isHighRisk ? 'text-crimson' : isDegraded ? 'text-amber' : 'text-neon-cyan'
						const borderColor = isHighRisk ? 'border-crimson/50' : isDegraded ? 'border-amber/50' : 'border-neon-cyan/50'
						const bgColor = isHighRisk ? 'bg-crimson/10' : isDegraded ? 'bg-amber/10' : 'bg-neon-cyan/10'
						const shadowColor = isHighRisk ? 'shadow-glow-crimson' : isDegraded ? 'shadow-glow-amber' : 'shadow-glow-cyan'

						return (
							<>
								{/* Massive Status Readout */}
								<div
									className={`border ${borderColor} ${bgColor} ${shadowColor} p-8 md:p-12 relative overflow-hidden backdrop-blur-sm transition-colors duration-500`}
								>
									{/* Decorative corner brackets */}
									<div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${borderColor}`} />
									<div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${borderColor}`} />
									<div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${borderColor}`} />
									<div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${borderColor}`} />

									<div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
										<div>
											<p className="font-mono text-white/50 text-sm tracking-widest mb-2 uppercase">Current Readiness</p>
											<h1
												className={`text-6xl md:text-8xl font-black tracking-tighter uppercase ${stateColor} ${isHighRisk ? 'animate-pulse' : ''}`}
											>
												{missionData.missionReadiness}
											</h1>
											<p className="font-mono mt-4 text-lg text-white tracking-widest uppercase">
												STATE: <span className={stateColor}>{missionData.riskState}</span>
											</p>
										</div>

										{/* Quick Stats Grid */}
										<div className="grid grid-cols-2 gap-4 w-full md:w-auto text-right">
											<div className="bg-surface-0 border border-border-dim p-4">
												<p className="text-[0.65rem] text-white/40 font-mono tracking-widest mb-1">RELIABILITY</p>
												<p className={`text-3xl font-mono ${stateColor}`}>{missionData.reliabilityLevel}%</p>
											</div>
											<div className="bg-surface-0 border border-border-dim p-4">
												<p className="text-[0.65rem] text-white/40 font-mono tracking-widest mb-1">EST. ERROR</p>
												<p className={`text-3xl font-mono ${stateColor}`}>±{missionData.estimatedAccuracy}m</p>
											</div>
										</div>
									</div>
								</div>

								{/* Plain English Advisories */}
								<div>
									<h3 className="text-sm font-bold tracking-widest text-white/40 uppercase mb-4 border-b border-border-dim pb-2 flex items-center gap-2">
										<ShieldAlert className="w-4 h-4 text-white/40" />
										Mission Planner Directives
									</h3>
									<div className="grid gap-4">
										{missionData.advisories.map((advisory) => (
											<div
												key={advisory.id}
												className="bg-surface-1 border border-border-dim p-5 flex items-start gap-4 transition-colors hover:bg-surface-2"
											>
												<div className="mt-1">
													{advisory.severity === 'CRITICAL' ? (
														<ShieldAlert className="w-6 h-6 text-crimson" />
													) : advisory.severity === 'WARNING' ? (
														<AlertTriangle className="w-6 h-6 text-amber" />
													) : (
														<CheckCircle className="w-6 h-6 text-neon-cyan" />
													)}
												</div>
												<div>
													<h4 className="text-lg font-heading font-bold tracking-wider text-white uppercase mb-1">
														{advisory.title}
													</h4>
													<p className="text-sm text-white/70 font-mono leading-relaxed uppercase tracking-wide">{advisory.body}</p>
												</div>
											</div>
										))}
									</div>
								</div>
							</>
						)
					})()}
				</motion.div>
			)}
		</div>
	)
}
