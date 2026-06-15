import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AmbientBackground } from "./components/AmbientBackground";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { WhyJoinSection } from "./components/WhyJoinSection";
import { LeaderboardSection } from "./components/LeaderboardSection";
import { Footer } from "./components/Footer";
import { Trophy, Swords, Home } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"intro" | "leaderboard">("intro");

  // Keep scroll position clean when switching views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  return (
    <main className="relative min-h-screen text-zinc-50 font-sans antialiased selection:bg-purple-500/30">
      <AmbientBackground />

      {/* High Fidelity Floating Header/Navbar */}
      <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab("intro")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Swords className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 select-none">
              Slam<span className="text-purple-400">Tiers</span>
            </span>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-1.5 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800/45">
            <button
              onClick={() => setActiveTab("intro")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                activeTab === "intro"
                  ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-sm"
                  : "text-zinc-400 hover:text-white border border-transparent"
              }`}
            >
              <Home className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Introduction</span>
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                activeTab === "leaderboard"
                  ? "bg-purple-600/20 text-purple-200 border border-purple-500/35 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  : "text-zinc-400 hover:text-white border border-transparent"
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Leaderboard</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Dynamic View Panel under AnimatePresence */}
      <div className="relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "intro" ? (
            <motion.div
              key="intro-view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <HeroSection onNavigateLeaderboard={() => setActiveTab("leaderboard")} />
              <FeaturesSection />
              <WhyJoinSection />
            </motion.div>
          ) : (
            <motion.div
              key="leaderboard-view"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <LeaderboardSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
