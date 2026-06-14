import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { useLocation } from '@/hooks/useLocation'
import sdLogo from '@/assets/logo.png'

export const GlobalHeader: React.FC = () => {
	const [query, setQuery] = useState('')
	const [searchResults, setSearchResults] = useState<any[]>([])
	const [isSearching, setIsSearching] = useState(false)
	const navigate = useNavigate()

	const { searchLocation, selectManualLocation, autoDetectLocation, loading } = useLocation()

	// 1. Safe, single-fire search on Enter or Click
	const handleSearchSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (query.trim().length < 2) return

		setIsSearching(true)
		try {
			const results = await searchLocation(query)
			setSearchResults(results || [])
		} catch (err) {
			console.error('Location search failed', err)
			setSearchResults([])
		} finally {
			setIsSearching(false)
		}
	}

	const handleSelect = async (result: any) => {
		await selectManualLocation(result)
		setSearchResults([])
		setQuery('')
		navigate('/console')
	}

	return (
		<header className="w-full border-b border-border-dim bg-surface-0/90 backdrop-blur-md p-4 sticky top-0 z-50">
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
				{/* Clickable Branding routed to Landing Page */}
				<Link to="/" className="flex items-center gap-3 w-full md:w-auto group hover:opacity-80 transition-opacity">
					<div className="w-8 h-8 border border-crimson flex items-center justify-center bg-crimson/10 shadow-glow-crimson group-hover:bg-crimson/20 transition-colors">
						<img
							src={sdLogo}
							alt="SD Logo"
							className="h-6 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300 drop-shadow-[0_0_8px_rgba(230,57,70,0.5)]"
						/>
					</div>
					<div>
						<h1 className="text-lg font-heading font-bold tracking-[0.2em] text-white uppercase">
							SIGNAL<span className="text-crimson">DEAD</span>
						</h1>
					</div>
				</Link>

				{/* Command Input */}
				<div className="relative w-full md:max-w-md">
					{/* 2. Tied to handleSearchSubmit */}
					<form onSubmit={handleSearchSubmit} className="relative flex items-center">
						<input
							type="text"
							placeholder="ENTER COORDINATES OR CITY... (Press Enter)"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="w-full bg-surface-2 border border-border-dim text-white text-xs font-mono p-3 pl-10 pr-12 focus:outline-none focus:border-neon-cyan focus:shadow-glow-cyan transition-all placeholder-white/30"
						/>

						{/* Make the magnifying glass a submit button too */}
						<button type="submit" className="absolute left-3 top-3.5 text-neon-cyan hover:text-white transition-colors">
							<Search className="w-3.5 h-3.5" />
						</button>

						<button
							type="button"
							onClick={autoDetectLocation}
							disabled={loading}
							className="absolute right-2 top-2.5 p-1 text-neon-cyan hover:text-white transition-colors"
						>
							{loading || isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
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
