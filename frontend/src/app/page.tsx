import HeroSection from "@/components/home/HeroSection";
import AboutSnapshot from "@/components/home/AboutSnapshot";
import ServicesOverview from "@/components/home/ServicesOverview";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import LeadershipTeam from "@/components/home/LeadershipTeam";
import PortfolioPlaceholder from "@/components/home/PortfolioPlaceholder";
import CtaBanner from "@/components/home/CtaBanner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSnapshot />
      <ServicesOverview />
      <WhyChooseUs />
      <LeadershipTeam />
      <PortfolioPlaceholder />
      <CtaBanner />
    </>
  );
}
