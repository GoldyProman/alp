"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../components/AdminShell";
import { Toaster, toast } from "react-hot-toast";
import { Upload, Trash2, Copy, Image as ImageIcon, Search, X, RefreshCw } from "lucide-react";

export default function MediaPage() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [drag, setDrag] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const inputRef = useRef();

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/upload");
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      setFiles(data.files || []);
    } catch { toast.error("Failed to load media"); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  async function uploadFiles(fileList) {
    setUploading(true);
    let count = 0;
    for (const file of Array.from(fileList)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "media");
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        count++;
      } catch (err) {
        toast.error(`Failed: ${file.name} — ${err.message}`);
      }
    }
    if (count > 0) toast.success(`${count} file(s) uploaded`);
    setUploading(false);
    fetchFiles();
  }

  async function deleteFile(path) {
    try {
      const res = await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("File deleted");
      fetchFiles();
    } catch (err) {
      toast.error(err.message);
    } finally { setConfirm(null); }
  }

  function copyUrl(url) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  }

  const filtered = files.filter((f) =>
    !search || f.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AdminShell title="Media Library">
      <Toaster position="top-right" toastOptions={{ className: "admin-toast" }} />

      {/* Upload Zone */}
      <div
        className={`upload-zone ${drag ? "drag-over" : ""}`}
        style={{ marginBottom: "1.5rem", padding: "2.5rem" }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault(); setDrag(false);
          uploadFiles(e.dataTransfer.files);
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
          onChange={(e) => uploadFiles(e.target.files)} />
        {uploading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            <span className="spinner" style={{ width: "28px", height: "28px" }} />
            <span>Uploading…</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            <Upload size={28} />
            <span style={{ fontWeight: 600 }}>Drag & drop images here, or click to browse</span>
            <span style={{ fontSize: "13px" }}>JPG, PNG, WebP, GIF, SVG · Max 5MB each · Multiple files supported</span>
          </div>
        )}
      </div>

      {/* Media Grid */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-search">
            <Search size={15} style={{ color: "var(--admin-text-muted)", flexShrink: 0 }} />
            <input placeholder="Search files…" value={search} onChange={(e) => setSearch(e.target.value)} />
            {search && <button className="btn-admin btn-admin-ghost btn-admin-icon" onClick={() => setSearch("")}><X size={13} /></button>}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "var(--admin-text-muted)" }}>{filtered.length} file{filtered.length !== 1 ? "s" : ""}</span>
            <button className="btn-admin btn-admin-secondary btn-admin-sm" onClick={fetchFiles}><RefreshCw size={12} /></button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center" }}><span className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon"><ImageIcon size={32} style={{ opacity: 0.3 }} /></div>
            <h3>No Media Files</h3>
            <p style={{ fontSize: "13px" }}>Upload images using the zone above.</p>
          </div>
        ) : (
          <div style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem" }}>
            {filtered.map((file) => (
              <div
                key={file.path}
                style={{
                  background: "var(--admin-surface-2)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "6px",
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--admin-border-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--admin-border)"}
              >
                <div style={{ aspectRatio: "1", background: "#000", overflow: "hidden" }}>
                  <img src={file.url} alt={file.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
                <div style={{ padding: "0.6rem" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--admin-text)", marginBottom: "2px" }}
                    className="truncate" title={file.name}>
                    {file.name}
                  </div>
                  {file.metadata?.size && (
                    <div style={{ fontSize: "11px", color: "var(--admin-text-muted)", marginBottom: "0.4rem" }}>
                      {formatSize(file.metadata.size)}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "0.3rem" }}>
                    <button
                      className="btn-admin btn-admin-secondary btn-admin-sm"
                      style={{ flex: 1, justifyContent: "center" }}
                      onClick={() => copyUrl(file.url)}
                      title="Copy URL"
                    >
                      <Copy size={11} /> Copy
                    </button>
                    <button
                      className="btn-admin btn-admin-danger btn-admin-sm btn-admin-icon"
                      onClick={() => setConfirm({ path: file.path, name: file.name })}
                      title="Delete"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {confirm && (
        <div className="modal-backdrop">
          <div className="modal-box modal-box-sm">
            <div className="modal-header">
              <span className="modal-title">Delete File</span>
              <button className="btn-admin btn-admin-ghost btn-admin-icon" onClick={() => setConfirm(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: "14px", color: "var(--admin-text-secondary)" }}>
                Delete <strong style={{ color: "var(--admin-text)" }}>{confirm.name}</strong>? This cannot be undone and any products using this image will show a broken image.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-admin btn-admin-secondary" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="btn-admin btn-admin-danger" onClick={() => deleteFile(confirm.path)}>Delete File</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
