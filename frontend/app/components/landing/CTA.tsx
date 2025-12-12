import { Link } from "react-router";

export function CTA() {
  return (
    <section className="px-6 py-20 md:py-32 bg-[#342612] text-[#EAD7BA] text-center relative border-t-2 border-[#6C5F48]">
      {/* Decorative Lines */}
      <div className="absolute top-4 left-0 w-full h-[1px] bg-[#6C5F48] opacity-30"></div>
      <div className="absolute bottom-4 left-0 w-full h-[1px] bg-[#6C5F48] opacity-30"></div>

      <h2 className="font-primary text-4xl md:text-6xl font-bold mb-6 tracking-wide uppercase text-shadow-retro text-[#EAD7BA]">
        Ready to Transform Your Workflow?
      </h2>
      <p className="font-mono-retro text-lg md:text-xl mb-12 max-w-2xl mx-auto text-[#EAD7BA]/80">
        // Join creators saving hours every week.
      </p>
      <div className="flex gap-6 justify-center flex-wrap">
        <Link
          to="/app"
          className="bg-[#813837] text-[#EAD7BA] px-10 py-4 font-primary text-xl font-bold uppercase tracking-wider hover:bg-[#EAD7BA] hover:text-[#813837] border-2 border-[#EAD7BA] transition-all shadow-[4px_4px_0px_#EAD7BA] active:translate-y-1 active:shadow-none"
        >
          Try Kaffe Now
        </Link>
      </div>
    </section>
  );
}
