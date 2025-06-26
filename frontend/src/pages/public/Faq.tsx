import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const Faq = () => {
  const [openItem, setOpenItem] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "How do I track my shipment?",
      answer:
        "You can track your shipment through our platform dashboard or by using the tracking number provided in your email confirmation. Simply enter your tracking number on our tracking page for real-time updates on your package's location and delivery status.",
    },
    {
      id: 2,
      question: "What are our delivery timeframes?",
      answer:
        "Delivery timeframes vary based on your chosen courier partner and destination. Standard delivery typically takes 2-5 business days* for domestic shipments, while international deliveries can take 5-15 business days* . Express and priority options are available for faster delivery.",
    },
    {
      id: 3,
      question: "How do I calculate shipping costs?",
      answer:
        "Shipping costs are calculated based on package dimensions, weight, destination, and selected courier service.",
    },
    {
      id: 4,
      question: "Do you ship internationally?",
      answer:
        "Yes, we offer international shipping to over 200+ countries worldwide through our global network of courier partners. International shipments include customs documentation support and duty/tax calculation assistance.",
    },
    {
      id: 5,
      question: "What items are prohibited for shipping?",
      answer:
        "Prohibited items include hazardous materials, illegal substances, perishable goods without proper packaging, weapons, and items restricted by destination country laws. Check our complete prohibited items list in your dashboard before shipping.",
    },
    {
      id: 6,
      question: "How do I report a damaged or missing package?",
      answer:
        "If your package is damaged or missing, contact our 24/7 support team immediately through the dashboard or email. We'll initiate an investigation with the courier partner and provide appropriate updates regarding the same ",
    },
  ];

  const toggleItem = (id: any) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div
      id="faqs"
      className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen mb-36"
    >
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
            <HelpCircle className="h-6 w-6 text-white" />
          </div>
          <span className="ml-3 text-blue-600 font-semibold tracking-wide uppercase text-sm">
            Frequently Asked Questions
          </span>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Common Shipping Questions
        </h1>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Find answers to our most commonly asked questions about our shipping
          services and policies.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors duration-200 hover:bg-gray-50"
            >
              <span className="text-gray-900 font-semibold text-lg pr-4">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                  openItem === item.id ? "transform rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`transition-all duration-300 ease-in-out ${
                openItem === item.id
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="px-6 pb-5">
                <div className="h-px bg-gradient-to-r from-blue-200 to-purple-200 mb-4"></div>
                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All FAQs Button */}
      {/* <div className="text-center mt-12">
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          <div className="flex items-center space-x-2">
            <span>View all FAQs</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>
      </div> */}

      {/* Contact Support Section */}
      {/* <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our 24/7 support team is here to help you with any shipping inquiries or technical assistance you may need.
          </p>
          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors duration-300">
            Contact Support
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Faq;
