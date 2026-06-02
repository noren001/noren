import Link from "next/link";

export default function DashboardFooter() {
  return (
    <footer className="border-t border-slate-700/50 bg-linear-to-b from-slate-800 to-slate-900 py-8 mt-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/products" className="hover:text-blue-400 transition">محصولات</Link></li>
              <li><Link href="/cart" className="hover:text-blue-400 transition">سبد خرید</Link></li>
              <li><Link href="/checkout" className="hover:text-blue-400 transition">پرداخت</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">پشتیبانی</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition">تماس با ما</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">سوالات متداول</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">حریم خصوصی</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-slate-700/50"></div>

        {/* Bottom */}
        <div className="text-sm text-slate-400 text-center">
          <p>© 2026 نُرن. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
