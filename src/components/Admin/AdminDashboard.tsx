import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Activity, Search, Plus, ArrowRight } from 'lucide-react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import TransactionAddModal from './TransactionAddModal';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface AdminDashboardProps {
  users: any[];
  transactions: any[];
  onUpdateUser: (user: any) => void;
  onAddTransaction: (transaction: any) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  users, 
  transactions, 
  onUpdateUser, 
  onAddTransaction 
}) => {
  const { getAllUsers, getAllTransactions } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [realUsers, setRealUsers] = useState(users);
  const [realTransactions, setRealTransactions] = useState(transactions);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from Supabase when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [usersData, transactionsData] = await Promise.all([
          getAllUsers(),
          getAllTransactions()
        ]);
        
        setRealUsers(usersData);
        setRealTransactions(transactionsData);
        console.log('✅ Admin dashboard loaded real data from Supabase');
      } catch (error) {
        console.error('Error loading admin data:', error);
        // Fallback to props data
        setRealUsers(users);
        setRealTransactions(transactions);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getAllUsers, getAllTransactions, users, transactions]);

  const totalBalance = realUsers.reduce((sum, user) => sum + user.balance, 0);
  const totalTransactions = realTransactions.length;
  const pendingTransactions = realTransactions.filter(t => t.status === 'pending').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredUsers = realUsers.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTransaction = async (transactionData: any) => {
    try {
      const transaction = {
        id: Date.now().toString(),
        user_id: selectedUserId,
        ...transactionData,
        createdAt: new Date()
      };
      
      // Save to Supabase directly
      const supabaseTransaction = {
        user_id: selectedUserId,
        amount: transactionData.amount,
        type: transactionData.type === 'deposit' ? 'credit' : 'debit',
        description: `${transactionData.type} ${transactionData.amount} ${transactionData.currency}`,
        status: 'success'
      };
      
      const { error } = await supabase
        .from('transactions')
        .insert(supabaseTransaction);
      
      if (error) {
        console.error('Error saving admin transaction:', error);
      } else {
        console.log('✅ Admin transaction saved to Supabase');
        // Refresh the data
        const [usersData, transactionsData] = await Promise.all([
          getAllUsers(),
          getAllTransactions()
        ]);
        setRealUsers(usersData);
        setRealTransactions(transactionsData);
      }
      
      onAddTransaction(transaction);
      setShowAddTransaction(false);
      setSelectedUserId('');
    } catch (error) {
      console.error('Error handling admin transaction:', error);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
          <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/75903197-21b2-4fa6-a139-2405ad6d4ef7-Gemini_Generated_Image_wzjx3bwzjx3bwzjx.png" alt="Optima" className="h-8 sm:h-10" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
          {isLoading && (
            <div className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              Loading...
            </div>
          )}
        </div>
        <p className="text-slate-400 text-sm sm:text-base">Manage users, transactions, and system overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-slate-400 text-xs sm:text-sm">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-slate-400 text-xs sm:text-sm">Total Balance</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-slate-400 text-xs sm:text-sm">Transactions</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-slate-400 text-xs sm:text-sm">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{pendingTransactions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Management */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">User Management</h2>
          <Button 
            onClick={() => setShowAddTransaction(true)} 
            icon={Plus}
            size="sm"
            className="w-full sm:w-auto"
          >
            Add Transaction
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            icon={Search}
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/60">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/30">
                <th className="text-left py-3 px-3 sm:px-4 text-slate-300 font-medium text-sm">User</th>
                <th className="text-left py-3 px-3 sm:px-4 text-slate-300 font-medium text-sm">Email</th>
                <th className="text-left py-3 px-3 sm:px-4 text-slate-300 font-medium text-sm">Balance</th>
                <th className="text-left py-3 px-3 sm:px-4 text-slate-300 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-200">
                  <td className="py-3 sm:py-4 px-3 sm:px-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-slate-700/50 rounded-lg mr-3">
                        <Users className="w-4 h-4 text-slate-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white text-sm sm:text-base truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-slate-400">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-slate-300 text-sm">
                    <span className="truncate block max-w-[150px] sm:max-w-[200px]">{user.email}</span>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4">
                    <span className="text-green-400 font-semibold text-sm sm:text-base">
                      {formatCurrency(user.balance)}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href={`/admin/users/${user.id}`}
                        className="inline-flex items-center justify-center px-3 py-2 bg-slate-700/70 hover:bg-slate-600/70 text-slate-100 rounded-lg text-sm border border-slate-600/50 transition-all duration-200 hover:border-slate-500/50"
                      >
                        <span className="hidden sm:inline">Manage</span>
                        <span className="sm:hidden">View</span>
                        <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
                      </a>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Plus}
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setShowAddTransaction(true);
                        }}
                        className="text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Add Transaction</span>
                        <span className="sm:hidden">+Tx</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No users found matching your search</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddTransaction && (
        <TransactionAddModal
          users={users}
          selectedUserId={selectedUserId}
          onSave={handleAddTransaction}
          onClose={() => {
            setShowAddTransaction(false);
            setSelectedUserId('');
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;