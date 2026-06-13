import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Star, Info, Copy, Check } from 'lucide-react';
import { DiscordIcon } from './DiscordIcon';
import { DISCORD_LINK } from '../config';

const VALID_GAMEMODES = [
  { id: 'overall', name: 'Overall XP' },
  { id: 'mace', name: 'Mace' },
  { id: 'sword', name: 'Sword' },
  { id: 'diapot', name: 'Diamond Pot' },
  { id: 'nethpot', name: 'Netherite Pot' },
  { id: 'smp', name: 'SMP' },
  { id: 'builduhc', name: 'Build UHC' },
  { id: 'axe', name: 'Axe' },
  { id: 'crystal', name: 'Crystal' }
];

export function LeaderboardSection() {
  const [activeTab, setActiveTab] = useState('overall');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfoPopover, setShowInfoPopover] = useState(false);
  const [popoverTab, setPopoverTab] = useState<'titles' | 'points'>('titles');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('mcpvp.club');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fetch from the live Serverless API
  const fetchRankings = async (modeId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?mode=${modeId}`);
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.leaderboard) {
          setData(json.leaderboard);
        } else {
          setData([]);
        }
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Failed to fetch live leaderboard:", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings(activeTab);
  }, [activeTab]);

  return (
    <section id="leaderboard" className="py-24 px-4 relative z-10 max-w-7xl mx-auto">
      {/* Decorative center glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <span className="text-purple-400 font-mono text-sm tracking-widest uppercase mb-2 block">Live Leaderboard</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 mb-4">
          SlamTiers Live Leaderboard
        </h2>
        <div className="w-20 h-1 bg-purple-600 mx-auto rounded-full mb-4" />
      </motion.div>

      {/* Gamemode Tab Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-4xl mx-auto">
        {VALID_GAMEMODES.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                : 'bg-zinc-900/60 text-zinc-450 border border-zinc-800/45 hover:bg-zinc-800/60 hover:text-white'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Leaderboard Table / Container */}
      <div className="max-w-4xl mx-auto relative">
        
        {/* Action Toolbar with Information & Server IP */}
        <div className="flex flex-wrap items-center justify-end gap-3 mb-5 px-1 relative z-30">
          <div className="flex flex-wrap items-center gap-3">
            {/* Information Button */}
            <div className="relative">
              <button
                onClick={() => setShowInfoPopover(!showInfoPopover)}
                id="info_popover_btn"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  showInfoPopover 
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.25)]' 
                    : 'bg-zinc-950/40 text-zinc-300 border border-zinc-800/80 hover:bg-zinc-800/80 hover:text-white'
                }`}
              >
                <Info className="w-4 h-4 text-purple-400" />
                <span>Information</span>
              </button>

              {/* Dynamic Popover */}
              <AnimatePresence>
                {showInfoPopover && (
                  <>
                    {/* Fixed full screen click-escape overlay */}
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setShowInfoPopover(false)} 
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-72 sm:w-[360px] bg-zinc-950/95 border border-zinc-800/90 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.85)] backdrop-blur-md z-50 overflow-hidden"
                    >
                      {/* Segmented Control */}
                      <div className="bg-zinc-900/60 p-0.5 rounded-xl flex gap-1 mb-4">
                        <button
                          onClick={() => setPopoverTab('titles')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                            popoverTab === 'titles'
                              ? 'bg-zinc-800 text-white shadow-md'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          Titles
                        </button>
                        <button
                          onClick={() => setPopoverTab('points')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                            popoverTab === 'points'
                              ? 'bg-zinc-800 text-white shadow-md'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          Points
                        </button>
                      </div>

                      {/* Content Switcher */}
                      {popoverTab === 'titles' ? (
                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 select-none">
                          <h4 className="text-xs font-normal text-zinc-300 leading-normal mb-2">
                            How to obtain <span className="underline decoration-purple-500/80 decoration-2 font-semibold text-white">Achievement Titles</span>:
                          </h4>
                          
                          <div className="flex items-start gap-2.5">
                            <span className="text-lg shrink-0">👑</span>
                            <div>
                              <span className="text-xs font-bold text-amber-300 block">Combat Grandmaster</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Obtained 400+ total points.</span>
                              <span className="text-[9px] text-amber-500/80 font-mono tracking-wider uppercase font-semibold">Absolute Top Tier</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="text-lg shrink-0">⚔️</span>
                            <div>
                              <span className="text-xs font-bold text-purple-300 block">Combat Master</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Obtained 250+ total points.</span>
                              <span className="text-[9px] text-purple-400/80 font-mono tracking-wider uppercase font-semibold">Elite Tier</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="text-lg shrink-0">💎</span>
                            <div>
                              <span className="text-xs font-bold text-cyan-300 block">Combat Ace</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Obtained 100+ total points.</span>
                              <span className="text-[9px] text-cyan-400/80 font-mono tracking-wider uppercase font-semibold">High Tier</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="text-lg shrink-0">🔥</span>
                            <div>
                              <span className="text-xs font-bold text-orange-300 block">Combat Specialist</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Obtained 50+ total points.</span>
                              <span className="text-[9px] text-orange-400/80 font-mono tracking-wider uppercase font-semibold">Mid Tier</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="text-lg shrink-0">🛡️</span>
                            <div>
                              <span className="text-xs font-bold text-indigo-300 block">Combat Cadet</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Obtained 20+ total points.</span>
                              <span className="text-[9px] text-indigo-400/80 font-mono tracking-wider uppercase font-semibold">Novice Tier</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="text-lg shrink-0">🎯</span>
                            <div>
                              <span className="text-xs font-bold text-red-300 block">Combat Novice</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Obtained 10+ total points.</span>
                              <span className="text-[9px] text-red-400/80 font-mono tracking-wider uppercase font-semibold">Beginner Tier</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 pt-1 border-t border-zinc-900">
                            <span className="text-lg shrink-0">🪵</span>
                            <div>
                              <span className="text-xs font-bold text-zinc-350 block">Rookie</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Under 10 Points.</span>
                              <span className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase">Unranked / Starting Tier</span>
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                          <h4 className="text-xs font-normal text-zinc-300 leading-normal mb-2">
                            How to obtain <span className="underline decoration-purple-500/80 decoration-2 font-semibold text-white">Points</span>:
                          </h4>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">
                            Points accumulate cumulatively across active gamemodes. Your verified tier on any gamemode dictates your specific contributions:
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-[11px] select-none font-sans">
                            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 flex justify-between">
                              <span className="text-purple-300 font-bold">HT1 / LT1</span>
                              <span className="text-zinc-200">40 / 35 pts</span>
                            </div>
                            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 flex justify-between">
                              <span className="text-purple-300 font-bold">HT2 / LT2</span>
                              <span className="text-zinc-200">30 / 25 pts</span>
                            </div>
                            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 flex justify-between">
                              <span className="text-purple-300 font-bold">HT3 / LT3</span>
                              <span className="text-zinc-200">20 / 15 pts</span>
                            </div>
                            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 flex justify-between">
                              <span className="text-purple-300 font-bold">HT4 / LT4</span>
                              <span className="text-zinc-200">12 / 8 pts</span>
                            </div>
                            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 flex justify-between col-span-2">
                              <span className="text-purple-300 font-bold">HT5 / LT5</span>
                              <span className="text-zinc-200">5 / 2 pts</span>
                            </div>
                          </div>

                          <div className="p-3 bg-purple-950/25 border border-purple-900/45 rounded-xl text-[10px] text-purple-300 leading-relaxed">
                            💡 Updating dynamic playstyles (such as Sword, Mace, SMP) merges under your universal overall scores.
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Discord Link Button */}
            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-zinc-950/40 border border-zinc-800/80 hover:border-[#5865F2]/40 hover:bg-[#5865F2]/10 transition-all flex items-center justify-center text-zinc-400 hover:text-[#5865F2]"
              title="Join Our Discord"
            >
              <DiscordIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <RefreshCw className="w-10 h-10 text-purple-500 animate-spin mb-4" />
              <p className="text-zinc-500 font-mono text-sm tracking-wide">Retrieving official profiles...</p>
            </motion.div>
          ) : (
            <motion.div
              key="leaderboard-table"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            >
              {data.length === 0 ? (
                <div className="py-24 px-8 text-center text-zinc-400 font-sans flex flex-col items-center justify-center animate-fade-in">
                  <div className="p-4 bg-purple-500/10 rounded-full text-purple-400 mb-5 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
                    <Trophy className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Ranked Data Found</h3>
                  <p className="max-w-md text-sm text-zinc-500 leading-relaxed">
                    There are currently no active player promotions recorded for this gamemode.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-zinc-800/80 bg-zinc-900/50">
                        <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold w-16 text-center">Rank</th>
                        <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">User</th>
                        {activeTab === 'overall' ? (
                          <>
                            <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold text-center">Title</th>
                            <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold text-right">Overall Points</th>
                          </>
                        ) : (
                          <>
                            <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold text-center">Highest Tier</th>
                            <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold text-right">Elo Rating</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((player, idx) => {
                        const rank = idx + 1;
                        let rankStyle = "text-zinc-400 font-mono";
                        let rowBg = "border-l-2 border-transparent hover:bg-zinc-800/10 transition-colors";
                        
                        if (rank === 1) {
                          rankStyle = "text-amber-400 font-extrabold bg-amber-500/15 rounded-lg py-1 px-3 border border-amber-500/30 text-center shadow-[0_0_12px_rgba(245,158,11,0.2)]";
                          rowBg = "bg-amber-500/5 hover:bg-amber-500/10 border-l-2 border-amber-500 shadow-[inset_0_0_24px_rgba(245,158,11,0.06)] transition-all duration-200";
                        } else if (rank === 2) {
                          rankStyle = "text-zinc-200 font-bold bg-zinc-400/15 rounded-lg py-1 px-3 border border-zinc-400/30 text-center shadow-[0_0_12px_rgba(168,168,168,0.15)]";
                          rowBg = "bg-zinc-400/5 hover:bg-zinc-400/8 border-l-2 border-zinc-400 shadow-[inset_0_0_20px_rgba(255,255,255,0.03)] transition-all duration-200";
                        } else if (rank === 3) {
                          rankStyle = "text-amber-600 font-bold bg-amber-800/15 rounded-lg py-1 px-3 border border-amber-800/30 text-center shadow-[0_0_12px_rgba(180,83,9,0.15)]";
                          rowBg = "bg-amber-800/5 hover:bg-amber-800/8 border-l-2 border-amber-600 shadow-[inset_0_0_20px_rgba(180,83,9,0.02)] transition-all duration-200";
                        }

                        return (
                          <motion.tr
                            key={player.discordId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.006, x: 4 }}
                            transition={{ 
                              x: { type: "spring", stiffness: 400, damping: 25 },
                              scale: { type: "spring", stiffness: 400, damping: 25 },
                              default: { delay: idx * 0.04 }
                            }}
                            className={`border-b border-zinc-900/60 ${rowBg} cursor-pointer origin-left`}
                          >
                            {/* Rank Indicator */}
                            <td className="py-4.5 px-6 text-center">
                              <span className={rankStyle}>{rank}</span>
                            </td>

                            {/* User details */}
                            <td className="py-4.5 px-6">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={`https://minotar.net/helm/${player.username}/64.png`} 
                                  alt={`${player.username}'s skin`} 
                                  className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-950 object-cover shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-150 hover:scale-110"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://minotar.net/helm/Steve/64.png';
                                  }}
                                  referrerPolicy="no-referrer"
                                />
                                <div className="flex flex-col">
                                  <span className="font-semibold text-white tracking-wide hover:text-purple-400 transition-colors duration-150">{player.username}</span>
                                  <span className="text-[10px] font-mono text-zinc-500 font-medium">ID: {player.discordId}</span>
                                </div>
                              </div>
                            </td>

                            {activeTab === 'overall' ? (
                              <>
                                {/* Title Column */}
                                <td className="py-4.5 px-6 text-center">
                                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                    player.totalPoints >= 400 ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30' :
                                    player.totalPoints >= 250 ? 'bg-purple-500/15 text-purple-200 border border-purple-500/30' :
                                    player.totalPoints >= 100 ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30' :
                                    player.totalPoints >= 50 ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30' :
                                    player.totalPoints >= 20 ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' :
                                    player.totalPoints >= 10 ? 'bg-red-500/15 text-red-300 border border-red-500/30' :
                                    'bg-zinc-800/40 text-zinc-400 border border-zinc-800/80'
                                  }`}>
                                    {player.achievementTitle}
                                  </span>
                                </td>

                                {/* Points Column */}
                                <td className="py-4.5 px-6 text-right font-mono text-zinc-150 font-semibold text-lg">
                                  <span className="text-purple-400">{player.totalPoints}</span> <span className="text-[10px] text-zinc-500 font-normal">XP</span>
                                </td>
                              </>
                            ) : (
                              <>
                                {/* Highest Tier Badger */}
                                <td className="py-4.5 px-6 text-center">
                                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold tracking-wide ${
                                    player.tier?.startsWith('HT') ? 'bg-purple-950/40 text-purple-300 border border-purple-500/20' : 'bg-zinc-800 text-zinc-300 border border-zinc-700/30'
                                  }`}>
                                    {player.tier || 'NONE'}
                                  </span>
                                </td>

                                {/* Score Points */}
                                <td className="py-4.5 px-6 text-right font-mono text-zinc-150 font-semibold text-lg">
                                  <span className="text-zinc-200">{player.points}</span> <span className="text-[10px] text-zinc-500 font-normal">PTS</span>
                                </td>
                              </>
                            )}
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
