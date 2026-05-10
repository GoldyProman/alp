"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminShell from "../components/AdminShell";
import { ConfirmDialog } from "../components/FormFields";
import { Toaster, toast } from "react-hot-toast";
import {
  Search, X, Trash2, Check, Download, Eye,
  ChevronLeft, ChevronRight, Clock, Mail, Phone, Package,
} from "lucide-react";

function EnquiriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(searchParams.get("status") || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirm, setConfirm] = useState(null);
  const [viewEnquiry, setViewEnquiry] = useState(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set("search", search);
    if (filterStatus) params.set("status", filterStatus);
    const res = await fetch(`/api/admin/enquiries?${params}`);
    if (res.status === 401) { router.push("/admin"); return; }
    const data = await res.json();
    setEnquiries(data.enquiries || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [search, filterStatus, page, router]);

  useEffect(() => { setPage(1); }, [search, filterStatus]);
  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  async function markContacted(id, current) {
    try {
      await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacted: !current }),
      });
      toast.success(!current ? "Marked as contacted" : "Marked as new");
      fetchEnquiries();
      if (viewEnquiry?.id === id) setViewEnquiry((e) => ({ ...e, contacted: !current }));
    } catch { toast.error("Update failed"); }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Enquiry deleted");
      fetchEnquiries();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirm(null);
    }
  }

  async function exportCsv() {
    const params = new URLSearchParams({ export: "csv" });
    if (search) params.set("search", search);
    if (filterStatus) params.set("status", filterStatus);
    window.open(`/api/admin/enquiries?${params}`, "_blank");
  }

  return (
    <AdminShell
      title="Enquiries"
      actions={
        <button className="btn-admin btn-admin-secondary" onClick={exportCsv}>
          <Download size={14} /> Export CSV
        </button>
      }
    >
      <Toaster position="top-right" toastOptions={{ className: "admin-toast" }} />

      <div className="admin-card">
        {/* Toolbar */}
        <div className="admin-card-header" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flex: 1, flexWrap: "wrap" }}>
            <div className="admin-search">
              <Search size={15} style={{ color: "var(--admin-text-muted)", flexShrink: 0 }} />
              <input placeholder="Search by name, email, product…" value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && <button className="btn-admin btn-admin-ghost btn-admin-icon" onClick={() => setSearch("")}><X size={13} /></button>}
            </div>
            <select className="admin-select" style={{ width: "auto" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Enquiries</option>
              <option value="new">New Only</option>
              <option value="contacted">Contacted</option>
            </select>
          </div>
          <span style={{ fontSize: "13px", color: "var(--admin-text-muted)", whiteSpace: "nowrap" }}>
            {total} enquir{total !== 1 ? "ies" : "y"}
          </span>
        </div>

        <div className="admin-table-wrap">
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}><span className="spinner" /></div>
          ) : enquiries.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📬</div>
              <h3>No Enquiries</h3>
              <p style={{ fontSize: "13px" }}>Customer enquiries from your website will appear here.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--admin-text)", fontSize: "14px" }}>{e.name}</div>
                      {e.message && (
                        <div style={{ fontSize: "12px", color: "var(--admin-text-muted)", maxWidth: "200px" }}
                          className="truncate">
                          {e.message}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: "13px", color: "var(--admin-text-secondary)", display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Mail size={11} style={{ color: "var(--admin-text-muted)" }} />{e.email}
                        </span>
                        {e.phone && (
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Phone size={11} style={{ color: "var(--admin-text-muted)" }} />{e.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: "13px" }}>
                      {e.product_name ? (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--admin-text-secondary)" }}>
                          <Package size={12} style={{ color: "var(--admin-text-muted)" }} />{e.product_name}
                        </span>
                      ) : <span style={{ color: "var(--admin-text-muted)" }}>—</span>}
                    </td>
                    <td>
                      <span style={{ fontSize: "12px", color: "var(--admin-text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={11} />
                        {new Date(e.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${e.contacted ? "badge-muted" : "badge-danger"}`}>
                        {e.contacted ? "Contacted" : "New"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                        <button className="btn-admin btn-admin-secondary btn-admin-sm" onClick={() => setViewEnquiry(e)}>
                          <Eye size={12} /> View
                        </button>
                        <button
                          className="btn-admin btn-admin-secondary btn-admin-sm"
                          onClick={() => markContacted(e.id, e.contacted)}
                          title={e.contacted ? "Mark as new" : "Mark as contacted"}
                        >
                          <Check size={12} style={{ color: e.contacted ? "var(--admin-text-muted)" : "var(--admin-success)" }} />
                        </button>
                        <button className="btn-admin btn-admin-danger btn-admin-sm" onClick={() => setConfirm({ id: e.id, name: e.name })}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--admin-border)", display: "flex", justifyContent: "flex-end" }}>
            <div className="admin-pagination">
              <button className="admin-page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={14} /></button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const pg = i + 1;
                return <button key={pg} className={`admin-page-btn ${pg === page ? "active" : ""}`} onClick={() => setPage(pg)}>{pg}</button>;
              })}
              <button className="admin-page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* View Enquiry Modal */}
      {viewEnquiry && (
        <div className="modal-backdrop">
          <div className="modal-box modal-box-md">
            <div className="modal-header">
              <span className="modal-title">Enquiry from {viewEnquiry.name}</span>
              <button className="btn-admin btn-admin-ghost btn-admin-icon" onClick={() => setViewEnquiry(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: "grid", gap: "1rem" }}>
                {[
                  { label: "Name", value: viewEnquiry.name },
                  { label: "Email", value: viewEnquiry.email },
                  { label: "Phone", value: viewEnquiry.phone || "Not provided" },
                  { label: "Product Interest", value: viewEnquiry.product_name || "Not specified" },
                  { label: "Date", value: new Date(viewEnquiry.created_at).toLocaleString("en-IN") },
                  { label: "Status", value: viewEnquiry.contacted ? "Contacted" : "New – not yet contacted" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", gap: "1rem" }}>
                    <span style={{ width: "140px", flexShrink: 0, fontFamily: "var(--font-barlow-condensed)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--admin-text-muted)", paddingTop: "1px" }}>{label}</span>
                    <span style={{ color: "var(--admin-text-secondary)", fontSize: "14px" }}>{value}</span>
                  </div>
                ))}
                {viewEnquiry.message && (
                  <div>
                    <div style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--admin-text-muted)", marginBottom: "0.5rem" }}>Message</div>
                    <div style={{ background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)", borderRadius: "4px", padding: "0.875rem", fontSize: "14px", color: "var(--admin-text-secondary)", lineHeight: "1.6" }}>
                      {viewEnquiry.message}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-admin btn-admin-secondary" onClick={() => setViewEnquiry(null)}>Close</button>
              <button
                className="btn-admin btn-admin-primary"
                onClick={() => markContacted(viewEnquiry.id, viewEnquiry.contacted)}
              >
                <Check size={14} />
                {viewEnquiry.contacted ? "Mark as New" : "Mark as Contacted"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Delete Enquiry"
        message={`Delete enquiry from "${confirm?.name}"? This cannot be undone.`}
        onConfirm={() => handleDelete(confirm.id)}
        onCancel={() => setConfirm(null)}
      />
    </AdminShell>
  );
}

export default function EnquiriesPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}><span className="spinner" /></div>}>
      <EnquiriesContent />
    </Suspense>
  );
}
