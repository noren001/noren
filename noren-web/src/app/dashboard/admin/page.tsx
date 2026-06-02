"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth";

// انواع داده
interface Product {
  id: number;
  name: string;
  slug: string;
  basePrice: number;
  stock: number;
  isActive: boolean;
  category: { name: string } | null;
  type: string;
}

const initialProductForm = {
  name: "",
  slug: "",
  categoryId: 1,
  basePrice: 0,
  stock: -1,
  type: "other",
  isActive: true,
};

// کامپوننت مدیریت کاربران (فقط برای مالک)
function AdminUsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, adminsRes] = await Promise.all([
          api.get("/admin/users?page=1&limit=50"),
          api.get("/admin/admins"),
        ]);
        setUsers(usersRes.data.data || []);
        setAdmins(adminsRes.data || []);
      } catch (err) {
        console.error("خطا در دریافت کاربران", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm("نقش کاربر تغییر کند؟")) return;
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      const updatedAdmins = await api.get("/admin/admins");
      setAdmins(updatedAdmins.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "خطا در تغییر نقش");
    }
  };

  if (loading) return <p className="text-slate-400 py-4">در حال بارگذاری...</p>;

  return (
    <div className="space-y-8">
      {/* لیست ادمین‌ها */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">ادمین‌های فعلی</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex items-center justify-between hover:border-purple-500/30 transition"
            >
              <div>
                <p className="font-semibold text-white">{admin.name || "بدون نام"}</p>
                <p className="text-sm text-slate-400 mt-1">{admin.mobile}</p>
              </div>
              <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                {admin.role === "owner"
                  ? "مالک"
                  : admin.role === "admin_1"
                  ? "ادمین ۱"
                  : admin.role === "admin_2"
                  ? "ادمین ۲"
                  : admin.role === "admin_3"
                  ? "ادمین ۳"
                  : admin.role}
              </span>
            </div>
          ))}
          {admins.length === 0 && (
            <p className="text-slate-500 col-span-full">هیچ ادمینی یافت نشد.</p>
          )}
        </div>
      </div>

      {/* جدول کاربران */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">همه کاربران</h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-md">
          <table className="w-full text-right">
            <thead className="text-slate-300 border-b border-slate-700">
              <tr>
                <th className="p-4">نام</th>
                <th className="p-4">موبایل</th>
                <th className="p-4">نقش فعلی</th>
                <th className="p-4">تغییر نقش</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                  <td className="p-4 font-medium text-white">{u.name || "---"}</td>
                  <td className="p-4 text-slate-300" dir="ltr">{u.mobile}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        u.role === "owner"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : u.role.startsWith("admin")
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-slate-600/20 text-slate-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.role !== "owner" ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500"
                      >
                        <option value="admin_1">ادمین ۱</option>
                        <option value="admin_2">ادمین ۲</option>
                        <option value="admin_3">ادمین ۳</option>
                        <option value="user">کاربر عادی</option>
                      </select>
                    ) : (
                      <span className="text-yellow-400 text-sm">غیرقابل تغییر</span>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">
                    هیچ کاربری یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "users">("products");

  // محصولات
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 8;

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(initialProductForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/auth");
    } else if (isHydrated && user && user.role === "user") {
      router.push("/user/dashboard"); // کاربران عادی دسترسی ندارند
    }
  }, [user, isHydrated, router]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get("/products", {
        params: { page, limit, sort: "newest" },
      });
      setProducts(res.data.data || []);
      setTotalProducts(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (activeTab === "products" && user) {
      fetchProducts();
    }
  }, [activeTab, page, user]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(initialProductForm);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      categoryId: product.category ? (product.category as any).id : 1,
      basePrice: product.basePrice,
      stock: product.stock,
      type: product.type,
      isActive: product.isActive,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim() || !form.slug.trim()) {
      setFormError("نام و slug الزامی هستند");
      return;
    }
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, form);
      } else {
        await api.post("/products", form);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "خطا در ذخیره محصول");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("آیا از حذف این محصول مطمئن هستید؟")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("خطا در حذف محصول");
    }
  };

  if (!isHydrated || !user || user.role === "user") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">در حال بررسی دسترسی...</p>
      </div>
    );
  }

  const isOwner = user.role === "owner";

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* هدر */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">پنل مدیریت نورن</h1>
            <p className="mt-2 text-slate-400">
              {user.name} عزیز، به بخش مدیریت خوش آمدید.
              <span className="mr-2 inline-block rounded-full bg-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-300">
                {user.role}
              </span>
            </p>
          </div>
          <button
            onClick={() => router.push("/user/dashboard")}
            className="rounded-lg border border-slate-500/50 px-5 py-2.5 font-semibold text-slate-300 hover:bg-slate-700 transition"
          >
            بازگشت به داشبورد
          </button>
        </div>

        {/* تب‌ها */}
        <div className="mb-8 border-b border-slate-700/50">
          <div className="flex gap-4 -mb-px">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 font-medium text-sm transition border-b-2 ${
                activeTab === "products"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              مدیریت محصولات
            </button>
            {isOwner && (
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 font-medium text-sm transition border-b-2 ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                مدیریت کاربران
              </button>
            )}
          </div>
        </div>

        {/* محتوای تب‌ها */}
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">محصولات</h2>
              <button
                onClick={openCreateModal}
                className="bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-lg font-semibold transition"
              >
                + محصول جدید
              </button>
            </div>

            {loadingProducts ? (
              <p className="text-slate-400">در حال بارگذاری...</p>
            ) : (
              <>
                <div className="overflow-x-auto rounded-xl border border-slate-700/50">
                  <table className="w-full text-right bg-slate-800/50">
                    <thead className="text-slate-300 border-b border-slate-700">
                      <tr>
                        <th className="p-3">نام</th>
                        <th className="p-3">نوع</th>
                        <th className="p-3">قیمت (تومان)</th>
                        <th className="p-3">موجودی</th>
                        <th className="p-3">وضعیت</th>
                        <th className="p-3">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                          <td className="p-3 font-medium">{p.name}</td>
                          <td className="p-3 text-sm">{p.type}</td>
                          <td className="p-3">{Number(p.basePrice).toLocaleString()}</td>
                          <td className="p-3">{p.stock === -1 ? "∞" : p.stock}</td>
                          <td className="p-3">{p.isActive ? "✅" : "❌"}</td>
                          <td className="p-3 flex gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              ویرایش
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-500">محصولی یافت نشد.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalProducts > limit && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: Math.ceil(totalProducts / limit) }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1 rounded ${
                          page === i + 1 ? "bg-purple-600" : "bg-slate-700 hover:bg-slate-600"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* مودال محصول */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-lg mx-4 border border-slate-700 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">
                    {editingProduct ? "ویرایش محصول" : "محصول جدید"}
                  </h3>

                  {formError && (
                    <div className="mb-4 bg-red-500/10 border border-red-500 text-red-300 rounded-lg p-3 text-sm">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">نام محصول *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">slug *</label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">قیمت (تومان)</label>
                        <input
                          type="number"
                          value={form.basePrice}
                          onChange={(e) => setForm({ ...form, basePrice: +e.target.value })}
                          className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">موجودی</label>
                        <input
                          type="number"
                          value={form.stock}
                          onChange={(e) => setForm({ ...form, stock: +e.target.value })}
                          className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">نوع</label>
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      >
                        <option value="uc">UC</option>
                        <option value="cp">CP</option>
                        <option value="telegram_premium">پریمیوم تلگرام</option>
                        <option value="gift_card">گیفت کارت</option>
                        <option value="other">سایر</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                        id="isActive"
                      />
                      <label htmlFor="isActive" className="text-sm text-slate-300">فعال</label>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                      >
                        ذخیره
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && isOwner && <AdminUsersPanel />}
      </div>
    </main>
  );
}