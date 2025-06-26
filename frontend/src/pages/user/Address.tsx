import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  User,
  Building,
  Globe,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Globe2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddressType {
  country: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state: string;
  countryFull?: string;
  district?: string;
  pincode?: string;
  postcode?: string;
  phone: string;
}

const countryAddresses: Record<string, AddressType> = {
  sg: {
    country: "Singapore",
    firstName: "Nirbhay Aksh",
    lastName: "Client name",
    addressLine1: "DTDC Global Express Pte Ltd",
    addressLine2: "101 Kitchener Road, #01-31 Jalan Besar Plaza, Singapore",
    pincode: "208511",
    phone: "62948098",
    state: "Singapore",
  },
  my: {
    country: "Malaysia",
    firstName: "Nirbhay Aksh",
    lastName: "Client name",
    addressLine1: "No.32, Jalan Sepadu C/O World Asia",
    addressLine2: "25/123A, Seksyen 25",
    city: "Shah Alam",
    state: "Selangor",
    pincode: "40400",
    phone: "125318196",
  },
  hk: {
    country: "Hong Kong",
    firstName: "Nirbhay Aksh",
    lastName: "Client name",
    addressLine1: "3/F Unit 12 Kwai Cheong Centre",
    addressLine2: "50 Kwai Cheong Road",
    city: "Kwai Chung",
    state: "NT/New territory",
    countryFull: "Hong Kong SAR",
    pincode: "999077",
    phone: "+85252221152",
  },
  cn: {
    country: "China",
    firstName: "尼尔",
    lastName: "Aksh Client name",
    addressLine1: "深圳市宝安区西乡街道宝运达物流中心综合楼三栋612",
    district: "Baon",
    state: "Shenzen",
    postcode: "518102",
    phone: "18926097113",
  },
  uk: {
    country: "UK",
    firstName: "Nirbhay Aksh",
    lastName: "Client name",
    addressLine1: "Icc global",
    addressLine2: "Unit 25,Phoenix distribution park",
    city: "Heston",
    state: "Middlesex",
    countryFull: "UK",
    pincode: "TW5 9NB",
    phone: "7967170219",
  },
  us: {
    country: "US",
    firstName: "Nirbhay Aksh",
    lastName: "Client Name",
    addressLine1: "177-15 149th Rd",
    city: "Jamaica",
    state: "New York",
    pincode: "11434-6218",
    phone: "+1 (347) 445-5958",
  },
  ca: {
    country: "Canada",
    firstName: "Nirbhay Aksh",
    lastName: "Client Name",
    addressLine1: "First Flight Couriers",
    addressLine2: "2980 Drew road, Unit-135 Backside door",
    city: "Mississauga",
    state: "Ontario",
    postcode: "L4T 0A7",
    phone: "+1 (647) 510-8547",
  },
  ae: {
    country: "UAE",
    firstName: "Nirbhay Aksh",
    lastName: "Client Name",
    addressLine1: "27, Al Habtoor Warehouse, AL Quasis",
    addressLine2: "Dubai DU United Arab Emirates",
    city: "Dubai",
    state: "Dubai",
    postcode: "123-45",
    phone: "+971 567869027",
  },
};

type CountryCode = keyof typeof countryAddresses;

interface AddressProps {
  isAdmin?: boolean;
}

const Address = ({ isAdmin = false }: AddressProps) => {
  const { countryCode = "us" } = useParams<{ countryCode?: string }>();
  const navigate = useNavigate();
  const [currentAddress, setCurrentAddress] = useState<AddressType | null>(
    null
  );
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const { user } = useAuth();

  // Get country name from code
  const getCountryName = (code: string) => {
    return countryAddresses[code as CountryCode]?.country || code.toUpperCase();
  };

  // Handle country selection
  const handleCountrySelect = (code: CountryCode) => {
    const basePath = isAdmin ? "/admin" : "/dashboard";
    navigate(`${basePath}/address/${code}`);
    setIsCountryDropdownOpen(false);
  };

  // Update address when country code changes
  useEffect(() => {
    if (countryCode && countryAddresses[countryCode as CountryCode]) {
      setCurrentAddress(countryAddresses[countryCode as CountryCode]);
    } else {
      // Default to US address if country code is invalid
      const basePath = isAdmin ? "/admin" : "/dashboard";
      navigate(`${basePath}/address/us`, { replace: true });
    }
  }, [countryCode, navigate, isAdmin]);

  if (!currentAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600 font-medium">
            Loading address...
          </p>
        </div>
      </div>
    );
  }

  // Country options for dropdown
  const countryOptions = [
    { code: "sg", name: "Singapore" },
    { code: "my", name: "Malaysia" },
    { code: "hk", name: "Hong Kong" },
    { code: "cn", name: "China" },
    { code: "uk", name: "United Kingdom" },
    { code: "us", name: "United States" },
    { code: "ca", name: "Canada" },
    { code: "ae", name: "Dubai, UAE" },
  ];

  const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      sg: "🇸🇬",
      my: "🇲🇾",
      hk: "🇭🇰",
      cn: "🇨🇳",
      uk: "🇬🇧",
      us: "🇺🇸",
      ca: "🇨🇦",
      ae: "🇦🇪",
    };
    return flags[countryCode] || "🌍";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Address Book</h1>
          <DropdownMenu
            open={isCountryDropdownOpen}
            onOpenChange={setIsCountryDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Globe2 className="h-4 w-4" />
                <span>{getCountryName(countryCode as CountryCode)}</span>
                {isCountryDropdownOpen ? (
                  <ChevronUp className="h-4 w-4 ml-1 opacity-50" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] bg-white">
              {countryOptions.map((country) => (
                <DropdownMenuItem
                  key={country.code}
                  onClick={() =>
                    handleCountrySelect(country.code as CountryCode)
                  }
                  className={`flex items-center gap-2 cursor-pointer ${
                    countryCode === country.code ? "bg-accent" : ""
                  }`}
                >
                  <span className="text-lg">
                    {getCountryFlag(country.code)}
                  </span>
                  <span>{country.name}</span>
                  {countryCode === country.code && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Shipment Notice */}
        {(countryCode === 'cn' || countryCode === 'ca') && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-bold">Important:</span> IT IS NECESSARY TO UPLOAD TRACKING IDS FOR {countryCode === 'cn' ? 'CHINA' : 'CANADA'} SHIPMENTS. WITHOUT SHARING THE TRACKING ID, THE SHIPMENT WON'T ARRIVE TO INDIA
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-sm transform transition-all duration-300 hover:shadow-3xl">
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Personal Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      First Name
                    </p>
                    <p className="text-lg font-semibold text-gray-800 bg-white rounded-lg px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md">
                      {currentAddress.firstName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Last Name
                    </p>
                    <p className="text-lg font-semibold text-gray-800 bg-white rounded-lg px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md">
                      {user?.firstName || currentAddress.lastName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Address Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg px-4 py-3 shadow-sm space-y-1 transition-all duration-200 hover:shadow-md">
                      <p className="text-md text-gray-600">
                        Address Line 1: {currentAddress.addressLine1}
                      </p>
                      {currentAddress.addressLine2 && (
                        <p className="text-md text-gray-600">
                          Address Line 2: {currentAddress.addressLine2}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentAddress.city && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          City
                        </p>
                        <p className="text-md font-semibold text-gray-800 bg-white rounded-lg px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md">
                          {currentAddress.city}
                        </p>
                      </div>
                    )}

                    {currentAddress.district && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          District
                        </p>
                        <p className="text-md font-semibold text-gray-800 bg-white rounded-lg px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md">
                          {currentAddress.district}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        {currentAddress.country === "US"
                          ? "State"
                          : "State/Province"}
                      </p>
                      <p className="text-md font-semibold text-gray-800 bg-white rounded-lg px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md">
                        {currentAddress.state}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentAddress.countryFull && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          Country
                        </p>
                        <p className="text-md font-semibold text-gray-800 bg-white rounded-lg px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md">
                          {currentAddress.countryFull}
                        </p>
                      </div>
                    )}

                    {(currentAddress.pincode || currentAddress.postcode) && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          {currentAddress.country === "UK" ||
                          currentAddress.country === "US"
                            ? "Postcode"
                            : "Pincode"}
                        </p>
                        <p className="text-md font-semibold text-gray-800 bg-white rounded-lg px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md">
                          {currentAddress.pincode || currentAddress.postcode}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Contact Information
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Phone Number
                  </p>
                  <p className="text-lg font-semibold text-gray-800 bg-white rounded-lg px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md">
                    {currentAddress.phone}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Address;
