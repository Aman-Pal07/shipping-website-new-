import React, { useState } from "react";
import { FileText, Save, Clock } from "lucide-react";

// Sample terms content
const initialTerms = {
  termsOfService: `# Terms of Service

## Introduction
Welcome to Package Tracker. These Terms of Service govern your use of our website, services, and applications (collectively, the "Services"). By using our Services, you agree to these terms.

Please read these Terms carefully. If you do not agree with these Terms, you should not use our Services.

## Account Registration
To use certain features of our Services, you may need to register for an account. When you register, you agree to provide accurate, current, and complete information about yourself.

You are responsible for safeguarding your account credentials and for any activity that occurs under your account. You must notify us immediately of any unauthorized use of your account.

We reserve the right to disable any user account if, in our opinion, you have violated any provision of these Terms.

## Shipping and Tracking Services
Our Services provide tracking information for packages shipped through our partners. While we strive to provide accurate and timely information, we cannot guarantee the accuracy of tracking data provided by third-party carriers.

Shipping rates, delivery times, and other service details are subject to change without notice. We are not responsible for delays, damages, or losses that occur during shipping.

For international shipments, you are responsible for complying with all customs regulations and paying any applicable duties, taxes, or fees.`,

  privacyPolicy: `# Privacy Policy

## Information We Collect
We collect information you provide directly to us when you create an account, use our Services, or communicate with us. This may include your name, email address, phone number, shipping address, and payment information.

We also automatically collect certain information about your device and how you interact with our Services, including your IP address, browser type, operating system, and usage data.

## How We Use Your Information
We use the information we collect to provide, maintain, and improve our Services, process transactions, send you technical notices and support messages, and respond to your comments and questions.

We may also use your information to send you marketing communications, develop new products and services, and personalize your experience.

## Sharing Your Information
We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, and customer service.

We may also share information when required by law, to protect our rights, or in connection with a business transfer such as a merger or acquisition.`,

  refundPolicy: `# Refund Policy

## Shipping Services
For shipping services, refunds may be issued in the following circumstances:
- The package was lost during transit
- The package was damaged during transit (subject to inspection)
- The service was not provided as described

Refund requests must be submitted within 30 days of the shipping date. Processing time for refunds is typically 7-10 business days.

## Insurance Claims
For insurance claims, please refer to our Insurance Policy for detailed information on coverage, claim procedures, and processing times.

## Payment Processing
Refunds for payment processing errors will be issued promptly upon verification. Please contact our customer support team with the transaction details to initiate the refund process.`,
};

export default function Terms() {
  const [activeTab, setActiveTab] = useState("termsOfService");
  const [terms, setTerms] = useState(initialTerms);
  const [editedContent, setEditedContent] = useState(
    initialTerms[activeTab as keyof typeof initialTerms]
  );
  const [lastUpdated, setLastUpdated] = useState({
    termsOfService: "2025-05-01",
    privacyPolicy: "2025-05-01",
    refundPolicy: "2025-05-15",
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setEditedContent(terms[tab as keyof typeof terms]);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };

  const handleSave = () => {
    setTerms({
      ...terms,
      [activeTab]: editedContent,
    });

    setLastUpdated({
      ...lastUpdated,
      [activeTab]: new Date().toISOString().split("T")[0],
    });

    alert("Content saved successfully!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Terms & Policies</h1>

      <div className=" border border-border rounded-lg shadow-sm">
        <div className="p-6 border-b border-border">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-primary mr-3" />
            <h2 className="text-lg font-semibold">Manage Legal Documents</h2>
          </div>
          <p className="text-muted-foreground mt-2">
            Update your website's legal documents and policies
          </p>
        </div>

        <div className="flex border-b border-border">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "termsOfService"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleTabChange("termsOfService")}
          >
            Terms of Service
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "privacyPolicy"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleTabChange("privacyPolicy")}
          >
            Privacy Policy
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "refundPolicy"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleTabChange("refundPolicy")}
          >
            Refund Policy
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>
                Last updated:{" "}
                {lastUpdated[activeTab as keyof typeof lastUpdated]}
              </span>
            </div>
            <button
              className="flex items-center bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary/90"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save Changes
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Use Markdown format for styling. Changes will be published
              immediately after saving.
            </p>
          </div>

          <textarea
            className="w-full h-[500px] border border-input rounded-md p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary "
            value={editedContent}
            onChange={handleContentChange}
          ></textarea>

          <div className="mt-6 bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Publishing Options</h3>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="notify-users"
                className="w-4 h-4 text-primary focus:ring-primary rounded"
              />
              <label htmlFor="notify-users" className="ml-2 text-sm">
                Notify users about policy changes via email
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="require-acceptance"
                className="w-4 h-4 text-primary focus:ring-primary rounded"
              />
              <label htmlFor="require-acceptance" className="ml-2 text-sm">
                Require users to accept new terms upon next login
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
