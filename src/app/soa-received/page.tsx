"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatusCard from "@/components/StatusCard";
import ImportModal from "@/components/ImportModal";
import styles from "./page.module.css";
import { Icon } from "@iconify/react";

interface SoaRow {
  id: string;
  soaRefNo: string;
  date: string;
  company: string;
  status: "Submitted" | "Draft";
  totalSum: number;
  totalPaid: number;
  totalDue: number;
  createdDate: string;
  lastModified: string;
}

type ColKey =
  | "soaRef"
  | "date"
  | "company"
  | "status"
  | "totalSum"
  | "totalPaid"
  | "totalDue"
  | "createdDate"
  | "lastModified";

const ALL_COLUMNS: { key: ColKey; label: string; locked?: boolean }[] = [
  { key: "soaRef", label: "SOA Ref No.", locked: true },
  { key: "date", label: "Date" },
  { key: "company", label: "Company", locked: true },
  { key: "status", label: "Status" },
  { key: "totalSum", label: "Total Sum" },
  { key: "totalPaid", label: "Total Paid" },
  { key: "totalDue", label: "Total Due" },
  { key: "createdDate", label: "Created Date" },
  { key: "lastModified", label: "Last Modified" },
];

const DEFAULT_VISIBLE: ColKey[] = [
  "soaRef", "date", "company", "status", "totalSum", "totalPaid", "totalDue", "createdDate", "lastModified"
];

const SOA_CARDS = [
  { id: "my-history", label: "My History", currency: "SGD", amount: "565.55", count: 6, icon: "lucide:history", color: "#475569", bgColor: "#F1F5F9" },
  { id: "all", label: "All", currency: "SGD", amount: "565.55", count: 6, icon: "lucide:list", color: "#E8692A", bgColor: "#FFF0E8" },
  { id: "duplicated", label: "Duplicated", currency: "SGD", amount: "20.00", count: 2, icon: "lucide:copy", color: "#D97706", bgColor: "#FEF3C7" },
  { id: "submitted", label: "Submitted", currency: "SGD", amount: "565.55", count: 3, icon: "lucide:send", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "draft", label: "Draft", currency: "SGD", amount: "0.00", count: 3, icon: "lucide:file-text", color: "#2563EB", bgColor: "#EFF6FF" },
  { id: "cancelled", label: "Cancelled", currency: "SGD", amount: "0.00", count: 0, icon: "lucide:ban", color: "#EA580C", bgColor: "#FFEDD5" },
  { id: "rejected", label: "Rejected", currency: "SGD", amount: "0.00", count: 0, icon: "lucide:x-circle", color: "#DC2626", bgColor: "#FEE2E2" },
];

const INITIAL_ROWS: SoaRow[] = [
  {
    id: "1",
    soaRefNo: "SOAR-2025-003",
    date: "18-Aug-2025",
    company: "VENDOR10 (VEN010)",
    status: "Submitted",
    totalSum: 545.55,
    totalPaid: 800.00,
    totalDue: -254.45,
    createdDate: "18-Aug-2025 11:11:16 AM",
    lastModified: "25-Aug-2025 10:49:26 AM",
  },
  {
    id: "2",
    soaRefNo: "SOAR-2025-005",
    date: "25-Aug-2025",
    company: "VENDOR11 (VEN011)",
    status: "Draft",
    totalSum: 0.00,
    totalPaid: 0.00,
    totalDue: 0.00,
    createdDate: "25-Aug-2025 10:44:58 AM",
    lastModified: "25-Aug-2025 10:44:58 AM",
  },
  {
    id: "3",
    soaRefNo: "SOAR-2025-004",
    date: "18-Aug-2025",
    company: "VENDOR8 (VEN008)",
    status: "Draft",
    totalSum: 0.00,
    totalPaid: 0.00,
    totalDue: 0.00,
    createdDate: "18-Aug-2025 02:14:00 PM",
    lastModified: "18-Aug-2025 02:14:00 PM",
  },
  {
    id: "4",
    soaRefNo: "SOAR-2025-002",
    date: "18-Aug-2025",
    company: "VENDOR10 (VEN010)",
    status: "Draft",
    totalSum: 0.00,
    totalPaid: 0.00,
    totalDue: 0.00,
    createdDate: "18-Aug-2025 10:50:02 AM",
    lastModified: "18-Aug-2025 11:30:51 AM",
  },
  {
    id: "5",
    soaRefNo: "SOAR-2025-001",
    date: "15-Aug-2025",
    company: "Botanique Group Organic Kitchen Sdn Bhd (RP8008)",
    status: "Submitted",
    totalSum: 10.00,
    totalPaid: 5.00,
    totalDue: 5.00,
    createdDate: "16-Aug-2025 06:24:58 AM",
    lastModified: "16-Aug-2025 06:25:17 AM",
  },
  {
    id: "6",
    soaRefNo: "SOAR-2025-001",
    date: "15-Aug-2025",
    company: "Botanique Group Organic Kitchen Sdn Bhd (RP8008)",
    status: "Submitted",
    totalSum: 10.00,
    totalPaid: 5.00,
    totalDue: 5.00,
    createdDate: "16-Aug-2025 06:24:34 AM",
    lastModified: "16-Aug-2025 06:24:57 AM",
  },
];

/* ─── Column Picker Component ─────────────────────────────── */
function ColumnPicker({
  visible, onChange, onClose,
}: {
  visible: ColKey[]; onChange: (v: ColKey[]) => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const toggle = (key: ColKey, locked: boolean) => {
    if (locked) return;
    onChange(
      visible.includes(key) ? visible.filter(k => k !== key) : [...visible, key]
    );
  };

  const reset = () => onChange([...DEFAULT_VISIBLE]);

  return (
    <div className={styles.pickerCard} ref={ref}>
      <div className={styles.pickerHeader}>
        <div>
          <p className={styles.pickerTitle}>Customize Columns</p>
          <p className={styles.pickerSub}>{visible.length} of {ALL_COLUMNS.length} columns visible</p>
        </div>
        <button className={styles.pickerReset} onClick={reset}>
          Reset
        </button>
      </div>

      <div className={styles.pickerList}>
        {ALL_COLUMNS.map(col => {
          const isVisible = visible.includes(col.key);
          return (
            <label
              key={col.key}
              className={`${styles.pickerRow} ${col.locked ? styles.pickerRowLocked : ""}`}
            >
              <input
                type="checkbox"
                checked={isVisible}
                disabled={col.locked}
                onChange={() => toggle(col.key, !!col.locked)}
                className={styles.pickerCb}
              />
              <span className={`${styles.pickerCheckBox} ${isVisible ? styles.pickerCheckBoxOn : ""}`}>
                {isVisible && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 6 5 9 10 3"/>
                  </svg>
                )}
              </span>
              <span className={styles.pickerLabel}>{col.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main SOA Received Page ─────────────────────────────── */
export default function SoaReceivedPage() {
  const [activeCard, setActiveCard] = useState("all");
  const [importOpen, setImportOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [visibleCols, setVisibleCols] = useState<ColKey[]>([...DEFAULT_VISIBLE]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const closePicker = useCallback(() => setPickerOpen(false), []);

  const toggleSelect = (id: string) => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const toggleExpand = (id: string) => setExpanded(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const filtered = INITIAL_ROWS.filter(r => {
    // Metric card filter
    if (activeCard === "submitted" && r.status !== "Submitted") return false;
    if (activeCard === "draft" && r.status !== "Draft") return false;
    if (activeCard === "cancelled" || activeCard === "rejected") return false;

    // Search input
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      if (
        !r.soaRefNo.toLowerCase().includes(q) &&
        !r.company.toLowerCase().includes(q) &&
        !r.status.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every(r => selected.includes(r.id));
  const someSelected = selected.length > 0 && !allSelected;
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map(i => i.id));

  const colSpan = visibleCols.length + 3;

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>SOA Received</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  border: "1px solid #CBD5E0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#4A5568",
                  background: "white",
                  cursor: "pointer"
                }}
                onClick={() => setImportOpen(true)}
              >
                <Icon icon="lucide:download" width={14} />
                Import
              </button>

              <Link href="/soa-received/new" className={styles.btnCreate}>
                <Icon icon="lucide:plus" width={15} />
                Create SOA Received
              </Link>
            </div>
          </div>

          <ImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />

          {/* Metric Status Cards Grid (Matching Bills To Pay Home Page) */}
          <div className={styles.cardsGrid}>
            {SOA_CARDS.map((card) => (
              <StatusCard
                key={card.id}
                id={card.id}
                label={card.label}
                currency={card.currency}
                amount={card.amount}
                count={card.count}
                color={card.color}
                bgColor={card.bgColor}
                active={activeCard === card.id}
                onClick={() => setActiveCard(card.id)}
                icon={card.icon}
              />
            ))}
          </div>

          {/* Table Container & Toolbar (Matching InvoiceTable.tsx) */}
          <div className={styles.wrap}>
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>
                {selected.length > 0 && (
                  <span className={styles.selHint}>{selected.length} selected</span>
                )}
              </div>

              <div className={styles.toolbarRight}>
                {/* Columns Customizer Popover */}
                <div className={styles.pickerWrap}>
                  <button
                    className={`${styles.colBtn} ${pickerOpen ? styles.colBtnActive : ""}`}
                    onClick={() => setPickerOpen(o => !o)}
                  >
                    <Icon icon="lucide:columns-2" width={14} />
                    Columns
                    <span className={styles.colBadge}>{visibleCols.length}</span>
                  </button>

                  {pickerOpen && (
                    <ColumnPicker
                      visible={visibleCols}
                      onChange={setVisibleCols}
                      onClose={closePicker}
                    />
                  )}
                </div>

                <div className={styles.divider} />

                {/* Filter Trigger Button */}
                <button
                  className={`${styles.filterBtn} ${filterOpen ? styles.filterBtnActive : ""}`}
                  onClick={() => setFilterOpen(f => !f)}
                >
                  <Icon icon="lucide:sliders-horizontal" width={14} />
                  Filter
                </button>

                {/* Search Box */}
                <div className={styles.searchBox}>
                  <Icon icon="lucide:search" width={14} className={styles.searchIco} />
                  <input
                    className={styles.searchInput}
                    placeholder="Search by SOA Ref No."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Main Table Card */}
            <div className={styles.card}>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.thead}>
                      <th className={styles.thCb}>
                        <input
                          type="checkbox"
                          className={styles.cb}
                          checked={allSelected}
                          ref={el => { if (el) el.indeterminate = someSelected; }}
                          onChange={toggleAll}
                        />
                      </th>
                      <th className={styles.th}>Action</th>
                      {visibleCols.includes("soaRef") && <th className={styles.th}>SOA Ref No. ↓</th>}
                      {visibleCols.includes("date") && <th className={styles.th}>Date ↓</th>}
                      {visibleCols.includes("company") && <th className={styles.th}>Company ↓</th>}
                      {visibleCols.includes("status") && <th className={styles.th}>Status ↓</th>}
                      {visibleCols.includes("totalSum") && <th className={`${styles.th} ${styles.thAmt}`}>Total Sum ↓</th>}
                      {visibleCols.includes("totalPaid") && <th className={`${styles.th} ${styles.thAmt}`}>Total Paid ↓</th>}
                      {visibleCols.includes("totalDue") && <th className={`${styles.th} ${styles.thAmt}`}>Total Due ↓</th>}
                      {visibleCols.includes("createdDate") && <th className={styles.th}>Created Date ↓</th>}
                      {visibleCols.includes("lastModified") && <th className={styles.th}>Last Modified ↓</th>}
                      <th className={styles.thArrow} />
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map(r => {
                      const isSel = selected.includes(r.id);
                      const isExp = expanded.includes(r.id);

                      return (
                        <React.Fragment key={r.id}>
                          <tr
                            className={`${styles.row} ${isSel ? styles.rowSel : ""} ${isExp ? styles.rowExp : ""}`}
                            onClick={() => toggleExpand(r.id)}
                          >
                            <td className={styles.tdCb} onClick={e => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                className={styles.cb}
                                checked={isSel}
                                onChange={() => toggleSelect(r.id)}
                              />
                            </td>

                            <td className={styles.td} onClick={e => e.stopPropagation()}>
                              <div className={styles.actionCell}>
                                <Link href="/bills-to-pay/review">
                                  <Icon icon="lucide:eye" width={16} className={styles.actionIcon} />
                                </Link>
                                <Icon icon="lucide:file-pen" width={16} className={styles.actionIcon} />
                                <Icon icon="lucide:printer" width={16} className={styles.actionIcon} />
                              </div>
                            </td>

                            {visibleCols.includes("soaRef") && <td className={`${styles.td} ${styles.refNo}`}>{r.soaRefNo}</td>}
                            {visibleCols.includes("date") && <td className={styles.td}>{r.date}</td>}
                            {visibleCols.includes("company") && <td className={`${styles.td} ${styles.companyName}`}>{r.company}</td>}
                            {visibleCols.includes("status") && (
                              <td className={styles.td}>
                                <span className={`${styles.statusBadge} ${r.status === "Submitted" ? styles.statusSubmitted : styles.statusDraft}`}>
                                  {r.status}
                                </span>
                              </td>
                            )}
                            {visibleCols.includes("totalSum") && (
                              <td className={`${styles.td} ${styles.tdAmt}`}>
                                <div className={styles.amt}>{r.totalSum.toFixed(2)}</div>
                                <div className={styles.amtCur}>SGD</div>
                              </td>
                            )}
                            {visibleCols.includes("totalPaid") && (
                              <td className={`${styles.td} ${styles.tdAmt}`}>
                                <div className={styles.amt}>{r.totalPaid.toFixed(2)}</div>
                                <div className={styles.amtCur}>SGD</div>
                              </td>
                            )}
                            {visibleCols.includes("totalDue") && (
                              <td className={`${styles.td} ${styles.tdAmt}`}>
                                <div className={styles.amt}>{r.totalDue.toFixed(2)}</div>
                                <div className={styles.amtCur}>SGD</div>
                              </td>
                            )}
                            {visibleCols.includes("createdDate") && <td className={`${styles.td} ${styles.cellText}`}>{r.createdDate}</td>}
                            {visibleCols.includes("lastModified") && <td className={`${styles.td} ${styles.cellText}`}>{r.lastModified}</td>}

                            <td className={styles.tdArrow}>
                              <span className={`${styles.chevron} ${isExp ? styles.chevronOpen : ""}`}>
                                <Icon icon="lucide:chevron-down" width={15} />
                              </span>
                            </td>
                          </tr>

                          {/* Row Expand Collapsible Panel */}
                          {isExp && (
                            <tr className={styles.expandTr}>
                              <td colSpan={colSpan} className={styles.expandTd}>
                                <div className={`${styles.panel} ${styles.panelOpen}`}>
                                  <div className={styles.panelBody}>
                                    <div className={styles.panelGrid}>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>SOA Ref No.</span>
                                        <span className={styles.chipValue}>{r.soaRefNo}</span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Company</span>
                                        <span className={styles.chipValue}>{r.company}</span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Total Sum</span>
                                        <span className={styles.chipValue}>SGD {r.totalSum.toFixed(2)}</span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Total Paid</span>
                                        <span className={styles.chipValue}>SGD {r.totalPaid.toFixed(2)}</span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Total Due</span>
                                        <span className={styles.chipValue}>SGD {r.totalDue.toFixed(2)}</span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Created Date</span>
                                        <span className={styles.chipValue}>{r.createdDate}</span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Last Modified</span>
                                        <span className={styles.chipValue}>{r.lastModified}</span>
                                      </div>
                                    </div>

                                    <div className={styles.panelActions} onClick={e => e.stopPropagation()}>
                                      <Link href="/bills-to-pay/review" className={styles.btnView}>
                                        <Icon icon="lucide:eye" width={14} /> View Details
                                      </Link>
                                      <button className={styles.btnEdit}>
                                        <Icon icon="lucide:file-pen" width={14} /> Edit
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
