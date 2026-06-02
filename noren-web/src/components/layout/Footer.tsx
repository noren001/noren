export default function Footer() {
  return (
    <footer className="border-t border-slate-700/50 bg-linear-to-b from-slate-800 to-slate-900 py-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-linear-to-br from-blue-500 to-purple-600 p-2">
                <span className="text-lg font-bold text-white">N</span>
              </div>
              <span className="text-lg font-bold text-white">نُرن</span>
            </div>
            <p className="text-sm text-slate-400">خریدی ساده، سریع و امن برای همه</p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">محصولات</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition">محصولات جدید</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">فروش ویژه</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">پرفروش‌ترین‌ها</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">پشتیبانی</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition">تماس با ما</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">سوالات متداول</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">شرایط و ضوابط</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">قانونی</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition">حریم خصوصی</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">سیاست فروش</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">بازگشت کالا</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-slate-700/50"></div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
          <p>© 2026 نُرن. تمامی حقوق محفوظ است.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-400 transition">توییتر</a>
            <a href="#" className="hover:text-blue-400 transition">اینستاگرام</a>
            <a href="#" className="hover:text-blue-400 transition">لینکدین</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
