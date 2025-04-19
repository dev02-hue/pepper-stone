import CarouselSection from "./components/home/CarouselSection";
import ExperienceCards from "./components/home/ExperienceCards";
import HeroSection from "./components/home/HeroSection";
import OurExperiences from "./components/home/OurExperiences";
import StatisticsSection from "./components/home/StatisticsSection";

 
 
export default function Home() {
  return (
      <>
      <HeroSection />
      <CarouselSection />
      <StatisticsSection />
      <OurExperiences />
      <ExperienceCards />
      </>
  );
}
