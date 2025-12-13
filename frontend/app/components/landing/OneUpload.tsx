interface ProcessStep {
  title: string;
  description: string;
}

export function OneUpload() {
  const steps: ProcessStep[] = [
    {
      title: "Upload Creative Work",
      description:
        "Share your product photo or creative piece with Kaffe's main orchestrator",
    },
    {
      title: "Visual Analysis",
      description:
        "Image Analysis Agent examines composition, style, colors, and emotional impact",
    },
    {
      title: "Parallel Processing",
      description:
        "Branding and SEO agents work simultaneously to optimize your content strategy",
    },
    {
      title: "Channel Planning",
      description:
        "Platform-specific customization for Instagram, LinkedIn, blogs, and more",
    },
    {
      title: "Content Generation",
      description:
        "Specialized agents create blogs, captions, keywords, and product descriptions",
    },
    {
      title: "Quality Polish",
      description:
        "Final review ensures brand consistency and marketing effectiveness",
    },
  ];

  // Generate random rotations for each card (-2 to 2 degrees)
  const rotations = steps.map(() => {
    const direction = Math.random() > 0.5 ? 1 : -1;
    const angle = (Math.random() * 2 + 0.5) * direction; // Random between 0.5-2.5 degrees
    return angle;
  });

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="font-secondary text-3xl md:text-4xl text-[#813837] mb-2 text-center">
          One Upload
        </div>
        <h2 className="font-primary text-4xl md:text-5xl font-bold text-[#342612] mb-4 text-center">
          Complete Marketing Kit.
        </h2>
        <p className="font-primary text-xl md:text-2xl text-[#342612] mb-16 text-center max-w-3xl mx-auto">
          Kaffe transforms your creative work into comprehensive marketing
          materials through an intelligent multi-agent system. Upload once, get
          everything you need to promote across all channels.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border-2 border-[#6C5F48] transition-transform duration-300 ease-in-out"
              style={
                {
                  "--rotation": `${rotations[index]}deg`,
                  transform: `rotate(var(--rotation))`,
                } as React.CSSProperties & { "--rotation": string }
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.setProperty("--rotation", "0deg");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty(
                  "--rotation",
                  `${rotations[index]}deg`
                );
              }}
            >
              <div className="font-secondary text-[#813837] text-3xl mb-4">
                {step.title}
              </div>
              <p className="text-[#342612]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
