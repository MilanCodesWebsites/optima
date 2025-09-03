import React, { useState } from 'react';
import WithdrawForm from './WithdrawForm';
import BankWithdrawPage from './BankWithdrawPage';
import FeeCalculator from './FeeCalculator';
import ConfirmationScreen from './ConfirmationScreen';
import { ArrowUpRight } from 'lucide-react';

interface WithdrawPageProps {
  balance: number;
  onWithdraw: (transaction: any) => void;
}

const WithdrawPage: React.FC<WithdrawPageProps> = ({ balance, onWithdraw }) => {
  const [step, setStep] = useState(1);
  const [withdrawData, setWithdrawData] = useState<any>(null);
  const [withdrawalType, setWithdrawalType] = useState<'crypto' | 'bank'>('crypto');

  const handleWithdrawSubmit = (data: any) => {
    setWithdrawData(data);
    setStep(2);
  };

  const handleFeeConfirm = () => {
    setStep(3);
  };

  const handleConfirmWithdraw = () => {
    const transaction = {
      type: 'debit' as const, // Map 'withdrawal' to 'debit'
      amount: withdrawData.amount,
      description: `Withdrawal ${withdrawData.amount} ${withdrawData.currency} to ${withdrawData.walletAddress}`, // Add description field
      status: 'pending' as const
    };
    
    onWithdraw(transaction);
    setStep(4);
  };

  const handleBankWithdraw = (transaction: any) => {
    onWithdraw(transaction);
  };

  const resetFlow = () => {
    setStep(1);
    setWithdrawData(null);
    setWithdrawalType('crypto');
  };

  const handleBackToCrypto = () => {
    setWithdrawalType('crypto');
    setStep(1);
    setWithdrawData(null);
  };

  // Bank withdrawal flow
  if (withdrawalType === 'bank') {
    return (
      <BankWithdrawPage
        balance={balance}
        onWithdraw={handleBankWithdraw}
        onBack={handleBackToCrypto}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="p-4 bg-red-500/10 rounded-2xl inline-block mb-4 animate-glow">
          <ArrowUpRight className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
        <p className="text-slate-400">Transfer funds from your Optima account</p>
      </div>

      {step === 1 && (
        <WithdrawForm 
          balance={balance} 
          onSubmit={handleWithdrawSubmit}
          onBankWithdraw={() => setWithdrawalType('bank')}
        />
      )}

      {step === 2 && withdrawData && (
        <FeeCalculator 
          amount={withdrawData.amount}
          currency={withdrawData.currency}
          onConfirm={handleFeeConfirm}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <ConfirmationScreen
          withdrawData={withdrawData}
          onConfirm={handleConfirmWithdraw}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <div className="text-center bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <div className="p-4 bg-neon-green/10 rounded-2xl inline-block mb-6 animate-glow">
            <ArrowUpRight className="w-12 h-12 text-neon-green" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Withdrawal Submitted!</h2>
          <p className="text-slate-300 mb-6">
            Your withdrawal request is being processed and will be completed within 24-48 hours.
          </p>
          <button
            onClick={resetFlow}
            className="px-6 py-3 bg-neon-green hover:bg-dark-green text-deep-black rounded-xl font-semibold transition-colors"
          >
            Make Another Withdrawal
          </button>
        </div>
      )}
    </div>
  );
};

export default WithdrawPage;