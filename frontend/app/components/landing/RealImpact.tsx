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
    <section className="px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-primary text-4xl md:text-5xl font-bold text-[#342612] mb-4">
          Real Impact for Real Creators
        </h2>
        <p className="font-primary text-xl md:text-2xl text-[#342612] mb-4 max-w-3xl mx-auto">
          More visibility. Less burnout. Authentic growth powered by intelligent
          automation.
        </p>
        <p className="font-secondary text-2xl md:text-3xl text-[#813837] mb-16 text-center">
          Your creative partner, always ready.
        </p>  

        <div className="grid md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg border-2 border-[#6C5F48]"
            >
              <div className="font-primary text-6xl font-bold text-[#813837] mb-4">
                {stat.value}
              </div>
              <div className="font-primary text-2xl text-[#342612] font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
