"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../components/AdminShell";
import { ConfirmDialog } from "../components/FormFields";
import { Toaster, toast } from "react-hot-toast";
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight, X, Image as ImageIcon } from "lucide-react";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null); // { id, name }

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/categories?search=${encodeURIComponent(search)}`);
    if (res.status === 401) { router.push("/admin"); return; }
    const data = await res.json();
    setCategories(data.categories || []);
    setLoading(false);
  }, [search, router]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  function openCreate() {
    router.push("/admin/categories/new");
  }

  function openEdit(cat) {
    router.push(`/admin/categories/${cat.id}/edit`);
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirm(null);
    }
  }

  async function toggleActive(cat) {
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !cat.is_active }),
      });
      if (!res.ok) throw new Error("Update failed");
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <AdminShell
      title="Categories"
      actions={
        <button className="btn-admin btn-admin-primary" onClick={openCreate}>
          <Plus size={16} /> Add Category
        </button>
      }
    >
      <Toaster position="top-right" toastOptions={{ className: "admin-toast" }} />

      <div className="admin-card">
        {/* Toolbar */}
        <div className="admin-card-header">
          <div className="admin-search">
            <Search size={16} style={{ color: "var(--admin-text-muted)", flexShrink: 0 }} />
            <input
              placeholder="Search categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="btn-admin btn-admin-ghost btn-admin-icon" onClick={() => setSearch("")} style={{ padding: "2px", minWidth: "unset", minHeight: "unset" }}>
                <X size={14} />
              </button>
            )}
          </div>
          <span style={{ fontSize: "13px", color: "var(--admin-text-muted)", fontWeight: 500 }}>
            {categories.length} categor{categories.length === 1 ? "y" : "ies"}
          </span>
        </div>

        {/* Table */}
        <div className="admin-table-wrap">
          {loading ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
              <span className="spinner" />
            </div>
          ) : categories.length === 0 ? (
            <div className="admin-empty" style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <div className="admin-empty-icon" style={{ fontSize: "48px", marginBottom: "1rem", opacity: 0.5 }}>🗂️</div>
              <h3 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "24px", textTransform: "uppercase", marginBottom: "0.5rem" }}>No Categories</h3>
              <p style={{ fontSize: "14px", color: "var(--admin-text-muted)", marginBottom: "1.5rem" }}>Click "Add Category" to create your first category structure.</p>
              <button className="btn-admin btn-admin-primary" onClick={openCreate}>
                <Plus size={16} /> Create Category
              </button>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Visibility</th>
                  <th>Sort</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td data-label="Name">
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        {cat.image_url ? (
                          <img src={cat.image_url} alt={cat.name}
                            style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--admin-border)" }} />
                        ) : (
                          <div style={{ width: "40px", height: "40px", borderRadius: "6px", background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ImageIcon size={18} style={{ color: "var(--admin-text-muted)" }} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--admin-text)", fontSize: "14px" }}>{cat.name}</div>
                          <code style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>/{cat.slug}</code>
                        </div>
                      </div>
                    </td>
                    <td data-label="Description" style={{ maxWidth: "300px" }}>
                      <span className="truncate" style={{ display: "block", fontSize: "13px", color: "var(--admin-text-secondary)" }}>
                        {cat.description || <em style={{ color: "var(--admin-text-muted)" }}>No description</em>}
                      </span>
                    </td>
                    <td data-label="Status">
                      <button
                        onClick={() => toggleActive(cat)}
                        className="btn-admin btn-admin-ghost"
                        style={{ padding: "0.2rem 0.5rem", gap: "0.4rem", background: cat.is_active ? "var(--admin-success-dim)" : "var(--admin-surface-2)" }}
                      >
                        {cat.is_active
                          ? <><ToggleRight size={16} style={{ color: "var(--admin-success)" }} /><span className="badge badge-success" style={{ padding: "2px 6px", fontSize: "10px", border: "none" }}>Active</span></>
                          : <><ToggleLeft size={16} style={{ color: "var(--admin-text-muted)" }} /><span className="badge badge-muted" style={{ padding: "2px 6px", fontSize: "10px", border: "none" }}>Hidden</span></>
                        }
                      </button>
                    </td>
                    <td data-label="Sort Order" style={{ color: "var(--admin-text-muted)", fontSize: "14px", fontWeight: 600 }}>{cat.sort_order}</td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button className="btn-admin btn-admin-secondary btn-admin-sm" onClick={() => openEdit(cat)}>
                          <Pencil size={14} /> Edit
                        </button>
                        <button className="btn-admin btn-admin-danger btn-admin-sm" style={{ padding: "0.35rem 0.5rem" }} onClick={() => setConfirm({ id: cat.id, name: cat.name })}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!confirm}
        title="Delete Category"
        message={`Are you sure you want to delete "${confirm?.name}"? All products within this category will remain, but their category association will be lost. This cannot be undone.`}
        onConfirm={() => handleDelete(confirm.id)}
        onCancel={() => setConfirm(null)}
      />
    </AdminShell>
  );
}
