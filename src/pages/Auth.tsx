import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import brandBag from '@/assets/brand-handbags.jpg';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authRole, setAuthRole] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, signUp, user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      navigate(isAdmin ? '/admin' : '/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Login failed',
            description: error.message === 'Invalid login credentials' 
              ? 'Invalid email or password. Please try again.'
              : error.message,
            variant: 'destructive',
          });
        } else {
          if (authRole === 'admin') {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) {
              throw userError || new Error('Unable to load user session');
            }

            const { data: role, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', userData.user.id)
              .eq('role', 'admin')
              .maybeSingle();

            if (roleError) {
              throw roleError;
            }

            if (!role) {
              await supabase.auth.signOut();
              toast({
                title: 'Admin access required',
                description: 'This account is not assigned the admin role. Please contact an administrator or assign the role in Supabase.',
                variant: 'destructive',
                duration: 10000, // Show for 10 seconds
              });
              console.error('Admin role not found. User ID:', userData.user.id);
              console.error('To assign admin role, run in Supabase SQL Editor:');
              console.error(`SELECT public.assign_admin_role_by_id('${userData.user.id}');`);
              return;
            }

            toast({
              title: 'Welcome back, admin!',
              description: 'Redirecting to your dashboard.',
            });
            navigate('/admin');
            return;
          }

          toast({
            title: 'Welcome back!',
            description: 'You have successfully logged in.',
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Account exists',
              description: 'This email is already registered. Please log in instead.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Sign up failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Account created!',
            description: 'Welcome to The Ridma Luxury.',
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={brandBag}
          alt="The Ridma Luxury shopping products"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-background">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm tracking-widest uppercase">Back to Store</span>
        </Link>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="flex items-center gap-3 mb-6">
            <Button
              type="button"
              variant={authRole === 'user' ? 'luxury' : 'outline'}
              onClick={() => setAuthRole('user')}
              className="flex-1"
            >
              Shopper
            </Button>
            <Button
              type="button"
              variant={authRole === 'admin' ? 'luxury' : 'outline'}
              onClick={() => {
                setAuthRole('admin');
                setIsLogin(true);
              }}
              className="flex-1"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </div>

          <h1 className="font-display text-4xl mb-2">
            {authRole === 'admin' 
              ? 'Admin Access' 
              : isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {authRole === 'admin'
              ? 'Sign in with an admin-approved account to manage the store.'
              : isLogin 
                ? 'Sign in to access your account and continue shopping.'
                : 'Join The Ridma Luxury for a faster shopping experience.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {(!isLogin && authRole === 'user') && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs tracking-widest uppercase">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 rounded-none border-border/50 focus:border-primary"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs tracking-widest uppercase">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="Enter your email"
                className={`h-12 rounded-none border-border/50 focus:border-primary ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs tracking-widest uppercase">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Enter your password"
                  className={`h-12 rounded-none border-border/50 focus:border-primary pr-12 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="luxury"
              size="xl"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Please wait...' 
                : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {authRole === 'user' && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="ml-2 text-primary hover:underline font-medium"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
