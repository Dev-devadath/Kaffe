interface ImpactStat {
  value: string;
  label: string;
}

export function RealImpact() {
  const stats: ImpactStat[] = [
    {
      value: "10x",
      label: "Faster Content Creation",
    },
    {
      value: "80%",
      label: "Time Saved",
    },
    {
      value: "40%",
      label: "Quicker Output",
    },
  ];

  return (
    <section className="px-6 py-16 md:py-24 bg-[#EAD7BA] relative">
      <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDAgMjAgMTAgMTAgMjAgMCAxMHoiIGZpbGw9IiM2QzVGNDgiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-50"></div>

      <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-primary text-4xl md:text-5xl font-bold text-[#342612] mb-4 uppercase tracking-tight text-shadow-retro">
          Real Impact for Real Creators
        </h2>
        <p className="font-primary text-xl md:text-2xl text-[#342612] mb-8 max-w-3xl mx-auto leading-relaxed">
          More visibility. Less burnout. Authentic growth powered by intelligent automation.
        </p>
        <p className="font-secondary text-3xl md:text-4xl text-[#813837] mb-16 text-center transform -rotate-1">
          Your creative partner, always ready.
        </p>

        <div className="grid md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-8 border-2 border-[#6C5F48] shadow-[8px_8px_0px_#6C5F48] hover:translate-y-1 hover:shadow-[4px_4px_0px_#6C5F48] transition-all duration-300"
            >
              <div className="font-primary text-7xl font-bold text-[#813837] mb-4 tracking-tighter">
                {stat.value}
              </div>
              <div className="w-12 h-1 bg-[#6C5F48] mx-auto mb-4"></div>
              <div className="font-mono-retro text-lg text-[#342612] uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
