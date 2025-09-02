import React from 'react';
import Modal from '../UI/Modal';
import { Printer, X } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  status: 'pending' | 'success' | 'denied';
  timestamp: Date | string;
}

interface TransactionReceiptModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
}

const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  transaction,
  isOpen,
  onClose,
  userBalance
}) => {
  if (!transaction || userBalance === undefined) return null;

  // Safe date parsing function
  const parseDate = (timestamp: Date | string): Date => {
    try {
      if (timestamp instanceof Date) {
        return timestamp;
      }
      const parsed = new Date(timestamp);
      if (isNaN(parsed.getTime())) {
        return new Date();
      }
      return parsed;
    } catch (error) {
      return new Date();
    }
  };

  // Safe date formatting functions
  const formatDate = (timestamp: Date | string): string => {
    try {
      const date = parseDate(timestamp);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (timestamp: Date | string): string => {
    try {
      const date = parseDate(timestamp);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Time';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return '↗️';
      case 'debit':
        return '↘️';
      default:
        return '•';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'credit':
        return 'text-green-600';
      case 'debit':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'credit':
        return 'Credit';
      case 'debit':
        return 'Debit';
      default:
        return 'Transaction';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'denied':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Receipt" size="lg">
      <div className="bg-white rounded-lg shadow-xl max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 rounded-t-lg">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/75903197-21b2-4fa6-a139-2405ad6d4ef7-Gemini_Generated_Image_wzjx3bwzjx3bwzjx.png" 
                alt="Optima"
                className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
              />
              <h1 className="text-lg sm:text-2xl font-bold">Optima</h1>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          <p className="text-blue-100 text-xs sm:text-sm">Transaction Receipt</p>
        </div>

        {/* Receipt Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Transaction Details */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs sm:text-sm">Receipt #</span>
              <span className="font-semibold text-gray-900 text-xs sm:text-sm">{transaction.id}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs sm:text-sm">Date</span>
              <span className="font-semibold text-gray-900 text-xs sm:text-sm">{formatDate(transaction.timestamp)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs sm:text-sm">Time</span>
              <span className="font-semibold text-gray-900 text-xs sm:text-sm">{formatTime(transaction.timestamp)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs sm:text-sm">Type</span>
              <span className={`font-semibold text-xs sm:text-sm ${getTransactionTypeColor(transaction.type)}`}>
                {getTransactionTypeIcon(transaction.type)} {getTransactionTypeLabel(transaction.type)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs sm:text-sm">Status</span>
              <span className={`font-semibold text-xs sm:text-sm ${getStatusColor(transaction.status)}`}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs sm:text-sm">Description</span>
              <span className="font-semibold text-gray-900 text-right max-w-xs text-xs sm:text-sm">
                {transaction.description}
              </span>
            </div>
          </div>

          {/* Amount Section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-base sm:text-lg text-gray-600">Amount</span>
              <span className={`text-xl sm:text-2xl font-bold ${getTransactionTypeColor(transaction.type)}`}>
                {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Balance Impact */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs sm:text-sm">Previous Balance</span>
              <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                ${((userBalance || 0) - (transaction.type === 'credit' ? transaction.amount : -transaction.amount)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600 text-xs sm:text-sm">New Balance</span>
              <span className="font-semibold text-gray-900 text-xs sm:text-sm">${(userBalance || 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-gray-600 mb-2 text-xs sm:text-sm">Thank you for using Optima</p>
            <p className="text-xs sm:text-sm text-gray-500">
              For support, contact us at support@optima.com
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
          >
            <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionReceiptModal;
