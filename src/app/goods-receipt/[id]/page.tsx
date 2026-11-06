"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import styles from "../new/page.module.css";

export default function GoodsReceiptDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "GR-2026-034";

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>
          {/* Breadcrumb Navigation */}
          <div className={styles.breadcrumbNav}>
            <Link href="/" className={styles.breadcrumbLink}>
              <Icon icon="lucide:home" width={14} />
            </Link>
            <span>/</span>
            <Link href="/goods-receipt" className={styles.breadcrumbLink}>
              Goods Receipt
            </Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>{id}</span>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.titleGroup}>
              <div className={styles.titleRow}>
                <h1 className={styles.pageTitle}>Goods Receipt</h1>
                <span className={styles.badgeNew} style={{ background: "#F0F9FF", color: "#0369A1", border: "1px solid #BAE6FD" }}>
                  Submitted
                </span>
              </div>
              <span className={styles.grnSubNo}>{id}</span>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => window.print()}
              >
                <Icon icon="lucide:printer" width={16} /> Print GRN
              </button>
              <Link href="/goods-receipt/new" className={styles.btnPrimary}>
                <Icon icon="lucide:pencil" width={16} /> Edit GRN
              </Link>
              <Link href="/goods-receipt" className={styles.btnOutlineDark}>
                Back
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
                <span style={{ fontWeight: 600, color: "#0F172A" }}>Activants (ACT006)</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Contact Person:</span>
                <span style={{ color: "#475569" }}>N/A</span>
              </div>
            </div>
          </div>

          {/* Section 2: GRN Information */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>GRN Information</span>
            </div>
            <div className={styles.formSectionGrid}>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Receiver Name:</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>Joshua Lee (Test) (joshua+1@activants.com)</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Receiver Department:</span>
                <span style={{ color: "#475569" }}>Super Admin</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Receipt Date:</span>
                <span style={{ color: "#475569" }}>15-Aug-2026</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Location:</span>
                <span style={{ color: "#475569" }}>Default</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>PO Ref.:</span>
                <span style={{ color: "#475569" }}>N/A</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>Delivery Order No.:</span>
                <span style={{ color: "#475569" }}>DO-2026-0091</span>
              </div>
            </div>
          </div>

          {/* Section 3: Line Items Summary */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Received Line Items</span>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>#</th>
                    <th className={styles.th}>Product Code</th>
                    <th className={styles.th}>Description</th>
                    <th className={styles.th}>Qty</th>
                    <th className={styles.th}>UOM</th>
                    <th className={styles.th}>Unit Price</th>
                    <th className={styles.th}>Tax</th>
                    <th className={styles.th} style={{ textAlign: "right" }}>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.td}>1</td>
                    <td className={styles.td} style={{ fontWeight: 600 }}>ACT-ITEM-01</td>
                    <td className={styles.td}>Office Equipment & Supplies</td>
                    <td className={styles.td}>5</td>
                    <td className={styles.td}>BOX</td>
                    <td className={styles.td}>SGD 200.00</td>
                    <td className={styles.td}>GST 9%</td>
                    <td className={styles.td} style={{ textAlign: "right", fontWeight: 600 }}>SGD 1,090.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
