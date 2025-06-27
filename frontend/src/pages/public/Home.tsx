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
    <div className="w-full min-h-screen bg-white flex flex-col">
      <Navigation />
      <main className="flex-1 w-full overflow-x-hidden">
        <HeroSection />
        <Testimonials />
        <Services />
        <Core />
        <GlobalCoverage />
        <Faq />
        <div className="mb-0">
          <Reviews />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
