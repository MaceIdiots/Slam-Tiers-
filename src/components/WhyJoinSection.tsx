import { motion } from "motion/react";
import { Scale, Puzzle, TrendingUp, Target, Bot } from "lucide-react";

const reasons = [
  {
    icon: Scale,
    title: "No Favoritism",
    description: "We enforce strict guidelines to ensure fair decisions and an unbiased competitive ladder.",
  },
  {
    icon: Puzzle,
    title: "Well-Managed System",
    description: "Every aspect of the server is designed to function seamlessly with clear, upfront rules.",
  },
  {
    icon: TrendingUp,
    title: "Grow & Get Recognized",
    description: "SlamTiers is the perfect venue to prove your skills and climb the ranks within the community.",
  },
  {
    icon: Target,
    title: "Controlled Environment",
    description: "We foster fierce competition while ensuring everyone remains respectful and toxicity-free.",
  },
  {
    icon: Bot,
    title: "Custom Bot Integration",
    description: "Our bespoke server bot automates tier updates, scheduling, and overall management effortlessly.",
  },
];

export function WhyJoinSection() {
  return (
    <section className="py-24 px-4 relative z-10 overflow-hidden">
      {/* Decorative gradient for the section */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="lg:w-1/3 text-center lg:text-left"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 mb-6">
            Why Join Us?
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Our community is dedicated to providing the ultimate competitive Minecraft experience. We blend fair testing, strict moderation, and powerful automations to let your real skills shine.
          </p>
        </motion.div>

        <div className="lg:w-2/3 flex flex-col gap-4">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex flex-col sm:flex-row sm:items-center gap-5 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm hover:bg-zinc-800/60 transition-colors"
            >
              <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-purple-950/50 text-purple-400 border border-purple-500/20 group-hover:bg-purple-900/50 group-hover:scale-110 transition-all duration-300">
                <reason.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-zinc-100 mb-1">
                  {reason.title}
                </h4>
                <p className="text-zinc-400 text-sm">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
