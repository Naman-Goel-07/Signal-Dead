import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { useLocation } from '@/hooks/useLocation'

export const GlobalHeader: React.FC = () => {
	const [query, setQuery] = useState('')
	const [searchResults, setSearchResults] = useState<any[]>([])
	const [isLiveSearching, setIsLiveSearching] = useState(false)
	const navigate = useNavigate()

	const { searchLocation, selectManualLocation, autoDetectLocation, loading } = useLocation()

	// Live Debounced Search
	useEffect(() => {
		const fetchLiveResults = async () => {
			if (query.trim().length >= 3) {
				setIsLiveSearching(true)
				const results = await searchLocation(query)
				setSearchResults(results)
				setIsLiveSearching(false)
			} else {
				// Clear results if the user clears the input
				setSearchResults([])
			}
		}

		// Wait 500ms after typing stops before calling the API
		const debounceTimeout = setTimeout(fetchLiveResults, 500)

		// Cleanup previous timeout if user keeps typing
		return () => clearTimeout(debounceTimeout)
	}, [query, searchLocation])

	const handleSelect = async (result: any) => {
		await selectManualLocation(result)
		setSearchResults([])
		setQuery('')
		navigate('/console/status')
	}

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault() // Prevent page reload on enter key, let live search handle it
	}

	return (
		<header className="w-full border-b border-border-dim bg-surface-0/90 backdrop-blur-md p-4 sticky top-0 z-50">
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
				{/* 1. Clickable Branding routed to Landing Page */}
				<Link to="/" className="flex items-center gap-3 w-full md:w-auto group hover:opacity-80 transition-opacity">
					<div className="w-8 h-8 border border-crimson flex items-center justify-center bg-crimson/10 shadow-glow-crimson group-hover:bg-crimson/20 transition-colors">
						<span className="text-crimson font-mono text-xs font-bold">SD</span>
					</div>
					<div>
						<h1 className="text-lg font-heading font-bold tracking-[0.2em] text-white uppercase">
							SIGNAL<span className="text-crimson">DEAD</span>
						</h1>
					</div>
				</Link>

				{/* Command Input */}
				<div className="relative w-full md:max-w-md">
					<form onSubmit={handleSearchSubmit} className="relative flex items-center">
						<input
							type="text"
							placeholder="ENTER COORDINATES OR CITY..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="w-full bg-surface-2 border border-border-dim text-white text-xs font-mono p-3 pl-10 pr-12 focus:outline-none focus:border-neon-cyan focus:shadow-glow-cyan transition-all placeholder-white/30"
						/>
						<Search className="absolute left-3 top-3.5 text-neon-cyan w-3.5 h-3.5" />

						<button
							type="button"
							onClick={autoDetectLocation}
							disabled={loading}
							className="absolute right-2 top-2.5 p-1 text-neon-cyan hover:text-white transition-colors"
						>
							{/* Show spinner if either auto-detecting OR live searching */}
							{loading || isLiveSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
						</button>
					</form>

					{/* Results Dropdown */}
					{searchResults.length > 0 && (
						<div className="absolute top-full left-0 w-full mt-1 bg-surface-1 border border-border-dim shadow-card overflow-hidden z-50 max-h-60 overflow-y-auto custom-scrollbar">
							{searchResults.slice(0, 5).map((res) => (
								<button
									key={res.place_id}
									onClick={() => handleSelect(res)}
									className="w-full text-left p-3 text-xs text-white/70 hover:bg-surface-3 hover:text-neon-cyan border-b border-border-dim last:border-0 font-mono transition-colors truncate uppercase"
								>
									{res.display_name}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</header>
	)
}
