"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminShell from "../../../components/AdminShell";
import ProductForm from "../../../components/ProductForm";
import { toast, Toaster } from "react-hot-toast";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/admin/products/${params.id}`), // Need to create this endpoint or fetch from list and filter
          fetch("/api/admin/categories")
        ]);
        
        // As a quick workaround since we might not have a single GET endpoint:
        // Fetch all and find, or assume we pass data. It's better to fetch single if possible.
        // Wait, the products API returns a list. Let's fetch the list and find the product for now.
        const catData = await catRes.json();
        setCategories(catData.categories || []);

        const prodListRes = await fetch(`/api/admin/products?limit=1000`);
        const prodData = await prodListRes.json();
        const p = prodData.products?.find(p => p.id === params.id);
        
        if (p) {
          setInitialData({
            id: p.id,
            name: p.name || "", slug: p.slug || "", category_id: p.category_id || "",
            description: p.description || "", full_description: p.full_description || "",
            images: p.images || [], tiers: p.tiers || [], specifications: p.specifications || [],
            sizes: p.sizes || [], tags: p.tags || [],
            is_active: p.is_active ?? true, is_featured: p.is_featured ?? false,
            meta_title: p.meta_title || "", meta_description: p.meta_description || "",
            sort_order: p.sort_order ?? 0,
          });
        } else {
          toast.error("Product not found");
          router.push("/admin/products");
        }
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchData();
  }, [params.id, router]);

  async function handleSave(form) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  }

  return (
    <AdminShell 
      title="Edit Product"
      breadcrumbs={[
        { label: "Products", href: "/admin/products" },
        { label: "Edit Product" }
      ]}
    >
      <Toaster position="top-right" toastOptions={{ className: "admin-toast" }} />
      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center" }}><span className="spinner" /></div>
      ) : initialData ? (
        <ProductForm 
          initialData={initialData} 
          categories={categories}
          onSubmit={handleSave} 
          onCancel={() => router.push("/admin/products")}
          saving={saving}
        />
      ) : null}
    </AdminShell>
  );
}
