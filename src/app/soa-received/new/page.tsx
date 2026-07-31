"use client";

import React, { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import styles from "./page.module.css";
import { Icon } from "@iconify/react";

interface LineRow {
  id: string;
  refNo: string;
  invoiceDate: string;
  total: number;
  paid: number;
  due: number;
}

export default function CreateSoaReceivedPage() {
  const [vendorCollapsed, setVendorCollapsed] = useState(false);
  const [soaInfoCollapsed, setSoaInfoCollapsed] = useState(false);
  const [attachCollapsed, setAttachCollapsed] = useState(false);
  const [lineItemsCollapsed, setLineItemsCollapsed] = useState(false);
  const [activityCollapsed, setActivityCollapsed] = useState(false);

  // Line items view mode: "dropdown" vs "table"
  const [viewMode, setViewMode] = useState<"dropdown" | "table">("table");

  // Line items state
  const [rows, setRows] = useState<LineRow[]>([
    { id: "1", refNo: "", invoiceDate: "31-Jul-2026", total: 0.0, paid: 0.0, due: 0.0 },
  ]);

  const addRow = () => {
    const nextId = (rows.length + 1).toString();
    setRows([
      ...rows,
      { id: nextId, refNo: "", invoiceDate: "31-Jul-2026", total: 0.0, paid: 0.0, due: 0.0 },
    ]);
  };

  const deleteRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((r) => r.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof LineRow, val: any) => {
    setRows(
      rows.map((r) => {
        if (r.id === id) {
          const updated = { ...r, [field]: val };
          if (field === "total" || field === "paid") {
            updated.due = (parseFloat(updated.total.toString()) || 0) - (parseFloat(updated.paid.toString()) || 0);
          }
          return updated;
        }
        return r;
      })
    );
  };

  const totalSum = rows.reduce((acc, r) => acc + (parseFloat(r.total.toString()) || 0), 0);
  const totalPaid = rows.reduce((acc, r) => acc + (parseFloat(r.paid.toString()) || 0), 0);
  const totalDue = rows.reduce((acc, r) => acc + (parseFloat(r.due.toString()) || 0), 0);

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>

          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <Icon icon="lucide:home" width={14} />
            <Link href="/soa-received" className={styles.breadcrumbLink}>SOA Received</Link>
            <span>&gt;</span>
            <span className={styles.breadcrumbActive}>Create New</span>
          </div>

          {/* Modern Minimalist Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.titleRow}>
                <h1 className={styles.pageTitle}>Create SOA Received</h1>
                <span className={styles.statusBadge}>New Draft</span>
              </div>
              <span className={styles.docIdTag}>DF-20260731-063816879</span>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnSecondary}>Save as Draft</button>
              <button className={styles.btnPrimary}>Save and Continue</button>
              <Link href="/soa-received" className={styles.btnIconButton} title="Back to SOA Received">
                <Icon icon="lucide:chevron-left" width={18} />
              </Link>
            </div>
          </div>

          {/* 1. Vendor Information Card */}
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
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Vendor*</label>
                    <select className={styles.select} defaultValue="">
                      <option value="" disabled>Type to search</option>
                      <option value="VENDOR10">VENDOR10 (VEN010)</option>
                      <option value="VENDOR11">VENDOR11 (VEN011)</option>
                      <option value="VENDOR8">VENDOR8 (VEN008)</option>
                      <option value="Botanique">Botanique Group Organic Kitchen Sdn Bhd (RP8008)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Contact Person*</label>
                    <select className={styles.select} defaultValue="">
                      <option value="" disabled>Type to search</option>
                      <option value="IMDA">IMDA TESTER BUYER (junior+1@activants.com)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                    <label className={styles.label}>Currency*</label>
                    <select className={styles.select} defaultValue="SGD">
                      <option value="" disabled>Type to search</option>
                      <option value="SGD">SGD - Singapore Dollar</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                  </div>
                </div>

                <div className={styles.btnGenerateRow}>
                  <button className={styles.btnGenerate}>
                    Generate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. SOA Information Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setSoaInfoCollapsed(!soaInfoCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:receipt" width={16} />
                </div>
                <span className={styles.sectionTitle}>SOA Information</span>
              </div>
              <Icon
                icon="lucide:chevron-up"
                className={`${styles.chevron} ${soaInfoCollapsed ? styles.chevronCollapsed : ""}`}
                width={16}
              />
            </div>

            {!soaInfoCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Date*</label>
                    <input type="text" className={styles.input} defaultValue="31-Jul-2026" />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Type</label>
                    <select className={styles.select} defaultValue="">
                      <option value="" disabled>Type to search</option>
                      <option value="Monthly">Monthly SOA</option>
                      <option value="Quarterly">Quarterly SOA</option>
                    </select>
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                    <label className={styles.label}>Reference No.</label>
                    <input type="text" className={styles.input} placeholder="Enter reference number..." />
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                    <label className={styles.label}>Notes / Terms</label>
                    <textarea className={styles.textarea} placeholder="Add notes or terms..." />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Attachment Card */}
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

          {/* 4. SOA Line Items Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setLineItemsCollapsed(!lineItemsCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:shopping-bag" width={16} />
                </div>
                <span className={styles.sectionTitle}>SOA Line Items</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px" }} onClick={(e) => e.stopPropagation()}>
                {/* View Mode Toggle */}
                <div className={styles.viewModeToggle}>
                  <button
                    className={`${styles.viewModeBtn} ${viewMode === "table" ? styles.viewModeBtnActive : ""}`}
                    onClick={() => setViewMode("table")}
                  >
                    <Icon icon="lucide:table" width={13} />
                    Table View
                  </button>
                  <button
                    className={`${styles.viewModeBtn} ${viewMode === "dropdown" ? styles.viewModeBtnActive : ""}`}
                    onClick={() => setViewMode("dropdown")}
                  >
                    <Icon icon="lucide:layout-list" width={13} />
                    Dropdown View
                  </button>
                </div>

                <button className={styles.btnColumns}>
                  <Icon icon="lucide:columns-2" width={14} />
                  Columns
                </button>
                <Icon
                  icon="lucide:chevron-up"
                  className={`${styles.chevron} ${lineItemsCollapsed ? styles.chevronCollapsed : ""}`}
                  width={16}
                  onClick={() => setLineItemsCollapsed(!lineItemsCollapsed)}
                />
              </div>
            </div>

            {!lineItemsCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.scrollNote}>
                  *Note: Press Shift & scroll to move to the right
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.lineTable}>
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>Move</th>
                        <th style={{ width: "40px" }}>No.</th>
                        <th>Reference Number*</th>
                        <th>Invoice Date*</th>
                        <th style={{ textAlign: "right" }}>Total</th>
                        <th style={{ textAlign: "right" }}>Paid</th>
                        <th style={{ textAlign: "right" }}>Due*</th>
                        <th style={{ width: "100px", textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, index) => (
                        <tr key={r.id}>
                          <td style={{ textAlign: "center", color: "#94A3B8", cursor: "grab" }}>::</td>
                          <td style={{ textAlign: "center" }}>{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              className={styles.tblInput}
                              value={r.refNo}
                              onChange={(e) => updateRow(r.id, "refNo", e.target.value)}
                              placeholder="Enter reference number..."
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={styles.tblInput}
                              value={r.invoiceDate}
                              onChange={(e) => updateRow(r.id, "invoiceDate", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className={styles.tblInput}
                              style={{ textAlign: "right" }}
                              value={r.total}
                              onChange={(e) => updateRow(r.id, "total", parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className={styles.tblInput}
                              style={{ textAlign: "right" }}
                              value={r.paid}
                              onChange={(e) => updateRow(r.id, "paid", parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td style={{ textAlign: "right", fontWeight: "600", color: "#0F172A" }}>
                            {r.due.toFixed(2)}
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                              <span title="Duplicate" onClick={addRow}>
                                <Icon icon="lucide:copy" width={15} style={{ cursor: "pointer", color: "#475569" }} />
                              </span>
                              <span title="Reset">
                                <Icon icon="lucide:rotate-ccw" width={15} style={{ cursor: "pointer", color: "#475569" }} />
                              </span>
                              <span title="Delete" onClick={() => deleteRow(r.id)}>
                                <Icon icon="lucide:trash-2" width={15} style={{ cursor: "pointer", color: "#EF4444" }} />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.tableBottomRow}>
                  <button className={styles.btnAddRow} onClick={addRow}>
                    <Icon icon="lucide:plus" width={14} /> Add Row
                  </button>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
                    <button className={styles.btnRefresh}>
                      <Icon icon="lucide:refresh-cw" width={13} /> Refresh Totals
                    </button>

                    <div className={styles.totalsBlock}>
                      <div className={styles.totalRowItem}>
                        <span className={styles.totalLabel}>Total Sum :</span>
                        <span className={styles.totalVal}>{totalSum.toFixed(2)} SGD</span>
                      </div>
                      <div className={styles.totalRowItem}>
                        <span className={styles.totalLabel}>Total Paid :</span>
                        <span className={styles.totalVal}>{totalPaid.toFixed(2)} SGD</span>
                      </div>
                      <div className={styles.totalRowItem}>
                        <span className={styles.totalLabel} style={{ fontWeight: 600, color: "#0F172A" }}>Total Due :</span>
                        <span className={styles.totalVal} style={{ fontWeight: 700, fontSize: "15px", color: "var(--brand-orange, #E8692A)" }}>
                          {totalDue.toFixed(2)} SGD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Activity Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setActivityCollapsed(!activityCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:message-square" width={16} />
                </div>
                <span className={styles.sectionTitle}>Activity</span>
              </div>
              <Icon
                icon="lucide:chevron-up"
                className={`${styles.chevron} ${activityCollapsed ? styles.chevronCollapsed : ""}`}
                width={16}
              />
            </div>

            {!activityCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.commentTab}>Comments</div>
                <p className={styles.noComments}>No comments recorded for this draft.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
