import { AnimateOnScroll } from "../../components/animations/AnimateOnScroll";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <AnimateOnScroll>
        <h1 className="text-4xl font-bold mb-8 text-center">
          About Package Tracker
        </h1>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <AnimateOnScroll delay={0.2}>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              At Package Tracker, our mission is to simplify international
              shipping and provide transparent, reliable tracking for all your
              packages. We believe in making global commerce accessible to
              everyone by removing the complexity and uncertainty from
              international shipping.
            </p>
            <p className="text-muted-foreground">
              We strive to provide exceptional service, innovative solutions,
              and peace of mind to our customers, whether they're shipping a
              single package or managing bulk shipments.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.4}>
          <div className="bg-muted rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Real-time tracking with accurate updates</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Competitive rates for international shipping</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Dedicated customer support team</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Secure packaging and handling</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Insurance options for valuable items</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Customs clearance assistance</span>
              </li>
            </ul>
          </div>
        </AnimateOnScroll>
      </div>

      <AnimateOnScroll delay={0.6}>
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Our Story</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground mb-4">
              Package Tracker was founded in 2018 by a team of logistics
              professionals who saw the need for a more transparent and
              customer-friendly approach to international shipping. After
              experiencing the frustrations of lost packages, delayed shipments,
              and poor communication firsthand, our founders decided to create a
              solution.
            </p>
            <p className="text-muted-foreground mb-4">
              Starting with a small office in Mumbai, we've grown to serve
              thousands of customers across India, providing reliable tracking
              and shipping services for packages of all sizes. Our commitment to
              innovation has led us to develop proprietary tracking technology
              that offers unprecedented visibility into the shipping process.
            </p>
            <p className="text-muted-foreground">
              Today, Package Tracker is a trusted name in international
              logistics, known for our reliability, customer service, and
              technological innovation. We continue to expand our services and
              reach, always with the goal of making international shipping
              simpler and more accessible for everyone.
            </p>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll delay={0.8}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className=" border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">5000+</div>
            <div className="text-muted-foreground">
              Packages Delivered Monthly
            </div>
          </div>
          <div className=" border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">Customer Satisfaction</div>
          </div>
          <div className=" border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Countries Served</div>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll delay={1}>
        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Ready to ship with us?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Experience the difference with Package Tracker. Create an account
            today and join thousands of satisfied customers who trust us with
            their international shipping needs.
          </p>
          <button className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
            Get Started
          </button>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
