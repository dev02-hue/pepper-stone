import CarouselSection from "./components/home/CarouselSection";
import ExperienceCards from "./components/home/ExperienceCards";
import HeroSection from "./components/home/HeroSection";
import OurExperiences from "./components/home/OurExperiences";
import StatisticsSection from "./components/home/StatisticsSection";
import RegisterSection from "./components/home/RegisterSection";
import PricingPlans from "./components/home/PricingPlans";
 
 
export default function Home() {
  return (
      <>
      <HeroSection />
      <CarouselSection />
      <StatisticsSection />
      <OurExperiences />
      <ExperienceCards />
      <RegisterSection />
      <PricingPlans />
      </>
  );
}
