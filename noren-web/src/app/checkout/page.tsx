import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-160px)] max-w-4xl px-6 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">صفحه پرداخت</h1>
        <p className="mt-3 text-slate-600">این بخش برای بررسی نهایی سفارش و تکمیل فرایند پرداخت طراحی شده است.</p>

        <div className="mt-8 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">خلاصه سفارش</h2>
            <p className="mt-3 text-sm text-slate-600">محصولات شما در سبد خرید آماده پرداخت هستند.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">اطلاعات پرداخت</h2>
            <p className="mt-3 text-sm text-slate-600">اینجا می‌توانید روش پرداخت و اطلاعات تحویل را اضافه کنید.</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/cart" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              بازگشت به سبد خرید
            </Link>
            <button className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
              تکمیل فرایند پرداخت
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
