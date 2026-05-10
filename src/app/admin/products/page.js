"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../components/AdminShell";
import { ConfirmDialog } from "../components/FormFields";
import { Toaster, toast } from "react-hot-toast";
import {
  Plus, Pencil, Trash2, Search, X, Star, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, Tag, Package
} from "lucide-react";

function ProductRow({ p, toggleField, openEdit, setConfirm }) {
  return (
    <tr key={p.id}>
      <td data-label="Product">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {p.images?.[0] ? (
            <img src={p.images[0]} alt={p.name}
              style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "6px", background: "#f3f4f6", border: "1px solid var(--admin-border)" }} />
          ) : (
            <div style={{ width: "48px", height: "48px", borderRadius: "6px", background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={20} style={{ color: "var(--admin-text-muted)" }} />
            </div>
          )}
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontWeight: 700, color: "var(--admin-text)", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
            <code style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>/{p.slug}</code>
          </div>
        </div>
      </td>
      <td data-label="Category">
        <span className="badge badge-muted">
          {p.categories?.name || "Uncategorized"}
        </span>
      </td>
      <td data-label="Details">
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ fontSize: "12px", display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ color: "var(--admin-text-muted)", fontSize: "11px", textTransform: "uppercase", fontWeight: 700 }}>Tiers:</span>
            {p.tiers?.length > 0 ? (
              p.tiers.map((t, idx) => (
                <span key={idx} style={{ 
                  color: t.color || "var(--admin-text)", 
                  fontWeight: 700,
                  fontSize: "11px"
                }}>
                  {t.title}{idx < p.tiers.length - 1 ? "," : ""}
                </span>
              ))
            ) : <span style={{ color: "var(--admin-text-muted)" }}>—</span>}
          </div>
          <div style={{ fontSize: "12px", display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ color: "var(--admin-text-muted)", fontSize: "11px", textTransform: "uppercase", fontWeight: 700 }}>Sizes:</span>
            <span style={{ fontWeight: 500, fontSize: "12px", color: "var(--admin-text-secondary)" }}>{p.sizes?.length > 0 ? p.sizes.join(", ") : "—"}</span>
          </div>
        </div>
      </td>
      <td data-label="Status">
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button onClick={() => toggleField(p, "is_active")} className="btn-admin btn-admin-ghost" style={{ padding: "0.2rem 0.5rem", gap: "0.4rem", background: p.is_active ? "var(--admin-success-dim)" : "var(--admin-surface-2)" }}>
            {p.is_active
              ? <><ToggleRight size={16} style={{ color: "var(--admin-success)" }} /><span className="badge badge-success" style={{ padding: "2px 6px", fontSize: "10px", border: "none" }}>Active</span></>
              : <><ToggleLeft size={16} /><span className="badge badge-muted" style={{ padding: "2px 6px", fontSize: "10px", border: "none" }}>Hidden</span></>}
          </button>
          <button onClick={() => toggleField(p, "is_featured")} className="btn-admin btn-admin-ghost btn-admin-icon" style={{ padding: "6px" }} title="Toggle Featured">
            <Star size={16} style={{ color: p.is_featured ? "#f59e0b" : "var(--admin-text-muted)", fill: p.is_featured ? "#f59e0b" : "none" }} />
          </button>
        </div>
      </td>
      <td style={{ textAlign: "right" }}>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button className="btn-admin btn-admin-secondary btn-admin-sm" onClick={() => openEdit(p)}>
            <Pencil size={14} /> Edit
          </button>
          <button className="btn-admin btn-admin-danger btn-admin-sm" style={{ padding: "0.35rem 0.5rem" }} onClick={() => setConfirm({ id: p.id, name: p.name })}>
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirm, setConfirm] = useState(null);
  const [groupByCat, setGroupByCat] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set("search", search);
    if (filterCat) params.set("category", filterCat);
    if (filterStatus) params.set("status", filterStatus);
    const res = await fetch(`/api/admin/products?${params}`);
    if (res.status === 401) { router.push("/admin"); return; }
    const data = await res.json();
    setProducts(data.products || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [search, filterCat, filterStatus, page, router]);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { setPage(1); }, [search, filterCat, filterStatus]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function openCreate() {
    router.push("/admin/products/new");
  }

  function openEdit(p) {
    router.push(`/admin/products/${p.id}/edit`);
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirm(null);
    }
  }

  async function toggleField(p, field) {
    try {
      await fetch(`/api/admin/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !p[field] }),
      });
      fetchProducts();
    } catch { toast.error("Update failed"); }
  }

  return (
    <AdminShell
      title="Products"
      actions={
        <button className="btn-admin btn-admin-primary" onClick={openCreate}>
          <Plus size={16} /> Add Product
        </button>
      }
    >
      <Toaster position="top-right" toastOptions={{ className: "admin-toast" }} />

      <div className="admin-card">
        {/* Toolbar */}
        <div className="admin-card-header" style={{ flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", flex: 1 }}>
            <div className="admin-search">
              <Search size={16} style={{ color: "var(--admin-text-muted)", flexShrink: 0 }} />
              <input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && <button className="btn-admin btn-admin-ghost btn-admin-icon" onClick={() => setSearch("")} style={{ padding: "2px", minWidth: "unset", minHeight: "unset" }}><X size={14} /></button>}
            </div>
            <select className="admin-select" style={{ width: "auto", padding: "0.5rem 1rem" }} value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="admin-select" style={{ width: "auto", padding: "0.5rem 1rem" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Hidden</option>
              <option value="featured">Featured</option>
            </select>
            <button 
              className={`btn-admin ${groupByCat ? "btn-admin-primary" : "btn-admin-secondary"}`}
              onClick={() => setGroupByCat(!groupByCat)}
            >
              {groupByCat ? "List View" : "Group by Category"}
            </button>
          </div>
          <span style={{ fontSize: "13px", color: "var(--admin-text-muted)", whiteSpace: "nowrap", fontWeight: 500 }}>
            {total} product{total !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="admin-table-wrap">
          {loading ? (
            <div style={{ padding: "4rem", textAlign: "center" }}><span className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon" style={{ fontSize: "48px", marginBottom: "1rem", opacity: 0.5 }}>📦</div>
              <h3 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "24px", textTransform: "uppercase", marginBottom: "0.5rem" }}>No Products Found</h3>
              <p style={{ fontSize: "14px", color: "var(--admin-text-muted)", marginBottom: "1.5rem" }}>Try adjusting your filters or add a new product.</p>
              <button className="btn-admin btn-admin-primary" onClick={openCreate}>
                <Plus size={16} /> Create Your First Product
              </button>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Variants & Specs</th>
                  <th>Visibility</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupByCat ? (
                  categories.map((cat) => {
                    const catProducts = products.filter(p => p.category_id === cat.id);
                    if (catProducts.length === 0 && filterCat !== cat.id) return null;
                    return (
                      <React.Fragment key={cat.id}>
                        <tr style={{ background: "var(--admin-surface-2)" }}>
                          <td colSpan="5" style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--admin-border)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <Tag size={14} style={{ color: "var(--admin-accent)" }} />
                              <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--admin-text)", fontSize: "14px" }}>
                                {cat.name}
                              </span>
                              <span className="badge badge-muted" style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "12px" }}>{catProducts.length} items</span>
                            </div>
                          </td>
                        </tr>
                        {catProducts.map((p) => <ProductRow key={p.id} p={p} toggleField={toggleField} openEdit={openEdit} setConfirm={setConfirm} />)}
                      </React.Fragment>
                    );
                  })
                ) : (
                  products.map((p) => <ProductRow key={p.id} p={p} toggleField={toggleField} openEdit={openEdit} setConfirm={setConfirm} />)
                )}
                {!groupByCat && products.length > 0 && products.some(p => !p.category_id) && (
                  <>
                    <tr style={{ background: "var(--admin-surface-2)" }}>
                      <td colSpan="5" style={{ padding: "0.75rem 1.5rem", fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--admin-text-muted)" }}>Uncategorized</td>
                    </tr>
                    {products.filter(p => !p.category_id).map((p) => <ProductRow key={p.id} p={p} toggleField={toggleField} openEdit={openEdit} setConfirm={setConfirm} />)}
                  </>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--admin-border)", display: "flex", justifyContent: "flex-end", background: "var(--admin-surface-2)" }}>
            <div className="admin-pagination">
              <button className="admin-page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const pg = i + 1;
                return (
                  <button key={pg} className={`admin-page-btn ${pg === page ? "active" : ""}`} onClick={() => setPage(pg)}>
                    {pg}
                  </button>
                );
              })}
              <button className="admin-page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${confirm?.name}"? This action cannot be undone and will remove it from the public catalog.`}
        onConfirm={() => handleDelete(confirm.id)}
        onCancel={() => setConfirm(null)}
      />
    </AdminShell>
  );
}
