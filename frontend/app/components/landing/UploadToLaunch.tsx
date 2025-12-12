interface WorkflowStep {
  number: number;
  title: string;
  description: string;
}

export function UploadToLaunch() {
  const steps: WorkflowStep[] = [
    {
      number: 1,
      title: "Upload",
      description: "Drop your artwork or product image into Kaffe",
    },
    {
      number: 2,
      title: "Analyze",
      description: "AI examines visual elements, specs, and creative intent",
    },
    {
      number: 3,
      title: "Strategize",
      description: "SEO and branding agents develop your positioning",
    },
    {
      number: 4,
      title: "Customize",
      description: "Channel planner adapts content for each platform",
    },
    {
      number: 5,
      title: "Generate",
      description: "Content agents create blogs, captions, and copy",
    },
    {
      number: 6,
      title: "Polish",
      description: "Quality agent ensures everything is publication-ready",
    },
  ];

  return (
    <section className="px-6 py-16 md:py-24 bg-[#342612] text-[#EAD7BA]">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-primary text-4xl md:text-5xl font-medium mb-4 text-center">
          From Upload to Launch in 60 Seconds
        </h2>
        <p className="font-primary text-xl text-center mb-16 text-[#EAD7BA]/80">
          Zero complexity workflow
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="bg-[#813837] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="font-primary text-2xl font-bold mb-3">
                {step.title}
              </h3>
              <p className="text-[#EAD7BA]/90">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
