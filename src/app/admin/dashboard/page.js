"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../components/AdminShell";
import Link from "next/link";
import {
  Package, Tag, MessageSquare, AlertCircle,
  ExternalLink, Clock, ChevronRight,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      setStats(data.stats);
      setRecentEnquiries(data.recentEnquiries || []);
      setRecentProducts(data.recentProducts || []);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statCards = stats ? [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "var(--admin-accent)",
      bg: "var(--admin-accent-dim)",
      link: "/admin/products",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: Tag,
      color: "var(--admin-info)",
      bg: "var(--admin-info-dim)",
      link: "/admin/categories",
    },
    {
      label: "Total Enquiries",
      value: stats.totalEnquiries,
      icon: MessageSquare,
      color: "var(--admin-success)",
      bg: "var(--admin-success-dim)",
      link: "/admin/enquiries",
    },
    {
      label: "New Enquiries",
      value: stats.newEnquiries,
      icon: AlertCircle,
      color: "var(--admin-danger)",
      bg: "var(--admin-danger-dim)",
      link: "/admin/enquiries?status=new",
    },
  ] : [];

  return (
    <AdminShell
      title="Dashboard"
      actions={
        <button 
          className="btn-admin btn-admin-secondary" 
          onClick={async () => {
            if (confirm("This will synchronize all static product data to your database. Continue?")) {
              const res = await fetch("/api/admin/seed");
              if (res.ok) {
                toast.success("Database synchronized successfully!");
                fetchData();
              } else {
                toast.error("Sync failed.");
              }
            }
          }}
        >
          Sync Website Data
        </button>
      }
    >
      <Toaster
        position="top-right"
        toastOptions={{ className: "admin-toast" }}
      />

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px", gap: "0.75rem", color: "var(--admin-text-muted)" }}>
          <span className="spinner" /> Loading dashboard...
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="admin-stats-grid">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.label}
                  href={card.link}
                  className="admin-stat-card"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="admin-stat-icon"
                    style={{ background: card.bg }}
                  >
                    <Icon size={18} style={{ color: card.color }} />
                  </div>
                  <div className="admin-stat-label">{card.label}</div>
                  <div className="admin-stat-value" style={{ color: card.color }}>
                    {card.value}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {/* Recent Enquiries */}
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Recent Enquiries</span>
                <Link href="/admin/enquiries" className="btn-admin btn-admin-ghost btn-admin-sm">
                  View All <ChevronRight size={12} />
                </Link>
              </div>
              <div>
                {recentEnquiries.length === 0 ? (
                  <div className="admin-empty" style={{ padding: "2rem" }}>
                    <p style={{ fontSize: "13px" }}>No enquiries yet.</p>
                  </div>
                ) : (
                  recentEnquiries.map((e) => (
                    <div
                      key={e.id}
                      style={{
                        padding: "0.875rem 1.25rem",
                        borderBottom: "1px solid var(--admin-border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--admin-text)", marginBottom: "2px" }}>
                          {e.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>
                          {e.email}
                          {e.product_name && ` · ${e.product_name}`}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                        <span className={`badge ${e.contacted ? "badge-muted" : "badge-danger"}`}>
                          {e.contacted ? "Contacted" : "New"}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--admin-text-muted)", display: "flex", alignItems: "center", gap: "3px" }}>
                          <Clock size={10} />
                          {new Date(e.created_at).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Products */}
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Recent Products</span>
                <Link href="/admin/products" className="btn-admin btn-admin-ghost btn-admin-sm">
                  View All <ChevronRight size={12} />
                </Link>
              </div>
              <div>
                {recentProducts.length === 0 ? (
                  <div className="admin-empty" style={{ padding: "2rem" }}>
                    <p style={{ fontSize: "13px" }}>No products added yet.</p>
                  </div>
                ) : (
                  recentProducts.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        padding: "0.875rem 1.25rem",
                        borderBottom: "1px solid var(--admin-border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--admin-text)", marginBottom: "2px" }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--admin-text-muted)", fontFamily: "monospace" }}>
                          /{p.slug}
                        </div>
                      </div>
                      <span className={`badge ${p.is_active ? "badge-success" : "badge-muted"}`}>
                        {p.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
