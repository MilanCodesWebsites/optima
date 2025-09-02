import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const adminSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Admin password is required')
});

const AdminLogin: React.FC = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(adminSchema)
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const success = await adminLogin(data.email, data.password);
      if (success) {
        toast.success('Welcome, Admin!');
        navigate('/admin', { replace: true });
      } else {
        toast.error('Invalid admin credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto relative">
        <div className="pointer-events-none absolute -inset-2 sm:-inset-x-10 -top-4 sm:-top-10 -bottom-4 sm:-bottom-10 opacity-40">
          <div className="absolute -top-2 sm:-top-6 -left-2 sm:-left-8 w-32 sm:w-64 h-32 sm:h-64 bg-red-500/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 -right-2 sm:-right-10 w-36 sm:w-72 h-36 sm:h-72 bg-red-700/20 blur-3xl rounded-full" />
        </div>
        <div className="relative bg-deep-black border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 sm:p-10">
          <div className="text-center mb-6 sm:mb-8 sm:mb-10">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/75903197-21b2-4fa6-a139-2405ad6d4ef7-Gemini_Generated_Image_wzjx3bwzjx3bwzjx.png" alt="Optima" className="h-12 sm:h-16" />
            </div>
            <h2 className="text-lg sm:text-xl sm:text-2xl font-semibold text-slate-200 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> Admin Panel Login
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Admin Email</label>
              <Input icon={Mail} placeholder="Enter admin email" type="email" {...register('email')} error={errors.email?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Admin Password</label>
              <div className="relative">
                <Input icon={Lock} placeholder="Enter admin password" type={showPassword ? 'text' : 'password'} {...register('password')} error={errors.password?.message} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-400 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>Access Admin Panel</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;


