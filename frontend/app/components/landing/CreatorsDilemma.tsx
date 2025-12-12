export function CreatorsDilemma() {
  const painPoints = [
    "Artists spend countless hours writing blogs, captions, and marketing copy instead of creating",
    "Branding, SEO, and positioning demand expertise across multiple disciplines",
    "Maintaining consistent presence across platforms becomes overwhelming",
    "Existing AI tools miss the mark—they don't actually understand your artwork",
    'Creative burnout hits hard when you\'re forced to "do everything"',
  ];

  return (
    <section className="px-6 py-16 md:py-24 bg-[#342612] text-[#EAD7BA]">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-primary text-4xl md:text-5xl font-bold mb-12 text-center">
          The Creator's Dilemma
        </h2>
        <p className="font-primary text-xl md:text-2xl mb-12 text-center font-light">
          Creators can make visuals, but can't turn them into content—fast.
        </p>
        <ul className="space-y-6 text-lg md:text-xl">
          {painPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-4">
              <span className="text-[#813837] font-bold text-2xl">→</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
