import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize GTranslate widget
  useEffect(() => {
    // Set GTranslate settings
    (window as any).gtranslateSettings = {
      "default_language": "en",
      "detect_browser_language": true,
      "wrapper_selector": ".gtranslate_wrapper",
      "switcher_horizontal_position": "inline",
      "float_switcher_open_direction": "bottom",
      "flag_style": "3d"
    };

    // Load GTranslate script if not already loaded
    if (!document.querySelector('script[src*="gtranslate.net"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.gtranslate.net/widgets/latest/float.js';
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Translation Widget */}
      <div className="fixed top-4 right-4 z-50">
        <div className="gtranslate_wrapper"></div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <Sidebar user={user} onLogout={onLogout} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 z-50">
            <Sidebar user={user} onLogout={onLogout} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 pb-24 sm:pb-28 lg:pb-0">
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNav onMenuClick={() => setIsSidebarOpen(true)} />
      </div>
    </div>
  );
};

export default Layout;