"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminShell from "../../../components/AdminShell";
import CategoryForm from "../../../components/CategoryForm";
import { toast, Toaster } from "react-hot-toast";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/admin/categories`);
        const data = await res.json();
        const cat = data.categories?.find(c => c.id === params.id);
        
        if (cat) {
          setInitialData({
            id: cat.id,
            name: cat.name || "", slug: cat.slug || "", description: cat.description || "",
            full_description: cat.full_description || "", image_url: cat.image_url || "",
            banner_url: cat.banner_url || "", meta_title: cat.meta_title || "",
            meta_description: cat.meta_description || "", is_active: cat.is_active ?? true,
            sort_order: cat.sort_order ?? 0,
          });
        } else {
          toast.error("Category not found");
          router.push("/admin/categories");
        }
      } catch (err) {
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchData();
  }, [params.id, router]);

  async function handleSave(form) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Category updated successfully");
      router.push("/admin/categories");
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  }

  return (
    <AdminShell 
      title="Edit Category"
      breadcrumbs={[
        { label: "Categories", href: "/admin/categories" },
        { label: "Edit Category" }
      ]}
    >
      <Toaster position="top-right" toastOptions={{ className: "admin-toast" }} />
      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center" }}><span className="spinner" /></div>
      ) : initialData ? (
        <CategoryForm 
          initialData={initialData} 
          onSubmit={handleSave} 
          onCancel={() => router.push("/admin/categories")}
          saving={saving}
        />
      ) : null}
    </AdminShell>
  );
}
