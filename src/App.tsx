import { AmbientBackground } from './components/AmbientBackground';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { WhyJoinSection } from './components/WhyJoinSection';
import { LeaderboardSection } from './components/LeaderboardSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <main className="relative min-h-screen text-zinc-50 font-sans antialiased selection:bg-purple-500/30">
      <AmbientBackground />
      <HeroSection />
      <FeaturesSection />
      <WhyJoinSection />
      <LeaderboardSection />
      <Footer />
    </main>
  );
}
