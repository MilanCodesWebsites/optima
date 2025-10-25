import React from 'react';
import { Crown, Sparkles, Zap, TrendingUp } from 'lucide-react';

const PremiumCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-neon-green/10 border-2 border-neon-green/30 rounded-2xl p-4 sm:p-6 mb-6 animate-fade-in relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-neon-green/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-xl border border-yellow-400/30">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                I~2 Trading Software Active
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-neon-green animate-pulse" />
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1">Premium Luxury Mode Enabled</p>
            </div>
          </div>
          <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-neon-green/20 border border-neon-green/30 rounded-full">
            <span className="text-xs font-semibold text-neon-green uppercase tracking-wide">Verified</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 sm:mb-6">
          You're currently trading in <span className="font-semibold text-white">Premium Luxury mode</span>. 
          Enjoy enhanced analytics, faster withdrawals, priority support, and an elevated trading experience 
          with cutting-edge AI-powered insights.
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-medium text-white">Priority Withdrawals</span>
            </div>
            <p className="text-xs text-slate-400">Same-day processing</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium text-white">Advanced Analytics</span>
            </div>
            <p className="text-xs text-slate-400">AI-powered insights</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-medium text-white">Premium Support</span>
            </div>
            <p className="text-xs text-slate-400">24/7 dedicated help</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumCard;
