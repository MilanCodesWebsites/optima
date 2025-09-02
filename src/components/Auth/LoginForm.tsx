import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../UI/Button';
import Input from '../UI/Input';

const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
});

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onAdminLogin: (email: string, password: string) => Promise<boolean>; // kept for compatibility, not used
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onAdminLogin, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const success = await onLogin(data.email, data.password);
      if (success) {
        toast.success('Login successful!');
            
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto relative px-4 sm:px-0">
      {/* Abstract green background accents - mobile responsive */}
      <div className="pointer-events-none absolute -inset-2 sm:-inset-x-6 sm:-inset-x-10 -top-4 sm:-top-6 sm:-top-10 -bottom-4 sm:-bottom-6 sm:-bottom-10 opacity-40">
        <div className="absolute -top-2 sm:-top-4 sm:-top-6 -left-2 sm:-left-6 sm:-left-8 w-32 sm:w-48 sm:w-64 h-32 sm:h-48 sm:h-64 bg-neon-green/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 -right-2 sm:-right-6 sm:-right-10 w-36 sm:w-56 sm:w-72 h-36 sm:h-56 sm:h-72 bg-dark-green/20 blur-3xl rounded-full" />
      </div>
      <div className="relative bg-deep-black border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 sm:p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/75903197-21b2-4fa6-a139-2405ad6d4ef7-Gemini_Generated_Image_wzjx3bwzjx3bwzjx.png" alt="Optima" className="h-12 sm:h-16 sm:h-18 md:h-20" />
          </div>
          <h2 className="text-lg sm:text-xl sm:text-2xl font-semibold text-slate-200">Sign in to continue trading</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">Email Address</label>
            <Input
              icon={Mail}
              placeholder="Enter your email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">Password</label>
            <div className="relative">
              <Input
                icon={Lock}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                {...register('password')}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-neon-green transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 sm:py-3.5 md:py-4 text-sm sm:text-base font-medium"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Switch to Register */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-neon-green hover:text-dark-green font-medium transition-colors"
              >
              Sign up here
              </button>
            </p>
          </div>
      </div>
    </div>
  );
};

export default LoginForm;