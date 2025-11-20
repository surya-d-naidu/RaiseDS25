import { useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotificationBar from "@/components/layout/notification-bar";
import HeroSection from "@/components/sections/hero-section";
import EventHighlights from "@/components/sections/event-highlights";
import AboutConference from "@/components/sections/about-conference";
import HostInstitutions from "@/components/sections/host-institutions";
import FeaturedSpeakers from "@/components/sections/featured-speakers";
import KeyFeatures from "@/components/sections/key-features";
import CallToAction from "@/components/sections/call-to-action";
import { Helmet } from "react-helmet";

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>SuWatE+'26 - Second International Conference on Next Generation Sustainable Materials for Water and Energy Solutions</title>
        <meta name="description" content="Second International Conference on Next Generation Sustainable Materials for Water and Energy Solutions (SuWatE+'26) - Theme: Water, Energy, Sensors & Technology" />
      </Helmet>
      
      <NotificationBar />
      <Navbar />
      
      <main>
        <HeroSection />
        <EventHighlights />
        <AboutConference />
        <HostInstitutions />
        <FeaturedSpeakers />
        <KeyFeatures />
        <CallToAction />
      </main>
      
      <Footer />
    </>
  );
}
