import { motion } from "motion/react";
import { Swords } from "lucide-react";
import { DiscordIcon } from "./DiscordIcon";
import { DISCORD_LINK } from "../config";

export function HeroSection() {
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

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 bg-white text-zinc-950 px-8 py-4 rounded-xl font-bold text-lg overflow-hidden transition-all hover:bg-zinc-200"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <DiscordIcon className="w-6 h-6 text-[#5865F2]" />
            Join Now
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
