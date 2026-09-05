import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { ProblemSection, HowItWorks, FeatureSections, ImpactSection, CTASection, Footer } from "@/components/landing/sections";

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <LandingNav />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <FeatureSections />
      <ImpactSection />
      <CTASection />
      <Footer />
    </div>
  );
}
