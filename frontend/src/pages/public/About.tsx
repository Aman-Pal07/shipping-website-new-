import { AnimateOnScroll } from "../../components/animations/AnimateOnScroll";
import Navigation from "./Navigation";

export default function About() {
  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-12 mt-14">
        {/* Hero Section */}
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About Parcel Up
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner in international shipping and package
              tracking
            </p>
          </div>
        </AnimateOnScroll>

        {/* Our Mission Section */}
        <AnimateOnScroll delay={0.2}>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-6 text-primary">
              Our Mission
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                At Parcel Up, our mission is to simplify international shipping
                and provide transparent, reliable tracking for all your
                packages. We believe in making global commerce accessible to
                everyone by removing the complexity and uncertainty from
                international shipping.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We strive to provide exceptional service, innovative solutions,
                and peace of mind to our customers, whether they're shipping a
                single package or managing bulk shipments.
              </p>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Why Choose Us Section */}
        <AnimateOnScroll delay={0.4}>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-8 text-center border border-blue-200/50 dark:border-blue-800/50 mb-16">
            <h2 className="text-3xl font-semibold mb-8 text-primary">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center text-left">
                <span className="text-primary text-2xl mr-4 flex-shrink-0">
                  ✓
                </span>
                <span className="text-lg">
                  Real-time tracking with accurate updates
                </span>
              </div>
              <div className="flex items-center text-left">
                <span className="text-primary text-2xl mr-4 flex-shrink-0">
                  ✓
                </span>
                <span className="text-lg">
                  Competitive rates for international shipping
                </span>
              </div>
              <div className="flex items-center text-left">
                <span className="text-primary text-2xl mr-4 flex-shrink-0">
                  ✓
                </span>
                <span className="text-lg">Dedicated customer support team</span>
              </div>
              <div className="flex items-center text-left">
                <span className="text-primary text-2xl mr-4 flex-shrink-0">
                  ✓
                </span>
                <span className="text-lg">Secure packaging and handling</span>
              </div>
              <div className="flex items-center text-left">
                <span className="text-primary text-2xl mr-4 flex-shrink-0">
                  ✓
                </span>
                <span className="text-lg">Affordable warehousing services</span>
              </div>
              <div className="flex items-center text-left">
                <span className="text-primary text-2xl mr-4 flex-shrink-0">
                  ✓
                </span>
                <span className="text-lg">Customs clearance assistance</span>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.6}>
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-semibold mb-8 text-primary">
              Our Story
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Parcel Up was founded in 2021 by a team of logistics
                professionals who saw the need for a more transparent and
                customer-friendly approach to international shipping. After
                experiencing the frustrations of lost packages, delayed
                shipments, and poor communication firsthand, our founders
                decided to create a solution.
              </p>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Starting with a small office in Delhi, we've grown to serve
                thousands of customers across India, providing reliable tracking
                and shipping services for packages of all sizes. Our commitment
                to innovation has led us to develop proprietary tracking
                technology that offers unprecedented visibility into the
                shipping process.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Today, Parcel Up is a trusted name in international logistics,
                known for our reliability, customer service, and technological
                innovation. We continue to expand our services and reach, always
                with the goal of making international shipping simpler and more
                accessible for everyone.
              </p>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.8}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center shadow-lg">
              <div className="text-5xl font-bold mb-3">1000+</div>
              <div className="text-blue-100 text-lg">
                Packages Delivered Monthly
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl p-8 text-center shadow-lg">
              <div className="text-5xl font-bold mb-3">98%</div>
              <div className="text-purple-100 text-lg">
                Customer Satisfaction
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-600 to-orange-500 text-white rounded-xl p-8 text-center shadow-lg">
              <div className="text-5xl font-bold mb-3">10+</div>
              <div className="text-pink-100 text-lg">Countries Served</div>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={1}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12 text-center text-white shadow-xl">
            <h2 className="text-3xl font-semibold mb-4">
              Ready to ship with us?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Experience the difference with Parcel Up. Create an account today
              and join thousands of satisfied customers who trust us with their
              international shipping needs.
            </p>
            <a href="/register">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
                Get Started
              </button>
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
