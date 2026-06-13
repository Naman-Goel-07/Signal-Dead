import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MissionHeroScene } from '@/features/landing/MissionHeroScene';
import { useLocation } from '@/hooks/useLocation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { location, loading, error, autoDetectLocation, searchLocation, selectManualLocation } = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await searchLocation(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectResult = (result: any) => {
    selectManualLocation(result);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleInitMission = () => {
    if (location) {
      navigate('/console');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-surface-0 flex flex-col items-center justify-center">
      <MissionHeroScene />

      <div className="relative z-20 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-10"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-[0.2em] text-white uppercase mb-2 text-glow-cyan">
            Signal<span className="text-neon-cyan">Dead</span>
          </h1>
          <p className="font-body text-sm tracking-widest text-white/60 uppercase">
            Aerospace GNSS Degradation Predictor
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="console-panel p-6 rounded-xl relative overflow-hidden"
        >
          {/* Cyberpunk corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan/50" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan/50" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-cyan/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-cyan/50" />

          <h2 className="font-heading text-lg font-semibold tracking-wider text-white/90 mb-6 uppercase border-b border-white/10 pb-2">
            Mission Location
          </h2>

          {!location ? (
            <div className="space-y-4">
              <button
                onClick={autoDetectLocation}
                disabled={loading || isSearching}
                className="w-full flex items-center justify-center space-x-3 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan py-3 px-4 rounded transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 disabled:opacity-50"
              >
                {loading && !isSearching ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                <span className="font-heading tracking-widest font-bold">AUTO DETECT LOCATION</span>
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-white/30 text-xs font-heading tracking-widest">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {!manualMode ? (
                <button
                  onClick={() => setManualMode(true)}
                  className="w-full text-center text-sm font-heading tracking-widest text-white/50 hover:text-white transition-colors py-2"
                >
                  ENTER LOCATION MANUALLY
                </button>
              ) : (
                <form onSubmit={handleSearch} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. Kennedy Space Center"
                      className="w-full bg-surface-2 border border-white/10 rounded px-4 py-3 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={isSearching || !searchQuery.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-neon-cyan disabled:opacity-50"
                    >
                      {isSearching ? <LoadingSpinner size="sm" /> : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      )}
                    </button>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="max-h-40 overflow-y-auto bg-surface-2 border border-white/10 rounded mt-2 custom-scrollbar">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectResult(result)}
                          className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/5 border-b border-white/5 last:border-0 truncate"
                        >
                          {result.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                </form>
              )}

              {error && (
                <p className="text-crimson text-xs mt-2 text-center">{error}</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start space-x-3 bg-neon-cyan/5 border border-neon-cyan/20 p-4 rounded">
                <svg className="w-5 h-5 text-neon-cyan mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-heading text-xs text-neon-cyan tracking-widest uppercase mb-1">Target Locked</p>
                  <p className="text-sm text-white/90 truncate">{location.locationName}</p>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E
                  </p>
                </div>
              </div>

              <button
                onClick={handleInitMission}
                className="w-full flex items-center justify-center space-x-2 bg-neon-cyan text-surface-0 hover:bg-white border border-neon-cyan hover:border-white py-3 px-4 rounded transition-all duration-300 font-heading tracking-[0.2em] font-bold text-sm"
              >
                INITIALIZE MISSION CONSOLE
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
