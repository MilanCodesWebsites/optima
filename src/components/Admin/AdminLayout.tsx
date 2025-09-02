import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Users, LogOut, Menu, X, BarChart3 } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Users', href: '/admin/users', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col h-full bg-[#0f0f0f]/95 backdrop-blur-sm border-r border-slate-800/60 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800/60">
            <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/75903197-21b2-4fa6-a139-2405ad6d4ef7-Gemini_Generated_Image_wzjx3bwzjx3bwzjx.png" alt="Optima" className="h-8" />
            <div>
              <span className="text-xl font-bold text-white">Optima</span>
              <p className="text-xs text-red-400 font-medium">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${isActive(item.href)
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-6 border-t border-slate-700/50">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:shadow-md"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-slate-800/60 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/75903197-21b2-4fa6-a139-2405ad6d4ef7-Gemini_Generated_Image_wzjx3bwzjx3bwzjx.png" alt="Optima" className="h-6" />
            <div>
              <span className="text-lg font-bold text-white">Optima</span>
              <p className="text-xs text-red-400 font-medium">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw]">
            <div className="flex flex-col h-full bg-slate-800/95 backdrop-blur-sm border-r border-slate-700/50 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700/50">
                <div className="flex items-center">
                  <div className="p-2 bg-red-500/20 rounded-xl">
                    <Shield className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <span className="text-lg font-bold text-white">Optima</span>
                    <p className="text-xs text-red-400 font-medium">Admin Panel</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`
                        flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                        ${isActive(item.href)
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="px-3 py-4 border-t border-slate-700/50">
                <button
                  onClick={() => {
                    onLogout();
                    setIsSidebarOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;