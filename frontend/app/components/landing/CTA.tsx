import { Link } from "react-router";

export function CTA() {
  return (
    <section className="px-6 py-20 md:py-32 bg-[#342612] text-[#EAD7BA] text-center">
      <h2 className="font-primary text-4xl md:text-6xl font-bold mb-6">
        Ready to Transform Your Creative Workflow?
      </h2>
      <p className="font-primary text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-[#EAD7BA]/90">
        Join creators who are already saving hours every week with Kaffe
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          to="/app"
          className="bg-[#813837] text-[#EAD7BA] px-8 py-4 rounded-lg font-primary text-lg font-semibold hover:bg-[#813837]/90 transition-colors inline-block"
        >
          Try Kaffe Now
        </Link>
        <button className="bg-transparent border-2 border-[#6C5F48] text-[#EAD7BA] px-8 py-4 rounded-lg font-primary text-lg font-semibold hover:bg-[#6C5F48]/20 transition-colors">
          See How It Works
        </button>
      </div>
    </section>
  );
}
