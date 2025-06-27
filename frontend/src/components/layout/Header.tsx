import { Button } from "../ui/button";

import { Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  return (
    <header className="relative bg-white border-b border-slate-100 overflow-hidden">
      {/* Modern gradient background accent */}

      <div className="relative px-2 py-[26px]">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden hover:bg-blue-50 transition-colors duration-200"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </Button>

            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  {title}
                </h1>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse"></div>
              </div>
              {subtitle && (
                <p className="text-slate-600 font-medium text-sm tracking-wide">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
