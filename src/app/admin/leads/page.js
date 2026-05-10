"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminShell from "../components/AdminShell";
import { ConfirmDialog } from "../components/FormFields";
import { Toaster, toast } from "react-hot-toast";
import {
  Search, X, Trash2, Check, Download, Eye,
  ChevronLeft, ChevronRight, Clock, Mail, Phone, Building2, User, MapPin, Briefcase
} from "lucide-react";

function LeadsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(searchParams.get("status") || "");
  const [filterSource, setFilterSource] = useState(searchParams.get("source") || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirm, setConfirm] = useState(null);
  const [viewLead, setViewLead] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set("search", search);
    if (filterStatus) params.set("status", filterStatus);
    if (filterSource) params.set("source", filterSource);
    const res = await fetch(`/api/admin/leads?${params}`);
    if (res.status === 401) { router.push("/admin"); return; }
    const data = await res.json();
    setLeads(data.leads || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [search, filterStatus, filterSource, page, router]);

  useEffect(() => { setPage(1); }, [search, filterStatus, filterSource]);
  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function markContacted(id, current) {
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacted: !current }),
      });
      toast.success(!current ? "Marked as contacted" : "Marked as new");
      fetchLeads();
      if (viewLead?.id === id) setViewLead((e) => ({ ...e, contacted: !current }));
    } catch { toast.error("Update failed"); }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Lead deleted");
      fetchLeads();
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
    if (filterSource) params.set("source", filterSource);
    window.open(`/api/admin/leads?${params}`, "_blank");
  }

  return (
    <AdminShell
      title="Leads"
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
              <input placeholder="Search by name, email, company…" value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && <button className="btn-admin btn-admin-ghost btn-admin-icon" onClick={() => setSearch("")}><X size={13} /></button>}
            </div>
            <select className="admin-select" style={{ width: "auto" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="new">New Only</option>
              <option value="contacted">Contacted</option>
            </select>
            <select className="admin-select" style={{ width: "auto" }} value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
              <option value="">All Sources</option>
              <option value="contact">Contact Form</option>
              <option value="distributor">Distributor App</option>
            </select>
          </div>
          <span style={{ fontSize: "13px", color: "var(--admin-text-muted)", whiteSpace: "nowrap" }}>
            {total} lead{total !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="admin-table-wrap">
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}><span className="spinner" /></div>
          ) : leads.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">🤝</div>
              <h3>No Leads</h3>
              <p style={{ fontSize: "13px" }}>Leads from your contact and distributor forms will appear here.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Details</th>
                  <th>Source</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--admin-text)", fontSize: "14px" }}>{e.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>{e.email}</div>
                      {e.phone && <div style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>{e.phone}</div>}
                    </td>
                    <td>
                      <div style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>
                        {e.company && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Building2 size={12} style={{ color: "var(--admin-text-muted)" }} />
                            {e.company}
                          </div>
                        )}
                        {e.city && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <MapPin size={12} style={{ color: "var(--admin-text-muted)" }} />
                            {e.city}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${e.source === 'distributor' ? 'badge-primary' : 'badge-secondary'}`}>
                        {e.source === 'distributor' ? 'Distributor' : 'Contact'}
                      </span>
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
                        <button className="btn-admin btn-admin-secondary btn-admin-sm" onClick={() => setViewLead(e)}>
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

      {/* View Lead Modal */}
      {viewLead && (
        <div className="modal-backdrop">
          <div className="modal-box modal-box-md">
            <div className="modal-header">
              <span className="modal-title">Lead from {viewLead.name}</span>
              <button className="btn-admin btn-admin-ghost btn-admin-icon" onClick={() => setViewLead(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: "grid", gap: "1rem" }}>
                {[
                  { label: "Name", value: viewLead.name },
                  { label: "Email", value: viewLead.email },
                  { label: "Phone", value: viewLead.phone || "Not provided" },
                  { label: "Company", value: viewLead.company || "N/A" },
                  { label: "City", value: viewLead.city || "N/A" },
                  { label: "Business Type", value: viewLead.business_type || "N/A" },
                  { label: "Source", value: viewLead.source === 'distributor' ? 'Distributor Application' : 'Contact Form' },
                  { label: "Subject", value: viewLead.subject || "N/A" },
                  { label: "Date", value: new Date(viewLead.created_at).toLocaleString("en-IN") },
                  { label: "Status", value: viewLead.contacted ? "Contacted" : "New – not yet contacted" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", gap: "1rem" }}>
                    <span style={{ width: "140px", flexShrink: 0, fontFamily: "var(--font-barlow-condensed)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--admin-text-muted)", paddingTop: "1px" }}>{label}</span>
                    <span style={{ color: "var(--admin-text-secondary)", fontSize: "14px" }}>{value}</span>
                  </div>
                ))}
                {viewLead.message && (
                  <div>
                    <div style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--admin-text-muted)", marginBottom: "0.5rem" }}>Message</div>
                    <div style={{ background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)", borderRadius: "4px", padding: "0.875rem", fontSize: "14px", color: "var(--admin-text-secondary)", lineHeight: "1.6" }}>
                      {viewLead.message}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-admin btn-admin-secondary" onClick={() => setViewLead(null)}>Close</button>
              <button
                className="btn-admin btn-admin-primary"
                onClick={() => markContacted(viewLead.id, viewLead.contacted)}
              >
                <Check size={14} />
                {viewLead.contacted ? "Mark as New" : "Mark as Contacted"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Delete Lead"
        message={`Delete lead from "${confirm?.name}"? This cannot be undone.`}
        onConfirm={() => handleDelete(confirm.id)}
        onCancel={() => setConfirm(null)}
      />
    </AdminShell>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}><span className="spinner" /></div>}>
      <LeadsContent />
    </Suspense>
  );
}
