import React from 'react';
import { X, CheckCircle, TrendingUp, Zap, Shield, MessageCircle } from 'lucide-react';
import Button from '../UI/Button';

interface I2SoftwareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const I2SoftwareModal: React.FC<I2SoftwareModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: TrendingUp,
      title: 'Enhanced Trading Accuracy',
      description: 'Advanced AI algorithms analyze market patterns in real-time to provide superior trading signals.'
    },
    {
      icon: Zap,
      title: 'Faster Withdrawals',
      description: 'Priority processing for all withdrawal requests with same-day approval for verified transactions.'
    },
    {
      icon: Shield,
      title: 'Increased Profit Margins',
      description: 'Access to premium trading strategies and tools that maximize your earning potential by up to 300%.'
    },
    {
      icon: CheckCircle,
      title: 'Premium Analytics',
      description: 'Real-time market insights, advanced charting tools, and predictive analytics dashboard.'
    }
  ];

  const handleContactSupport = () => {
    window.open('https://widget-page.smartsupp.com/widget/360ca7a2c3e3c3164c5a835095a2eb1050af300a', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">I~2 Trading Software</h2>
            <p className="text-sm text-slate-400">Elevate Your Trading Experience</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview */}
          <div className="bg-gradient-to-br from-neon-green/10 to-blue-500/10 border border-neon-green/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">What is I~2 Trading Software?</h3>
            <p className="text-slate-300 leading-relaxed">
              The I~2 Trading Software is our premium, AI-powered trading solution designed exclusively for serious traders. 
              This sophisticated platform integrates cutting-edge machine learning algorithms with real-time market data to 
              provide you with unparalleled trading advantages. Experience trading in Premium Luxury mode with features that 
              are simply not available to standard accounts.
            </p>
          </div>

          {/* Features Grid */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Key Features & Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-neon-green/30 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-neon-green/10 rounded-lg">
                      <feature.icon className="w-5 h-5 text-neon-green" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Activation */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Activation Process</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-neon-green font-bold">1</span>
                </div>
                <div>
                  <p className="text-slate-300">
                    <span className="font-medium text-white">Contact Our Support Team</span>
                    <br />
                    Reach out to our customer support agents via live chat to initiate your I~2 software activation request.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-neon-green font-bold">2</span>
                </div>
                <div>
                  <p className="text-slate-300">
                    <span className="font-medium text-white">Receive Payment Instructions</span>
                    <br />
                    A support agent will provide you with the specific payment address and amount based on your account tier.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-neon-green font-bold">3</span>
                </div>
                <div>
                  <p className="text-slate-300">
                    <span className="font-medium text-white">Make Payment</span>
                    <br />
                    Send <span className="text-neon-green font-semibold">$2,500 - $9,500 USD</span> to the provided address. 
                    The exact amount depends on your chosen package tier.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-neon-green font-bold">4</span>
                </div>
                <div>
                  <p className="text-slate-300">
                    <span className="font-medium text-white">Instant Activation</span>
                    <br />
                    Once payment is confirmed, your account will be upgraded to Premium Luxury mode within 1-2 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-200 mb-1">Important Notice</h4>
                <p className="text-sm text-yellow-100/80">
                  All I~2 software activations are processed securely through our verified payment system. 
                  Always verify payment addresses directly with our support team. Never send payments to unsolicited addresses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-6">
          <Button
            onClick={handleContactSupport}
            icon={MessageCircle}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Contact Support to Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default I2SoftwareModal;
