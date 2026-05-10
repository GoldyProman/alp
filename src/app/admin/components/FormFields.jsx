"use client";
import { useState, useRef } from "react";
import { Upload, X, Plus, Minus, GripVertical } from "lucide-react";
import { toast } from "react-hot-toast";

/* ─── Image Upload Zone ─── */
export function ImageUpload({ value, onChange, folder = "general", label = "Image" }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef();
  const [drag, setDrag] = useState(false);

  async function upload(file) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange(data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-form-group">
      <label className="admin-label">{label}</label>
      {value ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={value}
            alt={label}
            style={{
              width: "100%", maxWidth: "240px", height: "140px",
              objectFit: "cover", borderRadius: "4px",
              border: "1px solid var(--admin-border)",
            }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            style={{
              position: "absolute", top: "6px", right: "6px",
              background: "rgba(0,0,0,0.7)", border: "none", color: "#fff",
              width: "24px", height: "24px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          className={`upload-zone ${drag ? "drag-over" : ""}`}
          onClick={() => ref.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault(); setDrag(false);
            const f = e.dataTransfer.files[0];
            if (f) upload(f);
          }}
          style={{ minHeight: "120px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
        >
          {uploading ? <><span className="spinner" /><span>Uploading…</span></> : (
            <><Upload size={22} /><span>Click or drag image here</span><span style={{ fontSize: "12px" }}>Max 5MB · JPG, PNG, WebP</span></>
          )}
          <input
            ref={ref} type="file" accept="image/*" style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
          />
        </div>
      )}
      {/* Also allow direct URL input */}
      <input
        className="admin-input"
        style={{ marginTop: "0.5rem" }}
        placeholder="Or paste image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ─── Multi-Image Upload ─── */
export function MultiImageUpload({ value = [], onChange, folder = "products" }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef();

  async function upload(files) {
    setUploading(true);
    const uploaded = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        uploaded.push(data.url);
      } catch (err) {
        toast.error(`Failed: ${file.name}`);
      }
    }
    onChange([...value, ...uploaded]);
    setUploading(false);
    if (uploaded.length) toast.success(`${uploaded.length} image(s) uploaded`);
  }

  function remove(idx) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="admin-form-group">
      <label className="admin-label">Product Images</label>
      <div className="image-grid" style={{ marginBottom: "0.5rem" }}>
        {value.map((url, i) => (
          <div key={i} className="image-thumb">
            <img src={url} alt={`img-${i}`} />
            <button type="button" className="image-thumb-remove" onClick={() => remove(i)}>
              <X size={10} />
            </button>
          </div>
        ))}
        <div
          className="upload-zone"
          style={{ aspectRatio: "1", minHeight: "unset", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.25rem", fontSize: "12px" }}
          onClick={() => ref.current?.click()}
        >
          {uploading ? <span className="spinner" /> : <><Plus size={18} /><span>Add</span></>}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple style={{ display: "none" }}
        onChange={(e) => upload(e.target.files)} />
    </div>
  );
}

/* ─── Dynamic Array Field (tags, sizes, etc.) ─── */
export function ArrayField({ label, value = [], onChange, placeholder = "Add item…" }) {
  const [draft, setDraft] = useState("");

  function add() {
    if (!draft.trim()) return;
    onChange([...value, draft.trim()]);
    setDraft("");
  }

  function remove(i) { onChange(value.filter((_, idx) => idx !== i)); }

  return (
    <div className="admin-form-group">
      <label className="admin-label">{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.4rem" }}>
        {value.map((item, i) => (
          <span
            key={i}
            style={{
              background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)",
              borderRadius: "20px", padding: "0.2rem 0.7rem", fontSize: "12px",
              display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--admin-text-secondary)",
            }}
          >
            {item}
            <button type="button" onClick={() => remove(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-text-muted)", display: "flex", lineHeight: 1 }}>
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <input
          className="admin-input"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
        />
        <button type="button" className="btn-admin btn-admin-secondary" onClick={add}>
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── Dynamic Specifications ─── */
export function SpecsField({ value = [], onChange }) {
  function update(i, key, val) {
    const next = [...value];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  }
  function add() { onChange([...value, { label: "", value: "" }]); }
  function remove(i) { onChange(value.filter((_, idx) => idx !== i)); }

  return (
    <div className="admin-form-group">
      <label className="admin-label">Key Specifications (optional)</label>
      {value.map((spec, i) => (
        <div key={i} className="array-field-row">
          <input className="admin-input" placeholder="Label (e.g. Bore)" value={spec.label}
            onChange={(e) => update(i, "label", e.target.value)} style={{ flex: 1 }} />
          <input className="admin-input" placeholder="Value (e.g. 22.23mm)" value={spec.value}
            onChange={(e) => update(i, "value", e.target.value)} style={{ flex: 1 }} />
          <button type="button" className="btn-admin btn-admin-ghost btn-admin-icon" onClick={() => remove(i)}>
            <Minus size={14} />
          </button>
        </div>
      ))}
      <button type="button" className="btn-admin btn-admin-secondary btn-admin-sm" onClick={add}>
        <Plus size={12} /> Add Specification
      </button>
    </div>
  );
}

/* ─── Tiers Field ─── */
export function TiersField({ value = [], onChange }) {
  function update(i, key, val) {
    const next = [...value];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  }
  function updateSizes(i, sizes) {
    const next = [...value];
    next[i] = { ...next[i], sizes };
    onChange(next);
  }
  function add() {
    onChange([...value, { title: "", color: "#A8CC00", description: "", sizes: [] }]);
  }
  function remove(i) { onChange(value.filter((_, idx) => idx !== i)); }

  return (
    <div className="admin-form-group">
      <label className="admin-label">Product Tiers</label>
      {value.map((tier, i) => (
        <div key={i} style={{
          background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)",
          borderRadius: "6px", padding: "1rem", marginBottom: "0.75rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--admin-text-muted)" }}>
              Tier {i + 1}
            </span>
            <button type="button" className="btn-admin btn-admin-ghost btn-admin-icon" onClick={() => remove(i)}>
              <X size={14} />
            </button>
          </div>
          <div className="admin-grid-2" style={{ marginBottom: "0.5rem" }}>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label className="admin-label">Tier Name</label>
              <input className="admin-input" placeholder="e.g. Alpine Pro" value={tier.title}
                onChange={(e) => update(i, "title", e.target.value)} />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label className="admin-label">Color</label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input type="color" value={tier.color || "#A8CC00"}
                  onChange={(e) => update(i, "color", e.target.value)}
                  style={{ width: "40px", height: "34px", border: "1px solid var(--admin-border)", borderRadius: "4px", cursor: "pointer", padding: "2px", background: "var(--admin-surface-2)" }} />
                <input className="admin-input" value={tier.color || ""}
                  onChange={(e) => update(i, "color", e.target.value)}
                  placeholder="#A8CC00" />
              </div>
            </div>
          </div>
          <div className="admin-form-group" style={{ marginBottom: "0.5rem" }}>
            <label className="admin-label">Description</label>
            <input className="admin-input" placeholder="Short tier description" value={tier.description || ""}
              onChange={(e) => update(i, "description", e.target.value)} />
          </div>
          <ArrayField
            label="Sizes"
            value={tier.sizes || []}
            onChange={(s) => updateSizes(i, s)}
            placeholder="e.g. 4 inch (105mm)"
          />
        </div>
      ))}
      <button type="button" className="btn-admin btn-admin-secondary btn-admin-sm" onClick={add}>
        <Plus size={12} /> Add Tier
      </button>
    </div>
  );
}

/* ─── Confirm Dialog ─── */
export function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = true }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-box modal-box-sm">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn-admin btn-admin-ghost btn-admin-icon" onClick={onCancel}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <p style={{ color: "var(--admin-text-secondary)", fontSize: "14px" }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn-admin btn-admin-secondary" onClick={onCancel}>Cancel</button>
          <button
            className={`btn-admin ${danger ? "btn-admin-danger" : "btn-admin-primary"}`}
            onClick={onConfirm}
          >Confirm</button>
        </div>
      </div>
    </div>
  );
}
