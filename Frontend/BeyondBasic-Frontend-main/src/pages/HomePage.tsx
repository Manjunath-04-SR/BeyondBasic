
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import Hero from "@/components/marketing/hero";
import StatsSection from "@/components/marketing/stats-section";
import WhatYouGet from "@/components/marketing/what-you-get";
import HowItWorks from "@/components/marketing/how-it-works";
import CompanyPrep from "@/components/marketing/company-prep";
import Instructors from "@/components/marketing/instructors";
import Testimonials from "@/components/marketing/testimonials";
import RoadmapCTA from "@/components/marketing/roadmap-cta";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsSection />
        <WhatYouGet />
        <HowItWorks />
        <CompanyPrep />
        <Instructors />
        <Testimonials />
        <RoadmapCTA />
      </main>
      <Footer />
    </div>
  );
}
