import React from 'react'
import { motion } from 'framer-motion'

const GlobeIcon = ({ className = '' }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<circle cx="12" cy="12" r="10"></circle>
		<line x1="2" y1="12" x2="22" y2="12"></line>
		<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
	</svg>
)

const SatelliteIcon = ({ className = '' }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M13 7 9 3 5 7l4 4"></path>
		<path d="m17 11 4 4-4 4-4-4"></path>
		<path d="m8 12 4 4 6-6-4-4Z"></path>
		<path d="m16 8 3-3"></path>
		<path d="M9 21a6 6 0 0 0-6-6"></path>
	</svg>
)

export const MissionHeroScene: React.FC = () => {
	return (
		<div className="absolute inset-0 w-full h-full pointer-events-none z-[1] overflow-hidden flex items-center justify-center bg-surface-0">
			{/* Background Deep Space Stars (Layer 1) */}
			<div className="absolute inset-0">
				{Array.from({ length: 60 }).map((_, i) => (
					<div
						key={`star-${i}`}
						className="absolute bg-white rounded-full opacity-20 animate-pulse"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							width: `${1 + Math.random() * 2}px`,
							height: `${1 + Math.random() * 2}px`,
							animationDuration: `${3 + Math.random() * 4}s`,
							animationDelay: `${Math.random() * 2}s`,
						}}
					/>
				))}
			</div>

			{/* Orbital Visualization (Layer 2) */}
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 1.5, ease: 'easeOut' }}
				className="relative flex items-center justify-center w-full h-full max-w-4xl aspect-square"
			>
				{/* Core Radar Area */}
				<div className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] border border-neon-cyan/10 rounded-full flex items-center justify-center shadow-[inset_0_0_80px_rgba(0,229,255,0.05)]">
					{/* Radar Sweeps */}
					<div
						className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent origin-center animate-spin"
						style={{ animationDuration: '10s' }}
					/>
					<div
						className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-neon-cyan/20 to-transparent origin-center animate-spin"
						style={{ animationDuration: '10s' }}
					/>

					{/* Radar Gradient Cone */}
					<div
						className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(0,229,255,0.08)_360deg)] animate-spin"
						style={{ animationDuration: '6s', animationTimingFunction: 'linear' }}
					/>

					{/* Orbital Rings */}
					<div
						className="absolute w-[85%] h-[85%] border border-dashed border-neon-cyan/20 rounded-full animate-spin"
						style={{ animationDuration: '30s', animationTimingFunction: 'linear' }}
					/>

					<div className="absolute w-[60%] h-[60%] border border-white/5 rounded-full" />

					<div
						className="absolute w-[35%] h-[35%] border border-dashed border-neon-cyan/30 rounded-full animate-spin"
						style={{ animationDuration: '15s', animationDirection: 'reverse', animationTimingFunction: 'linear' }}
					/>

					{/* Earth Center */}
					<div className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-surface-1 border border-neon-cyan/50 flex items-center justify-center rounded-full shadow-[0_0_30px_rgba(0,229,255,0.2)] z-10">
						<GlobeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-neon-cyan animate-pulse-slow" />
					</div>

					{/* Satellite Constellation (Inner) */}
					<motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: 'linear', duration: 20 }} className="absolute w-[35%] h-[35%]">
						{/* Swapped to rounded-none for sharp targeting box look */}
						<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-1 border border-neon-cyan p-1.5 rounded-none shadow-glow-cyan">
							<SatelliteIcon className="w-4 h-4 text-neon-cyan" />
						</div>
						<div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-surface-1 border border-white/40 p-1 rounded-none">
							<SatelliteIcon className="w-3 h-3 text-white/60" />
						</div>
					</motion.div>

					{/* Satellite Constellation (Middle) */}
					<motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, ease: 'linear', duration: 35 }} className="absolute w-[60%] h-[60%]">
						<div className="absolute top-1/4 right-0 translate-x-1/2 bg-surface-1 border border-amber/70 p-1.5 rounded-none shadow-glow-amber">
							<SatelliteIcon className="w-3 h-3 text-amber" />
						</div>
					</motion.div>

					{/* Satellite Constellation (Outer) */}
					<motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: 'linear', duration: 45 }} className="absolute w-[85%] h-[85%]">
						<div className="absolute bottom-1/4 left-0 -translate-x-1/2 bg-surface-1 border border-crimson/70 p-1.5 rounded-none shadow-glow-crimson">
							<SatelliteIcon className="w-4 h-4 text-crimson" />
						</div>
						<div className="absolute top-1/2 right-0 translate-x-1/2 bg-surface-1 border border-neon-cyan/50 p-1 rounded-none">
							<SatelliteIcon className="w-3 h-3 text-neon-cyan/70" />
						</div>
					</motion.div>

					{/* Signal Disturbances */}
					<div className="absolute top-[20%] left-[30%] w-4 h-4 bg-crimson rounded-full animate-ping z-0" />
					<div className="absolute top-[20%] left-[30%] w-4 h-4 bg-crimson/60 rounded-full z-0" />

					<div className="absolute bottom-[30%] right-[20%] w-3 h-3 bg-amber rounded-full animate-ping z-0" style={{ animationDelay: '1s' }} />
					<div className="absolute bottom-[30%] right-[20%] w-3 h-3 bg-amber/50 rounded-full z-0" />

					{/* Telemetry Readouts Overlaying the Rings */}
					<div className="absolute top-1/4 right-[10%] font-mono text-[10px] sm:text-xs text-neon-cyan/60 hidden sm:block tracking-widest">
						<p>AZ: 145.2</p>
						<p>EL: +42.1</p>
						<p className="text-amber">SNR: LOW</p>
					</div>
					<div className="absolute bottom-1/4 left-[10%] font-mono text-[10px] sm:text-xs text-neon-cyan/60 hidden sm:block tracking-widest">
						<p>IONO: ACTIVE</p>
						<p className="text-crimson">SCINT: HIGH</p>
					</div>
				</div>
			</motion.div>

			{/* Dark Gradient Overlay (Layer 4 handled via z-index in AppLayout/LandingPage) */}
			<div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-surface-0 via-surface-0/80 to-transparent z-[3]" />
		</div>
	)
}
