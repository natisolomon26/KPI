import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import { Footer } from "@/components/landing/Footer";
import Resources from "@/components/landing/Resource";
import AlumniForm from "@/components/landing/AlumniForm";
import WorkWithUs from "@/components/landing/WorkWithUs";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Resources /> 
      <WorkWithUs />
      <AlumniForm />
      <Footer />
    </>
  );
}