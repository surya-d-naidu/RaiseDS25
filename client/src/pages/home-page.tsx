import { useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import EventHighlights from "@/components/sections/event-highlights";
import AboutConference from "@/components/sections/about-conference";
import HostInstitutions from "@/components/sections/host-institutions";
import KeyFeatures from "@/components/sections/key-features";
import PublicationSection from "@/components/sections/publication-section";
import CallToAction from "@/components/sections/call-to-action";
import InvitedSpeakersCarousel from "@/components/invited-speakers-carousel";
import { Helmet } from "react-helmet";

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>RAISE DS 2025 - Recent Advances and Innovative Statistics with Enhancing Data Science</title>
        <meta name="description" content="45th Annual Convention of Indian Society for Probability and Statistics (ISPS) in Conjunction with International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science" />
      </Helmet>
      
      <Navbar />
      
      <main>
        <HeroSection />
        <EventHighlights />
        <AboutConference />
        <InvitedSpeakersCarousel />
        <HostInstitutions />
        <KeyFeatures />
        <PublicationSection />
        <CallToAction />
      </main>
      
      <Footer />
    </>
  );
}
