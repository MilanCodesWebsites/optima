import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, History, Menu, Settings } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillTransfer, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';

interface MobileNavProps {
  onMenuClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onMenuClick }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Deposit', href: '/deposit', icon: 'deposit' },
    { name: 'Withdraw', href: '/withdraw', icon: 'withdraw' },
    { name: 'Transactions', href: '/transactions', icon: History },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-lg border-t border-slate-700 safe-area-pb z-50">
      <div className="flex items-center justify-around py-3 px-2">
        {navigation.map((item) => {
          const renderIcon = () => {
            if (item.icon === 'deposit') {
              return <FontAwesomeIcon icon={faMoneyBillTransfer} className="w-5 h-5 mb-1" />;
            } else if (item.icon === 'withdraw') {
              return <FontAwesomeIcon icon={faHandHoldingDollar} className="w-5 h-5 mb-1" />;
            } else {
              const Icon = item.icon;
              return <Icon className="w-5 h-5 mb-1" />;
            }
          };

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 min-h-[60px] justify-center
                ${isActive(item.href)
                  ? 'text-neon-green bg-neon-green/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }
              `}
            >
              {renderIcon()}
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center py-2 px-3 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-xl transition-all duration-200 min-h-[60px] justify-center"
        >
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Menu</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;