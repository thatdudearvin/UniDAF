import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { authService } from '../services/api/auth';
import { useAuthStore } from '../store/authStore';
import { LoginCredentials, UserRole } from '../types/auth';


const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.token);
      toast.success('Welcome back 👋');

      switch (response.user.role) {
        case UserRole.STUDENT:
          navigate('/student');
          break;
        case UserRole.TEACHING_STAFF:
          navigate('/teacher');
          break;
        case UserRole.NON_TEACHING_STAFF:
        case UserRole.ADMIN:
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute w-72 h-72 bg-pink-300 rounded-full -top-20 -left-16 opacity-40 animate-blob"></div>
        <div className="absolute w-72 h-72 bg-purple-300 rounded-full -bottom-20 -right-16 opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Soft glow */}
        <div className="absolute inset-0 bg-white/10 blur-3xl rounded-3xl" />

        {/* Card */}
        <div className="relative bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              UniDAF Portal
            </h1>
            <p className="text-gray-600 mt-2">Sign in to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full rounded-2xl border border-gray-300 pl-12 pr-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400
                    shadow-sm transition duration-300"
                  placeholder="you@university.edu"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full rounded-2xl border border-gray-300 pl-12 pr-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400
                    shadow-sm transition duration-300"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(228, 145, 201, 0.5)' }}
              whileTap={{ scale: 0.97 }}
              disabled={isLoading}
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl
                bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white py-3 font-semibold
                shadow-lg hover:opacity-90 transition-all disabled:opacity-60"
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 rounded-2xl bg-white/70 p-4 text-xs text-gray-700 shadow-inner">
            <p className="font-semibold mb-1">Demo accounts</p>
            <p>Student: student@university.edu / Student@123</p>
            <p>Teacher: teacher@university.edu / Teacher@123</p>
            <p>Admin: admin@university.edu / Admin@123</p>
          </div>
        </div>
      </motion.div>

      {/* Blob animation CSS */}
      <style>
        {`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob { animation: blob 8s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}
      </style>
    </div>
  );
};

export default Login;
