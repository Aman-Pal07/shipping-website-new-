import Footer from "@/components/layout/Footer";
import GlobalCoverage from "./GlobalCoverage";
import HeroSection from "./HeroSection";
import Navigation from "./Navigation";
import Testimonials from "./Testimonials";
import Faq from "./Faq";
import Services from "./Services";
import Core from "./Core";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      {/* <WhyChooseUs /> */}
      <Testimonials />
      <Services />
      <GlobalCoverage />
      <Faq />
      <Core />
      <Footer />
    </div>
  );
};

export default Home;
