"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./PaymentTable.module.css";
import { Icon } from "@iconify/react";
import PaymentModal, { SelectedPaymentItem } from "./PaymentModal";

/* ─── Column Definitions matching Screenshot ─────────────── */
export const ALL_COLUMNS = [
  { key: "no",           label: "No.",                     locked: true  },
  { key: "type",         label: "Type",                    locked: false },
  { key: "refNo",        label: "Ref. No. & Trans. No.",   locked: true  },
  { key: "payee",        label: "Payee",                   locked: false },
  { key: "totalAmount",  label: "Total",                   locked: false },
  { key: "status",       label: "Status",                  locked: false },
  { key: "lastModified", label: "Last Modified",           locked: false },
  { key: "paymentMode",  label: "Payment Mode",            locked: false },
  { key: "dueDate",      label: "Due Date",                locked: false },
  { key: "createdDate",  label: "Created Date",            locked: false },
] as const;

type ColKey = typeof ALL_COLUMNS[number]["key"];
const DEFAULT_VISIBLE: ColKey[] = [
  "no",
  "type",
  "refNo",
  "payee",
  "totalAmount",
  "status",
  "lastModified",
  "paymentMode",
];

/* ─── Record Data Interface ─────────────────────────────── */
interface PaymentRecord {
  id: string;
  no: number;
  type: string;
  refNo: string;
  transNo: string;
  payeeMain: string;
  payeeSub: string;
  totalAmount: string;
  currency: string;
  status: "Accepted" | "Awaiting Payment" | "Approved" | "Pending Approval" | "Paid";
  lastModified: string;
  paymentMode: string;
  dueDate: string;
  createdDate: string;
}

/* ─── All 10 Exact Data Rows from Screenshot ─────────────── */
const PAYMENTS: PaymentRecord[] = [
  {
    id: "1",
    no: 1,
    type: "Bills To Pay",
    refNo: "INV-2026-010",
    transNo: "B-2026-378",
    payeeMain: "CMH PTE LTD",
    payeeSub: "IMDA TESTER BUYER (junior+1...",
    totalAmount: "8,070.36",
    currency: "SGD",
    status: "Accepted",
    lastModified: "08-Jul-2026",
    paymentMode: "-",
    dueDate: "2026-07-08",
    createdDate: "15-Apr-2026 01:27 PM",
  },
  {
    id: "2",
    no: 2,
    type: "Bills To Pay",
    refNo: "INV-2026-007",
    transNo: "B-2026-377",
    payeeMain: "CMH PTE LTD",
    payeeSub: "IMDA TESTER BUYER (junior+1...",
    totalAmount: "1,850.00",
    currency: "SGD",
    status: "Accepted",
    lastModified: "30-Jun-2026",
    paymentMode: "-",
    dueDate: "2026-04-15",
    createdDate: "16-Apr-2026 10:14 AM",
  },
  {
    id: "3",
    no: 3,
    type: "Bills To Pay",
    refNo: "INV-2026-002",
    transNo: "B-2026-315",
    payeeMain: "BW LNG",
    payeeSub: "BW LNG (jeremie+bw@activa...",
    totalAmount: "1,635.00",
    currency: "SGD",
    status: "Accepted",
    lastModified: "04-Jun-2026",
    paymentMode: "-",
    dueDate: "2026-05-28",
    createdDate: "18-Apr-2026 04:45 PM",
  },
  {
    id: "4",
    no: 4,
    type: "Bills To Pay",
    refNo: "PO-2026-069",
    transNo: "B-2026-362",
    payeeMain: "CMH PTE LTD (CMH1)",
    payeeSub: "IMDA TESTER BUYER (junior+1...",
    totalAmount: "1,500.00",
    currency: "SGD",
    status: "Accepted",
    lastModified: "13-May-2026",
    paymentMode: "-",
    dueDate: "2026-05-30",
    createdDate: "20-Apr-2026 11:00 AM",
  },
  {
    id: "5",
    no: 5,
    type: "Bills To Pay",
    refNo: "123",
    transNo: "B-2026-329",
    payeeMain: "CMH PTE LTD (CMH1)",
    payeeSub: "IMDA TESTER BUYER (junior+1...",
    totalAmount: "0.00",
    currency: "SGD",
    status: "Awaiting Payment",
    lastModified: "24-Apr-2026",
    paymentMode: "-",
    dueDate: "2026-04-24",
    createdDate: "24-Apr-2026 02:30 PM",
  },
  {
    id: "6",
    no: 6,
    type: "Claims",
    refNo: "C-2026-031",
    transNo: "C-2026-031",
    payeeMain: "Joshua Lee (Test)",
    payeeSub: "(joshua+1...",
    totalAmount: "0.00",
    currency: "SGD",
    status: "Awaiting Payment",
    lastModified: "24-Apr-2026",
    paymentMode: "COD",
    dueDate: "2026-04-24",
    createdDate: "24-Apr-2026 03:00 PM",
  },
  {
    id: "7",
    no: 7,
    type: "Claims",
    refNo: "C-2026-030",
    transNo: "C-2026-030",
    payeeMain: "Joshua Lee (Test)",
    payeeSub: "(joshua+1...",
    totalAmount: "0.00",
    currency: "SGD",
    status: "Awaiting Payment",
    lastModified: "24-Apr-2026",
    paymentMode: "PayNow",
    dueDate: "2026-04-24",
    createdDate: "24-Apr-2026 03:15 PM",
  },
  {
    id: "8",
    no: 8,
    type: "Bills To Pay",
    refNo: "22223333",
    transNo: "B-2026-323",
    payeeMain: "Activants QA",
    payeeSub: "John (johnpaul@activants.c...",
    totalAmount: "0.00",
    currency: "SGD",
    status: "Awaiting Payment",
    lastModified: "24-Apr-2026",
    paymentMode: "-",
    dueDate: "2026-04-24",
    createdDate: "24-Apr-2026 04:00 PM",
  },
  {
    id: "9",
    no: 9,
    type: "Claims",
    refNo: "C-2026-028",
    transNo: "C-2026-028",
    payeeMain: "Joshua Lee (Test)",
    payeeSub: "(joshua+1...",
    totalAmount: "0.00",
    currency: "SGD",
    status: "Awaiting Payment",
    lastModified: "24-Apr-2026",
    paymentMode: "COD",
    dueDate: "2026-04-24",
    createdDate: "24-Apr-2026 04:30 PM",
  },
  {
    id: "10",
    no: 10,
    type: "Bills To Pay",
    refNo: "3wm-po-050",
    transNo: "B-2026-310",
    payeeMain: "CMH PTE LTD (CMH1)",
    payeeSub: "IMDA TESTER BUYER (junior+1...",
    totalAmount: "0.00",
    currency: "SGD",
    status: "Awaiting Payment",
    lastModified: "24-Apr-2026",
    paymentMode: "-",
    dueDate: "2026-04-24",
    createdDate: "24-Apr-2026 05:00 PM",
  },
];

/* ─── Status Badges matching Screenshot ─────────────── */
const STATUS_META: Record<string, { color: string; bg: string; border: string }> = {
  "Accepted":         { color: "#4C51BF", bg: "#EBF8FF", border: "#C3DAFE" }, // Soft purple-blue pill
  "Awaiting Payment": { color: "#3182CE", bg: "#EBF8FF", border: "#BEE3F8" }, // Soft blue pill
  "Approved":         { color: "#276749", bg: "#F0FFF4", border: "#C6F6D5" },
  "Pending Approval": { color: "#C05621", bg: "#FFFAF0", border: "#FEEBC8" },
  "Paid":             { color: "#319795", bg: "#E6FFFA", border: "#B2F5EA" },
};

function StatusBadge({ status }: { status: PaymentRecord["status"] }) {
  const m = STATUS_META[status] ?? { color: "#4A5568", bg: "#EDF2F7", border: "#E2E8F0" };
  return (
    <span
      className={styles.statusBadge}
      style={{
        color: m.color,
        background: m.bg,
        borderColor: m.border,
        padding: "3px 12px",
        borderRadius: "99px",
        fontSize: "12px",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {status}
    </span>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.chip}>
      <span className={styles.chipLabel}>{label}</span>
      <span className={styles.chipValue}>{value}</span>
    </div>
  );
}

/* ─── Column Picker Popover ─────────────────────────────── */
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

  return (
    <div className={styles.pickerCard} ref={ref}>
      <div className={styles.pickerHeader}>
        <div>
          <p className={styles.pickerTitle}>Customize Columns</p>
          <p className={styles.pickerSub}>{visible.length} of {ALL_COLUMNS.length} columns visible</p>
        </div>
        <button className={styles.pickerReset} onClick={() => onChange([...DEFAULT_VISIBLE])}>
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
              <span className={styles.pickerCheck}>
                <input
                  type="checkbox"
                  checked={isVisible}
                  disabled={col.locked}
                  onChange={() => toggle(col.key, col.locked)}
                  className={styles.pickerCb}
                />
                <span className={`${styles.pickerCheckBox} ${isVisible ? styles.pickerCheckBoxOn : ""}`}>
                  {isVisible && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2">
                      <polyline points="2 6 5 9 10 3"/>
                    </svg>
                  )}
                </span>
              </span>
              <span className={styles.pickerLabel}>{col.label}</span>
              {col.locked && <span className={styles.pickerLockBadge}>Always on</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Payment Table ────────────────────────────────── */
export default function PaymentTable() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [visibleCols, setVisibleCols] = useState<ColKey[]>([...DEFAULT_VISIBLE]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"full" | "partial">("full");
  const [modalItems, setModalItems] = useState<SelectedPaymentItem[]>([]);

  const filtered = PAYMENTS.filter(row =>
    row.refNo.toLowerCase().includes(search.toLowerCase()) ||
    row.payeeMain.toLowerCase().includes(search.toLowerCase()) ||
    row.type.toLowerCase().includes(search.toLowerCase()) ||
    row.status.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setWarningMessage(null);
    setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  };
  const toggleExpand = (id: string) => setExpanded(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const allSelected = filtered.length > 0 && filtered.every(inv => selected.includes(inv.id));
  const toggleAll = () => {
    setWarningMessage(null);
    setSelected(allSelected ? [] : filtered.map(i => i.id));
  };
  const closePicker = useCallback(() => setPickerOpen(false), []);

  const openFullPaymentModal = (itemsToPay?: PaymentRecord[]) => {
    let targetRows: PaymentRecord[] = [];

    if (itemsToPay && itemsToPay.length > 0) {
      targetRows = itemsToPay;
    } else if (selected.length > 0) {
      targetRows = PAYMENTS.filter(p => selected.includes(p.id));
    } else {
      setWarningMessage("Please select at least 1 item from the table before making a payment.");
      setTimeout(() => setWarningMessage(null), 4000);
      return;
    }

    const mapped: SelectedPaymentItem[] = targetRows.map(r => ({
      id: r.id,
      type: r.type,
      refNo: r.refNo,
      payeeMain: r.payeeMain,
      dueDate: r.dueDate,
      totalAmount: r.totalAmount,
      currency: r.currency,
    }));

    setWarningMessage(null);
    setModalMode("full");
    setModalItems(mapped);
    setIsModalOpen(true);
  };

  const openPartialPaymentModal = (itemToPay?: PaymentRecord) => {
    let targetRow: PaymentRecord | undefined = itemToPay;

    if (!targetRow) {
      if (selected.length === 0) {
        setWarningMessage("Please select 1 item from the table for Partial Payment.");
        setTimeout(() => setWarningMessage(null), 4000);
        return;
      }
      if (selected.length > 1) {
        setWarningMessage("Partial Payment allows selecting ONLY 1 item at a time. Please select 1 item.");
        setTimeout(() => setWarningMessage(null), 4000);
        return;
      }
      targetRow = PAYMENTS.find(p => p.id === selected[0]);
    }

    if (!targetRow) return;

    const mapped: SelectedPaymentItem[] = [{
      id: targetRow.id,
      type: targetRow.type,
      refNo: targetRow.refNo,
      payeeMain: targetRow.payeeMain,
      dueDate: targetRow.dueDate,
      totalAmount: targetRow.totalAmount,
      currency: targetRow.currency,
    }];

    setWarningMessage(null);
    setModalMode("partial");
    setModalItems(mapped);
    setIsModalOpen(true);
  };

  const panelCols = ALL_COLUMNS.filter(c => !visibleCols.includes(c.key) && !c.locked);
  const colSpan = visibleCols.length + 2;

  const renderCellContent = (colKey: ColKey, row: PaymentRecord) => {
    switch (colKey) {
      case "no":
        return <b>{row.no}</b>;
      case "type":
        return <span className={styles.typeText}>{row.type}</span>;
      case "refNo":
        return (
          <>
            <div className={styles.refNo}>{row.refNo}</div>
            <div className={styles.transNo}>{row.transNo}</div>
          </>
        );
      case "payee":
        return (
          <>
            <div className={styles.payeeName}>{row.payeeMain}</div>
            {row.payeeSub && <div className={styles.payeeSub}>{row.payeeSub}</div>}
          </>
        );
      case "totalAmount":
        return (
          <span className={styles.amt}>
            {row.totalAmount} <span className={styles.amtCur}>{row.currency}</span>
          </span>
        );
      case "status":
        return <StatusBadge status={row.status} />;
      case "lastModified":
        return <span className={styles.cellText}>{row.lastModified}</span>;
      case "paymentMode":
        return <span className={styles.cellText}>{row.paymentMode}</span>;
      case "dueDate":
        return <span className={styles.cellText}>{row.dueDate}</span>;
      case "createdDate":
        return <span className={styles.cellText}>{row.createdDate}</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.wrap}>
        {/* Warning Alert Banner when selection constraints fail */}
        {warningMessage && (
          <div style={{
            background: "#FFF5F5",
            border: "1px solid #FEB2B2",
            color: "#C53030",
            padding: "10px 16px",
            borderRadius: "8px",
            marginBottom: "12px",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <Icon icon="lucide:alert-circle" width={16} />
            {warningMessage}
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <button className={styles.btnActionSolid} onClick={() => openFullPaymentModal()}>
              <Icon icon="lucide:credit-card" width={16} /> Make Payment
            </button>
            <button className={styles.btnActionOrange} onClick={() => openPartialPaymentModal()}>
              <Icon icon="lucide:receipt" width={16} /> Make Partial Payment
            </button>
            {selected.length > 0 && (
              <span className={styles.selHint}>{selected.length} selected</span>
            )}
          </div>

          <div className={styles.toolbarRight}>
            {/* Columns dropdown */}
            <div className={styles.pickerWrap}>
              <button
                className={`${styles.colBtn} ${pickerOpen ? styles.colBtnActive : ""}`}
                onClick={() => setPickerOpen(o => !o)}
              >
                <Icon icon="lucide:layout-grid" width={14} />
                Columns
                <span className={styles.colBadge}>{visibleCols.length}</span>
                <Icon icon="lucide:chevron-down" width={12} />
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
              <Icon icon="lucide:sliders-horizontal" width={14} />
              Filter
            </button>

            <div className={styles.searchBox}>
              <Icon icon="lucide:search" width={14} className={styles.searchIco} />
              <input
                className={styles.searchInput}
                placeholder="Search by keywords..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Table Card ── */}
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
                      onChange={toggleAll}
                    />
                  </th>
                  {visibleCols.map(key => {
                    const col = ALL_COLUMNS.find(c => c.key === key)!;
                    return (
                      <th key={key} className={styles.th}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          {col.label}
                          {col.key !== "no" && <Icon icon="lucide:arrow-down" width={12} />}
                        </span>
                      </th>
                    );
                  })}
                  <th className={styles.thArrow} />
                </tr>
              </thead>

              <tbody>
                {filtered.map(row => {
                  const isSel = selected.includes(row.id);
                  const isExp = expanded.includes(row.id);

                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        className={`${styles.row} ${isSel ? styles.rowSel : ""} ${isExp ? styles.rowExp : ""}`}
                        onClick={() => toggleExpand(row.id)}
                      >
                        <td className={styles.tdCb} onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className={styles.cb}
                            checked={isSel}
                            onChange={() => toggleSelect(row.id)}
                          />
                        </td>

                        {visibleCols.map(key => (
                          <td key={key} className={styles.td}>
                            {renderCellContent(key, row)}
                          </td>
                        ))}

                        <td className={styles.tdArrow}>
                          <span className={`${styles.chevron} ${isExp ? styles.chevronOpen : ""}`}>
                            <Icon icon="lucide:chevron-down" width={16} />
                          </span>
                        </td>
                      </tr>

                      {/* Expandable detail panel */}
                      <tr className={styles.expandTr}>
                        <td colSpan={colSpan} className={styles.expandTd}>
                          <div className={`${styles.panel} ${isExp ? styles.panelOpen : ""}`}>
                            <div className={styles.panelBody}>
                              <div className={styles.panelGrid}>
                                {panelCols.length > 0 ? panelCols.map(col => {
                                  let val = "–";
                                  if (col.key === "dueDate") val = row.dueDate;
                                  if (col.key === "paymentMode") val = row.paymentMode;
                                  if (col.key === "createdDate") val = row.createdDate;
                                  if (col.key === "status") val = row.status;
                                  if (col.key === "type") val = row.type;
                                  if (col.key === "payee") val = `${row.payeeMain} (${row.payeeSub})`;
                                  if (col.key === "totalAmount") val = `${row.currency} ${row.totalAmount}`;
                                  return <Chip key={col.key} label={col.label} value={val} />;
                                }) : (
                                  <p className={styles.panelAllVisible}>All details are shown in the main table.</p>
                                )}
                              </div>

                              <div className={styles.panelActions} onClick={e => e.stopPropagation()}>
                                <button className={styles.btnPay} onClick={() => openFullPaymentModal([row])}>
                                  <Icon icon="lucide:check-circle-2" width={14} /> Process
                                </button>
                                <button className={styles.btnView} onClick={() => openPartialPaymentModal(row)}>
                                  <Icon icon="lucide:receipt" width={14} /> Partial
                                </button>
                                <Link href="/bills-to-pay/review" className={styles.btnView} style={{ background: "#EDF2F7", color: "#4A5568" }}>
                                  <Icon icon="lucide:eye" width={14} /> View Details
                                </Link>
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
          </div>

          {filtered.length === 0 && (
            <div className={styles.empty}>
              <Icon icon="lucide:search-x" width={32} />
              <p>No payment records match your search query.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Payment Modal ── */}
      <PaymentModal
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={() => setIsModalOpen(false)}
        selectedItems={modalItems}
        onConfirmPayment={() => {
          alert(`${modalMode === "partial" ? "Partial payment" : "Payment"} processed successfully!`);
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
