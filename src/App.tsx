import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Admin/AdminLayout';
import AuthWrapper from './components/Auth/AuthWrapper';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import Dashboard from './components/Home/Dashboard';
import DepositPage from './components/Deposit/DepositPage';
import WithdrawPage from './components/Withdraw/WithdrawPage';
import TransactionsPage from './components/Transactions/TransactionsPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminLogin from './components/Auth/AdminLogin';

import AdminUserDetail from './components/Admin/AdminUserDetail';
import AdminUsersList from './components/Admin/AdminUsersList';
import SettingsPage from './components/Settings/SettingsPage';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isAdminAuthenticated, logout, updateUser, addTransaction } = useAuth();

  return (
    <div className="min-h-screen bg-deep-black text-slate-100">
        <Routes>
          {/* Admin route is always available: shows login if not admin-authenticated */}
          <Route path="/admin" element={
            isAdminAuthenticated ? (
              <ProtectedRoute requireAdmin>
                <AdminLayout onLogout={logout}>
                  <AdminDashboard 
                    users={[]} // Will be populated by component
                    transactions={[]} // Will be populated by component
                    onUpdateUser={updateUser}
                    onAddTransaction={(transaction) => {
                      // This will be handled by the AdminDashboard component itself
                      console.log('Admin transaction:', transaction);
                    }}
                  />
                </AdminLayout>
              </ProtectedRoute>
            ) : (
              <AdminLogin />
            )
          } />

          <Route path="/admin/users" element={
            isAdminAuthenticated ? (
              <ProtectedRoute requireAdmin>
                <AdminLayout onLogout={logout}>
                  <AdminUsersList />
                </AdminLayout>
              </ProtectedRoute>
            ) : (
              <AdminLogin />
            )
          } />

          <Route path="/admin/users/:id" element={
            isAdminAuthenticated ? (
              <ProtectedRoute requireAdmin>
                <AdminLayout onLogout={logout}>
                  <AdminUserDetail />
                </AdminLayout>
              </ProtectedRoute>
            ) : (
              <AdminLogin />
            )
          } />

          {/* User routes */}
          <Route path="/" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <Dashboard user={user!} transactions={user?.transactions || []} />
                </Layout>
              </ProtectedRoute>
            ) : (
              <AuthWrapper />
            )
          } />

          <Route path="/deposit" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <DepositPage onDeposit={(transaction) => {
                    // This will save the transaction to Supabase and update AuthContext
                    addTransaction(transaction);
                  }} />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          <Route path="/withdraw" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <WithdrawPage balance={user!.balance} onWithdraw={(transaction) => {
                    // This will save the transaction to Supabase and update AuthContext
                    addTransaction(transaction);
                  }} />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          <Route path="/transactions" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <TransactionsPage transactions={user?.transactions || []} userBalance={user?.balance || 0} />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />



          <Route path="/settings" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#111111',
            color: '#f1f5f9',
            border: '1px solid #334155'
          }
        }} />
      </Router>
    </AuthProvider>
  );
}

export default App;