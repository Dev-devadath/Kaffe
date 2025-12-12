import { Hero } from "../components/landing/Hero";
import { CreatorsDilemma } from "../components/landing/CreatorsDilemma";
import { OneUpload } from "../components/landing/OneUpload";
import { UploadToLaunch } from "../components/landing/UploadToLaunch";
import { RealImpact } from "../components/landing/RealImpact";
import { CTA } from "../components/landing/CTA";

export function Home() {
  return (
    <div className="min-h-screen bg-[#EAD7BA]">
      <Hero />
      <CreatorsDilemma />
      <OneUpload />
      <UploadToLaunch />
      <RealImpact />
      <CTA />
    </div>
  );
}
