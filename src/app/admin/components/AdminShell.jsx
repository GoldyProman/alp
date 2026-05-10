"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, Tag, MessageSquare, Image,
  LogOut, Menu, X, ChevronRight, Home
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { section: "Catalogue" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { section: "CRM" },
  { href: "/admin/enquiries", icon: MessageSquare, label: "Enquiries", badge: true, badgeKey: "newEnquiries" },
  { href: "/admin/leads", icon: MessageSquare, label: "Leads", badge: true, badgeKey: "newLeads" },
  { section: "External" },
  { href: "/", icon: ChevronRight, label: "View Website", external: true },
];

export default function AdminShell({ children, title, actions, breadcrumbs = [] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [stats, setStats] = useState({ newEnquiries: 0, newLeads: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => setStats(d?.stats || { newEnquiries: 0, newLeads: 0 }))
      .catch(() => {});
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  const Sidebar = () => (
    <aside className={`admin-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <div className="admin-sidebar-logo-mark">A</div>
        <div>
          <div className="admin-sidebar-title">Alpine</div>
          <div className="admin-sidebar-subtitle">Admin Panel</div>
        </div>
        {/* Mobile close button */}
        <button 
          className="btn-admin btn-admin-ghost btn-admin-icon mobile-only" 
          style={{ marginLeft: "auto" }}
          onClick={() => setMobileOpen(false)}
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="admin-nav">
        {NAV.map((item, i) => {
          if (item.section) {
            return <div key={i} className="admin-nav-section">{item.section}</div>;
          }
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          
          if (item.external) {
            return (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="admin-nav-link">
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link ${active ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge && stats[item.badgeKey] > 0 && (
                <span className="admin-nav-badge">{stats[item.badgeKey] > 99 ? "99+" : stats[item.badgeKey]}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid var(--admin-border)" }}>
        <button className="admin-nav-link" onClick={handleLogout} style={{ color: "var(--admin-danger)" }}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="admin-shell">
      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${mobileOpen ? "active" : ""}`} 
        onClick={() => setMobileOpen(false)} 
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              className="btn-admin btn-admin-ghost btn-admin-icon mobile-only"
              onClick={() => setMobileOpen(true)}
              style={{ padding: "0.5rem" }}
            >
              <Menu size={22} />
            </button>
            <span className="admin-topbar-title">{title}</span>
          </div>
          <div className="admin-topbar-actions">{actions}</div>
        </div>

        {/* Content */}
        <div className="admin-content">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="admin-breadcrumbs">
              <Link href="/admin/dashboard"><Home size={14} /></Link>
              {breadcrumbs.map((bc, i) => (
                <React.Fragment key={i}>
                  <ChevronRight size={12} />
                  {bc.href ? (
                    <Link href={bc.href}>{bc.label}</Link>
                  ) : (
                    <span className="active">{bc.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
