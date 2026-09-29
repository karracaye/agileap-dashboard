"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import ActionButton from "./ActionButton";
import styles from "./ClaimsTable.module.css";

export interface ClaimItem {
  id: string;
  claimNo: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  totalTax: number;
  totalClaim: number;
  paymentMethod: string;
  transactionDate: string;
  status:
    | "Pending Approval"
    | "Submitted"
    | "Awaiting Payment"
    | "Approved"
    | "Rejected"
    | "Draft"
    | "Cancelled"
    | "Paid";
  description: string;
  createdDate: string;
  lastModified: string;
}

export const ALL_CLAIM_COLUMNS = [
  { key: "claimNo", label: "Claim No.", locked: true },
  { key: "user", label: "User", locked: true },
  { key: "totalAmount", label: "Total Amount", locked: false },
  { key: "totalTax", label: "Total Tax", locked: false },
  { key: "totalClaim", label: "Total Claim", locked: false },
  { key: "paymentMethod", label: "Payment Method", locked: false },
  { key: "transactionDate", label: "Transaction Date", locked: false },
  { key: "status", label: "Status", locked: false },
  { key: "description", label: "Description", locked: false },
  { key: "createdDate", label: "Created Date", locked: false },
  { key: "lastModified", label: "Last Modified", locked: false },
] as const;

export type ClaimColKey = (typeof ALL_CLAIM_COLUMNS)[number]["key"];

const DEFAULT_VISIBLE_COLS: ClaimColKey[] = [
  "claimNo",
  "user",
  "totalAmount",
  "totalClaim",
  "paymentMethod",
  "status",
];

const STATUS_META: Record<string, { color: string; bg: string; border: string }> = {
  "Pending Approval": { color: "#D97706", bg: "#FEF3C7", border: "#FDE68A" },
  Submitted: { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  "Awaiting Payment": { color: "#E8692A", bg: "#FFF0E8", border: "#FFD0B8" },
  Approved: { color: "#16A34A", bg: "#DCFCE7", border: "#BBF7D0" },
  Rejected: { color: "#DC2626", bg: "#FEE2E2", border: "#FCA5A5" },
  Draft: { color: "#475569", bg: "#F1F5F9", border: "#CBD5E1" },
  Cancelled: { color: "#EA580C", bg: "#FFEDD5", border: "#FED7AA" },
  Paid: { color: "#16A34A", bg: "#DCFCE7", border: "#BBF7D0" },
};

function StatusBadge({ status }: { status: ClaimItem["status"] }) {
  const m = STATUS_META[status] ?? { color: "#64748B", bg: "#F1F5F9", border: "#E2E8F0" };
  return (
    <span
      className={styles.statusBadge}
      style={{ color: m.color, background: m.bg, borderColor: m.border }}
    >
      <span className={styles.statusDot} style={{ background: m.color }} />
      {status}
    </span>
  );
}

function ColumnPicker({
  visible,
  onChange,
  onClose,
}: {
  visible: ClaimColKey[];
  onChange: (v: ClaimColKey[]) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const toggle = (key: ClaimColKey, locked: boolean) => {
    if (locked) return;
    onChange(
      visible.includes(key) ? visible.filter((k) => k !== key) : [...visible, key]
    );
  };

  const reset = () => onChange([...DEFAULT_VISIBLE_COLS]);

  return (
    <div className={styles.pickerCard} ref={ref}>
      <div className={styles.pickerHeader}>
        <div>
          <p className={styles.pickerTitle}>Customize Columns</p>
          <p className={styles.pickerSub}>
            {visible.length} of {ALL_CLAIM_COLUMNS.length} columns visible
          </p>
        </div>
        <button className={styles.pickerReset} onClick={reset}>
          Reset
        </button>
      </div>

      <div className={styles.pickerList}>
        {ALL_CLAIM_COLUMNS.map((col) => {
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
                  onChange={() => toggle(col.key, !!col.locked)}
                  className={styles.pickerCb}
                />
                <span
                  className={`${styles.pickerCheckBox} ${
                    isVisible ? styles.pickerCheckBoxOn : ""
                  }`}
                >
                  {isVisible && (
                    <Icon icon="lucide:check" width={10} style={{ color: "white" }} />
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

interface ClaimsTableProps {
  claims: ClaimItem[];
  activeFilter?: string;
}

export default function ClaimsTable({ claims, activeFilter = "all" }: ClaimsTableProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [visibleCols, setVisibleCols] = useState<ClaimColKey[]>([...DEFAULT_VISIBLE_COLS]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const closePicker = useCallback(() => setPickerOpen(false), []);

  const toggleSelect = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((i) => i !== id) : [...p, id]));
  const toggleExpand = (id: string) =>
    setExpanded((p) => (p.includes(id) ? p.filter((i) => i !== id) : [...p, id]));

  const filtered = claims.filter((item) => {
    // Metric filter
    if (activeFilter === "draft" && item.status !== "Draft") return false;
    if (activeFilter === "submitted" && item.status !== "Submitted") return false;
    if (activeFilter === "pending-approval" && item.status !== "Pending Approval") return false;
    if (activeFilter === "approved" && item.status !== "Approved") return false;
    if (activeFilter === "rejected" && item.status !== "Rejected") return false;
    if (activeFilter === "cancelled" && item.status !== "Cancelled") return false;
    if (activeFilter === "paid" && item.status !== "Paid") return false;
    if (activeFilter === "awaiting-payment" && item.status !== "Awaiting Payment") return false;
    if (activeFilter === "my-task" && item.status !== "Pending Approval") return false;

    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNo = item.claimNo.toLowerCase().includes(q);
      const matchUser = item.userName.toLowerCase().includes(q) || item.userEmail.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchStatus = item.status.toLowerCase().includes(q);
      const matchMethod = item.paymentMethod.toLowerCase().includes(q);
      if (!matchNo && !matchUser && !matchDesc && !matchStatus && !matchMethod) return false;
    }

    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every((i) => selected.includes(i.id));
  const someSelected = selected.length > 0 && !allSelected;
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map((i) => i.id));

  const colSpan = visibleCols.length + 3;

  return (
    <div className={styles.wrap}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          {selected.length > 0 && (
            <span className={styles.selHint}>{selected.length} selected</span>
          )}
        </div>

        <div className={styles.toolbarRight}>
          <button className={styles.actionBtn} onClick={() => alert("Exporting claims data...")}>
            <Icon icon="lucide:download" width={14} />
            Export
          </button>

          <button className={styles.actionBtn} onClick={() => alert("Filter options clicked")}>
            <Icon icon="lucide:sliders-horizontal" width={14} />
            Filter
          </button>

          <div className={styles.pickerWrap}>
            <button
              className={`${styles.colBtn} ${pickerOpen ? styles.colBtnActive : ""}`}
              onClick={() => setPickerOpen((o) => !o)}
            >
              <Icon icon="lucide:columns-2" width={14} />
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

          <div className={styles.searchBox}>
            <Icon icon="lucide:search" width={14} className={styles.searchIco} />
            <input
              className={styles.searchInput}
              placeholder="Search by keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
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
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleAll}
                  />
                </th>
                <th className={styles.th}>Action</th>
                {visibleCols.includes("claimNo") && <th className={styles.th}>Claim No. ↓</th>}
                {visibleCols.includes("user") && <th className={styles.th}>User ↓</th>}
                {visibleCols.includes("totalAmount") && (
                  <th className={`${styles.th} ${styles.thAmt}`}>Total Amount ↓</th>
                )}
                {visibleCols.includes("totalTax") && (
                  <th className={`${styles.th} ${styles.thAmt}`}>Total Tax ↓</th>
                )}
                {visibleCols.includes("totalClaim") && (
                  <th className={`${styles.th} ${styles.thAmt}`}>Total Claim ↓</th>
                )}
                {visibleCols.includes("paymentMethod") && (
                  <th className={styles.th}>Payment Method ↓</th>
                )}
                {visibleCols.includes("transactionDate") && (
                  <th className={styles.th}>Transaction Date ↓</th>
                )}
                {visibleCols.includes("status") && <th className={styles.th}>Status ↓</th>}
                {visibleCols.includes("description") && <th className={styles.th}>Description ↓</th>}
                {visibleCols.includes("createdDate") && <th className={styles.th}>Created Date ↓</th>}
                {visibleCols.includes("lastModified") && (
                  <th className={styles.th}>Last Modified ↑</th>
                )}
                <th className={styles.thArrow} />
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => {
                const isSel = selected.includes(item.id);
                const isExp = expanded.includes(item.id);

                return (
                  <React.Fragment key={item.id}>
                    <tr
                      className={`${styles.row} ${isSel ? styles.rowSel : ""} ${
                        isExp ? styles.rowExp : ""
                      }`}
                      onClick={() => toggleExpand(item.id)}
                    >
                      <td className={styles.tdCb} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className={styles.cb}
                          checked={isSel}
                          onChange={() => toggleSelect(item.id)}
                        />
                      </td>

                      <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.actionCell}>
                          <ActionButton type="view" href="/claims/CL26-000123" tooltip="View Claim" />
                          <ActionButton type="edit" href="/claims/CL26-000123" tooltip="Edit Claim" />
                          <button
                            type="button"
                            className={styles.actionIconBtn}
                            title="Print Claim"
                            onClick={() => alert(`Printing claim ${item.claimNo}`)}
                          >
                            <Icon icon="lucide:printer" width={14} />
                          </button>
                        </div>
                      </td>

                      {visibleCols.includes("claimNo") && (
                        <td className={`${styles.td} ${styles.claimNo}`}>
                          <Link
                            href="/claims/CL26-000123"
                            style={{ color: "#E8692A", textDecoration: "underline", fontWeight: 700 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.claimNo}
                          </Link>
                        </td>
                      )}
                      {visibleCols.includes("user") && (
                        <td className={styles.td}>
                          <div className={styles.userName}>{item.userName}</div>
                          <div className={styles.userEmail}>({item.userEmail})</div>
                        </td>
                      )}
                      {visibleCols.includes("totalAmount") && (
                        <td className={`${styles.td} ${styles.tdAmt}`}>
                          <div className={styles.amt}>{item.totalAmount.toFixed(2)}</div>
                          <div className={styles.amtCur}>SGD</div>
                        </td>
                      )}
                      {visibleCols.includes("totalTax") && (
                        <td className={`${styles.td} ${styles.tdAmt}`}>
                          <div className={styles.amt}>{item.totalTax.toFixed(2)}</div>
                          <div className={styles.amtCur}>SGD</div>
                        </td>
                      )}
                      {visibleCols.includes("totalClaim") && (
                        <td className={`${styles.td} ${styles.tdAmt}`}>
                          <div className={styles.amt}>{item.totalClaim.toFixed(2)}</div>
                          <div className={styles.amtCur}>SGD</div>
                        </td>
                      )}
                      {visibleCols.includes("paymentMethod") && (
                        <td className={`${styles.td} ${styles.cellText}`}>{item.paymentMethod}</td>
                      )}
                      {visibleCols.includes("transactionDate") && (
                        <td className={`${styles.td} ${styles.cellText}`}>
                          {item.transactionDate}
                        </td>
                      )}
                      {visibleCols.includes("status") && (
                        <td className={styles.td}>
                          <StatusBadge status={item.status} />
                        </td>
                      )}
                      {visibleCols.includes("description") && (
                        <td className={`${styles.td} ${styles.cellText}`}>{item.description}</td>
                      )}
                      {visibleCols.includes("createdDate") && (
                        <td className={`${styles.td} ${styles.cellText}`}>{item.createdDate}</td>
                      )}
                      {visibleCols.includes("lastModified") && (
                        <td className={`${styles.td} ${styles.cellText}`}>{item.lastModified}</td>
                      )}

                      <td className={styles.tdArrow}>
                        <span className={`${styles.chevron} ${isExp ? styles.chevronOpen : ""}`}>
                          <Icon icon="lucide:chevron-down" width={15} />
                        </span>
                      </td>
                    </tr>

                    {/* Expand Collapsible Row Details */}
                    {isExp && (
                      <tr className={styles.expandTd}>
                        <td colSpan={colSpan} className={styles.expandTd}>
                          <div className={`${styles.panel} ${styles.panelOpen}`}>
                            <div className={styles.panelBody}>
                              <div className={styles.panelGrid}>
                                <div className={styles.chip}>
                                  <span className={styles.chipLabel}>Claim Reference</span>
                                  <span className={styles.chipValue}>{item.claimNo}</span>
                                </div>
                                <div className={styles.chip}>
                                  <span className={styles.chipLabel}>User & Contact</span>
                                  <span className={styles.chipValue}>
                                    {item.userName} ({item.userEmail})
                                  </span>
                                </div>
                                <div className={styles.chip}>
                                  <span className={styles.chipLabel}>Payment Method</span>
                                  <span className={styles.chipValue}>{item.paymentMethod}</span>
                                </div>
                                <div className={styles.chip}>
                                  <span className={styles.chipLabel}>Total Amount</span>
                                  <span className={styles.chipValue}>
                                    SGD {item.totalAmount.toFixed(2)}
                                  </span>
                                </div>
                                <div className={styles.chip}>
                                  <span className={styles.chipLabel}>Total Tax</span>
                                  <span className={styles.chipValue}>
                                    SGD {item.totalTax.toFixed(2)}
                                  </span>
                                </div>
                                <div className={styles.chip}>
                                  <span className={styles.chipLabel}>Total Claim</span>
                                  <span className={styles.chipValue}>
                                    SGD {item.totalClaim.toFixed(2)}
                                  </span>
                                </div>
                                <div className={styles.chip}>
                                  <span className={styles.chipLabel}>Transaction Date</span>
                                  <span className={styles.chipValue}>{item.transactionDate}</span>
                                </div>
                                <div className={styles.chip}>
                                  <span className={styles.chipLabel}>Description</span>
                                  <span className={styles.chipValue}>{item.description}</span>
                                </div>
                                <div className={styles.chip}>
                                  <span className={styles.chipLabel}>Created Date</span>
                                  <span className={styles.chipValue}>{item.createdDate}</span>
                                </div>
                                <div className={styles.chip}>
                                  <span className={styles.chipLabel}>Last Modified</span>
                                  <span className={styles.chipValue}>{item.lastModified}</span>
                                </div>
                              </div>

                              <div
                                className={styles.panelActions}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className={styles.btnView}
                                  onClick={() => alert(`Viewing details for ${item.claimNo}`)}
                                >
                                  <Icon icon="lucide:eye" width={14} /> View Details
                                </button>
                                <button
                                  className={styles.btnEdit}
                                  onClick={() => alert(`Editing claim ${item.claimNo}`)}
                                >
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

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <Icon icon="lucide:search-x" width={36} style={{ color: "#CBD5E1" }} />
            <p>No claims match your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
