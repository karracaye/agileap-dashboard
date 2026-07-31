"use client";

import React, { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import styles from "./page.module.css";
import { Icon } from "@iconify/react";

export default function ReviewBillPage() {
  const [vendorCollapsed, setVendorCollapsed] = useState(false);
  const [additionalCollapsed, setAdditionalCollapsed] = useState(false);
  const [billInfoCollapsed, setBillInfoCollapsed] = useState(false);
  const [deliveryCollapsed, setDeliveryCollapsed] = useState(false);
  const [attachCollapsed, setAttachCollapsed] = useState(false);

  // Line items view mode: "dropdown" (default - no right scrolling needed!) vs "table"
  const [viewMode, setViewMode] = useState<"dropdown" | "table">("dropdown");

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>

          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <Icon icon="lucide:home" width={14} />
            <Link href="/" className={styles.breadcrumbLink}>Bills To Pay</Link>
            <span>&gt;</span>
            <span className={styles.breadcrumbActive}>Review</span>
          </div>

          {/* Minimalist Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.titleRow}>
                <h1 className={styles.pageTitle}>Bills To Pay</h1>
                <span className={styles.statusBadge}>
                  <span className={styles.statusDot} />
                  Awaiting Payment
                </span>
              </div>
              <span className={styles.docIdTag}>B-2025-241</span>
            </div>

            <div className={styles.actions}>
              <Link href="/payment" className={styles.btnPayment}>
                <Icon icon="lucide:credit-card" width={15} />
                Payment
              </Link>
              <button className={styles.btnIconButton} title="More Actions">
                <Icon icon="lucide:more-vertical" width={16} />
              </button>
              <Link href="/" className={styles.btnIconButton} title="Back to Bills To Pay">
                <Icon icon="lucide:chevron-left" width={18} />
              </Link>
            </div>
          </div>

          {/* 1. Vendor Information (Clean Flat Layout) */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setVendorCollapsed(!vendorCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:building-2" width={16} />
                </div>
                <span className={styles.sectionTitle}>Vendor Information</span>
              </div>
              <Icon
                icon="lucide:chevron-up"
                className={`${styles.chevron} ${vendorCollapsed ? styles.chevronCollapsed : ""}`}
                width={16}
              />
            </div>

            {!vendorCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.flatGrid}>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Vendor*</span><span className={styles.flatVal}>CMH PTE LTD (CMH1)</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Contact Person*</span><span className={styles.flatVal}>IMDA TESTER BUYER (junior+1@activants.com)</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Company Code</span><span className={styles.flatVal}>CMH1</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Company Name</span><span className={styles.flatVal}>CMH PTE LTD</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Business Reg. No.</span><span className={styles.flatVal}>202537518H</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Tax Reg. No.</span><span className={styles.flatVal}>202537518H</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Peppol ID</span><span className={styles.flatVal}>0195:SGUEN202112298N</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Address</span><span className={styles.flatVal}>24 Sin Ming Lane, Singapore 535133</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Company Email</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Contact No.</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Vendor Reference ⓘ</span><span className={styles.flatVal}>–</span></div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Additional Field */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setAdditionalCollapsed(!additionalCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:folder-code" width={16} />
                </div>
                <span className={styles.sectionTitle}>Additional Field</span>
              </div>
              <Icon
                icon="lucide:chevron-up"
                className={`${styles.chevron} ${additionalCollapsed ? styles.chevronCollapsed : ""}`}
                width={16}
              />
            </div>

            {!additionalCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.flatGrid}>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Contract Number</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Budget</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Validity Period Start</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Validity Period End</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem} style={{ gridColumn: "1 / -1" }}><span className={styles.flatLabel}>Shipping Address</span><span className={styles.flatVal}>–</span></div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Bill Information */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setBillInfoCollapsed(!billInfoCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:receipt" width={16} />
                </div>
                <span className={styles.sectionTitle}>Bill Information</span>
              </div>
              <Icon
                icon="lucide:chevron-up"
                className={`${styles.chevron} ${billInfoCollapsed ? styles.chevronCollapsed : ""}`}
                width={16}
              />
            </div>

            {!billInfoCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.flatGrid}>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Bill Type</span><span className={styles.flatVal}>Invoice</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Reference No.* ⓘ</span><span className={styles.flatVal}>INVWAPT51</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>PR Number</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Purchase Order Number</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Additional PO</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>GRN Number</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Vendor CN Number</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Currency*</span><span className={styles.flatVal}>SGD</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Exchange Rate</span><span className={styles.flatVal}>1.00000</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Issue Date*</span><span className={styles.flatVal}>26-Dec-2025</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Due Date*</span><span className={styles.flatVal}>25-Jan-2026</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Payment Terms</span><span className={styles.flatVal}>30 Days</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Notes / Description ⓘ</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Location*</span><span className={styles.flatVal}>–</span></div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Delivery */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setDeliveryCollapsed(!deliveryCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:truck" width={16} />
                </div>
                <span className={styles.sectionTitle}>Delivery</span>
              </div>
              <Icon
                icon="lucide:chevron-up"
                className={`${styles.chevron} ${deliveryCollapsed ? styles.chevronCollapsed : ""}`}
                width={16}
              />
            </div>

            {!deliveryCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.flatGrid}>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Location ID</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Address</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Country</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Postal Code</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Delivery Period Start</span><span className={styles.flatVal}>–</span></div>
                  <div className={styles.flatItem}><span className={styles.flatLabel}>Delivery Period End</span><span className={styles.flatVal}>–</span></div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Attachment */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setAttachCollapsed(!attachCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:paperclip" width={16} />
                </div>
                <span className={styles.sectionTitle}>Attachment</span>
              </div>
              <Icon
                icon="lucide:chevron-up"
                className={`${styles.chevron} ${attachCollapsed ? styles.chevronCollapsed : ""}`}
                width={16}
              />
            </div>

            {!attachCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.uploadBox}>
                  <Icon icon="lucide:cloud-upload" width={28} style={{ color: "#E8692A" }} />
                  <p className={styles.uploadText}>
                    Click here to <span className={styles.uploadHighlight}>upload</span> your file.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 6. Line Items (Exact Match to User Screenshots with Dropdown Card View & Right Scroll Table) */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:shopping-bag" width={16} />
                </div>
                <span className={styles.sectionTitle}>Line Items</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {/* View Mode Toggle (Dropdown View vs Table View) */}
                <div className={styles.viewModeToggle}>
                  <button
                    className={`${styles.viewModeBtn} ${viewMode === "dropdown" ? styles.viewModeBtnActive : ""}`}
                    onClick={() => setViewMode("dropdown")}
                  >
                    <Icon icon="lucide:layout-list" width={13} />
                    Dropdown View
                  </button>
                  <button
                    className={`${styles.viewModeBtn} ${viewMode === "table" ? styles.viewModeBtnActive : ""}`}
                    onClick={() => setViewMode("table")}
                  >
                    <Icon icon="lucide:table" width={13} />
                    Table View
                  </button>
                </div>

                {/* Screenshot Action Buttons: Columns & Popout */}
                <div className={styles.lineHeaderActions}>
                  <button className={styles.btnColumns}>
                    <Icon icon="lucide:columns-2" width={14} />
                    Columns
                  </button>
                  <button className={styles.btnPopout} title="Expand Table">
                    <Icon icon="lucide:external-link" width={13} />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.sectionBody}>

              {viewMode === "dropdown" ? (
                /* ── Dropdown Item Card View (Easy fill-up / review - No right scrolling!) ── */
                <div className={styles.itemCardList}>
                  <div className={styles.itemCard}>
                    <div className={styles.itemCardHeader}>
                      <div className={styles.itemHeaderLeft}>
                        <span className={styles.itemNumber}>1</span>
                        <span className={styles.itemTitle}>Lenovo — Test</span>
                      </div>
                      <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#0F172A" }}>
                        27,060.00 SGD
                      </span>
                    </div>

                    <div className={styles.itemCardBody}>
                      <div><span className={styles.flatLabel}>PO S/No.:</span> <span className={styles.flatVal}>–</span></div>
                      <div><span className={styles.flatLabel}>Product Code:</span> <span className={styles.flatVal}>Lenovo</span></div>
                      <div><span className={styles.flatLabel}>Description*:</span> <span className={styles.flatVal}>Test</span></div>
                      <div><span className={styles.flatLabel}>Cost Centre:</span> <span className={styles.flatVal}>–</span></div>
                      <div><span className={styles.flatLabel}>GL Code*:</span> <span className={styles.flatVal}>0000</span></div>
                      <div><span className={styles.flatLabel}>Quantity*:</span> <span className={styles.flatVal}>220.00</span></div>
                      <div><span className={styles.flatLabel}>UOM*:</span> <span className={styles.flatVal}>Each</span></div>
                      <div><span className={styles.flatLabel}>Unit Price*:</span> <span className={styles.flatVal}>123.00</span></div>
                      <div><span className={styles.flatLabel}>Taxes*:</span> <span className={styles.flatVal}>0%</span></div>
                      <div><span className={styles.flatLabel}>Tax Amount*:</span> <span className={styles.flatVal}>0.00</span></div>
                      <div><span className={styles.flatLabel}>Total (Excl. Tax)* ⓘ:</span> <span className={styles.flatVal}>27,060.00</span></div>
                      <div><span className={styles.flatLabel}>Total (Incl. Tax)* ⓘ:</span> <span className={styles.flatVal}>27,060.00</span></div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Right-Scrollable Table View (Exact Screenshot Columns & Note) ── */
                <div>
                  <div className={styles.scrollNote}>
                    *Note: Press Shift & scroll to move to the right
                  </div>

                  <div className={styles.tableContainer}>
                    <table className={styles.lineTable}>
                      <thead>
                        <tr>
                          <th>S/No.</th>
                          <th>PO S/No.</th>
                          <th>Product Code</th>
                          <th>Description*</th>
                          <th>Cost Centre</th>
                          <th>GL Code*</th>
                          <th style={{ textAlign: "right" }}>Quantity*</th>
                          <th>UOM*</th>
                          <th style={{ textAlign: "right" }}>Unit Price*</th>
                          <th style={{ textAlign: "right" }}>Taxes*</th>
                          <th style={{ textAlign: "right" }}>Tax Amount*</th>
                          <th style={{ textAlign: "right" }}>Total (Excl. Tax)* ⓘ</th>
                          <th style={{ textAlign: "right" }}>Total (Incl. Tax)* ⓘ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td style={{ color: "#94A3B8" }}>–</td>
                          <td style={{ fontWeight: "500" }}>Lenovo</td>
                          <td>Test</td>
                          <td style={{ color: "#94A3B8" }}>–</td>
                          <td>0000</td>
                          <td style={{ textAlign: "right" }}>220.00</td>
                          <td>Each</td>
                          <td style={{ textAlign: "right" }}>123.00</td>
                          <td style={{ textAlign: "right" }}>0%</td>
                          <td style={{ textAlign: "right" }}>0.00</td>
                          <td style={{ textAlign: "right" }}>27,060.00</td>
                          <td style={{ textAlign: "right" }}>27,060.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Exact Screenshot Totals Summary */}
              <div className={styles.totalsBlock}>
                <div className={styles.totalRowItem}>
                  <span className={styles.totalLabel}>Sub Total (excl. tax)*:</span>
                  <span className={styles.totalVal}>27,060.00</span>
                </div>
                <div className={styles.totalRowItem}>
                  <span className={styles.totalLabel}>Total Tax ⓘ:</span>
                  <span className={styles.totalVal}>0.00</span>
                </div>
                <div className={styles.totalRowItem}>
                  <span className={styles.totalLabel} style={{ fontWeight: 600, color: "#0F172A" }}>Total Amount*:</span>
                  <span className={`${styles.totalVal} ${styles.grandTotal}`}>27,060.00</span>
                </div>
              </div>

            </div>
          </div>

          {/* 7. Activity Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:message-square" width={16} />
                </div>
                <span className={styles.sectionTitle}>Activity</span>
              </div>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.activityBox}>
                <div className={styles.commentTab}>Comments</div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" }}>
                  <div className={styles.flatItem}>
                    <span className={styles.flatLabel}>Session Type</span>
                    <select style={{ padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: "6px", fontSize: "13px" }} defaultValue="Internal">
                      <option value="Internal">Internal</option>
                    </select>
                  </div>

                  <div className={styles.flatItem}>
                    <span className={styles.flatLabel}>Action type</span>
                    <select style={{ padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: "6px", fontSize: "13px" }} defaultValue="To Create">
                      <option value="To Create">To Create</option>
                    </select>
                  </div>
                </div>

                <textarea
                  className={styles.commentField}
                  placeholder="Add a comment..."
                />

                <div className={styles.commentActions}>
                  <button style={{
                    padding: "8px 16px",
                    border: "1.5px solid #E8692A",
                    borderRadius: "8px",
                    color: "#E8692A",
                    background: "white",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}>
                    Add Attachment
                  </button>

                  <button style={{
                    padding: "8px 22px",
                    border: "none",
                    borderRadius: "8px",
                    color: "#94A3B8",
                    background: "#F1F5F9",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    cursor: "not-allowed"
                  }}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
