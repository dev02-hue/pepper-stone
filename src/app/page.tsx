import CarouselSection from "./components/home/CarouselSection";
import ExperienceCards from "./components/home/ExperienceCards";
import HeroSection from "./components/home/HeroSection";
import OurExperiences from "./components/home/OurExperiences";
import StatisticsSection from "./components/home/StatisticsSection";
import RegisterSection from "./components/home/RegisterSection";
import PricingPlans from "./components/home/PricingPlans";
import InvestmentCalculator from "./components/home/InvestmentCalculator";
import LiveChart from "./components/home/LiveChart";
import FAQComponent from "./components/home/FAQComponent";
 
 
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
      <InvestmentCalculator />
      <LiveChart />
      <FAQComponent />
      </>
  );
}
