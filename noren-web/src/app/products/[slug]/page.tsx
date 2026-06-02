import Link from "next/link";

const products = [
  { slug: "organic-tea", title: "چای ارگانیک", price: 129000, description: "چای تازه و سالم با عطر طبیعی." },
  { slug: "coffee-beans", title: "دانه قهوه ویژه", price: 199000, description: "دانه‌های قهوه خاص برای یک تجربه متفاوت." },
  { slug: "saffron-powder", title: "زعفران ممتاز", price: 349000, description: "رنگ و عطر بی‌نظیر برای آشپزی و نوشیدنی." },
];

type PageProps = {
  params: {
    slug: string;
  };
};

export default function ProductDetailPage({ params }: PageProps) {
  const product = products.find((item) => item.slug === params.slug);

  if (!product) {
    return (
      <main className="mx-auto min-h-[calc(100vh-160px)] max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">محصول مورد نظر یافت نشد</h1>
        <p className="mt-3 text-slate-600">لطفاً دوباره از لیست محصولات بازدید کنید.</p>
        <Link href="/products" className="mt-6 inline-block rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
          بازگشت به فروشگاه
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-160px)] max-w-3xl px-6 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{product.title}</h1>
        <p className="mt-4 text-slate-600">{product.description}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-2xl font-semibold text-slate-900">{product.price.toLocaleString()} تومان</span>
          <Link href="/cart" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
            اضافه به سبد خرید
          </Link>
        </div>
      </div>
    </main>
  );
}
