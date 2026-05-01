import HeroBanner from "@/components/home/hero-banner";
import MissionVision from "@/components/home/mission-vision";
import FeaturesPrograms from "@/components/home/features-programs";
import PersonalTraining from "@/components/home/personal-training";

export default function Page() {
  return (
    <>
      <HeroBanner imageIndex={2} />
      <MissionVision />
      <FeaturesPrograms />
      <PersonalTraining />
    </>
  );
}