import { motion } from "motion/react";
import { Swords } from "lucide-react";
import { DiscordIcon } from "./DiscordIcon";
import { DISCORD_LINK } from "../config";

interface HeroSectionProps {
  onNavigateLeaderboard?: () => void;
}

export function HeroSection({ onNavigateLeaderboard }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center max-w-4xl mx-auto"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8 backdrop-blur-md"
        >
          <Swords className="w-4 h-4" />
          <span>Minecraft Skills Ranked • Version 1.21.11+</span>
        </motion.div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          Welcome to <br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600">
            SlamTiers
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 font-sans">
          Where true Minecraft skills get measured. Join a competitive but controlled environment featuring fair tests, a custom bot, and a thriving community.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 rounded-xl font-bold text-lg overflow-hidden transition-all shadow-[0_4px_24px_rgba(88,101,242,0.25)] hover:shadow-[0_4px_30px_rgba(88,101,242,0.4)]"
            >
              <DiscordIcon className="w-6 h-6 text-white" />
              Join Now
            </a>
          </motion.div>

          {onNavigateLeaderboard && (
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <button
                onClick={onNavigateLeaderboard}
                className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-750 hover:border-zinc-600 rounded-xl font-bold text-lg transition-all shadow-md cursor-pointer"
              >
                <span>View Standings</span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
