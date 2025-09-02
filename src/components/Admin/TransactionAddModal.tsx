import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DollarSign, Wallet, Save, User, TrendingUp, TrendingDown, ArrowDown, ArrowUp } from 'lucide-react';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';

const transactionSchema = yup.object({
  type: yup.string().oneOf(['profit', 'loss', 'deposit', 'withdrawal']).required('Type is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be greater than 0')
    .required('Amount is required'),
  currency: yup.string().required('Currency is required'),
  walletAddress: yup.string().optional(),
  userId: yup.string().required('User is required')
});

interface TransactionAddModalProps {
  users: Array<{ id: string; firstName: string; lastName: string }>;
  selectedUserId: string;
  onSave: (data: any) => void;
  onClose: () => void;
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

const TransactionAddModal: React.FC<TransactionAddModalProps> = ({ users, selectedUserId, onSave, onClose }) => {
  const [selectedType, setSelectedType] = useState('deposit');
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      type: 'deposit',
      amount: undefined,
      currency: 'USDT',
      walletAddress: '',
      userId: selectedUserId || (users[0]?.id ?? '')
    }
  });

  const watchType = watch('type');

  const onSubmit = (data: any) => {
    onSave({
      type: data.type,
      amount: Number(data.amount),
      currency: data.currency,
      walletAddress: data.walletAddress || undefined
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Add Transaction" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Transaction Type Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-3">Transaction Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {transactionTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = watchType === type.value;
              return (
                <div
                  key={type.value}
                  className={`
                    relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
                    ${isSelected ? type.color : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600/50'}
                  `}
                  onClick={() => setSelectedType(type.value)}
                >
                  <input
                    type="radio"
                    value={type.value}
                    {...register('type')}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-current' : 'text-slate-500'}`} />
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
          {errors.type && <p className="mt-2 text-sm text-red-400">{String(errors.type.message)}</p>}
        </div>

        {/* User Selection and Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">User</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-3 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                {...register('userId')}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                ))}
              </select>
            </div>
            {errors.userId && <p className="mt-1 text-sm text-red-400">{String(errors.userId.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Amount</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="number"
                step="0.01"
                placeholder="Enter amount"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-3 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                {...register('amount')}
              />
            </div>
            {errors.amount && <p className="mt-1 text-sm text-red-400">{String(errors.amount.message)}</p>}
          </div>
        </div>

        {/* Currency Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Currency</label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
            {...register('currency')}
          >
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="SOL">SOL</option>
          </select>
          {errors.currency && <p className="mt-1 text-sm text-red-400">{String(errors.currency.message)}</p>}
        </div>

        {/* Wallet Address (optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Wallet Address <span className="text-slate-500 text-xs">(optional)</span>
          </label>
          <div className="relative">
            <Wallet className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Enter wallet address"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-3 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              {...register('walletAddress')}
            />
          </div>
          {errors.walletAddress && <p className="mt-1 text-sm text-red-400">{String(errors.walletAddress.message)}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="flex-1 order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            icon={Save} 
            className="flex-1 order-1 sm:order-2"
          >
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionAddModal;


