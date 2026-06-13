import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MissionHeroScene } from '@/features/landing/MissionHeroScene'
import { useLocation } from '@/hooks/useLocation'
import { useLocationStore } from '@/store/locationStore'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Crosshair } from 'lucide-react'

export const LandingPage: React.FC = () => {
	const navigate = useNavigate()
	const { location, loading, error, autoDetectLocation, searchLocation, selectManualLocation } = useLocation()

	// Grab the clear function from global store
	const { clearLocation } = useLocationStore()

	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState<any[]>([])
	const [isSearching, setIsSearching] = useState(false)
	const [manualMode, setManualMode] = useState(false)

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!searchQuery.trim()) return
		setIsSearching(true)
		const results = await searchLocation(searchQuery)
		setSearchResults(results)
		setIsSearching(false)
	}

	const handleSelectResult = (result: any) => {
		selectManualLocation(result)
		setSearchResults([])
		setSearchQuery('')
	}

	const handleInitMission = () => {
		if (location) {
			navigate('/console')
		}
	}

	// Function to abort the target lock and try a new location
	const handleResetTarget = () => {
		clearLocation()
		setSearchQuery('')
		setSearchResults([])
		setManualMode(false)
	}

	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-surface-0 flex flex-col items-center justify-center font-sans">
			<MissionHeroScene />

			<div className="relative z-20 w-full max-w-md px-6">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="text-center mb-10 flex flex-col items-center"
				>
					{/* Synchronized Logo */}
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 border border-crimson flex items-center justify-center bg-crimson/10 shadow-glow-crimson">
							<span className="text-crimson font-mono text-lg font-bold">SD</span>
						</div>
						<h1 className="font-heading text-4xl md:text-5xl font-bold tracking-[0.2em] text-white uppercase">
							SIGNAL<span className="text-crimson">DEAD</span>
						</h1>
					</div>
					<p className="font-mono text-xs tracking-widest text-neon-cyan uppercase">Aerospace GNSS Degradation Predictor</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="bg-surface-1 border border-border-dim p-6 md:p-8 rounded-none relative shadow-card"
				>
					{/* Cyberpunk corner accents */}
					<div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-cyan" />
					<div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neon-cyan" />
					<div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neon-cyan" />
					<div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-cyan" />

					<h2 className="font-heading text-lg font-semibold tracking-wider text-white/90 mb-6 uppercase border-b border-border-dim pb-2 flex items-center gap-2">
						<Crosshair className="w-4 h-4 text-neon-cyan" />
						Mission Target Location
					</h2>

					{!location ? (
						<div className="space-y-4">
							<button
								onClick={autoDetectLocation}
								disabled={loading || isSearching}
								className="w-full flex items-center justify-center space-x-3 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 hover:border-neon-cyan text-neon-cyan py-4 px-4 rounded-none transition-all duration-300 focus:outline-none disabled:opacity-50 group"
							>
								{loading && !isSearching ? (
									<LoadingSpinner size="sm" />
								) : (
									<svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
								)}
								<span className="font-mono tracking-widest text-sm uppercase">AUTO-DETECT UPLINK</span>
							</button>

							<div className="relative flex items-center py-2">
								<div className="flex-grow border-t border-border-dim"></div>
								<span className="flex-shrink-0 mx-4 text-white/30 text-xs font-mono tracking-widest">OR</span>
								<div className="flex-grow border-t border-border-dim"></div>
							</div>

							{!manualMode ? (
								<button
									onClick={() => setManualMode(true)}
									className="w-full text-center text-xs font-mono tracking-widest text-white/40 hover:text-white transition-colors py-2 border border-transparent hover:border-border-dim"
								>
									ENTER COORDINATES MANUALLY
								</button>
							) : (
								<form onSubmit={handleSearch} className="space-y-3">
									<div className="relative">
										<input
											type="text"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											placeholder="e.g. New Delhi, IN"
											className="w-full bg-surface-2 border border-border-dim rounded-none px-4 py-3 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
										/>
										<button
											type="submit"
											disabled={isSearching || !searchQuery.trim()}
											className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-neon-cyan disabled:opacity-50 p-2"
										>
											{isSearching ? (
												<LoadingSpinner size="sm" />
											) : (
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
													/>
												</svg>
											)}
										</button>
									</div>

									{searchResults.length > 0 && (
										<div className="max-h-40 overflow-y-auto bg-surface-2 border border-border-dim mt-2 shadow-card custom-scrollbar">
											{searchResults.map((result, idx) => (
												<button
													key={idx}
													type="button"
													onClick={() => handleSelectResult(result)}
													className="w-full text-left px-4 py-3 text-xs font-mono text-white/80 hover:bg-surface-3 hover:text-neon-cyan border-b border-border-dim last:border-0 truncate transition-colors uppercase"
												>
													{result.display_name}
												</button>
											))}
										</div>
									)}
								</form>
							)}

							{error && (
								<p className="text-crimson font-mono tracking-widest text-xs mt-2 text-center uppercase border border-crimson/20 bg-crimson/5 py-2">
									{error}
								</p>
							)}
						</div>
					) : (
						<div className="space-y-4">
							<div className="flex items-start space-x-3 bg-neon-cyan/5 border border-neon-cyan/20 p-4 rounded-none shadow-glow-cyan">
								<svg
									className="w-5 h-5 text-neon-cyan mt-0.5 flex-shrink-0 animate-pulse"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
								<div>
									<p className="font-heading text-xs text-neon-cyan tracking-widest uppercase mb-1">Target Locked</p>
									<p className="text-sm text-white font-mono truncate uppercase">{location.locationName}</p>
									<p className="text-xs text-white/50 font-mono mt-1 border-t border-neon-cyan/20 pt-1">
										LAT: {location.latitude.toFixed(4)} | LON: {location.longitude.toFixed(4)}
									</p>
								</div>
							</div>

							<button
								onClick={handleInitMission}
								className="w-full flex items-center justify-center space-x-2 bg-neon-cyan text-surface-0 hover:bg-white border border-neon-cyan py-4 px-4 rounded-none transition-all duration-300 font-mono tracking-[0.2em] font-bold text-sm shadow-glow-cyan"
							>
								INITIALIZE MISSION CONSOLE
							</button>

							{/* Abort/Recalibrate Button */}
							<button
								onClick={handleResetTarget}
								className="w-full text-center text-xs font-mono tracking-widest text-white/40 hover:text-crimson transition-colors py-2 border border-transparent hover:border-crimson/30 bg-transparent"
							>
								ABORT TARGET LOCK
							</button>
						</div>
					)}
				</motion.div>
			</div>
		</div>
	)
}
