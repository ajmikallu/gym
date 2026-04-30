import HeroBanner from "@/components/home/hero-banner";
import MissionVision from "@/components/home/mission-vision";

export default function Page() {
  return (
    <>
      <HeroBanner imageIndex={2} />
      <MissionVision />
    </>
  );
}