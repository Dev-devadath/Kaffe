import { Upload, Cpu, Newspaper } from "lucide-react";

export function HowItWorks() {
    const steps = [
        {
            icon: <Upload size={32} className="text-[#EAD7BA]" />,
            title: "1. Deposit Art",
            description: "Upload your raw creative files into the secure intake chute.",
        },
        {
            icon: <Cpu size={32} className="text-[#EAD7BA]" />,
            title: "2. Processing",
            description: "Our engines analyze structure, tone, and visual essence.",
        },
        {
            icon: <Newspaper size={32} className="text-[#EAD7BA]" />,
            title: "3. Press Run",
            description: "Receive a full stack of repurposed assets, hot off the press.",
        },
    ];

    return (
        <section className="bg-[#342612] text-[#EAD7BA] py-20 px-6 border-y-4 border-[#6C5F48]">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-[#813837] rounded-none rotate-3 flex items-center justify-center border-2 border-[#EAD7BA] shadow-[4px_4px_0px_#6C5F48] mb-6 group-hover:rotate-6 transition-transform">
                                {step.icon}
                            </div>
                            <h3 className="font-primary text-2xl font-bold uppercase tracking-widest mb-3">
                                {step.title}
                            </h3>
                            <p className="font-mono-retro text-sm leading-relaxed max-w-xs opacity-80">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
