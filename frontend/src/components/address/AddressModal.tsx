import { Button } from "../ui/button";
import { Copy, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";

interface AddressDetails {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  phone: string;
  district?: string;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryCode: string;
}

const addressData: Record<string, AddressDetails> = {
  us: {
    firstName: "Nirbhay Aksh",
    lastName: "Client Name",
    addressLine1: "177-15 149th Rd",
    city: "Jamaica",
    state: "New York",
    postcode: "11434-6218",
    phone: "+1 (347) 445-5958",
    country: "United States",
  },
  uk: {
    firstName: "Nirbhay Aksh",
    lastName: "Client name",
    addressLine1: "Icc global",
    addressLine2: "Unit 25, Phoenix distribution park",
    city: "Heston",
    state: "Middlesex",
    country: "UK",
    postcode: "TW5 9NB",
    phone: "7967170219",
  },
  cn: {
    firstName: "尼尔",
    lastName: "Aksh Client name",
    addressLine1: "深圳市宝安区西乡街道宝运达物流中心综合楼三栋612",
    city: "Shenzhen",
    state: "Shenzhen",
    district: "Baoan",
    postcode: "518102",
    phone: "18926097113",
    country: "China",
  },
  hk: {
    firstName: "Nirbhay Aksh",
    lastName: "Client name",
    addressLine1: "3/F Unit 12 Kwai Cheong Centre",
    addressLine2: "50 Kwai Cheong Road",
    city: "Kwai Chung",
    state: "NT/New territory",
    country: "Hong Kong SAR",
    postcode: "999077",
    phone: "+85252221152",
  },
  my: {
    firstName: "Nirbhay Aksh",
    lastName: "Client name",
    addressLine1: "No.32, Jalan Sepadu C/O World Asia",
    addressLine2: "25/123A, Seksyen 25",
    city: "Shah Alam",
    state: "Selangor",
    country: "Malaysia",
    postcode: "40400",
    phone: "125318196",
  },
  sg: {
    firstName: "Nirbhay Aksh",
    lastName: "Client name",
    addressLine1: "DTDC Global Express Pte Ltd",
    addressLine2: "101 Kitchener Road, #01-31 Jalan Besar Plaza, Singapore",
    city: "Singapore",
    state: "Singapore",
    country: "Singapore",
    postcode: "208511",
    phone: "62948098",
  },
};

export function AddressModal({
  isOpen,
  onClose,
  countryCode,
}: AddressModalProps) {
  if (!isOpen) return null;
  const { user } = useAuth();

  const address = addressData[countryCode.toLowerCase()];
  if (!address) return null;

  // Use the first name from the user data if available, otherwise fall back to the default
  const displayLastName = user?.firstName || "Client";

  const formatAddress = () => {
    return `First name: ${address.firstName}
Last name: ${displayLastName}
Address: ${address.addressLine1}${
      address.addressLine2 ? `\n${address.addressLine2}` : ""
    }
City: ${address.city}
${address.district ? `District: ${address.district}\n` : ""}State: ${
      address.state
    }
${address.country ? `Country: ${address.country}\n` : ""}Postcode: ${
      address.postcode
    }
Phone: ${address.phone}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatAddress());
      alert("Address copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy address");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            {address.country.toUpperCase()} Address
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm whitespace-pre-line">
            {formatAddress()
              .split("\n")
              .map((line, i) => (
                <div key={i} className="mb-1">
                  {line}
                </div>
              ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={copyToClipboard}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Copy className="w-4 h-4" />
            Copy Address
          </Button>
        </div>
      </div>
    </div>
  );
}
