"use client";
import React, { useState } from "react";
import { MultiImageUpload, ArrayField, SpecsField, TiersField } from "./FormFields";

export default function ProductForm({ 
  initialData = {}, 
  categories = [], 
  onSubmit, 
  onCancel, 
  saving 
}) {
  const [form, setForm] = useState(initialData);
  const [tab, setTab] = useState("basic");

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  function slugify(t) {
    return t.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  }

  const TABS = [
    { key: "basic", label: "Basic Info" },
    { key: "media", label: "Images" },
    { key: "tiers", label: "Tiers & Sizes" },
    { key: "specs", label: "Specs & Tags" },
    { key: "seo", label: "SEO" },
  ];

  return (
    <div className="admin-card">
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--admin-border)", padding: "0 1.5rem", gap: "0.25rem", overflowX: "auto" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              padding: "0.875rem 1rem", fontSize: "12px", fontWeight: 700,
              fontFamily: "var(--font-barlow-condensed)", textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: tab === t.key ? "var(--admin-accent)" : "var(--admin-text-muted)",
              borderBottom: tab === t.key ? "2px solid var(--admin-accent)" : "2px solid transparent",
              marginBottom: "-1px",
              whiteSpace: "nowrap"
            }}
          >{t.label}</button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card-body">
          <div className="admin-form-container">
            {/* Basic Info Tab */}
            {tab === "basic" && (
              <>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Product Name *</label>
                    <input className="admin-input" placeholder="e.g. Turbo Diamond Blade" value={form.name || ""} required
                      onChange={(e) => {
                        set("name", e.target.value);
                        if (!initialData.id) set("slug", slugify(e.target.value));
                      }} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Slug (URL)</label>
                    <input className="admin-input" placeholder="turbo-diamond-blade" value={form.slug || ""}
                      onChange={(e) => set("slug", e.target.value)} />
                  </div>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Category *</label>
                    <select className="admin-select" value={form.category_id || ""} required onChange={(e) => set("category_id", e.target.value)}>
                      <option value="">Select category…</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Sort Order</label>
                    <input className="admin-input" type="number" value={form.sort_order ?? 0}
                      onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Short Description</label>
                  <textarea className="admin-textarea" placeholder="One-line product summary" value={form.description || ""}
                    onChange={(e) => set("description", e.target.value)} style={{ minHeight: "70px" }} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Full Description</label>
                  <textarea className="admin-textarea" placeholder="Detailed product description" value={form.full_description || ""}
                    onChange={(e) => set("full_description", e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: "2.5rem", marginTop: "1rem", padding: "1rem", background: "var(--admin-surface-2)", borderRadius: "var(--radius)", border: "1px solid var(--admin-border)" }}>
                  <label className="admin-toggle">
                    <input type="checkbox" checked={form.is_active ?? true} onChange={(e) => set("is_active", e.target.checked)} />
                    <div className="admin-toggle-track"><div className="admin-toggle-thumb"></div></div>
                    <span style={{ fontSize: "14px", color: "var(--admin-text)", fontWeight: 500 }}>Active (visible on site)</span>
                  </label>
                  <label className="admin-toggle">
                    <input type="checkbox" checked={form.is_featured ?? false} onChange={(e) => set("is_featured", e.target.checked)} />
                    <div className="admin-toggle-track"><div className="admin-toggle-thumb"></div></div>
                    <span style={{ fontSize: "14px", color: "var(--admin-text)", fontWeight: 500 }}>Featured Product</span>
                  </label>
                </div>
              </>
            )}

            {/* Media Tab */}
            {tab === "media" && (
              <MultiImageUpload value={form.images || []} onChange={(v) => set("images", v)} folder="products" />
            )}

            {/* Tiers Tab */}
            {tab === "tiers" && (
              <TiersField value={form.tiers || []} onChange={(v) => set("tiers", v)} />
            )}

            {/* Specs & Tags Tab */}
            {tab === "specs" && (
              <>
                <SpecsField value={form.specifications || []} onChange={(v) => set("specifications", v)} />
                <ArrayField label="Tags" value={form.tags || []} onChange={(v) => set("tags", v)} placeholder="e.g. concrete, heavy-duty…" />
              </>
            )}

            {/* SEO Tab */}
            {tab === "seo" && (
              <>
                <div className="admin-form-group">
                  <label className="admin-label">Meta Title</label>
                  <input className="admin-input" placeholder="SEO title (auto-filled from name if blank)" value={form.meta_title || ""}
                    onChange={(e) => set("meta_title", e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Meta Description</label>
                  <textarea className="admin-textarea" placeholder="SEO description (max 160 chars)" value={form.meta_description || ""}
                    onChange={(e) => set("meta_description", e.target.value)} style={{ minHeight: "80px" }} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="admin-card-header" style={{ justifyContent: "flex-end", background: "var(--admin-surface-2)", borderTop: "1px solid var(--admin-border)", borderBottom: "none" }}>
          <button type="button" className="btn-admin btn-admin-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-admin btn-admin-primary" disabled={saving}>
            {saving ? <><span className="spinner" style={{ width: "13px", height: "13px" }} /> Saving…</> : (initialData.id ? "Save Changes" : "Create Product")}
          </button>
        </div>
      </form>
    </div>
  );
}
