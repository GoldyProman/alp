"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../../components/AdminShell";
import CategoryForm from "../../components/CategoryForm";
import { toast, Toaster } from "react-hot-toast";

const EMPTY_FORM = {
  name: "", slug: "", description: "", full_description: "",
  image_url: "", banner_url: "", meta_title: "", meta_description: "",
  is_active: true, sort_order: 0,
};

export default function NewCategoryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSave(form) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Category created successfully");
      router.push("/admin/categories");
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  }

  return (
    <AdminShell 
      title="Add New Category"
      breadcrumbs={[
        { label: "Categories", href: "/admin/categories" },
        { label: "New Category" }
      ]}
    >
      <Toaster position="top-right" toastOptions={{ className: "admin-toast" }} />
      <CategoryForm 
        initialData={EMPTY_FORM} 
        onSubmit={handleSave} 
        onCancel={() => router.push("/admin/categories")}
        saving={saving}
      />
    </AdminShell>
  );
}
