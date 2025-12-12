export function CreatorsDilemma() {
  const painPoints = [
    "Creators spend countless hours writing blogs, captions, and marketing copy instead of creating",
    "Branding, SEO, and positioning demand expertise across multiple disciplines",
    "Maintaining consistent presence across platforms becomes overwhelming",
    "Existing AI tools miss the mark—they don't actually understand your work",
    'Creative burnout hits hard when you\'re forced to "do everything"',
  ];

  return (
    <section className="px-6 py-16 md:py-24 bg-[#813837] text-[#EAD7BA]">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-primary text-4xl md:text-5xl font-bold mb-12 text-start pl-8">
          The Creator's Dilemma
        </h2>
        <p className="font-primary text-xl md:text-2xl mb-12 text-start font-light pl-8">
          Creators can make visuals, but can't turn them into content—fast.
        </p>
        <ul className="space-y-6 text-lg md:text-xl">
          {painPoints.map((point, index) => (
            <li key={index} className="flex items-baseline gap-4">
              <span className="text-[#EAD7BA] font-light text-2xl leading-normal shrink-0">
                →
              </span>
              <span className="flex-1 leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
