import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Determine the title based on the current path
  const getTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    if (path === "/about") return "About Us";
    if (path === "/terms") return "Terms & Conditions";
    if (path === "/login") return "Login";
    if (path === "/register") return "Register";
    if (path === "/verify-email") return "Email Verification";
    if (path === "/track") return "Track Package";
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/admin")) return "Admin Panel";
    return "Parcel Up";
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <Header
          title={getTitle()}
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
