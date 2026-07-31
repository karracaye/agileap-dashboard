"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import styles from "./InvoiceTable.module.css";

/* ─── Column definitions ────────────────────────────────── */
export const ALL_COLUMNS = [
  { key: "invRef",       label: "Invoice Ref",       locked: true  },
  { key: "type",         label: "Source / Type",     locked: false },
  { key: "status",       label: "Status",            locked: false },
  { key: "vendor",       label: "Vendor / Contact",  locked: false },
  { key: "totalAmount",  label: "Total Amount",      locked: false },
  { key: "exception",    label: "Exception Reason",  locked: false },
  { key: "pendingWith",  label: "Pending With",      locked: false },
  { key: "subtotal",     label: "Sub Total",         locked: false },
  { key: "totalTax",     label: "Total Tax",         locked: false },
  { key: "poRef",        label: "PO / GR Ref.",      locked: false },
  { key: "issueDate",    label: "Issue Date",        locked: false },
  { key: "dueDate",      label: "Due Date",          locked: false },
  { key: "createdDate",  label: "Created Date",      locked: false },
  { key: "lastModified", label: "Last Modified",     locked: false },
] as const;

type ColKey = typeof ALL_COLUMNS[number]["key"];

const DEFAULT_VISIBLE: ColKey[] = ["invRef", "type", "status", "vendor", "totalAmount"];

/* ─── Invoice type ──────────────────────────────────────── */
interface Invoice {
  id: string;
  invRefNo: string; subRef: string;
  type: "agileap" | "ocr" | "invoicenow" | "na";
  status: "Rejected"|"Accepted"|"Draft"|"Paid"|"Pending"|"Cancelled"|"Submitted";
  exceptionReason: string; pendingWith: string;
  vendor: string; vendorContact: string;
  subtotal: string; totalTax: string; totalAmount: string; currency: string;
  poGrRef: string; issueDate: string; dueDate: string;
  createdDate: string; lastModified: string;
}

/* ─── Data ──────────────────────────────────────────────── */
const INVOICES: Invoice[] = [
  { id:"1",  invRefNo:"INV-2026-007",      subRef:"B-2026-331",   type:"agileap",    status:"Rejected",  exceptionReason:"Matched",                pendingWith:"System",       vendor:"CMH PTE LTD",              vendorContact:"IMDA TESTER BUYER (junior+1@activ...)", subtotal:"1,850.00",  totalTax:"0.00",     totalAmount:"1,850.00",  currency:"SGD", poGrRef:"PO-2026-063",  issueDate:"15-Apr-2026", dueDate:"15-May-2026", createdDate:"15-Apr-2026 01:27:30 PM", lastModified:"30-Jun-2026 05:54:20 PM" },
  { id:"2",  invRefNo:"INV-2026-008",      subRef:"B-2026-366",   type:"agileap",    status:"Rejected",  exceptionReason:"Duplicate Invoice Found", pendingWith:"System",       vendor:"CMH PTE LTD",              vendorContact:"IMDA TESTER BUYER (junior+1@activ...)", subtotal:"1,500.00",  totalTax:"0.00",     totalAmount:"1,500.00",  currency:"SGD", poGrRef:"PO-2026-069",  issueDate:"15-Apr-2026", dueDate:"15-May-2026", createdDate:"20-May-2026 07:24:23 PM", lastModified:"29-Jun-2026 04:41:17 PM" },
  { id:"3",  invRefNo:"INV-2026-008",      subRef:"B-2026-365",   type:"agileap",    status:"Rejected",  exceptionReason:"Duplicate Invoice Found", pendingWith:"System",       vendor:"CMH PTE LTD",              vendorContact:"IMDA TESTER BUYER (junior+1@activ...)", subtotal:"1,500.00",  totalTax:"0.00",     totalAmount:"1,500.00",  currency:"SGD", poGrRef:"PO-2026-069",  issueDate:"15-Apr-2026", dueDate:"15-May-2026", createdDate:"20-May-2026 07:23:58 PM", lastModified:"29-Jun-2026 04:41:17 PM" },
  { id:"4",  invRefNo:"25123197",          subRef:"B-2026-250",   type:"ocr",        status:"Rejected",  exceptionReason:"Matched",                pendingWith:"System",       vendor:"SynTech Chemicals Pte Ltd.",vendorContact:"syntechchem@syntechchem.com",           subtotal:"201.00",    totalTax:"0.00",     totalAmount:"201.00",    currency:"SGD", poGrRef:"4500501424",   issueDate:"29-Dec-2025", dueDate:"25-Feb-2026", createdDate:"25-Jan-2026 04:31:38 AM", lastModified:"11-Jun-2026 01:08:57 AM" },
  { id:"5",  invRefNo:"INV-2026-008",      subRef:"B-2026-333",   type:"agileap",    status:"Rejected",  exceptionReason:"–",                      pendingWith:"System",       vendor:"CMH PTE LTD",              vendorContact:"IMDA TESTER BUYER (junior+1@activ...)", subtotal:"1,500.00",  totalTax:"0.00",     totalAmount:"1,500.00",  currency:"SGD", poGrRef:"PO-2026-069",  issueDate:"15-Apr-2026", dueDate:"15-May-2026", createdDate:"15-Apr-2026 03:14:25 PM", lastModified:"16-Apr-2026 08:49:30 PM" },
  { id:"6",  invRefNo:"invoice123",        subRef:"INV-2024-064", type:"na",         status:"Rejected",  exceptionReason:"–",                      pendingWith:"System",       vendor:"CMH PTE LTD",              vendorContact:"Letoh Tan (junior@activants.com)",      subtotal:"50.00",     totalTax:"4.50",     totalAmount:"54.50",     currency:"SGD", poGrRef:"N/A",          issueDate:"29-Aug-2024", dueDate:"29-Sep-2024", createdDate:"29-Aug-2024 11:43:48 AM", lastModified:"14-Apr-2026 09:57:09 PM" },
  { id:"7",  invRefNo:"INV00186-PS133HI1", subRef:"INV-2024-051", type:"invoicenow", status:"Rejected",  exceptionReason:"–",                      pendingWith:"System",       vendor:"IMDA TEST BUYER",          vendorContact:"Ahmad Bala Chan (invoicenowtest...)",   subtotal:"33,915.00", totalTax:"3,052.35", totalAmount:"36,967.35", currency:"SGD", poGrRef:"PO123",        issueDate:"03-Jun-2024", dueDate:"03-Jul-2024", createdDate:"03-Jun-2024 11:32:31 PM", lastModified:"06-Apr-2026 05:26:15 PM" },
  { id:"8",  invRefNo:"INV-2026-009",      subRef:"B-2026-410",   type:"agileap",    status:"Draft",     exceptionReason:"–",                      pendingWith:"Finance Team", vendor:"Global Tech Pte Ltd",      vendorContact:"accounts@globaltech.com.sg",            subtotal:"4,200.00",  totalTax:"378.00",   totalAmount:"4,578.00",  currency:"SGD", poGrRef:"PO-2026-071",  issueDate:"20-Apr-2026", dueDate:"20-May-2026", createdDate:"20-Apr-2026 09:10:00 AM", lastModified:"21-Apr-2026 02:00:00 PM" },
  { id:"9",  invRefNo:"INV-2026-010",      subRef:"B-2026-411",   type:"ocr",        status:"Paid",      exceptionReason:"–",                      pendingWith:"–",            vendor:"ABC Supplies Pte Ltd",     vendorContact:"invoice@abcsupplies.sg",                subtotal:"8,750.00",  totalTax:"787.50",   totalAmount:"9,537.50",  currency:"SGD", poGrRef:"PO-2026-044",  issueDate:"01-Mar-2026", dueDate:"01-Apr-2026", createdDate:"01-Mar-2026 10:00:00 AM", lastModified:"05-Apr-2026 03:15:00 PM" },
  { id:"10", invRefNo:"INV-2025-190",      subRef:"B-2025-900",   type:"invoicenow", status:"Accepted",  exceptionReason:"–",                      pendingWith:"–",            vendor:"Prime Logistics SG",       vendorContact:"billing@primelogistics.com",            subtotal:"12,400.00", totalTax:"1,116.00", totalAmount:"13,516.00", currency:"SGD", poGrRef:"PO-2025-188",  issueDate:"10-Dec-2025", dueDate:"10-Jan-2026", createdDate:"10-Dec-2025 08:45:00 AM", lastModified:"12-Jan-2026 11:00:00 AM" },
];

/* ─── Status badge ──────────────────────────────────────── */
const STATUS_META: Record<string, { color: string; bg: string; border: string }> = {
  Rejected:  { color:"#C53030", bg:"#FFF5F5", border:"#FED7D7" },
  Accepted:  { color:"#276749", bg:"#F0FFF4", border:"#C6F6D5" },
  Draft:     { color:"#975A16", bg:"#FFFBEB", border:"#FEEBC8" },
  Paid:      { color:"#553C9A", bg:"#FAF5FF", border:"#E9D8FD" },
  Pending:   { color:"#9C4221", bg:"#FFFAF0", border:"#FEEBC8" },
  Cancelled: { color:"#4A5568", bg:"#F7FAFC", border:"#E2E8F0" },
  Submitted: { color:"#2B6CB0", bg:"#EBF8FF", border:"#BEE3F8" },
};

function StatusBadge({ status }: { status: Invoice["status"] }) {
  const m = STATUS_META[status] ?? STATUS_META.Cancelled;
  return (
    <span className={styles.statusBadge} style={{ color:m.color, background:m.bg, borderColor:m.border }}>
      <span className={styles.statusDot} style={{ background:m.color }} />
      {status}
    </span>
  );
}

function TypeLabel({ type }: { type: Invoice["type"] }) {
  if (type === "agileap")    return <span className={styles.typeText}>From <b className={styles.tAgile}>agile</b><b className={styles.tAp}>ap</b></span>;
  if (type === "invoicenow") return <span className={styles.typeText}>From <b className={styles.tInvoice}>INVOICE</b><b className={styles.tNow}>NOW</b></span>;
  if (type === "ocr")        return <span className={styles.typeText}>From OCR</span>;
  return <span className={styles.typeMuted}>N/A</span>;
}

function Chip({ label, value, link }: { label: string; value: string; link?: boolean }) {
  return (
    <div className={styles.chip}>
      <span className={styles.chipLabel}>{label}</span>
      <span className={`${styles.chipValue} ${link ? styles.chipLink : ""}`}>{value}</span>
    </div>
  );
}

/* helper: render a cell value for a given key */
function CellContent({ colKey, inv }: { colKey: ColKey; inv: Invoice }) {
  switch (colKey) {
    case "invRef":       return <><p className={styles.invNo}>{inv.invRefNo}</p><p className={styles.invSub}>{inv.subRef}</p></>;
    case "type":         return <TypeLabel type={inv.type} />;
    case "status":       return <StatusBadge status={inv.status} />;
    case "vendor":       return <><p className={styles.vendorName}>{inv.vendor}</p><p className={styles.vendorSub}>{inv.vendorContact}</p></>;
    case "totalAmount":  return <><p className={styles.amt}>{inv.totalAmount}</p><p className={styles.amtCur}>{inv.currency}</p></>;
    case "exception":    return <span className={styles.cellText}>{inv.exceptionReason}</span>;
    case "pendingWith":  return <span className={styles.cellText}>{inv.pendingWith}</span>;
    case "subtotal":     return <><p className={styles.amt}>{inv.subtotal}</p><p className={styles.amtCur}>{inv.currency}</p></>;
    case "totalTax":     return <><p className={styles.amt}>{inv.totalTax}</p><p className={styles.amtCur}>{inv.currency}</p></>;
    case "poRef":        return <span className={styles.chipLink}>{inv.poGrRef}</span>;
    case "issueDate":    return <span className={styles.cellText}>{inv.issueDate}</span>;
    case "dueDate":      return <span className={styles.cellText}>{inv.dueDate}</span>;
    case "createdDate":  return <span className={styles.cellText}>{inv.createdDate}</span>;
    case "lastModified": return <span className={styles.cellText}>{inv.lastModified}</span>;
    default:             return null;
  }
}

/* helper: is a column right-aligned? */
function isRightAlign(key: ColKey) {
  return ["totalAmount", "subtotal", "totalTax"].includes(key);
}

/* ─── Column picker popover ─────────────────────────────── */
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
      visible.includes(key)
        ? visible.filter(k => k !== key)
        : [...visible, key]
    );
  };

  const reset = () => onChange([...DEFAULT_VISIBLE]);

  return (
    <div className={styles.pickerCard} ref={ref}>
      {/* Header */}
      <div className={styles.pickerHeader}>
        <div>
          <p className={styles.pickerTitle}>Customize Columns</p>
          <p className={styles.pickerSub}>{visible.length} of {ALL_COLUMNS.length} columns visible</p>
        </div>
        <button className={styles.pickerReset} onClick={reset} title="Reset to defaults">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
          </svg>
          Reset
        </button>
      </div>

      {/* Column list */}
      <div className={styles.pickerList}>
        {ALL_COLUMNS.map(col => {
          const isVisible = visible.includes(col.key);
          return (
            <label
              key={col.key}
              className={`${styles.pickerRow} ${col.locked ? styles.pickerRowLocked : ""}`}
              title={col.locked ? "This column is always visible" : undefined}
            >
              <span className={styles.pickerCheck}>
                <input
                  type="checkbox"
                  checked={isVisible}
                  disabled={col.locked}
                  onChange={() => toggle(col.key, col.locked)}
                  className={styles.pickerCb}
                  aria-label={`toggle ${col.label}`}
                />
                <span className={`${styles.pickerCheckBox} ${isVisible ? styles.pickerCheckBoxOn : ""}`}>
                  {isVisible && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2 6 5 9 10 3"/>
                    </svg>
                  )}
                </span>
              </span>
              <span className={styles.pickerLabel}>{col.label}</span>
              {col.locked && (
                <span className={styles.pickerLockBadge}>Always on</span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────── */
export default function InvoiceTable() {
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [visibleCols, setVisibleCols] = useState<ColKey[]>([...DEFAULT_VISIBLE]);
  const [pickerOpen, setPickerOpen]   = useState(false);

  const pickerAnchorRef = useRef<HTMLDivElement>(null);

  const filtered   = INVOICES.filter(inv =>
    inv.invRefNo.toLowerCase().includes(search.toLowerCase()) ||
    inv.vendor.toLowerCase().includes(search.toLowerCase()) ||
    inv.status.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const toggleExpand = (id: string) => setExpanded(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const allSelected  = filtered.length > 0 && filtered.every(inv => selected.includes(inv.id));
  const someSelected = selected.length > 0 && !allSelected;
  const toggleAll    = () => setSelected(allSelected ? [] : filtered.map(i => i.id));

  const closePicker = useCallback(() => setPickerOpen(false), []);

  // Columns NOT in the table → go into expand panel
  const panelCols = ALL_COLUMNS.filter(c => !visibleCols.includes(c.key) && !c.locked);

  // Column span = visible cols + checkbox + chevron
  const colSpan = visibleCols.length + 2;

  return (
    <div className={styles.wrap}>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          {selected.length > 0 && (
            <span className={styles.selHint}>{selected.length} selected</span>
          )}
        </div>
        <div className={styles.toolbarRight}>

          {/* Column picker trigger */}
          <div className={styles.pickerWrap} ref={pickerAnchorRef}>
            <button
              id="column-visibility-btn"
              className={`${styles.colBtn} ${pickerOpen ? styles.colBtnActive : ""}`}
              onClick={() => setPickerOpen(o => !o)}
              aria-haspopup="true"
              aria-expanded={pickerOpen}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              Columns
              <span className={styles.colBadge}>{visibleCols.length}</span>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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

          <button className={styles.filterBtn}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filter
          </button>
          <div className={styles.searchBox}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIco}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input className={styles.searchInput} placeholder="Search by Invoice No."
              value={search} onChange={e => setSearch(e.target.value)} aria-label="search invoices" />
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className={styles.card}>
        <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.thead}>
              <th className={styles.th}>Action</th>
              {visibleCols.map(key => {
                const col = ALL_COLUMNS.find(c => c.key === key)!;
                return (
                  <th key={key} className={`${styles.th} ${isRightAlign(key) ? styles.thAmt : ""}`}>
                    {col.label}
                  </th>
                );
              })}
              <th className={styles.thArrow} />
            </tr>
          </thead>

          <tbody>
            {filtered.map(inv => {
              const isSel = selected.includes(inv.id);
              const isExp = expanded.includes(inv.id);

              return (
                <React.Fragment key={inv.id}>
                  {/* Main row */}
                  <tr
                    className={`${styles.row} ${isSel ? styles.rowSel : ""} ${isExp ? styles.rowExp : ""}`}
                    onClick={() => toggleExpand(inv.id)}
                  >
                    <td className={styles.td} onClick={e => e.stopPropagation()}>
                      <div className={styles.actionCell}>
                        <Link href="/bills-to-pay/review" title="View Bill">
                          <Icon icon="lucide:eye" width={16} className={styles.actionIcon} />
                        </Link>
                        <Link href="/bills-to-pay/new" title="Edit Bill">
                          <Icon icon="lucide:file-pen" width={16} className={styles.actionIcon} />
                        </Link>
                      </div>
                    </td>

                    {visibleCols.map(key => (
                      <td key={key} className={`${styles.td} ${isRightAlign(key) ? styles.tdAmt : ""}`}>
                        <CellContent colKey={key} inv={inv} />
                      </td>
                    ))}

                    <td className={styles.tdArrow}>
                      <span className={`${styles.chevron} ${isExp ? styles.chevronOpen : ""}`}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </span>
                    </td>
                  </tr>

                  {/* Expand panel */}
                  <tr className={styles.expandTr}>
                    <td colSpan={colSpan} className={styles.expandTd}>
                      <div className={`${styles.panel} ${isExp ? styles.panelOpen : ""}`}>
                        <div className={styles.panelBody}>
                          {/* Detail chips for hidden columns */}
                          <div className={styles.panelGrid}>
                            {panelCols.length > 0 ? panelCols.map(col => {
                              const val = (() => {
                                switch (col.key) {
                                  case "exception":    return inv.exceptionReason;
                                  case "pendingWith":  return inv.pendingWith;
                                  case "subtotal":     return `${inv.currency} ${inv.subtotal}`;
                                  case "totalTax":     return `${inv.currency} ${inv.totalTax}`;
                                  case "totalAmount":  return `${inv.currency} ${inv.totalAmount}`;
                                  case "poRef":        return inv.poGrRef;
                                  case "issueDate":    return inv.issueDate;
                                  case "dueDate":      return inv.dueDate;
                                  case "createdDate":  return inv.createdDate;
                                  case "lastModified": return inv.lastModified;
                                  case "type":         return inv.type === "agileap" ? "From agileap" : inv.type === "invoicenow" ? "From INVOICENOW" : inv.type === "ocr" ? "From OCR" : "N/A";
                                  case "status":       return inv.status;
                                  case "vendor":       return `${inv.vendor} — ${inv.vendorContact}`;
                                  default:             return "–";
                                }
                              })();
                              return (
                                <Chip key={col.key} label={col.label} value={val}
                                  link={col.key === "poRef"} />
                              );
                            }) : (
                              <p className={styles.panelAllVisible}>All columns are visible in the table.</p>
                            )}
                          </div>

                          {/* Right — actions */}
                          <div className={styles.panelActions} onClick={e => e.stopPropagation()}>
                            <Link href="/bills-to-pay/review" className={styles.btnView}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                              </svg>
                              View
                            </Link>
                            <button className={styles.btnEdit}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        </div>{/* tableScroll */}

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#CBD5E0" strokeWidth="1.2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <p>No invoices match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
