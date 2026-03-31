import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Countdown from "@/components/Countdown";
import Gallery from "@/components/Gallery";
import RsvpForm from "@/components/RsvpForm";
import EventInfo from "@/components/EventInfo";
import DigitalGifting from "@/components/DigitalGifting";
import Footer from "@/components/Footer";
import BackgroundMusic from "@/components/BackgroundMusic";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  return (
    <>
      <BackgroundMusic />
      
      <Hero />
      
      <FadeIn delay={0.2}><Countdown /></FadeIn>
      <FadeIn delay={0.2}><Gallery /></FadeIn>
      <FadeIn delay={0.2}><Story /></FadeIn>
      <FadeIn delay={0.2}><RsvpForm /></FadeIn>
      <FadeIn delay={0.2}><EventInfo /></FadeIn>
      <FadeIn delay={0.2}><DigitalGifting /></FadeIn>
      
      <Footer />
    </>
  );
}
