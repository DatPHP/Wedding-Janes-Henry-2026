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
import NavBar from "@/components/NavBar";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <>
      <BackgroundMusic />
      <NavBar />
      <ScrollToTop />

      <section id="greeting">
        <Hero />
      </section>

      <section id="countdown">
        <FadeIn delay={0.2}><Countdown /></FadeIn>
      </section>

      <section id="memories">
        <FadeIn delay={0.2}><Gallery /></FadeIn>
      </section>

      <section id="story">
        <FadeIn delay={0.2}><Story /></FadeIn>
      </section>

      <section id="wishes">
        <FadeIn delay={0.2}><RsvpForm /></FadeIn>
      </section>

      <section id="event">
        <FadeIn delay={0.2}><EventInfo /></FadeIn>
      </section>

      <section id="gift">
        <FadeIn delay={0.2}><DigitalGifting /></FadeIn>
      </section>

      <Footer />
    </>
  );
}
