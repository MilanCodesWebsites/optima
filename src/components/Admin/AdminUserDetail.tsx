import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, TrendingUp, TrendingDown, DollarSign, ArrowDown, ArrowUp } from 'lucide-react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  status: 'pending' | 'success' | 'denied';
  timestamp: Date;
  type: 'credit' | 'debit';
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  initialBalance: number;
  avatar?: string;
  transactions: Transaction[];
}

const transactionTypes = [
  {
    value: 'profit',
    label: 'Profit',
    icon: TrendingUp,
    color: 'bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30',
    description: 'Add trading profit to user balance'
  },
  {
    value: 'loss',
    label: 'Loss',
    icon: TrendingDown,
    color: 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30',
    description: 'Deduct trading loss from user balance'
  },
  {
    value: 'deposit',
    label: 'Deposit',
    icon: ArrowDown,
    color: 'bg-blue-500/20 border-blue-500/40 text-blue-400 hover:bg-blue-500/30',
    description: 'Add deposit to user balance'
  },
  {
    value: 'withdrawal',
    label: 'Withdrawal',
    icon: ArrowUp,
    color: 'bg-orange-500/20 border-orange-500/40 text-orange-400 hover:bg-orange-500/30',
    description: 'Deduct withdrawal from user balance'
  }
];

const AdminUserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAllUsers, addTransaction } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [transactionForm, setTransactionForm] = useState({
    type: 'deposit' as 'profit' | 'loss' | 'deposit' | 'withdrawal',
    amount: '',
    description: '',
    status: 'success' as const
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  // Load user data and transactions from Supabase
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setIsLoadingTransactions(true);
        
        const users = await getAllUsers();
        const targetUser = users.find(u => u.id === id);
        if (targetUser) {
          setUser(targetUser);
          console.log('✅ User data loaded from Supabase:', targetUser);
          
          // Load user transactions
          await loadUserTransactions(targetUser.id);
        } else {
          console.log('❌ User not found:', id);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
        setIsLoadingTransactions(false);
      }
    };
    
    loadUserData();
  }, [id, getAllUsers]);

  // Load user transactions from Supabase
  const loadUserTransactions = async (userId: string) => {
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading user transactions:', error);
        return;
      }

      // Convert Supabase transaction format to local format
      const localTransactions = transactions.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        type: tx.type,
        description: tx.description,
        status: tx.status,
        timestamp: new Date(tx.created_at)
      }));

      setUserTransactions(localTransactions);
      console.log(`✅ Loaded ${localTransactions.length} transactions for user ${userId}`);
    } catch (error) {
      console.error('Error loading user transactions:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Calculate P&L percentage
  const calculatePnL = () => {
    if (!user || user.initialBalance === 0) return 0;
    return ((user.balance - user.initialBalance) / user.initialBalance) * 100;
  };

  const pnlPercentage = calculatePnL();
  const pnlAmount = user ? user.balance - user.initialBalance : 0;

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionForm.amount || !transactionForm.description || !user) return;

    setIsSubmitting(true);
    
    try {
      const amount = parseFloat(transactionForm.amount);
      if (isNaN(amount)) return;

      // Determine transaction type and amount based on transaction type
      let finalAmount = amount;
      let type: 'credit' | 'debit' = 'credit';
      
      switch (transactionForm.type) {
        case 'profit':
        case 'deposit':
          type = 'credit';
          finalAmount = amount;
          break;
        case 'loss':
        case 'withdrawal':
          type = 'debit';
          finalAmount = amount;
          break;
      }

      // Save transaction to Supabase
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: finalAmount,
          type: type,
          description: transactionForm.description,
          status: transactionForm.status
        });

      if (transactionError) {
        console.error('Error saving transaction:', transactionError);
        return;
      }

      // Update user balance in Supabase
      const newBalance = type === 'credit' ? user.balance + finalAmount : user.balance - finalAmount;
      const { error: balanceError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', user.id);

      if (balanceError) {
        console.error('Error updating user balance:', balanceError);
        return;
      }

      console.log('✅ Admin transaction saved and balance updated');

      // Reset form
      setTransactionForm({
        type: 'deposit',
        amount: '',
        description: '',
        status: 'success'
      });

      // Force refresh user data and transactions immediately
      setTimeout(async () => {
        try {
          const users = await getAllUsers();
          const updatedUser = users.find(u => u.id === id);
          if (updatedUser) {
            setUser(updatedUser);
            console.log('✅ User data refreshed after transaction');
          }
          
          // Refresh transactions
          await loadUserTransactions(user.id);
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while user data is being fetched
  if (isLoading || !user) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="text-center text-slate-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading user data...</p>
          {isLoading && (
            <p className="text-xs text-slate-500 mt-2">Fetching from Supabase...</p>
          )}
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">User Account Management</h1>
            <p className="text-sm sm:text-base text-slate-400">Manage {user.firstName} {user.lastName}'s account</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* User Info & P&L Card */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-800/70 border border-slate-700/50 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-lg sm:text-2xl text-slate-400 font-semibold">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-white truncate">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Current Balance */}
              <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/30">
                <p className="text-sm text-slate-400 mb-1">Current Balance</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(user.balance || 0)}</p>
              </div>
              
              {/* Initial Balance */}
              <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/30">
                <p className="text-sm text-slate-400 mb-1">Initial Balance</p>
                <p className="text-base sm:text-lg font-semibold text-white">{formatCurrency(user.initialBalance || 0)}</p>
              </div>

              {/* P&L Indicator - Prominently Displayed */}
              <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/30">
                <p className="text-sm text-slate-400 mb-2">Profit & Loss</p>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${pnlAmount >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {pnlAmount >= 0 ? (
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-lg sm:text-xl font-bold ${pnlAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pnlAmount >= 0 ? '+' : ''}{formatCurrency(pnlAmount)}
                    </p>
                    <p className={`text-sm font-medium ${pnlAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Transaction Count */}
              <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/30">
                <p className="text-sm text-slate-400 mb-1">Total Transactions</p>
                <p className="text-lg sm:text-xl font-semibold text-white">{userTransactions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Transaction Management */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Single Transaction Form */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Add New Transaction</h3>
            
            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              {/* Transaction Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-3">Transaction Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {transactionTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = transactionForm.type === type.value;
                    return (
                      <div
                        key={type.value}
                        className={`
                          relative cursor-pointer rounded-xl border-2 p-3 sm:p-4 transition-all duration-200
                          ${isSelected ? type.color : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600/50'}
                        `}
                        onClick={() => setTransactionForm(prev => ({ ...prev, type: type.value as any }))}
                      >
                        <input
                          type="radio"
                          value={type.value}
                          checked={isSelected}
                          onChange={() => setTransactionForm(prev => ({ ...prev, type: type.value as any }))}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 ${isSelected ? 'text-current' : 'text-slate-500'}`} />
                          <p className={`font-medium text-sm ${isSelected ? 'text-current' : 'text-slate-300'}`}>
                            {type.label}
                          </p>
                          <p className={`text-xs mt-1 ${isSelected ? 'text-current/80' : 'text-slate-500'}`}>
                            {type.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-current rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={transactionForm.amount}
                      onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter the transaction amount
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Status</label>
                  <select
                    value={transactionForm.status}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, status: e.target.value as 'pending' | 'success' | 'denied' }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 text-sm sm:text-base transition-colors"
                  >
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="denied">Denied</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
                <Input
                  placeholder="e.g., Trading profit, Bank transfer, Referral bonus"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              {/* Balance Impact Preview */}
              <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-sm text-slate-300">Balance Impact</span>
                  <span className="text-sm text-slate-400">
                    {transactionForm.amount && transactionForm.status === 'success' ? (
                      <>
                        Balance will be {['profit', 'deposit'].includes(transactionForm.type) ? 'increased' : 'decreased'} by 
                        <span className={`font-medium ${['profit', 'deposit'].includes(transactionForm.type) ? 'text-green-400' : 'text-red-400'}`}>
                          {' '}{formatCurrency(Math.abs(parseFloat(transactionForm.amount)))}
                        </span>
                      </>
                    ) : (
                      'Enter amount and select status to see balance impact'
                    )}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                icon={Save}
                loading={isSubmitting}
                className="w-full"
                disabled={!transactionForm.amount || !transactionForm.description}
              >
                Save Transaction & Update Balance
              </Button>
            </form>
          </div>

          {/* Transaction History */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Transaction History</h3>
            
            <div className="space-y-3">
              {isLoadingTransactions ? (
                <div className="text-center py-6 sm:py-8 text-slate-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3"></div>
                  <p>Loading transactions...</p>
                </div>
              ) : userTransactions.length > 0 ? (
              userTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700/30 gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${
                        transaction.status === 'success' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                        transaction.status === 'pending' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                        'text-red-400 bg-red-400/10 border-red-400/20'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-sm sm:text-base truncate">{transaction.description}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(transaction.timestamp).toLocaleDateString()} at {new Date(transaction.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold text-base sm:text-lg ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-slate-400 capitalize">{transaction.type}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8 text-slate-400">
                  <p>No transactions found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
