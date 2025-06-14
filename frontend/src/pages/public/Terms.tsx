import { motion } from "framer-motion";
import {
  Shield,
  Package,
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  Truck,
  CheckCircle,
  Users,
  Scale,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const sections = [
    {
      id: "services",
      title: "Services Provided",
      icon: Package,
      content:
        "We provide shipping and logistics services to our customers. Our services include, but are not limited to, transportation, packaging, warehousing, customs clearance, and documentation. We reserve the right to change or discontinue any part of our services at any time without notice.",
    },
    {
      id: "responsibilities",
      title: "Customer Responsibilities",
      icon: Users,
      content:
        "It is the customer's responsibility to provide accurate information regarding the shipment, including but not limited to, the contents, weight, and dimensions of the package. The customer is also responsible for properly packaging the shipment and providing any necessary documentation. Customer has to declare the correct value of the shipment to us and also agree to submit KYC documents in order for us to process the shipments. Customer is also liable to pay all the custom duties concerning the shipment.",
    },
    {
      id: "prohibited",
      title: "Prohibited Items",
      icon: AlertTriangle,
      content:
        "We do not allow the shipment of prohibited items, which include but are not limited to, hazardous materials, illegal substances, weapons, and live animals. We reserve the right to refuse any shipment that contains prohibited items.",
    },
    {
      id: "delivery",
      title: "Delivery Times",
      icon: Clock,
      content:
        "We do our best to ensure timely delivery of shipments. However, we cannot guarantee delivery times due to factors outside of our control, such as weather conditions, customs delays, and transportation issues.",
    },
    {
      id: "liability",
      title: "Liability",
      icon: Shield,
      content:
        "Our liability for any loss or damage to a shipment is limited to the lesser of the actual value of the shipment or the declared value of the shipment. We are not liable for any indirect, consequential, or special damages.",
    },
    {
      id: "insurance",
      title: "Insurance",
      icon: FileText,
      content:
        "We offer insurance options for shipments. It is the customer's responsibility to declare the value of the shipment and purchase appropriate insurance coverage.",
    },
    {
      id: "payment",
      title: "Payment",
      icon: DollarSign,
      content:
        "Payment for our services is due at the time of shipment. We accept various forms of payment, including credit cards, checks, and wire transfers.",
    },
    {
      id: "termination",
      title: "Termination",
      icon: FileText,
      content:
        "We reserve the right to terminate our services at any time and for any reason. The customer may also terminate our services at any time by providing written notice.",
    },
    {
      id: "governing",
      title: "Governing Law",
      icon: Scale,
      content:
        "These terms and conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which we are located.",
    },
    {
      id: "amendments",
      title: "Amendments",
      icon: FileText,
      content:
        "We reserve the right to amend these terms and conditions at any time without notice. It is the customer's responsibility to review these terms and conditions regularly.",
    },
  ];

  const courierPartners = [
    "Delhivery",
    "DTDC",
    "Ekart",
    "Bluedart",
    "Shree Tirupati",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <motion.div
          className="max-w-6xl mx-auto px-6 py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Please read these terms and conditions carefully before using our
              shipping and logistics services.
            </p>
          </motion.div>

          {/* Terms Sections */}
          <motion.div className="grid gap-8 mb-16" variants={containerVariants}>
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <motion.div key={section.id} variants={itemVariants}>
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                      <CardTitle className="flex items-center gap-4 text-xl font-semibold text-gray-800">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl">{section.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Shipping Partners Section */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <CardTitle className="flex items-center gap-4 text-xl font-semibold text-gray-800">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">Domestic Shipping</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    We provide a range of various courier partners associated
                    with us for domestic shipping. Customers are bound to bear
                    domestic shipping charges as additional charges and not to
                    be covered in our kg rates.
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Our Courier Partners:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {courierPartners.map((partner, index) => (
                        <motion.div
                          key={partner}
                          className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="font-medium text-gray-700">
                            {index + 1}. {partner}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Important Note:
                    </h4>
                    <p className="text-amber-700 leading-relaxed">
                      All weight charged for domestic shipping is strictly{" "}
                      <strong>Volumetric or Actual, whichever is higher</strong>
                      .
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Agreement Section */}
          <motion.div className="mt-16 text-center" variants={itemVariants}>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Agreement</h3>
              <p className="text-blue-100 text-lg leading-relaxed max-w-3xl mx-auto">
                By using our services, you acknowledge that you have read and
                agree to these terms and conditions.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
