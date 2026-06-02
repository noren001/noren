"use client";

import Link from "next/link";
import { useCartStore } from "../../lib/store/cart";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <main className="mx-auto min-h-[calc(100vh-160px)] max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">سبد خرید</h1>
      <p className="mt-2 text-slate-600">اقلام انتخاب شده خود را بازبینی و مدیریت کنید.</p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-700">سبد خرید شما خالی است.</p>
          <Link href="/products" className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{item.name}</h2>
                  <p className="mt-2 text-sm text-slate-600">قیمت واحد: {item.price.toLocaleString()} تومان</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-900"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-900"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="rounded-full bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700"
                    onClick={() => removeItem(item.id)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-semibold text-slate-900">جمع کل: {total.toLocaleString()} تومان</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/checkout" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                ادامه به پرداخت
              </Link>
              <button
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={clearCart}
              >
                خالی کردن سبد
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
