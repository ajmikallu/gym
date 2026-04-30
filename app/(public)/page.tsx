import HeroBanner from "@/components/home/hero-banner";
import MissionVision from "@/components/home/mission-vision";
import PersonalTraining from "@/components/home/personal-training";

export default function Page() {
  return (
    <>
      <HeroBanner imageIndex={2} />
      <MissionVision />
      <PersonalTraining />
    </>
  );
}