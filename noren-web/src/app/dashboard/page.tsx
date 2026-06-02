"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/auth");
    }
  }, [user, isHydrated, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">درحال بارگذاری...</p>
      </div>
    );
  }

  const isAdmin = user.role !== "user"; // شامل مالک و ادمین‌ها

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6">
      {/* تزئینات پس‌زمینه */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* هدر */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">داشبورد شما</h1>
            <p className="mt-2 text-slate-400">
              خوش آمدید، {user.name}!
              {isAdmin && (
                <span className="mr-2 inline-block rounded-full bg-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-300">
                  {user.role === "owner"
                    ? "مالک"
                    : user.role === "admin_1"
                    ? "ادمین ۱"
                    : user.role === "admin_2"
                    ? "ادمین ۲"
                    : user.role === "admin_3"
                    ? "ادمین ۳"
                    : ""}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-500/50 px-5 py-2.5 font-semibold text-red-400 transition duration-200 hover:bg-red-500/10 hover:border-red-400 active:scale-95"
          >
            خروج از حساب
          </button>
        </div>

        {/* کارت‌های پروفایل */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="group rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl p-6 hover:border-blue-500/30 transition">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400">نام کاربر</h3>
                <p className="text-xl font-semibold text-white">{user.name}</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl p-6 hover:border-purple-500/30 transition">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-3">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400">ایمیل</h3>
                <p className="text-lg font-semibold text-white break-all">
                  {user.email || "---"}
                </p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl p-6 hover:border-green-500/30 transition">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3">
                <span className="text-2xl">🆔</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400">شناسه کاربر</h3>
                <p className="text-sm font-mono text-blue-400">
                  {user.id.slice(0, 8)}...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* دسترسی سریع */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">دسترسی سریع</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/products"
              className="group rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 p-5 hover:border-blue-500/50 transition"
            >
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-semibold text-white group-hover:text-blue-400 transition">
                محصولات
              </h3>
              <p className="text-sm text-slate-400 mt-1">مشاهده و خرید محصولات</p>
            </Link>

            <Link
              href="/cart"
              className="group rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 p-5 hover:border-purple-500/50 transition"
            >
              <div className="text-3xl mb-2">🛒</div>
              <h3 className="font-semibold text-white group-hover:text-purple-400 transition">
                سبد خرید
              </h3>
              <p className="text-sm text-slate-400 mt-1">مشاهده و مدیریت سبد خرید</p>
            </Link>

            <Link
              href="/checkout"
              className="group rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 p-5 hover:border-green-500/50 transition"
            >
              <div className="text-3xl mb-2">💳</div>
              <h3 className="font-semibold text-white group-hover:text-green-400 transition">
                پرداخت
              </h3>
              <p className="text-sm text-slate-400 mt-1">انجام خرید و پرداخت</p>
            </Link>

            {/* فقط برای ادمین و مالک */}
            {isAdmin && (
              <Link
                href="/dashboard/admin"
                className="group rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-900/30 to-slate-900 p-5 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition"
              >
                <div className="text-3xl mb-2">⚙️</div>
                <h3 className="font-semibold text-white group-hover:text-purple-300 transition">
                  پنل مدیریت
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  مدیریت محصولات، کاربران و سفارش‌ها
                </p>
              </Link>
            )}
          </div>
        </div>

        {/* اطلاعات حساب */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl p-8">
            <h3 className="text-lg font-semibold text-white mb-6">سفارش‌های شما</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/20 border border-slate-600/30">
                <span className="text-slate-300">تعداد سفارش‌ها</span>
                <span className="text-2xl font-bold text-blue-400">۰</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/20 border border-slate-600/30">
                <span className="text-slate-300">سفارش‌های تکمیل شده</span>
                <span className="text-2xl font-bold text-green-400">۰</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/20 border border-slate-600/30">
                <span className="text-slate-300">سفارش‌های در حال انجام</span>
                <span className="text-2xl font-bold text-yellow-400">۰</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl p-8">
            <h3 className="text-lg font-semibold text-white mb-6">اطلاعات حساب</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-700/20 border border-slate-600/30">
                <p className="text-sm text-slate-400">وضعیت حساب</p>
                <p className="text-base font-semibold text-green-400 mt-1">✓ فعال</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/20 border border-slate-600/30">
                <p className="text-sm text-slate-400">تاریخ عضویت</p>
                <p className="text-sm text-slate-300 mt-1">
                  {new Date().toLocaleDateString("fa-IR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}