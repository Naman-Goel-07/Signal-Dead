import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLocationStore } from '@/store/locationStore'
import { ShieldAlert, Activity, BarChart2 } from 'lucide-react'

interface NavCardProps {
	title: string
	description: string
	path: string
	icon: React.ReactNode
	delay: number
}

const NavCard: React.FC<NavCardProps> = ({ title, description, path, icon, delay }) => {
	const navigate = useNavigate()

	return (
		<motion.button
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay }}
			whileHover={{ y: -4 }}
			whileTap={{ scale: 0.98 }}
			onClick={() => navigate(path)}
			className="group relative w-full text-left bg-surface-1 border border-border-dim p-6 rounded-none overflow-hidden hover:border-neon-cyan/50 transition-colors duration-300 shadow-card"
		>
			<div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl group-hover:bg-neon-cyan/10 transition-colors duration-500" />

			<div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-neon-cyan/50 transition-colors" />
			<div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-neon-cyan/50 transition-colors" />

			<div className="relative z-10 flex flex-col h-full">
				<div className="text-neon-cyan/70 group-hover:text-neon-cyan group-hover:shadow-glow-cyan transition-all duration-300 mb-4">{icon}</div>
				<h3 className="font-heading text-2xl font-bold tracking-wider text-white mb-2 uppercase">{title}</h3>
				<p className="font-body text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-300">{description}</p>

				<div className="mt-6 flex items-center text-neon-cyan text-sm font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
					INITIALIZE MODULE <span className="ml-2">→</span>
				</div>
			</div>
		</motion.button>
	)
}

export const ConsolePage: React.FC = () => {
	const { location } = useLocationStore()

	return (
		<div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto w-full flex flex-col">
			<div className="flex-1 flex flex-col justify-center">
				<header className="mb-12 border-b border-border-dim pb-6">
					<h1 className="font-heading text-3xl font-bold tracking-wider text-white uppercase flex items-center">
						<span className="w-3 h-3 bg-neon-cyan mr-4 hidden md:block animate-pulse"></span>
						Mission Control
					</h1>
					<p className="font-mono text-xs text-white/50 mt-2 tracking-widest uppercase">
						ACTIVE TARGET: <span className="text-neon-cyan">{location?.locationName || 'UNKNOWN'}</span>
					</p>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<NavCard
						title="Mission Status"
						description="Comprehensive overview of readiness, reliability levels, and active operational directives."
						path="/console/status"
						delay={0.1}
						icon={<ShieldAlert className="w-8 h-8" />}
					/>
					<NavCard
						title="Telemetry"
						description="Raw real-time GNSS monitoring data including geomagnetic KP index and dilution of precision."
						path="/console/telemetry"
						delay={0.2}
						icon={<Activity className="w-8 h-8" />}
					/>
					<NavCard
						title="24h Forecast"
						description="Predictive timeline of expected GNSS degradation over the next 24 hours to aid mission scheduling."
						path="/console/forecast"
						delay={0.3}
						icon={<BarChart2 className="w-8 h-8" />}
					/>
				</div>
			</div>
		</div>
	)
}
