export function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Top Left Blob */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-900/20 blur-[150px] opacity-70 mix-blend-screen" />
      
      {/* Middle Right Blob */}
      <div className="absolute top-[30%] -right-[15%] w-[50%] h-[70%] rounded-full bg-violet-800/15 blur-[150px] opacity-60 mix-blend-screen" />
      
      {/* Bottom Left Blob */}
      <div className="absolute -bottom-[20%] left-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-900/15 blur-[150px] opacity-60 mix-blend-screen" />

      {/* Noise Overlay Effect (Subtle) */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
