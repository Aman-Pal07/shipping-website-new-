import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string; // Add this line
}

export default function AdminLayout({
  isCollapsed = false,
  onToggle,
}: AdminSidebarProps) {
  return (
    <div className="flex flex-col sm:flex-row h-screen overflow-hidden bg-gray-50 ">
      {/* Admin Sidebar */}
      <AdminSidebar isCollapsed={isCollapsed} onToggle={onToggle} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b border-gray-200/60 z-10 relative">
          <div className="pl-16 pr-4 sm:px-6 py-4 sm:py-[24px] flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <NotificationBell />
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
