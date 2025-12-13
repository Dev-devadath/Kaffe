export function Hero() {
  return (
    <section className="px-6 py-20 md:py-32 text-center relative overflow-hidden">
      {/* Decorative vintage elements */}
      <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-[#6C5F48] opacity-50"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-[#6C5F48] opacity-50"></div>

      <div className="font-secondary text-4xl md:text-6xl text-[#813837] mb-6 transform -rotate-2">
        Est. 2025
      </div>

      <h1 className="font-primary text-6xl md:text-8xl font-medium text-[#342612] mb-8 leading-tight uppercase tracking-tight text-shadow-retro">
        Kaffe Studio
      </h1>

      <div className="inline-block border-2 border-dashed border-[#6C5F48] py-2 mb-8 px-12">
        <p className="font-primary text-lg md:text-xl text-[#6C5F48] tracking-widest uppercase">
          Automated Content GENERATION WITH EASE
        </p>
      </div>

      <p className="font-primary text-xl md:text-2xl text-[#342612] max-w-2xl mx-auto leading-relaxed mb-12">
        Transform any creative work into a complete marketing toolkit in
        seconds.
        <span className="block mt-2 italic text-[#813837] font-secondary">
          Focus on the craft. Let us handle the press.
        </span>
      </p>

      <div className="relative flex flex-col md:flex-row items-center justify-center gap-4">
  
        <a
          href="/app"
          className="bg-[#813837] text-[#EAD7BA] px-8 py-4 text-xl font-bold uppercase tracking-wider hover:bg-[#6C5F48] transition-colors shadow-[4px_4px_0px_#342612] active:translate-y-1 active:shadow-none border-2 border-[#342612]"
        >
          Start Making
        </a>
              <span className="font-secondary text-[#342612] text-xl">
          or scroll to learn more
        </span>
      </div>
    </section>
  );
}
