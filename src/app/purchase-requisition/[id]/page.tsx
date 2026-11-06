"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import styles from "../new/page.module.css";

const MOCK_PR_DETAILS: Record<string, any> = {
  "PR-2026-031": {
    prNo: "PR-2026-031",
    status: "Submitted",
    subTotal: 2.00,
    totalTax: 0.18,
    totalAmount: 2.18,
    items: [
      {
        id: "l1",
        no: 1,
        productCode: "OFF-001",
        description: "Office Supplies Paper",
        longDescription: "A4 Printing Paper Box (5 reams)",
        quantity: 1,
        uom: "BOX",
        unitPrice: 2.00,
        taxRate: "GST 9%",
        taxAmount: 0.18,
      },
    ],
  },
  "PR-2026-030": {
    prNo: "PR-2026-030",
    status: "Submitted",
    subTotal: 647165.40,
    totalTax: 58244.89,
    totalAmount: 705410.29,
    items: [
      {
        id: "l1",
        no: 1,
        productCode: "ENG-809",
        description: "Engine Spare Parts",
        longDescription: "Main Engine Piston Assembly Unit",
        quantity: 2,
        uom: "LOT",
        unitPrice: 323582.70,
        taxRate: "GST 9%",
        taxAmount: 58244.89,
      },
    ],
  },
};

export default function PurchaseRequisitionDetailPage() {
  const params = useParams();
  const prId = typeof params?.id === "string" ? params.id : "PR-2026-031";
  const prData = MOCK_PR_DETAILS[prId] || MOCK_PR_DETAILS["PR-2026-031"];

  const [attachmentOpen, setAttachmentOpen] = useState(true);
  const [lineItems, setLineItems] = useState(prData.items);

  const subTotalExclTax = lineItems.reduce(
    (sum: number, row: any) => sum + (Number(row.quantity) || 0) * (Number(row.unitPrice) || 0),
    0
  );

  const totalTaxAmount = lineItems.reduce(
    (sum: number, row: any) => sum + (Number(row.taxAmount) || 0),
    0
  );

  const totalAmountInclTax = subTotalExclTax + totalTaxAmount;

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
            <Link href="/purchase-requisition" className={styles.breadcrumbLink}>
              Purchase Requisition
            </Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>{prData.prNo}</span>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.titleGroup}>
              <div className={styles.titleRow}>
                <h1 className={styles.pageTitle}>Purchase Requisition</h1>
                <span className={styles.badgeNew}>{prData.status}</span>
              </div>
              <span className={styles.prSubNo}>{prData.prNo}</span>
            </div>

            <div className={styles.headerActions}>
              <button type="button" className={styles.btnSecondary}>
                Save as Draft
              </button>
              <button type="button" className={styles.btnPrimary}>
                Save and Continue
              </button>
              <Link href="/purchase-requisition" className={styles.btnOutlineDark}>
                Back
              </Link>
            </div>
          </div>

          {/* Attachment Card */}
          <div className={styles.card}>
            <div
              className={styles.cardHeader}
              onClick={() => setAttachmentOpen((prev) => !prev)}
            >
              <span className={styles.cardTitle}>Attachment</span>
              <Icon
                icon={attachmentOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
                width={18}
                style={{ color: "#64748B" }}
              />
            </div>

            {attachmentOpen && (
              <div className={styles.uploadDropzone}>
                <label style={{ cursor: "pointer" }}>
                  <span>Click here to </span>
                  <span className={styles.uploadLink}>upload</span>
                  <span> your file.</span>
                  <input type="file" style={{ display: "none" }} />
                </label>
              </div>
            )}
          </div>

          {/* Line Items Card */}
          <div className={styles.card}>
            <div className={styles.lineToolbar}>
              <span className={styles.noteText}>*Note: Press Shift &amp; scroll to move to the right</span>
              <button type="button" className={styles.btnColumns}>
                <Icon icon="lucide:columns-2" width={14} />
                <span>Columns</span>
              </button>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: "36px" }}>Move</th>
                    <th style={{ width: "36px" }}>No.</th>
                    <th style={{ width: "160px" }}>Product Code</th>
                    <th style={{ width: "180px" }}>Description*</th>
                    <th style={{ width: "180px" }}>Long Description</th>
                    <th style={{ width: "90px", textAlign: "right" }}>Quantity*</th>
                    <th style={{ width: "100px" }}>UOM*</th>
                    <th style={{ width: "100px", textAlign: "right" }}>Unit Price*</th>
                    <th style={{ width: "110px" }}>Taxes*</th>
                    <th style={{ width: "100px", textAlign: "right" }}>Tax Amount*</th>
                    <th style={{ width: "110px", textAlign: "right" }}>Total (Excl. Tax)</th>
                    <th style={{ width: "110px", textAlign: "right" }}>Total (Incl. Tax)*</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item: any) => {
                    const rowExclTax = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                    const rowInclTax = rowExclTax + (Number(item.taxAmount) || 0);

                    return (
                      <tr key={item.id}>
                        <td style={{ textAlign: "center", color: "#94A3B8" }}>
                          <Icon icon="lucide:grip-vertical" width={14} />
                        </td>
                        <td style={{ textAlign: "center", fontWeight: 600, color: "#64748B" }}>
                          {item.no}
                        </td>
                        <td>{item.productCode}</td>
                        <td>{item.description}</td>
                        <td>{item.longDescription}</td>
                        <td style={{ textAlign: "right" }}>{item.quantity.toFixed(2)}</td>
                        <td>{item.uom}</td>
                        <td style={{ textAlign: "right" }}>{item.unitPrice.toFixed(2)}</td>
                        <td>{item.taxRate}</td>
                        <td style={{ textAlign: "right" }}>{item.taxAmount.toFixed(2)}</td>
                        <td style={{ textAlign: "right", fontWeight: 600, color: "#0F172A" }}>
                          {rowExclTax.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 600, color: "#0F172A" }}>
                          {rowInclTax.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Subtotals Summary */}
            <div className={styles.subtotalsBox}>
              <div className={styles.totalRow}>
                <span>Sub Total (excl. tax) :</span>
                <span className={styles.totalVal}>{subTotalExclTax.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Total Tax :</span>
                <span className={styles.totalVal}>{totalTaxAmount.toFixed(2)}</span>
              </div>
              <div className={styles.totalGrandRow}>
                <span>Total Amount :</span>
                <span className={styles.totalGrandVal}>{totalAmountInclTax.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className={styles.activityCard}>
            <h3 className={styles.cardTitle}>Activity</h3>
            <div className={styles.commentsTab}>
              <span>Comments</span>
            </div>
            <span className={styles.commentEmpty}>No comments.</span>
          </div>
        </main>
      </div>
    </div>
  );
}
