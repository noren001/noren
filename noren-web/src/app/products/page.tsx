import Link from "next/link";

const products = [
  { slug: "organic-tea", title: "چای ارگانیک", price: 129000, description: "طعم طبیعی و تازه برای هر روز" },
  { slug: "coffee-beans", title: "دانه قهوه ویژه", price: 199000, description: "عطر و طعم قهوه ناب برای شروع روز" },
  { slug: "saffron-powder", title: "زعفران ممتاز", price: 349000, description: "رنگ و عطر بی‌نظیر برای غذاها و نوشیدنی‌ها" },
];

export default function ProductsPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-160px)] max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">فروشگاه محصولات</h1>
        <p className="mt-2 text-slate-600">محصولات منتخب ما را مشاهده و به سبد خود اضافه کنید.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <article key={product.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <h2 className="text-xl font-semibold text-slate-900">{product.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="text-lg font-semibold text-slate-900">{product.price.toLocaleString()} تومان</span>
              <Link href={`/products/${product.slug}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                مشاهده
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
