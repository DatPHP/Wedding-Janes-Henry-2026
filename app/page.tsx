import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Countdown from "@/components/Countdown";
import Gallery from "@/components/Gallery";
import EventInfo from "@/components/EventInfo";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Story />
      <Countdown />
      <Gallery />
      <EventInfo />
      <Footer />
    </>
  );
}
