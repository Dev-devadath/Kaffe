import { Hero } from "../components/landing/Hero";
import { HowItWorks } from "../components/landing/HowItWorks";
import { CreatorsDilemma } from "../components/landing/CreatorsDilemma";
import { OneUpload } from "../components/landing/OneUpload";
import { UploadToLaunch } from "../components/landing/UploadToLaunch";
import { RealImpact } from "../components/landing/RealImpact";
import { CTA } from "../components/landing/CTA";

export function Home() {
  return (
    <main className="min-h-screen bg-[#EAD7BA] overflow-x-hidden">
      <Hero />
      <HowItWorks />
      <CreatorsDilemma />
      <OneUpload />
      <UploadToLaunch />
      <RealImpact />
      <CTA />
    </main>
  );
}
