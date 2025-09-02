import React, { useState } from 'react';
import { History, Search, Filter, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, X } from 'lucide-react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import TransactionReceiptModal from '../Home/TransactionReceiptModal';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'credit' | 'debit';
  amount: number;
  currency?: string;
  status: 'pending' | 'completed' | 'success' | 'denied';
  createdAt?: Date;
  timestamp?: Date;
  walletAddress?: string;
  description?: string;
}

interface TransactionsPageProps {
  transactions: Transaction[];
  userBalance: number;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Normalize transaction data to handle both formats
  const normalizedTransactions = (transactions || []).map(transaction => {
    // Map AuthContext format to display format
    const displayType = transaction.type === 'credit' ? 'deposit' : 
                       transaction.type === 'debit' ? 'withdrawal' : 
                       transaction.type;
    
    const displayStatus = transaction.status === 'success' ? 'completed' : 
                         transaction.status === 'denied' ? 'denied' : 
                         transaction.status;
    
    const displayDate = transaction.createdAt || transaction.timestamp;
    
    // Extract currency from description if not present
    let currency = transaction.currency;
    if (!currency && transaction.description) {
      // Try to extract currency from description (e.g., "Deposit 100 USDT" -> "USDT")
      const currencyMatch = transaction.description.match(/\b(USDT|BTC|ETH|BNB|SOL|USD|EUR)\b/i);
      if (currencyMatch) {
        currency = currencyMatch[1].toUpperCase();
      } else {
        currency = 'USD'; // Default currency
      }
    }

    return {
      ...transaction,
      displayType,
      displayStatus,
      displayDate,
      displayCurrency: currency || 'USD'
    };
  });

  // Filter transactions
  const filteredTransactions = normalizedTransactions.filter(transaction => {
    const matchesSearch = 
      (transaction.displayCurrency?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || transaction.displayStatus === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.displayType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Paginate transactions
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Handle transaction click to open receipt
  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsReceiptModalOpen(true);
  };

  // Close receipt modal
  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setSelectedTransaction(null);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Date not available';
    
    try {
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'Date error';
    }
  };

  // Convert transaction to receipt format
  const convertToReceiptFormat = (transaction: Transaction) => {
    return {
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description || `${transaction.displayType} ${transaction.displayCurrency}`,
      status: transaction.displayStatus === 'completed' ? 'success' : 
              transaction.displayStatus === 'denied' ? 'denied' : 'pending',
      timestamp: transaction.displayDate || new Date(),
      type: transaction.displayType === 'deposit' ? 'credit' : 'debit'
    };
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <History className="w-6 h-6 sm:w-8 sm:h-8 text-neon-green" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Transaction History</h1>
            <p className="text-slate-400 text-sm sm:text-base">View and manage all your transactions</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Input
            icon={Search}
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green text-sm sm:text-base"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="denied">Denied</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green text-sm sm:text-base"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
          </select>
        </div>

        {/* Transaction Count */}
        <div className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>

        {/* Transactions List */}
        {paginatedTransactions.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {paginatedTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 sm:p-4 bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer group"
                onClick={() => handleTransactionClick(transaction)}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <div className={`p-2 sm:p-3 rounded-xl mr-3 sm:mr-4 flex-shrink-0 ${
                    transaction.displayType === 'deposit' 
                      ? 'bg-neon-green/10 border border-neon-green/20' 
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}>
                    {transaction.displayType === 'deposit' ? (
                      <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-neon-green" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1 flex-wrap gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm font-medium text-white capitalize group-hover:text-blue-300 transition-colors">
                        {transaction.displayType}
                      </p>
                      <span className="px-1.5 sm:px-2 py-0.5 text-xs font-medium bg-slate-600 text-slate-300 rounded-md">
                        {transaction.displayCurrency}
                      </span>
                      <span className="text-xs text-slate-500 hidden sm:inline">ID: {transaction.id}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {formatDate(transaction.displayDate)}
                    </p>
                    {transaction.description && (
                      <p className="text-xs text-slate-500 mt-1 max-w-32 sm:max-w-48 truncate">
                        {transaction.description}
                      </p>
                    )}
                    {transaction.walletAddress && (
                      <p className="text-xs text-slate-500 font-mono mt-1 truncate max-w-32 sm:max-w-48">
                        To: {transaction.walletAddress}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2 sm:ml-4">
                  <div className="flex items-center justify-end mb-1">
                    <p className={`text-base sm:text-lg font-semibold ${
                      transaction.displayType === 'deposit' ? 'text-neon-green' : 'text-red-400'
                    }`}>
                      {transaction.displayType === 'deposit' ? '+' : '-'}{formatAmount(transaction.amount)}
                    </p>
                  </div>
                  <div className="flex items-center justify-end">
                    {transaction.displayStatus === 'completed' ? (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-neon-green mr-1" />
                    ) : transaction.displayStatus === 'denied' ? (
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
                    )}
                    <span className={`text-xs sm:text-sm capitalize font-medium ${
                      transaction.displayStatus === 'completed' ? 'text-neon-green' : 
                      transaction.displayStatus === 'denied' ? 'text-red-400' : 
                      'text-yellow-400'
                    }`}>
                      {transaction.displayStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <History className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-slate-300 mb-2">No transactions found</h3>
            <p className="text-slate-500 text-sm">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Try adjusting your filters or search terms' 
                : 'Your transaction history will appear here once you make transactions'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700">
            <div className="text-xs sm:text-sm text-slate-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Receipt Modal */}
      {selectedTransaction && (
        <TransactionReceiptModal
          transaction={convertToReceiptFormat(selectedTransaction)}
          isOpen={isReceiptModalOpen}
          onClose={closeReceiptModal}
          userBalance={userBalance}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
