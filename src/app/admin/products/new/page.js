"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../../components/AdminShell";
import ProductForm from "../../components/ProductForm";
import { toast, Toaster } from "react-hot-toast";

const EMPTY_FORM = {
  name: "", slug: "", category_id: "", description: "", full_description: "",
  images: [], tiers: [], specifications: [], sizes: [], tags: [],
  is_active: true, is_featured: false,
  meta_title: "", meta_description: "", sort_order: 0,
};

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    }
    fetchCategories();
  }, []);

  async function handleSave(form) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  }

  return (
    <AdminShell 
      title="Add New Product"
      breadcrumbs={[
        { label: "Products", href: "/admin/products" },
        { label: "New Product" }
      ]}
    >
      <Toaster position="top-right" toastOptions={{ className: "admin-toast" }} />
      <ProductForm 
        initialData={EMPTY_FORM} 
        categories={categories}
        onSubmit={handleSave} 
        onCancel={() => router.push("/admin/products")}
        saving={saving}
      />
    </AdminShell>
  );
}
