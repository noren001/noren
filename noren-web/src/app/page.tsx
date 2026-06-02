import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
                خوش آمدید به نُرن
              </p>
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                خرید <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">آسان</span> و
                <br />
                <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">سریع</span>
              </h1>
              <p className="text-lg leading-relaxed text-slate-300">
                تجربه خریدی بدون دردسر. محصولات باکیفیت، پرداخت محفوظ و خدمات رفیقانه.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/products"
                className="group rounded-xl bg-linear-to-r from-blue-500 to-purple-600 px-8 py-4 text-center font-semibold text-white shadow-lg transition duration-300 hover:shadow-2xl hover:shadow-blue-500/50 active:scale-95"
              >
                مشاهده محصولات
              </Link>
              <Link
                href="/auth"
                className="rounded-xl border-2 border-slate-600 px-8 py-4 text-center font-semibold text-white transition duration-300 hover:border-blue-500 hover:bg-slate-700/50"
              >
                ورود / ثبت‌نام
              </Link>
            </div>
          </div>

          {/* Right side - Features */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "📦", title: "محصولات منتخب", desc: "کیفیت تضمین شده" },
              { icon: "🛒", title: "سبد خرید", desc: "ذخیره و مدیریت آسان" },
              { icon: "👤", title: "حساب کاربری", desc: "داشبورد شخصی" },
              { icon: "💳", title: "پرداخت امن", desc: "تراکنش محفوظ" },
            ].map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-slate-700 bg-linear-to-br from-slate-800 to-slate-900 p-6 transition duration-300 hover:border-blue-500/50 hover:bg-slate-800/50"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-white group-hover:text-blue-400">{feature.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
