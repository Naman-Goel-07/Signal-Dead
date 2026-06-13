import React from 'react'
import { motion } from 'framer-motion'
import { BackButton } from '@/components/layout/BackButton'
import { useMissionStore } from '@/store/missionStore'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { Activity, Satellite, Crosshair } from 'lucide-react'

export const TelemetryPage: React.FC = () => {
	const { missionData, isLoading, error } = useMissionStore()

	return (
		<div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto w-full">
			<BackButton />

			<header className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-border-dim pb-6">
				<div>
					<h1 className="font-heading text-3xl font-bold tracking-wider text-white uppercase flex items-center">
						<span className="w-3 h-3 bg-neon-cyan mr-4 hidden md:block"></span>
						Raw Telemetry
					</h1>
					<p className="font-body text-white/50 mt-2">Real-time GNSS signal monitoring parameters</p>
				</div>
				<div className="mt-4 md:mt-0 font-mono text-xs text-white/40 text-right">
					UPDATE RATE: <span className="text-neon-cyan">LIVE (NOAA / CELESTRAK)</span>
					<br />
					STATUS:{' '}
					<span className={isLoading ? 'text-amber animate-pulse' : 'text-neon-cyan'}>{isLoading ? 'CALCULATING ORBITS' : 'UPLINK ESTABLISHED'}</span>
				</div>
			</header>

			{error ? (
				<div className="p-4 border border-crimson/30 bg-crimson/10 rounded-none text-crimson text-sm font-mono tracking-widest uppercase">{error}</div>
			) : isLoading || !missionData ? (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="bg-surface-1 p-6 border border-border-dim rounded-none shadow-card">
							<SkeletonLoader width="w-24" height="h-4" className="mb-6" />
							<SkeletonLoader width="w-32" height="h-16" />
						</div>
					))}
				</div>
			) : (
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* KP Index Panel */}
					<div className="bg-surface-1 p-6 border border-border-dim rounded-none relative overflow-hidden shadow-card group hover:border-neon-cyan/50 transition-colors">
						<div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-neon-cyan" />
						<div className="text-xs font-heading tracking-widest text-white/40 mb-2 flex items-center gap-2">
							<Activity className="w-4 h-4 text-neon-cyan" />
							GEOMAGNETIC KP INDEX
						</div>
						<div
							className={`font-mono text-6xl font-black tracking-tighter ${missionData.riskState === 'HIGH_RISK' ? 'text-crimson animate-pulse' : 'text-white'}`}
						>
							{missionData.telemetry?.kpIndex.toFixed(1) || '0.0'}
						</div>
						<p className="text-xs font-mono text-white/30 mt-4 uppercase tracking-widest">Range: 0-9 (Solar Storm Intensity)</p>
					</div>

					{/* Satellites Panel */}
					<div className="bg-surface-1 p-6 border border-border-dim rounded-none relative overflow-hidden shadow-card group hover:border-neon-cyan/50 transition-colors">
						<div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-neon-cyan" />
						<div className="text-xs font-heading tracking-widest text-white/40 mb-2 flex items-center gap-2">
							<Satellite className="w-4 h-4 text-neon-cyan" />
							SATELLITES OVERHEAD
						</div>
						<div className="font-mono text-6xl font-black tracking-tighter text-white">{missionData.telemetry?.satellitesOverhead || '0'}</div>
						<p className="text-xs font-mono text-white/30 mt-4 uppercase tracking-widest">Visible GNSS Constellations {'>'} 10° Elev</p>
					</div>

					{/* PDOP Panel */}
					<div className="bg-surface-1 p-6 border border-border-dim rounded-none relative overflow-hidden shadow-card group hover:border-neon-cyan/50 transition-colors">
						<div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-neon-cyan" />
						<div className="text-xs font-heading tracking-widest text-white/40 mb-2 flex items-center gap-2">
							<Crosshair className="w-4 h-4 text-neon-cyan" />
							POSITIONAL DOP (PDOP)
						</div>
						<div
							className={`font-mono text-6xl font-black tracking-tighter ${missionData.telemetry?.pdop && missionData.telemetry.pdop > 4 ? 'text-amber' : 'text-neon-cyan'}`}
						>
							{missionData.telemetry?.pdop?.toFixed(2) || '0.00'}
						</div>
						<p className="text-xs font-mono text-white/30 mt-4 uppercase tracking-widest">Lower is better. {'>'} 4 = Degraded Signal.</p>
					</div>
				</motion.div>
			)}
		</div>
	)
}
