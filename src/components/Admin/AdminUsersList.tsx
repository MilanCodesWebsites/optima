import React, { useMemo, useState, useEffect } from 'react';
import { Search, Users, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Input from '../UI/Input';
import { useAuth } from '../../contexts/AuthContext';

const AdminUsersList: React.FC = () => {
  const { getAllUsers } = useAuth();
  const [term, setTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load users from Supabase
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const usersData = await getAllUsers();
        setUsers(usersData);
        console.log('✅ AdminUsersList loaded users from Supabase:', usersData.length);
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [getAllUsers]);

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
    u.email.toLowerCase().includes(term.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
          <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/75903197-21b2-4fa6-a139-2405ad6d4ef7-Gemini_Generated_Image_wzjx3bwzjx3bwzjx.png" alt="Optima" className="h-8 sm:h-10" />
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">All Users</h1>
        </div>
        <p className="text-slate-400 text-sm sm:text-base">View and manage all registered users</p>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-4 sm:p-6 shadow-lg">
        {/* Search */}
        <div className="mb-6">
          <Input 
            icon={Search} 
            placeholder="Search by name or email" 
            value={term} 
            onChange={(e) => setTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading users from Supabase...</p>
          </div>
        )}

        {/* Mobile Cards View */}
        {!isLoading && (
          <div className="block sm:hidden space-y-4">
            {filtered.map(u => (
            <div key={u.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700/70 border border-slate-600/50 flex items-center justify-center overflow-hidden">
                  {u.avatar ? (
                    <img src={u.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-sm text-slate-400 font-semibold">
                      {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm sm:text-base truncate">
                    {u.firstName} {u.lastName}
                  </div>
                  <div className="text-xs text-slate-400">ID: {u.id}</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-16 text-slate-500">Email:</span>
                  <span className="truncate">{u.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-slate-500">Balance:</span>
                  <span className="font-medium text-green-400">{formatCurrency(u.balance)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-16 text-slate-500">Transactions:</span>
                  <span>{u.transactions.length}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link 
                  to={`/admin/users/${u.id}`}
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-slate-700/70 hover:bg-slate-600/70 text-slate-100 border border-slate-600/50 rounded-lg hover:border-slate-500/50 transition-all duration-200 font-medium text-sm"
                >
                  Manage User
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Desktop Table View */}
        {!isLoading && (
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-800/60">
            <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/30">
                <th className="text-left py-3 px-4 text-slate-300 font-medium text-sm">User</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium text-sm">Email</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium text-sm">Balance</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium text-sm">Transactions</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-200">
                  <td className="py-3 sm:py-4 px-4 text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700/70 border border-slate-600/50 flex items-center justify-center overflow-hidden">
                        {u.avatar ? (
                          <img src={u.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-sm text-slate-400 font-semibold">
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-white truncate">{u.firstName} {u.lastName}</div>
                        <div className="text-xs text-slate-400">ID: {u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-4 text-slate-400 text-sm">
                    <span className="truncate block max-w-[200px]">{u.email}</span>
                  </td>
                  <td className="py-3 sm:py-4 px-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-green-400">{formatCurrency(u.balance)}</span>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-4 text-slate-400 text-sm">{u.transactions.length}</td>
                  <td className="py-3 sm:py-4 px-4">
                    <Link 
                      to={`/admin/users/${u.id}`}
                      className="inline-flex items-center px-3 py-2 bg-slate-700/70 hover:bg-slate-600/70 text-slate-100 border border-slate-600/50 rounded-lg hover:border-slate-500/50 transition-all duration-200 font-medium text-sm"
                    >
                      Manage
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No users match your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersList;
