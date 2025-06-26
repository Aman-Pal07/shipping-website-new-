import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Package,
  Users,
  Search,
  MapPin,
  CreditCard,
  Settings,
  Shield,
  FileText,
  File,
  LogOut,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Truck,
  Clock,
  Plane,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { AddressModal } from "../address/AddressModal";

// Define types for user and auth context
interface User {
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
}

interface AuthContext {
  user: User | null;
  logout: () => void;
  isAdmin: boolean;
}

// Define types for navigation items
interface NavChild {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface NavItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  isCollapsible?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  children?: NavChild[];
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isCollapsed = false }: SidebarProps) {
  const location = useLocation();
  const { user, logout, isAdmin, isLoading } = useAuth() as AuthContext & {
    isLoading?: boolean;
  };
  const [ordersOpen, setOrdersOpen] = useState<boolean>(true);
  const [packagesOpen, setPackagesOpen] = useState<boolean>(false);
  const [addressOpen, setAddressOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  // Country options for address dropdown
  const countryOptions = [
    { code: "us", name: "United States" },
    { code: "uk", name: "United Kingdom" },
    { code: "cn", name: "China" },
    { code: "hk", name: "Hong Kong" },
    { code: "my", name: "Malaysia" },
    { code: "sg", name: "Singapore" },
    { code: "ca", name: "Canada" },
    { code: "ae", name: "Dubai" },
  ];

  // Check screen size and update responsive states
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, isMobile]);

  const navigationItems: NavItem[] = isAdmin
    ? [
        { name: "Overview", href: "/admin", icon: BarChart3 },
        {
          name: "Orders",
          icon: Package,
          isCollapsible: true,
          isOpen: ordersOpen,
          onToggle: () => setOrdersOpen(!ordersOpen),
          children: [
            {
              name: "Waiting",
              href: "/admin/orders?status=waiting",
              icon: Clock,
              count: 12,
            },
            {
              name: "In Transit",
              href: "/admin/orders?status=in_transit",
              icon: Truck,
              count: 8,
            },
            {
              name: "India",
              href: "/admin/orders?status=india",
              icon: Plane,
              count: 5,
            },
            {
              name: "Dispatch",
              href: "/admin/orders?status=dispatch",
              icon: CheckCircle,
              count: 3,
            },
          ],
        },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Track Packages", href: "/admin/track", icon: Search },
        { name: "Address", href: "/admin/addresses", icon: MapPin },
        { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
        { name: "Settings", href: "/admin/settings", icon: Settings },
        { name: "Security", href: "/admin/security", icon: Shield },
        { name: "Insurance", href: "/admin/insurance", icon: File },
        { name: "Terms & Conditions", href: "/admin/terms", icon: FileText },
      ]
    : [
        { name: "Overview", href: "/dashboard", icon: BarChart3 },
        {
          name: "My Packages",
          icon: Package,
          isCollapsible: true,
          isOpen: packagesOpen,
          onToggle: () => setPackagesOpen(!packagesOpen),
          children: [
            {
              name: "Waiting",
              href: "/dashboard/packages?status=waiting",
              icon: Clock,
            },
            {
              name: "In Transit",
              href: "/dashboard/packages?status=in_transit",
              icon: Truck,
            },
            {
              name: "India",
              href: "/dashboard/packages?status=india",
              icon: Plane,
            },
            {
              name: "Dispatch",
              href: "/dashboard/packages?status=dispatch",
              icon: CheckCircle,
            },
          ],
        },
        { name: "Track Packages", href: "/dashboard/track", icon: Search },
        {
          name: "Address",
          icon: MapPin,
          isCollapsible: true,
          isOpen: addressOpen,
          onToggle: () => setAddressOpen(!addressOpen),
          children: countryOptions.map((country) => ({
            name: country.name,
            href: `/dashboard/address/${country.code.toLowerCase()}`,
            icon: MapPin,
          })),
        },
        {
          name: "Transactions",
          href: "/dashboard/transactions",
          icon: CreditCard,
        },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
        { name: "Terms & Conditions", href: "/terms", icon: FileText },
      ];

  const isActiveLink = (href: string): boolean => {
    if (href === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/"
      );
    }
    return location.pathname.startsWith(href);
  };

  const handleMobileToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Mobile Menu Button
  const MobileMenuButton = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleMobileToggle}
      className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow-lg rounded-lg border"
    >
      {isMobileMenuOpen ? (
        <X className="w-5 h-5" />
      ) : (
        <Menu className="w-5 h-5" />
      )}
    </Button>
  );

  // Sidebar Content Component
  const SidebarContent = ({
    isMobileView = false,
  }: {
    isMobileView?: boolean;
  }) => (
    <>
      {/* Logo/Brand */}
      <div
        className={cn(
          "border-b border-gray-50",
          isMobileView ? "pl-2 pr-4 py-4" : "pl-4 pr-6 py-6"
        )}
      >
        <div className="flex items-center">
          {(!isCollapsed || isMobileView) && (
            <div className="w-full">
              <div className="flex items-center">
                <img
                  src="/e2.png"
                  alt="PARCELUP Logo"
                  className="h-10 w-auto -ml-2"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav
        className={cn(
          "flex-1 space-y-2 overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent",
          isMobileView ? "p-3" : "p-4"
        )}
      >
        <style>{`
          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #e5e7eb;
            border-radius: 2px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #d1d5db;
          }
        `}</style>

        {navigationItems.map((item) => (
          <div key={item.name}>
            {item.isCollapsible ? (
              <Collapsible open={item.isOpen} onOpenChange={item.onToggle}>
                <CollapsibleTrigger
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group",
                    isCollapsed && !isMobileView && "justify-center"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-xl bg-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                    </div>
                    {(!isCollapsed || isMobileView) && (
                      <span className="font-semibold text-sm">{item.name}</span>
                    )}
                  </div>
                  {(!isCollapsed || isMobileView) &&
                    (item.isOpen ? (
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 transition-transform duration-200 text-gray-400" />
                    ))}
                </CollapsibleTrigger>
                {(!isCollapsed || isMobileView) && (
                  <CollapsibleContent className="ml-8 space-y-1 mt-2">
                    {item.name === "Address" ? (
                      <div className="space-y-1">
                        {item.children?.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={cn(
                              "flex items-center justify-between px-4 py-2.5 text-sm rounded-xl hover:bg-gray-50 transition-all duration-200 group relative",
                              isActiveLink(child.href)
                                ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25"
                                : "text-gray-600 hover:text-gray-900"
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-xs font-mono font-bold w-6 h-6 flex items-center justify-center bg-white/20 rounded-full">
                                {child.href?.split("/").pop()?.toUpperCase()}
                              </span>
                              <span className="font-semibold">
                                {child.name}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      item.children?.map((child) => (
                        <Link key={child.name} to={child.href}>
                          <div
                            className={cn(
                              "flex items-center justify-between px-4 py-2.5 text-sm rounded-xl hover:bg-gray-50 transition-all duration-200 group relative",
                              isActiveLink(child.href)
                                ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25"
                                : "text-gray-600 hover:text-gray-900"
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={cn(
                                  "w-2.5 h-2.5 rounded-full transition-all duration-200 shadow-sm",
                                  child.name === "Waiting" && "bg-amber-400",
                                  child.name === "In Transit" && "bg-blue-500",
                                  child.name === "India" && "bg-purple-500",
                                  child.name === "Dispatch" && "bg-emerald-500"
                                )}
                              />
                              <span className="font-semibold">
                                {child.name}
                              </span>
                            </div>
                            {child.count !== undefined && (
                              <span
                                className={cn(
                                  "text-xs px-2.5 py-1 rounded-full font-bold transition-all duration-200",
                                  isActiveLink(child.href)
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                                )}
                              >
                                {child.count}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))
                    )}
                  </CollapsibleContent>
                )}
              </Collapsible>
            ) : (
              <Link to={item.href ?? "#"}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative",
                    isActiveLink(item.href ?? "")
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    isCollapsed && !isMobileView && "justify-center"
                  )}
                >
                  <div
                    className={cn(
                      "p-1.5 rounded-xl transition-all duration-200",
                      isActiveLink(item.href ?? "")
                        ? "bg-white/20"
                        : "bg-gray-100 group-hover:bg-white group-hover:shadow-sm"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                  </div>
                  {(!isCollapsed || isMobileView) && (
                    <span className="font-semibold text-sm">{item.name}</span>
                  )}
                  {isActiveLink(item.href ?? "") && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                  )}
                </div>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div
        className={cn("border-t border-gray-50", isMobileView ? "p-3" : "p-4")}
      >
        <div
          className={cn(
            "flex items-center space-x-3 px-4 py-4 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all duration-200 group",
            isCollapsed && !isMobileView && "justify-center"
          )}
        >
          <div className="relative">
            <Avatar
              className={cn(
                "flex-shrink-0 shadow-md ring-2 ring-gray-100",
                isMobileView ? "w-10 h-10" : "w-11 h-11"
              )}
            >
              <AvatarFallback
                className={cn(
                  "bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold",
                  isMobileView ? "text-sm" : "text-base"
                )}
              >
                {user?.firstName && user?.lastName
                  ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                  : user?.username
                  ? user.username.slice(0, 2).toUpperCase()
                  : user?.email
                  ? user.email[0].toUpperCase()
                  : "US"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          {(!isCollapsed || isMobileView) && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {isLoading ? "Loading..." : user?.firstName || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate font-medium">
                  {isLoading ? "Loading..." : user?.email || "No email"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="p-2.5 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group-hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <MobileMenuButton />

      {/* Mobile Overlay */}
      {isMobileMenuOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex h-screen bg-white border-r border-gray-100 flex-col transition-all duration-300 ease-in-out shadow-sm",
          // Desktop breakpoint
          !isMobile && !isTablet && (isCollapsed ? "w-16" : "w-72"),
          // Tablet breakpoint
          isTablet && (isCollapsed ? "w-16" : "w-64")
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-100 flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent isMobileView />
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={!!selectedCountry}
        onClose={() => setSelectedCountry(null)}
        countryCode={selectedCountry || ""}
      />
    </>
  );
}
