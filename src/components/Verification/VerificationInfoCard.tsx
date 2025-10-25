import React, { useState } from 'react';
import { Info, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../UI/Button';
import I2SoftwareModal from './I2SoftwareModal';

const VerificationInfoCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6 mb-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <span>Unlock Premium Trading Features</span>
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-full text-xs font-medium text-yellow-300">
                    I~2 Software
                  </span>
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Elevate your trading experience with our exclusive I~2 Trading Software. Access advanced analytics, 
                  enhanced profit strategies, and priority withdrawal processing to maximize your trading potential.
                </p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  icon={ArrowRight}
                  className="bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  Learn More
                </Button>
              </div>
              <button
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="More Information"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <I2SoftwareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default VerificationInfoCard;
