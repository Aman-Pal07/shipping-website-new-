import Footer from "@/components/layout/Footer";
import GlobalCoverage from "./GlobalCoverage";
import HeroSection from "./HeroSection";
import Navigation from "./Navigation";
import Testimonials from "./Testimonials";
import WhyChooseUs from "./WhyChooseUs";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      {/* <WhyChooseUs /> */}
      <Testimonials />
      <GlobalCoverage />
      <Footer />
    </div>
  );
};

export default Home;
