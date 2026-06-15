import { motion } from "motion/react";
import { BarChart3, Shield, Users, Trophy, Scroll } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Structured Tierlist System",
    description: "Our comprehensive tierlist ensures accurate placement according to absolute skill level.",
  },
  {
    icon: Shield,
    title: "Fair & Monitored Ranked Tests",
    description: "Every test is closely monitored to guarantee fairness and prevent any fraudulent activity.",
  },
  {
    icon: Users,
    title: "Active & Organized Staff",
    description: "Our dedicated team is always online to assist, moderate, and keep the environment clean.",
  },
  {
    icon: Trophy,
    title: "Competitive Environment",
    description: "Whether you are a rising talent or a seasoned veteran, there's a place for you here.",
  },
  {
    icon: Scroll,
    title: "Clear Rules & Management",
    description: "Professional management combined with transparent rules you can rely on.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 mb-4">
            What We Offer
          </h2>
          <div className="w-20 h-1 bg-purple-600 mx-auto rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  scale: 1.025,
                  boxShadow: "0 20px 40px -15px rgba(168, 85, 247, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-800 hover:border-purple-500/50 transition-colors duration-300 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative h-full bg-surface-card bg-zinc-900/80 backdrop-blur-xl p-8 rounded-2xl flex flex-col items-start text-left">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl mb-6 shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-shadow">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-zinc-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
