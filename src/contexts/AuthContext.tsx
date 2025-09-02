import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
  initialBalance: number;
  avatar: string | null;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  status: 'pending' | 'success' | 'denied';
  timestamp: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  registrationSuccess: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  register: (userData: { firstName: string; lastName: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  getUsers: () => User[];
  getAllUsers: () => Promise<User[]>;
  getAllTransactions: () => Promise<Transaction[]>;
  clearRegistrationSuccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Check for existing user session and admin authentication on app startup
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // Check for admin authentication
        const adminAuthenticated = sessionStorage.getItem('optima_admin_authenticated');
        if (adminAuthenticated === 'true') {
          setIsAdminAuthenticated(true);
          console.log('✅ Admin session restored from session storage');
        }

        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        if (supabaseUser) {
          // User is authenticated with Supabase
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();

          if (userData) {
            // Load user transactions from Supabase
            const userTransactions = await loadUserTransactions(supabaseUser.id);
            
            // Create final user object with loaded transactions
            const finalUser: User = {
              id: supabaseUser.id,
              firstName: userData.first_name,
              lastName: userData.last_name,
              email: userData.email,
              balance: userData.balance,
              initialBalance: userData.initial_balance,
              avatar: userData.avatar_url,
              transactions: userTransactions || []
            };

            setUser(finalUser);
            setIsAuthenticated(true);
            console.log('✅ User session restored from Supabase');
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
      }
    };

    checkExistingSession();
  }, []);

  // No localStorage initialization - everything comes from Supabase

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // First, try Supabase login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Supabase login error:', authError);
        return false;
      }

      if (authData.user) {
        // Fetch user profile from Supabase
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.error('Supabase profile fetch error:', profileError);
          return false;
        }

        // Convert Supabase profile to local User format
        const supabaseUser: User = {
          id: userProfile.id,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          email: userProfile.email,
          balance: userProfile.balance,
          initialBalance: userProfile.initial_balance,
          avatar: userProfile.avatar_url,
          transactions: [] // We'll load transactions separately
        };

        // Load user transactions from Supabase
        const userTransactions = await loadUserTransactions(supabaseUser.id);
        
        // Create final user object with loaded transactions
        const finalUser: User = {
          ...supabaseUser,
          transactions: userTransactions || []
        };

        setUser(finalUser);
        setIsAuthenticated(true);
        console.log('✅ User logged in successfully with Supabase');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Supabase login error:', error);
      return false;
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    // Check against all admin credentials
    const adminCredentials = [
      { email: 'admin@optima.com', password: 'Optima@Secure2025' },
      { email: 'princesochimaobim@gmail.com', password: 'qvA5d*Da8_qK@8L' },
      { email: 'Nicholasugbana@gmail.com', password: 'BigNick365' }
    ];

    const isValidAdmin = adminCredentials.some(cred =>
      cred.email === email && cred.password === password
    );

    if (isValidAdmin) {
      setIsAdminAuthenticated(true);
      // Store admin authentication in session storage
      sessionStorage.setItem('optima_admin_authenticated', 'true');
      sessionStorage.setItem('optima_admin_email', email);
      return true;
    }
    return false;
  };

  const register = async (userData: { firstName: string; lastName: string; email: string; password: string }): Promise<boolean> => {
    try {
      // First, try Supabase registration
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        return false;
      }

      if (authData.user) {
        // Create user profile in Supabase
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            balance: 0,
            initial_balance: 0,
          });

        if (profileError) {
          console.error('Supabase profile creation error:', profileError);
          return false;
        }

        // Success with Supabase - create local user object
        const newUser: User = {
          id: authData.user.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          balance: 0,
          initialBalance: 0,
          avatar: null,
          transactions: []
        };

        // Don't automatically log in - user needs to confirm email first
        setRegistrationSuccess(true);
        console.log('✅ User registered successfully with Supabase - email confirmation required');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Supabase registration error:', error);
      return false;
    }
  };



  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdminAuthenticated(false);
    // Clear admin authentication from session storage
    sessionStorage.removeItem('optima_admin_authenticated');
    sessionStorage.removeItem('optima_admin_email');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    if (user) {
      try {
        // First, try to save to Supabase
        const { data: supabaseTransaction, error } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            amount: transaction.amount,
            type: transaction.type,
            description: transaction.description,
            status: transaction.status,
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase transaction save error:', error);
          // Fallback to localStorage
          addTransactionToLocalStorage(transaction);
          return;
        }

        // Success with Supabase - create local transaction object
        const newTransaction: Transaction = {
          id: supabaseTransaction.id,
          ...transaction,
          timestamp: new Date(supabaseTransaction.created_at)
        };

        let balanceChange = 0;
        if (transaction.status === 'success') {
          balanceChange = transaction.type === 'credit' ? transaction.amount : -transaction.amount;
        }

        const updatedUser = {
          ...user,
          balance: user.balance + balanceChange,
          transactions: [newTransaction, ...user.transactions]
        };

        setUser(updatedUser);
        console.log('✅ Transaction saved to Supabase successfully');

      } catch (error) {
        console.error('Supabase transaction error:', error);
      }
    }
  };

  const getUsers = () => users;

  // Fetch all users from Supabase
  const getAllUsers = async () => {
    try {
      const { data: supabaseUsers, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      // Convert Supabase format to local User format
      const localUsers = supabaseUsers.map(supabaseUser => ({
        id: supabaseUser.id,
        firstName: supabaseUser.first_name,
        lastName: supabaseUser.last_name,
        email: supabaseUser.email,
        balance: supabaseUser.balance,
        initialBalance: supabaseUser.initial_balance,
        avatar: supabaseUser.avatar_url,
        transactions: [] // We'll load transactions separately
      }));

      console.log(`✅ Loaded ${localUsers.length} users from Supabase`);
      return localUsers;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  // Fetch all transactions from Supabase
  const getAllTransactions = async () => {
    try {
      const { data: supabaseTransactions, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return []; // Return empty array if error
      }

      // Convert Supabase format to local Transaction format
      const localTransactions = supabaseTransactions.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        type: tx.type,
        description: tx.description,
        status: tx.status,
        timestamp: new Date(tx.created_at)
      }));

      console.log(`✅ Loaded ${localTransactions.length} transactions from Supabase`);
      return localTransactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return []; // Return empty array if error
    }
  };

  // Load user transactions from Supabase
  const loadUserTransactions = async (userId: string) => {
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading transactions:', error);
        return [];
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

      console.log(`✅ Loaded ${localTransactions.length} transactions from Supabase for user ${userId}`);
      return localTransactions;
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  };

  const clearRegistrationSuccess = () => {
    setRegistrationSuccess(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAdminAuthenticated,
      registrationSuccess,
      login,
      adminLogin,
      register,
      logout,
      updateUser,
      addTransaction,
      getUsers,
      getAllUsers,
      getAllTransactions,
      clearRegistrationSuccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};