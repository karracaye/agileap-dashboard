"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import styles from "./page.module.css";

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "PO-2026-144";

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>
          {/* Breadcrumbs */}
          <div className={styles.breadcrumbNav}>
            <Link href="/" className={styles.breadcrumbLink}>
              <Icon icon="lucide:home" width={14} height={14} />
            </Link>
            <span>/</span>
            <Link href="/purchase-order" className={styles.breadcrumbLink}>
              Purchase Order
            </Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>{id}</span>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.titleGroup}>
              <div className={styles.titleRow}>
                <h1 className={styles.pageTitle}>Purchase Order</h1>
                <span className={styles.badgeSubmitted}>Submitted</span>
              </div>
              <span className={styles.poSubNo}>{id}</span>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => window.print()}
              >
                <Icon icon="lucide:printer" width={16} height={16} /> Print PO
              </button>
              <Link href={`/purchase-order/new?edit=${id}`} className={styles.btnPrimary}>
                <Icon icon="lucide:pencil" width={16} height={16} /> Edit PO
              </Link>
              <Link href="/purchase-order" className={styles.btnOutlineDark}>
                Back to List
              </Link>
            </div>
          </div>

          {/* Section 1: Vendor Information */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Vendor Information</span>
            </div>
            <div className={styles.formSectionGrid}>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Vendor:</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>CMH PTE LTD (CMH1)</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Contact Person:</span>
                <span style={{ color: "#475569" }}>Joshua Lee</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Currency / Exchange Rate:</span>
                <span style={{ color: "#475569" }}>SGD (Rate: 1.00000)</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Buyer Reference:</span>
                <span style={{ color: "#475569" }}>N/A</span>
              </div>
            </div>
          </div>

          {/* Section 2: PO Details */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Purchase Order Details</span>
            </div>
            <div className={styles.formSectionGrid}>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>PO Date:</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>03-Sep-2026</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Expected Delivery Date:</span>
                <span style={{ color: "#475569" }}>18-Sep-2026</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Payment Terms:</span>
                <span style={{ color: "#475569" }}>Net 30 Days</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Delivery Location:</span>
                <span style={{ color: "#475569" }}>Main Warehouse (C300)</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>PR Ref.:</span>
                <span style={{ color: "#475569" }}>PR-2026-031</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Send Via:</span>
                <span style={{ color: "#475569" }}>InvoiceNow</span>
              </div>
            </div>
          </div>

          {/* Section 3: Line Items */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Line Items</span>
            </div>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>S/N</th>
                    <th className={styles.th}>Item Code</th>
                    <th className={styles.th}>Description</th>
                    <th className={styles.th}>Qty</th>
                    <th className={styles.th}>UOM</th>
                    <th className={styles.th}>Unit Price (SGD)</th>
                    <th className={styles.th}>Tax</th>
                    <th className={styles.th} style={{ textAlign: "right" }}>Total Amount (SGD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.td}>1</td>
                    <td className={styles.td}>IT-SRV-001</td>
                    <td className={styles.td}>Server Hardware Upgrade Kit & Maintenance</td>
                    <td className={styles.td}>1.00</td>
                    <td className={styles.td}>EA</td>
                    <td className={styles.td}>1,750.00</td>
                    <td className={styles.td}>Zero Rated 0%</td>
                    <td className={styles.td} style={{ textAlign: "right", fontWeight: 600 }}>1,750.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.totalsWrap}>
              <div className={styles.totalsBox}>
                <div className={styles.totalRow}>
                  <span>Sub Total:</span>
                  <strong>SGD 1,750.00</strong>
                </div>
                <div className={styles.totalRow}>
                  <span>Total Tax:</span>
                  <strong>SGD 0.00</strong>
                </div>
                <div className={styles.totalRowGrand}>
                  <span>Total Amount:</span>
                  <strong style={{ color: "#E8692A" }}>SGD 1,750.00</strong>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
