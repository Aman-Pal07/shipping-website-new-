import { useState } from "react";
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
}: AdminSidebarProps) {
  const location = useLocation();
  // Get user data from auth with fallback
  const { user, logout } = useAuth();
  // Safely access user properties with type assertion
  const userEmail = user?.email || "admin@example.com";
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
  ].map(country => ({
    ...country,
    href: `/admin/address/${country.code}`
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
      return location.pathname === href || 
             (location.pathname.startsWith("/admin/address/") && 
              location.pathname.split('/').pop() === href.split('/').pop());
    }
    return href !== "/admin" && location.pathname.startsWith(href);
  };

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out shadow-sm",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Logo/Brand */}
      <div
        className={cn("border-b border-gray-50", isCollapsed ? "p-4" : "p-6")}
      >
        <div className="flex items-center">
          {!isCollapsed && (
            <div className="w-full">
              <div className="flex items-center">
                <img
                  src="/e2.png"
                  alt="PARCELUP Logo"
                  className="h-10 w-auto"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
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
                    isCollapsed && "justify-center"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-105 transition-transform duration-200" />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{item.name}</span>
                    )}
                  </div>
                  {!isCollapsed &&
                    (item.isOpen ? (
                      <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                    ))}
                </CollapsibleTrigger>
                {!isCollapsed && item.children && (
                  <CollapsibleContent className="ml-8 space-y-1 mt-2">
                    {item.name === "Address" ? (
                      <div className="space-y-1">
                        {item.children.map((child) => (
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
                      item.children.map((child) => (
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
              <Link to={item.href}>
                <div
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group",
                    isActiveLink(item.href) && "text-blue-600 bg-blue-50",
                    isCollapsed && "justify-center"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-105 transition-transform duration-200" />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{item.name}</span>
                    )}
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-white shadow">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                {user?.firstName && user?.lastName
                  ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                  : user?.email[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName ?? "Anonymous"}
                </p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full"
              onClick={logout}
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
