"use client";
import React, { useState } from "react";
import { ImageUpload } from "./FormFields";

export default function CategoryForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  saving 
}) {
  const [form, setForm] = useState(initialData);

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  function slugify(t) {
    return t.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  }

  return (
    <div className="admin-card">
      <form onSubmit={handleSubmit}>
        <div className="admin-card-body">
          <div className="admin-form-container">
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">Category Name *</label>
                <input className="admin-input" placeholder="e.g. Diamond Blades" value={form.name || ""} required
                  onChange={(e) => {
                    set("name", e.target.value);
                    if (!initialData.id) set("slug", slugify(e.target.value));
                  }} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Slug (URL)</label>
                <input className="admin-input" placeholder="diamond-blades" value={form.slug || ""}
                  onChange={(e) => set("slug", e.target.value)} />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Short Description</label>
              <textarea className="admin-textarea" placeholder="Brief description shown in listings" value={form.description || ""}
                onChange={(e) => set("description", e.target.value)} style={{ minHeight: "70px" }} />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Full Description</label>
              <textarea className="admin-textarea" placeholder="Detailed description shown on category page" value={form.full_description || ""}
                onChange={(e) => set("full_description", e.target.value)} />
            </div>

            <div className="admin-form-grid">
              <ImageUpload label="Category Image" value={form.image_url || ""} onChange={(v) => set("image_url", v)} folder="categories" />
              <ImageUpload label="Banner Image" value={form.banner_url || ""} onChange={(v) => set("banner_url", v)} folder="categories" />
            </div>

            <div style={{ background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)", borderRadius: "var(--radius)", padding: "1.25rem", marginBottom: "1.5rem", marginTop: "1rem" }}>
              <div style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--admin-text-muted)", marginBottom: "1rem" }}>
                SEO Settings
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Meta Title</label>
                <input className="admin-input" placeholder="SEO title" value={form.meta_title || ""}
                  onChange={(e) => set("meta_title", e.target.value)} />
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-label">Meta Description</label>
                <textarea className="admin-textarea" placeholder="SEO description (160 chars max)" value={form.meta_description || ""}
                  onChange={(e) => set("meta_description", e.target.value)} style={{ minHeight: "70px" }} />
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">Sort Order</label>
                <input className="admin-input" type="number" value={form.sort_order ?? 0}
                  onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} />
              </div>
              <div className="admin-form-group" style={{ justifyContent: "center" }}>
                <label className="admin-label" style={{ marginBottom: "0.5rem" }}>Status</label>
                <label className="admin-toggle">
                  <input type="checkbox" checked={form.is_active ?? true} onChange={(e) => set("is_active", e.target.checked)} />
                  <div className="admin-toggle-track"><div className="admin-toggle-thumb"></div></div>
                  <span style={{ fontSize: "14px", color: "var(--admin-text)", fontWeight: 500 }}>
                    {form.is_active ? "Active (visible on site)" : "Hidden"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-card-header" style={{ justifyContent: "flex-end", background: "var(--admin-surface-2)", borderTop: "1px solid var(--admin-border)", borderBottom: "none" }}>
          <button type="button" className="btn-admin btn-admin-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-admin btn-admin-primary" disabled={saving}>
            {saving ? <><span className="spinner" style={{ width: "13px", height: "13px" }} /> Saving…</> : (initialData.id ? "Save Changes" : "Create Category")}
          </button>
        </div>
      </form>
    </div>
  );
}
