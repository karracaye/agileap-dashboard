"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import styles from "./Sidebar.module.css";

const NAV_GROUPS = [
  {
    id: "activants",
    label: "Activants PINT Test",
    icon: "lucide:building-2",
    tone: "brand",
    children: [
      { id: "overview", label: "Overview", icon: "lucide:layout-dashboard", href: "#" },
      { id: "workspace", label: "Workspace", icon: "lucide:briefcase-business", href: "#" },
    ],
  },
  {
    id: "payable",
    label: "Accounts Payable",
    icon: "lucide:arrow-up-right",
    tone: "payable",
    children: [
      { id: "ap-dashboard", label: "AP Dashboard", icon: "lucide:layout-dashboard", href: "/ap-dashboard" },
      { id: "purchase-req", label: "Purchase Requisition", icon: "lucide:clipboard-list", href: "#" },
      { id: "goods-receipt", label: "Goods Receipt", icon: "lucide:package-check", href: "#" },
      { id: "bills-to-pay", label: "Bills To Pay", icon: "lucide:receipt-text", href: "/" },
      { id: "claims", label: "Claims / Petty Cash", icon: "lucide:wallet-cards", href: "/claims" },
      { id: "purchase-order", label: "Purchase Order", icon: "lucide:shopping-cart", href: "#" },
      { id: "vendor-credit", label: "Vendor Credit Note", icon: "lucide:file-pen-line", href: "#" },
      { id: "payment", label: "Payment", icon: "lucide:circle-dollar-sign", href: "/payment" },
      { id: "timesheets", label: "Timesheets", icon: "lucide:clock-3", href: "#" },
      { id: "soa", label: "SOA Received", icon: "lucide:file-check-2", href: "/soa-received" },
      { id: "contract", label: "Contract", icon: "lucide:scroll-text", href: "#" },
      { id: "vendor-debit", label: "Vendor Debit Note", icon: "lucide:file-minus-2", href: "#" },
      { id: "budget", label: "Budget", icon: "lucide:calculator", href: "#" },
    ],
  },
  {
    id: "receivable",
    label: "Accounts Receivable",
    icon: "lucide:arrow-down-left",
    tone: "receivable",
    children: [
      { id: "ar-dashboard", label: "AR Dashboard", icon: "lucide:chart-no-axes-combined", href: "#" },
      { id: "customer-invoices", label: "Customer Invoices", icon: "lucide:file-text", href: "#" },
      { id: "collections", label: "Collections", icon: "lucide:hand-coins", href: "#" },
    ],
  },
  {
    id: "general",
    label: "General",
    icon: "lucide:settings",
    tone: "neutral",
    children: [
      { id: "configuration", label: "Configuration", icon: "lucide:settings", href: "/configuration" },
      { id: "vendor-customer", label: "Vendor / Customer", icon: "lucide:users", href: "#" },
      { id: "bank-management", label: "Bank Management", icon: "lucide:landmark", href: "#" },
      { id: "notification", label: "Notification", icon: "lucide:bell", href: "#" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: "lucide:file-text",
    tone: "neutral",
    children: [
      { id: "reports-main", label: "Reports", icon: "lucide:file-bar-chart-2", href: "/reports" },
      { id: "invoicenow-peppol", label: "InvoiceNow (Peppol)", icon: "lucide:calendar-days", href: "#" },
      { id: "myinvois", label: "MyInvois", icon: "lucide:calendar-days", href: "#" },
      { id: "gst-invoicenow", label: "GST InvoiceNow", icon: "lucide:calendar-days", href: "/gst-invoicenow" },
      { id: "sap-transaction", label: "SAP Transaction", icon: "lucide:calendar-days", href: "#" },
    ],
  },
];

function NavIcon({ icon, size = 18 }: { icon: string; size?: number }) {
  return <Icon icon={icon} width={size} height={size} aria-hidden="true" />;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(["payable"]);

  const toggleGroup = (id: string) => {
    setExpanded((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
      <div className={styles.logoRow}>
        {collapsed ? (
          <Image src="/agile-logo-icon.png" alt="AgileAP" width={32} height={32} className={styles.logoIcon} priority />
        ) : (
          <Image src="/agile-logo-full.png" alt="AgileAP" width={120} height={34} className={styles.logoFull} priority />
        )}
        <button
          className={styles.toggleBtn}
          onClick={() => setCollapsed((current) => !current)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon
            className={`${styles.toggleIcon} ${collapsed ? styles.toggleIconFlipped : ""}`}
            icon="lucide:chevron-left"
            width={16}
            height={16}
            aria-hidden="true"
          />
        </button>
      </div>

      <nav className={styles.nav}>
        {NAV_GROUPS.map((group) => {
          const isExpanded = expanded.includes(group.id);
          const isActiveGroup = group.children.some((child) => child.href === pathname);

          return (
            <div key={group.id} className={styles.navGroup}>
              <button
                className={`${styles.navItem} ${isActiveGroup ? styles.navItemActive : ""} ${collapsed ? styles.navItemCollapsed : ""}`}
                onClick={() => !collapsed && toggleGroup(group.id)}
                title={collapsed ? group.label : undefined}
                aria-expanded={isExpanded}
              >
                <span className={`${styles.navIconSlot} ${styles[group.tone as keyof typeof styles]}`}>
                  <NavIcon icon={group.icon} />
                </span>
                {!collapsed && (
                  <>
                    <span className={styles.navLabel}>{group.label}</span>
                    <Icon
                      className={`${styles.chevron} ${isExpanded ? styles.chevronUp : ""}`}
                      icon="lucide:chevron-down"
                      width={14}
                      height={14}
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>

              {isExpanded && !collapsed && (
                <div className={styles.subNav}>
                  {group.children.map((child) => {
                    const isActive = pathname === child.href;
                    return (
                      <Link
                        key={child.id}
                        href={child.href}
                        className={`${styles.subNavItem} ${isActive ? styles.subNavItemActive : ""}`}
                      >
                        <span className={styles.subNavIcon}>
                          <NavIcon icon={child.icon} size={16} />
                        </span>
                        <span>{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
