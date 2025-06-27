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
  MapPin,
  Globe2,
  Menu,
  X,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

// Define types for navigation items
interface NavigationChildItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface NavigationItemBase {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  isCollapsible?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  children?: NavigationChildItem[];
  href?: string;
}

type NavigationItem =
  | (NavigationItemBase & { href: string }) // Non-collapsible items must have href
  | (NavigationItemBase & {
      // Collapsible items must have children
      isCollapsible: true;
      children: NavigationChildItem[];
    });

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function AdminSidebar({
  isCollapsed = false,
  onToggle,
}: AdminSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const location = useLocation();
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

  // Mobile menu button component
  const MobileMenuButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md rounded-xl p-2"
      onClick={() => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        onToggle?.();
      }}
    >
      {isMobileMenuOpen ? (
        <X className="w-5 h-5" />
      ) : (
        <Menu className="w-5 h-5" />
      )}
    </Button>
  );
  // Get user data from auth with fallback
  const { user, logout } = useAuth();
  // Safely access user properties with type assertion
  const [ordersOpen, setOrdersOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(true);

  // Country options for address section
  const countryOptions = [
    { code: "us", name: "United States" },
    { code: "uk", name: "United Kingdom" },
    { code: "cn", name: "China" },
    { code: "hk", name: "Hong Kong" },
    { code: "my", name: "Malaysia" },
    { code: "sg", name: "Singapore" },
    { code: "ca", name: "Canada" },
    { code: "ae", name: "Dubai" },
  ].map((country) => ({
    ...country,
    href: `/admin/address/${country.code}`,
  }));

  // Admin-specific navigation items
  const navigationItems: NavigationItem[] = [
    {
      name: "Overview",
      href: "/admin",
      icon: BarChart3,
    },
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
        },
        {
          name: "In Transit",
          href: "/admin/orders?status=in_transit",
          icon: Truck,
        },
        {
          name: "India",
          href: "/admin/orders?status=india",
          icon: Plane,
        },
        {
          name: "Dispatch",
          href: "/admin/orders?status=dispatch",
          icon: CheckCircle,
        },
      ],
    },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Track Packages", href: "/admin/track", icon: Search },
    { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
    {
      name: "Completed Transactions",
      href: "/admin/completed-transactions",
      icon: CheckCircle,
    },
    {
      name: "Address",
      icon: MapPin,
      isCollapsible: true,
      isOpen: addressOpen,
      onToggle: () => setAddressOpen(!addressOpen),
      children: countryOptions.map((country) => ({
        name: country.name,
        href: country.href,
        icon: Globe2,
      })),
    },
    {
      name: "Settings",
      icon: Settings,
      isCollapsible: true,
      isOpen: settingsOpen,
      onToggle: () => setSettingsOpen(!settingsOpen),
      children: [
        { name: "Security", href: "/admin/settings/security", icon: Shield },
        { name: "Insurance", href: "/admin/settings/insurance", icon: File },
        { name: "Terms", href: "/admin/settings/terms", icon: FileText },
      ],
    },
  ];

  // Check if the current location matches a given href
  const isActiveLink = (href: string) => {
    if (href === "/admin" && location.pathname === "/admin") {
      return true;
    }
    // Special handling for address routes to match exactly or with country code
    if (href.startsWith("/admin/address/")) {
      return (
        location.pathname === href ||
        (location.pathname.startsWith("/admin/address/") &&
          location.pathname.split("/").pop() === href.split("/").pop())
      );
    }
    return href !== "/admin" && location.pathname.startsWith(href);
  };

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
          "border-b border-gray-100",
          isMobileView ? "pl-2 pr-4 py-4" : "pl-4 pr-6 py-6"
        )}
      >
        <div className="flex items-center">
          {(!isCollapsed || isMobileView) && (
            <div className="w-full">
              <div className="flex items-center">
                <Link to="/">
                  <img
                    src="/e2.png"
                    alt="PARCELUP Logo"
                    className="h-10 w-auto -ml-2"
                  />
                </Link>
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
                    "flex items-center justify-between w-full px-4 py-3 rounded-2xl transition-all duration-200 group",
                    isCollapsed && !isMobileView && "justify-center"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
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
                    {item.children?.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={cn(
                          "flex items-center px-4 py-2.5 text-sm rounded-xl transition-all duration-200 group",
                          isActiveLink(child.href)
                            ? "text-blue-600 font-medium"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          {child.name === "Address" ? (
                            <span className="text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded-full border border-gray-200">
                              {child.href?.split("/").pop()?.toUpperCase()}
                            </span>
                          ) : (
                            <child.icon className="w-4 h-4" />
                          )}
                          <span>{child.name}</span>
                        </div>
                      </Link>
                    ))}
                  </CollapsibleContent>
                )}
              </Collapsible>
            ) : (
              <Link
                to={item.href || "#"}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
                  isActiveLink(item.href)
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(!isCollapsed || isMobileView) && (
                  <span className="font-semibold text-sm">{item.name}</span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center space-x-3 group cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200">
          <div className="relative">
            <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700">
              <AvatarFallback className="bg-transparent text-white font-bold">
                {user?.email ? user.email[0].toUpperCase() : ""}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          {(!isCollapsed || isMobileView) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.firstName + " " + user?.lastName || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate font-medium">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          )}
          {(!isCollapsed || isMobileView) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="p-2.5 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group-hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
            </Button>
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
    </>
  );
}
