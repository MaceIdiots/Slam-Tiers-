import { motion } from "motion/react";
import { DISCORD_LINK } from "../config";
import { DiscordIcon } from "./DiscordIcon";
import { Swords } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative pt-24 pb-12 px-4 z-10">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-purple-950/20 z-[-1]" />
      
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="p-8 md:p-12 rounded-3xl bg-zinc-900/50 border border-purple-500/10 backdrop-blur-lg w-full shadow-[0_0_50px_rgba(168,85,247,0.05)]"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400">
              <Swords className="w-8 h-8" />
            </div>
          </div>
          
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to prove your skill?
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto font-sans">
            Join now and become part of a growing competitive scene. Make your mark, climb the tierlist, and secure your ranking today.
          </p>

          <motion.a
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all"
          >
            <DiscordIcon className="w-6 h-6" />
            Join The Community
          </motion.a>
        </motion.div>
      </div>
    </footer>
  );
}
