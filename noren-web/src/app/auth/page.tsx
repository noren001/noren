'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth';

type Step =
  | 'mobile'
  | 'otp'
  | 'complete_profile'
  | 'enter_password';

export default function AuthPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration before checking auth
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect to dashboard if already logged in (after hydration)
  useEffect(() => {
    if (isHydrated && user) {
      router.push('/dashboard');
    }
  }, [user, isHydrated, router]);

  const [step, setStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const [showOtpNotification, setShowOtpNotification] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const formatMobile = (val: string) => {
    let normalized = val.replace(/\D/g, '');
    // اگر فقط ۹ رقم بود (بدون ۰)
    if (normalized.length === 10 && normalized.startsWith('9')) {
      normalized = '0' + normalized;
    }
    return normalized.slice(0, 11);
  };

  const isValidMobile = (val: string): boolean => {
    const normalized = formatMobile(val);
    return normalized.length === 11 && normalized.startsWith('09');
  };

  const handleSendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const normalizedMobile = formatMobile(mobile);
      
      if (!isValidMobile(normalizedMobile)) {
        setError('شماره موبایل معتبر نیست. مثال: ۰۹۱۲۳۴۵۶۷۸۹');
        setLoading(false);
        return;
      }

      const res = await api.post('/auth/send-otp', { mobile: normalizedMobile });
      const { isNewUser: isNew } = res.data.data;
      const devCode = res.data.devCode;

      setIsNewUser(isNew);
      setOtpCode(devCode);
      setShowOtpNotification(true);
      setStep('otp');
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;      
      setError(axiosError.response?.data?.message || 'خطا در ارسال کد');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const normalizedMobile = formatMobile(mobile);
      const res = await api.post('/auth/verify-otp', { 
        mobile: normalizedMobile, 
        code 
      });
      const { step: nextStep, token } = res.data;

      setShowOtpNotification(false);

      if (nextStep === 'logged_in') {
        login(res.data.user, token);
        router.push('/dashboard');
      } else if (nextStep === 'complete_profile') {
        setStep('complete_profile');
      } else if (nextStep === 'enter_password') {
        setStep('enter_password');
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'کد نامعتبر');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    setError('');
    setLoading(true);
    try {
      const endpoint = isNewUser
        ? '/auth/complete-profile'
        : '/auth/update-incomplete-profile';

      interface ProfileBody {
        mobile: string;
        name: string;
        email?: string;
        password?: string;
      }

      const normalizedMobile = formatMobile(mobile);
      const body: ProfileBody = { mobile: normalizedMobile, name };
      if (email.trim()) body.email = email;
      if (isNewUser) body.password = password;

      const res = await api.post(endpoint, body);
      login(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'خطا در تکمیل اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPassword = async () => {
    setError('');
    setLoading(true);
    try {
      const normalizedMobile = formatMobile(mobile);
      const res = await api.post('/auth/login-password', { 
        mobile: normalizedMobile, 
        password 
      });
      login(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'رمز اشتباه');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during hydration or redirect
  if (!isHydrated) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-slate-400">درحال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>

      {/* OTP Notification */}
      {showOtpNotification && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
          <div className="bg-linear-to-br from-emerald-500 to-green-600 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center animate-bounce border border-emerald-400/50 pointer-events-auto">
            <div className="text-3xl mb-3">✓</div>
            <p className="text-white text-sm mb-3 font-medium">کد تایید برای</p>
            <p className="text-white text-sm mb-2">{mobile}</p>
            <p className="text-5xl font-bold text-white tracking-[0.3em] mb-4 font-mono" dir="ltr">
              {otpCode}
            </p>
            <p className="text-emerald-100 text-xs">این کد تا ۲ دقیقه معتبر است</p>
            <button
              onClick={() => setShowOtpNotification(false)}
              className="mt-4 w-full rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 transition"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50"></div>
        
        <div className="relative rounded-3xl border border-slate-700/50 bg-linear-to-br from-slate-900 to-slate-800 backdrop-blur-xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-block rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 p-3 mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">نُرن</h1>
            <p className="text-slate-400 text-sm">
              {step === 'mobile' && 'ورود / ثبت‌نام'}
              {step === 'otp' && 'تأیید کد'}
              {step === 'complete_profile' && (isNewUser ? 'تکمیل پروفایل' : 'تکمیل اطلاعات')}
              {step === 'enter_password' && 'ورود با رمز عبور'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-300 flex gap-3 items-start">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Forms */}
          {step === 'mobile' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">شماره موبایل</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(formatMobile(e.target.value))}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  maxLength={11}
                  className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-800/50 text-white text-center text-lg tracking-wider placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                  dir="ltr"
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={mobile.length < 11 || loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95"
              >
                {loading ? '⏳ در حال ارسال...' : 'ارسال کد'}
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-5">
              <p className="text-slate-400 text-sm text-center">
                کد ۶ رقمی ارسال شده به <span className="text-blue-400 font-medium">{mobile}</span> را وارد کنید
              </p>
              {otpCode && (
                <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">کد توسعه دهنده:</p>
                  <p className="text-lg font-mono text-blue-400">{otpCode}</p>
                </div>
              )}
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="●●●●●●"
                maxLength={6}
                className="w-full px-4 py-4 rounded-xl border border-slate-600 bg-slate-800/50 text-white text-2xl text-center tracking-[0.3em] font-mono placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                dir="ltr"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={code.length < 6 || loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95"
              >
                {loading ? '⏳ در حال بررسی...' : 'تأیید کد'}
              </button>
              <button
                onClick={() => {
                  setStep('mobile');
                  setCode('');
                  setError('');
                  setShowOtpNotification(false);
                }}
                className="w-full py-2 text-slate-400 hover:text-blue-400 text-sm transition"
              >
                ← اصلاح شماره موبایل
              </button>
            </div>
          )}

          {step === 'complete_profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">نام و نام خانوادگی</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام خود را وارد کنید"
                  className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-800/50 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ایمیل <span className="text-slate-500 font-normal">(اختیاری)</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-800/50 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                  dir="ltr"
                />
              </div>
              {isNewUser && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">رمز عبور</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="حداقل ۶ کاراکتر"
                    className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-800/50 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                    dir="ltr"
                  />
                </div>
              )}
              <button
                onClick={handleCompleteProfile}
                disabled={!name || (isNewUser && password.length < 6) || loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95 mt-2"
              >
                {loading ? '⏳ در حال ذخیره...' : 'تکمیل و ورود'}
              </button>
            </div>
          )}

          {step === 'enter_password' && (
            <div className="space-y-5">
              <p className="text-slate-400 text-sm text-center">رمز عبور خود را وارد کنید</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور"
                className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-800/50 text-white text-center placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                dir="ltr"
              />
              <button
                onClick={handleLoginPassword}
                disabled={!password || loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95"
              >
                {loading ? '⏳ در حال ورود...' : 'ورود'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}