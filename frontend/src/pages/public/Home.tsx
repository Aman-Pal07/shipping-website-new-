import Footer from "@/components/layout/Footer";
import GlobalCoverage from "./GlobalCoverage";
import HeroSection from "./HeroSection";
import Navigation from "./Navigation";
import Testimonials from "./Testimonials";
import Faq from "./Faq";
import Services from "./Services";
import Core from "./Core";
import Reviews from "./Reviews";

const Home = () => {
  return (
    <div className="w-screen min-h-screen bg-white overflow-x-hidden flex flex-col">
      <div className="w-full flex-1 flex flex-col">
        <Navigation />
        <main className="flex-1">
          <HeroSection />
          {/* <WhyChooseUs /> */}
          <Core />
          <Testimonials />
          <Services />
          <GlobalCoverage />
          <Faq />
          <div className="mb-0">
            <Reviews />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
