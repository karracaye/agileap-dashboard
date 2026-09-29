"use client";

import React, { useState, useEffect } from "react";
import styles from "./AllocateExpenseModal.module.css";
import { Icon } from "@iconify/react";

export type AllocationMode = "Manual" | "Rule based" | "Two-level";

export interface LineItemData {
  no: number;
  type: string;
  transDate: string;
  transNo: string;
  company: string;
  glCode: string;
  costCentre: string;
  amount: number;
  allocationType: AllocationMode | "Not split";
  allocationLabel: string;
}

interface AllocateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  lineItem?: LineItemData | null;
  onSaveAllocation?: (lineNo: number, mode: AllocationMode, label: string) => void;
}

interface ManualRow {
  id: string;
  staff: string;
  costCentre: string;
  percent: number | string;
}

// Rule based static breakdown for NR-001 (matches media_1790572715351.png)
const RULE_BASED_STAFF = [
  { no: 1, staff: "Marcus Goh", percent: 12.0 },
  { no: 2, staff: "Kenji Watanabe", percent: 10.0 },
  { no: 3, staff: "Farhan Ismail", percent: 10.0 },
  { no: 4, staff: "Olivia Chen", percent: 8.0 },
  { no: 5, staff: "Arjun Menon", percent: 8.0 },
  { no: 6, staff: "Lucas Ng", percent: 7.0 },
  { no: 7, staff: "Hannah Koh", percent: 7.0 },
  { no: 8, staff: "Ravi Pillai", percent: 6.0 },
  { no: 9, staff: "Grace Teo", percent: 6.0 },
  { no: 10, staff: "Nurul Huda", percent: 6.0 },
  { no: 11, staff: "Ethan Lee", percent: 5.0 },
  { no: 12, staff: "Chloe Lau", percent: 5.0 },
  { no: 13, staff: "Vikram Rao", percent: 4.0 },
  { no: 14, staff: "Isabel Seah", percent: 3.0 },
  { no: 15, staff: "Samuel Ong", percent: 3.0 },
];

export default function AllocateExpenseModal({
  isOpen,
  onClose,
  lineItem,
  onSaveAllocation,
}: AllocateExpenseModalProps) {
  const initialMode: AllocationMode =
    lineItem?.allocationType === "Not split"
      ? "Manual"
      : lineItem?.allocationType || "Manual";

  const [mode, setMode] = useState<AllocationMode>(initialMode);
  const [splitBy, setSplitBy] = useState<"Percentage" | "Amount">("Percentage");

  // Mode 1: Manual Allocation State (percentages stored with unique IDs for rock-solid interaction)
  const STAFF_COST_CENTRES: Record<string, string> = {
    "Rachel Lim": "SG-DRY",
    "Priya Nair": "SG-DRY",
    "Sofia Hassan": "EU-DESK",
    "Aisha Rahman": "NR-001",
    "Marcus Goh": "SG-DRY",
    "Kenji Watanabe": "NR-001",
    "Farhan Ismail": "EU-DESK",
  };

  const [manualRows, setManualRows] = useState<ManualRow[]>([
    { id: "m1", staff: "Rachel Lim", costCentre: "SG-DRY", percent: 10 },
    { id: "m2", staff: "Priya Nair", costCentre: "SG-DRY", percent: 40 },
    { id: "m3", staff: "Sofia Hassan", costCentre: "EU-DESK", percent: 20 },
    { id: "m4", staff: "Aisha Rahman", costCentre: "NR-001", percent: 30 },
  ]);

  // Mode 2: Rule Based Allocation State
  const [selectedRule, setSelectedRule] = useState("NR-001 · Nesty Regional");
  const [collapsedDepts, setCollapsedDepts] = useState<Record<string, boolean>>({
    chartering: false,
    drybulk: false,
    regional: true, // Collapsed by default for clean view
  });

  const toggleDeptCollapse = (key: string) => {
    setCollapsedDepts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Mode 3: Two-level State
  const [custA_percent, setCustA_percent] = useState(50);
  const [custB_percent, setCustB_percent] = useState(50);
  const [collapsedCustomers, setCollapsedCustomers] = useState<Record<string, boolean>>({
    custA: false,
    custB: false,
  });

  const toggleCustCollapse = (key: string) => {
    setCollapsedCustomers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Staff search filter state (Must be called unconditionally at top level)
  const [staffFilter, setStaffFilter] = useState("");

  useEffect(() => {
    if (lineItem) {
      if (lineItem.allocationType === "Rule based") {
        setMode("Rule based");
      } else if (lineItem.allocationType === "Two-level") {
        setMode("Two-level");
      } else {
        setMode("Manual");
      }
    }
  }, [lineItem, isOpen]);

  if (!isOpen || !lineItem) return null;

  const currentTotalAmount = lineItem.amount;

  // Real-time Dynamic Math for Manual Mode
  const manualTotalPercent = manualRows.reduce((sum, r) => {
    const p = typeof r.percent === "number" ? r.percent : parseFloat(r.percent) || 0;
    return sum + p;
  }, 0);
  const manualTotalAmount = (manualTotalPercent / 100) * currentTotalAmount;
  const remainingPercent = Math.max(0, 100 - manualTotalPercent);
  const remainingAmount = Math.max(0, currentTotalAmount - manualTotalAmount);
  const isManualBalanced = Math.abs(manualTotalPercent - 100) < 0.01;

  const filteredManualRows = manualRows.filter(
    (r) =>
      r.staff.toLowerCase().includes(staffFilter.toLowerCase()) ||
      r.costCentre.toLowerCase().includes(staffFilter.toLowerCase())
  );

  const handleSplitEqually = () => {
    if (manualRows.length === 0) return;
    const equalPct = Math.floor((100 / manualRows.length) * 100) / 100;
    const remainder = Math.round((100 - equalPct * manualRows.length) * 100) / 100;

    setManualRows((prev) =>
      prev.map((r, i) => ({
        ...r,
        percent: i === prev.length - 1 ? equalPct + remainder : equalPct,
      }))
    );
  };

  const handleManualPercentChange = (id: string, val: string) => {
    setManualRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, percent: val } : row))
    );
  };

  const handleManualAmountChange = (id: string, amtStr: string) => {
    const amt = parseFloat(amtStr);
    const calculatedPct =
      currentTotalAmount > 0 && !isNaN(amt)
        ? Math.round(((amt / currentTotalAmount) * 100) * 100) / 100
        : "";
    setManualRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, percent: calculatedPct } : row))
    );
  };

  const handleStaffChange = (id: string, staffName: string) => {
    const cc = STAFF_COST_CENTRES[staffName] || "SG-DRY";
    setManualRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, staff: staffName, costCentre: cc } : row
      )
    );
  };

  const handleAddManualRow = () => {
    const newId = `m_${Date.now()}`;
    const usedStaff = new Set(manualRows.map((r) => r.staff));
    const availableStaffList = [
      "Marcus Goh",
      "Kenji Watanabe",
      "Farhan Ismail",
      "Daniel Tan",
      "Alex Wong",
      "Priya Nair",
      "Sofia Hassan",
      "Rachel Lim",
      "Aisha Rahman",
    ];
    const availableStaff =
      availableStaffList.find((s) => !usedStaff.has(s)) || "Marcus Goh";
    const cc = STAFF_COST_CENTRES[availableStaff] || "SG-DRY";
    const remPct = remainingPercent > 0 ? Math.round(remainingPercent * 100) / 100 : 0;
    setManualRows((prev) => [
      ...prev,
      { id: newId, staff: availableStaff, costCentre: cc, percent: remPct },
    ]);
  };

  const handleRemoveManualRow = (id: string) => {
    setManualRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    let label = "";
    if (mode === "Manual") {
      label = `Manual · ${manualRows.length} staff`;
    } else if (mode === "Rule based") {
      label = `Rule · NR-001 v2`;
    } else {
      label = `Two-level · 2 customers`;
    }

    if (onSaveAllocation) {
      onSaveAllocation(lineItem.no, mode, label);
    }
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <h2 className={styles.modalTitle}>Allocate Expense</h2>
            <span className={styles.modalSub}>
              Line {lineItem.no} · {lineItem.type} · {lineItem.company} · {lineItem.transDate}
            </span>
          </div>
          <button className={styles.btnClose} onClick={onClose} aria-label="Close modal">
            <Icon icon="lucide:x" width={18} />
          </button>
        </div>

        {/* Modal Body Container (Scrollable) */}
        <div className={styles.modalBody}>
          {/* Top Amount to Allocate Card */}
          <div className={styles.amountCard}>
            <div className={styles.amountLeft}>
              <span className={styles.amountLabel}>Amount to allocate</span>
            </div>
            <span className={styles.amountValue}>
              SGD {currentTotalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Mode Tab Switcher Bar */}
          <div className={styles.tabBar}>
            <button
              type="button"
              className={`${styles.tabBtn} ${mode === "Manual" ? styles.tabBtnActive : ""}`}
              onClick={() => setMode("Manual")}
            >
              Manual
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${mode === "Rule based" ? styles.tabBtnActive : ""}`}
              onClick={() => setMode("Rule based")}
            >
              Rule based
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${mode === "Two-level" ? styles.tabBtnActive : ""}`}
              onClick={() => setMode("Two-level")}
            >
              Two-level
            </button>
          </div>

          {/* MODE 1: MANUAL TAB (media_1790572680185.png) */}
          {mode === "Manual" && (
            <>
              <p className={styles.modeHelperText}>
                Split this line across staff by percentage or by exact amount. Each claim can use a different split.
              </p>

              {/* Controls Toolbar with Item 7 UX Analysis Helper Shortcut & Filter */}
              <div className={styles.controlRow} style={{ flexWrap: "wrap", justifyContent: "space-between", gap: "12px" }}>
                <div className={styles.radioRow}>
                  <span>Split by</span>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="splitBy"
                      className={styles.radioInput}
                      checked={splitBy === "Percentage"}
                      onChange={() => setSplitBy("Percentage")}
                    />
                    Percentage
                  </label>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="splitBy"
                      className={styles.radioInput}
                      checked={splitBy === "Amount"}
                      onChange={() => setSplitBy("Amount")}
                    />
                    Amount
                  </label>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Filter staff..."
                    value={staffFilter}
                    onChange={(e) => setStaffFilter(e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid #CBD5E1",
                      fontSize: "12px",
                      width: "120px",
                    }}
                  />
                  <button
                    type="button"
                    className={styles.btnSplitEqually}
                    onClick={handleSplitEqually}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid #CBD5E1",
                      background: "white",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#0F172A",
                      cursor: "pointer",
                    }}
                  >
                    Split Equally (Helper)
                  </button>
                </div>
              </div>

              {/* Staff Allocation Table */}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Staff</th>
                      <th style={{ whiteSpace: "nowrap" }}>Cost Centre</th>
                      <th style={{ width: "130px", textAlign: "right" }}>Share %</th>
                      <th style={{ width: "130px", textAlign: "right" }}>Amount (SGD)</th>
                      <th style={{ width: "40px", textAlign: "center" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredManualRows.map((r) => {
                      const numericPct = typeof r.percent === "number" ? r.percent : parseFloat(r.percent) || 0;
                      const rowAmount = (numericPct / 100) * currentTotalAmount;
                      return (
                        <tr key={r.id}>
                          <td>
                            <select
                              className={styles.select}
                              value={r.staff}
                              onChange={(e) => handleStaffChange(r.id, e.target.value)}
                            >
                              <option value="Select staff">Select staff</option>
                              <option value="Rachel Lim">Rachel Lim (Lead Claimant)</option>
                              <option value="Priya Nair">Priya Nair</option>
                              <option value="Sofia Hassan">Sofia Hassan</option>
                              <option value="Aisha Rahman">Aisha Rahman</option>
                              <option value="Marcus Goh">Marcus Goh</option>
                              <option value="Kenji Watanabe">Kenji Watanabe</option>
                              <option value="Farhan Ismail">Farhan Ismail</option>
                            </select>
                          </td>
                          <td style={{ fontWeight: 500, color: "#475569" }}>{r.costCentre}</td>
                          <td style={{ textAlign: "right" }}>
                            {splitBy === "Percentage" ? (
                              <div className={styles.percentInputWrap}>
                                <input
                                  type="number"
                                  step="0.01"
                                  className={styles.percentInput}
                                  value={r.percent}
                                  onChange={(e) =>
                                    handleManualPercentChange(r.id, e.target.value)
                                  }
                                />
                                <span className={styles.percentSymbol}>%</span>
                              </div>
                            ) : (
                              <span style={{ fontWeight: 500, color: "#475569" }}>
                                {numericPct.toFixed(2)}%
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: "right", fontWeight: 700, color: "#0F172A" }}>
                            {splitBy === "Amount" ? (
                              <input
                                type="number"
                                step="0.01"
                                className={styles.input}
                                value={rowAmount.toFixed(2)}
                                onChange={(e) =>
                                  handleManualAmountChange(r.id, e.target.value)
                                }
                                style={{ width: "100px", textAlign: "right", fontWeight: 700 }}
                              />
                            ) : (
                              <span>{rowAmount.toFixed(2)}</span>
                            )}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              className={styles.btnDeleteRow}
                              onClick={() => handleRemoveManualRow(r.id)}
                              title="Remove staff"
                            >
                              <Icon icon="lucide:trash-2" width={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div>
                <button
                  type="button"
                  className={styles.btnAddRow}
                  onClick={handleAddManualRow}
                >
                  + Add staff
                </button>
              </div>

              {/* Summary Cards */}
              <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                  <span className={styles.summaryLabel}>Allocated</span>
                  <span className={styles.summaryValue}>
                    {manualTotalPercent.toFixed(2)}% · SGD {manualTotalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className={styles.summaryCard}>
                  <span className={styles.summaryLabel}>Remaining</span>
                  <span className={styles.summaryValue}>
                    {remainingPercent.toFixed(2)}% · SGD {remainingAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Validation Banner */}
              {isManualBalanced ? (
                <div className={styles.validationBannerValid}>
                  <Icon icon="lucide:check" width={18} />
                  <span>Balanced — ready to save</span>
                </div>
              ) : (
                <div className={styles.validationBannerInvalid}>
                  <Icon icon="lucide:alert-circle" width={18} />
                  <span>
                    {remainingPercent.toFixed(2)}% (SGD {remainingAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}) remaining to assign.
                  </span>
                </div>
              )}

              {/* Rounding Subtext */}
              <p className={styles.roundingNote}>
                Rounding: any 0.01 difference is added to the last line.
              </p>
            </>
          )}

          {/* MODE 2: RULE BASED TAB (media_1790572715351.png) */}
          {mode === "Rule based" && (
            <>
              <p className={styles.modeHelperText}>
                Pick a cost-centre rule. The split fills in from the version valid on the transaction date.
              </p>

              {/* Form Grid */}
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    Allocation rule <span className={styles.required}>*</span>
                  </label>
                  <select
                    className={styles.select}
                    value={selectedRule}
                    onChange={(e) => setSelectedRule(e.target.value)}
                  >
                    <option value="NR-001 · Nesty Regional">NR-001 · Nesty Regional</option>
                    <option value="SG-DRY · Singapore Dry Bulk">SG-DRY · Singapore Dry Bulk</option>
                    <option value="EU-DESK · Europe Desk">EU-DESK · Europe Desk</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Version applied</label>
                  <input
                    type="text"
                    className={styles.input}
                    value="Version 2 · from 01 Jul 2026"
                    disabled
                    style={{ background: "#F8FAFC" }}
                  />
                  <span style={{ fontSize: "12px", color: "#64748B" }}>
                    Picked by transaction date, {lineItem.transDate}.
                  </span>
                </div>
              </div>

              {/* Rule Lock Banner */}
              <div className={styles.ruleLockBanner}>
                <Icon icon="lucide:lock" width={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>
                  This split comes from the rule and can&apos;t be edited on the claim. When the claim is approved, Version 2 is saved with this line, so later rule changes won&apos;t alter it.
                </span>
              </div>

              {/* Department Dropdown Accordions (Organized by Department) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* Department 1: Chartering Desk */}
                <div className={styles.deptGroupCard}>
                  <div
                    className={styles.deptGroupHeader}
                    onClick={() => toggleDeptCollapse("chartering")}
                  >
                    <div className={styles.deptGroupLeft}>
                      <Icon
                        icon={collapsedDepts.chartering ? "lucide:chevron-right" : "lucide:chevron-down"}
                        width={16}
                      />
                      <span>1. Chartering Desk (4 Staff Members)</span>
                    </div>
                    <span className={styles.deptGroupRight}>
                      40.00% Share (SGD {(0.4 * currentTotalAmount).toFixed(2)})
                    </span>
                  </div>
                  {!collapsedDepts.chartering && (
                    <table className={styles.table}>
                      <tbody>
                        <tr>
                          <td>Rachel Lim (Senior Broker)</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>12.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.12 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Daniel Tan (Charterer)</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>10.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.10 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Priya Nair (Charterer)</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>10.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.10 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Marcus Goh (Trader)</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>8.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.08 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Department 2: Dry Bulk Desk */}
                <div className={styles.deptGroupCard}>
                  <div
                    className={styles.deptGroupHeader}
                    onClick={() => toggleDeptCollapse("drybulk")}
                  >
                    <div className={styles.deptGroupLeft}>
                      <Icon
                        icon={collapsedDepts.drybulk ? "lucide:chevron-right" : "lucide:chevron-down"}
                        width={16}
                      />
                      <span>2. Dry Bulk Desk (6 Staff Members)</span>
                    </div>
                    <span className={styles.deptGroupRight}>
                      38.00% Share (SGD {(0.38 * currentTotalAmount).toFixed(2)})
                    </span>
                  </div>
                  {!collapsedDepts.drybulk && (
                    <table className={styles.table}>
                      <tbody>
                        <tr>
                          <td>Sofia Hassan (Desk Lead)</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>8.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.08 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Alex Wong (Trader)</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>7.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.07 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Sarah Jenkins (Broker)</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>6.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.06 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Kenneth Lee (Broker)</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>6.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.06 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>David Chen (Junior Broker)</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>6.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.06 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Jessica Taylor (Junior Broker)</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>5.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.05 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Department 3: Regional Desks */}
                <div className={styles.deptGroupCard}>
                  <div
                    className={styles.deptGroupHeader}
                    onClick={() => toggleDeptCollapse("regional")}
                  >
                    <div className={styles.deptGroupLeft}>
                      <Icon
                        icon={collapsedDepts.regional ? "lucide:chevron-right" : "lucide:chevron-down"}
                        width={16}
                      />
                      <span>3. Regional Desks (5 Staff Members — Click to expand)</span>
                    </div>
                    <span className={styles.deptGroupRight}>
                      22.00% Share (SGD {(0.22 * currentTotalAmount).toFixed(2)})
                    </span>
                  </div>
                  {!collapsedDepts.regional && (
                    <table className={styles.table}>
                      <tbody>
                        <tr>
                          <td>Ethan Lee</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>5.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.05 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Chloe Lau</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>5.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.05 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Vikram Rao</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>4.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.04 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Isabel Seah</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>3.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.03 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Samuel Ong</td>
                          <td style={{ textAlign: "right", color: "#64748B" }}>5.00%</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>SGD {(0.05 * currentTotalAmount).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Validation Banner */}
              <div className={styles.validationBannerValid}>
                <Icon icon="lucide:check" width={18} />
                <span>Balanced — ready to save</span>
              </div>
            </>
          )}

          {/* MODE 3: TWO-LEVEL TAB (media_1790572738397.png) */}
          {mode === "Two-level" && (
            <>
              <p className={styles.modeHelperText}>
                Split between customers first, then each customer&apos;s share is split by that customer&apos;s rule.
              </p>

              {/* Level 1 Section */}
              <div className={styles.levelSectionTitle}>
                <span>Level 1 · Split between customers</span>
                <div className={styles.radioRow} style={{ fontSize: "13px" }}>
                  <label className={styles.radioOption}>
                    <input type="radio" checked readOnly className={styles.radioInput} /> Percentage
                  </label>
                  <label className={styles.radioOption}>
                    <input type="radio" readOnly className={styles.radioInput} /> Amount
                  </label>
                </div>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th style={{ width: "90px", textAlign: "right" }}>Share %</th>
                      <th style={{ width: "100px", textAlign: "right" }}>Amount</th>
                      <th>Level 2 rule</th>
                      <th style={{ width: "36px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <select className={styles.select} defaultValue="Customer A (Panama)">
                          <option>Customer A (Panama)</option>
                        </select>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <input
                          type="number"
                          className={styles.input}
                          value={custA_percent}
                          onChange={(e) => setCustA_percent(Number(e.target.value))}
                          style={{ width: "65px", textAlign: "right" }}
                        />
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>
                        {((custA_percent / 100) * currentTotalAmount).toFixed(2)}
                      </td>
                      <td>
                        <select className={styles.select} defaultValue="SG-DRY · Singapore Dry">
                          <option>SG-DRY · Singapore Dry</option>
                        </select>
                      </td>
                      <td>
                        <button type="button" className={styles.btnDeleteRow}>
                          <Icon icon="lucide:trash-2" width={16} />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <select className={styles.select} defaultValue="Customer B (BVI)">
                          <option>Customer B (BVI)</option>
                        </select>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <input
                          type="number"
                          className={styles.input}
                          value={custB_percent}
                          onChange={(e) => setCustB_percent(Number(e.target.value))}
                          style={{ width: "65px", textAlign: "right" }}
                        />
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>
                        {((custB_percent / 100) * currentTotalAmount).toFixed(2)}
                      </td>
                      <td>
                        <select className={styles.select} defaultValue="EU-DESK · Europe Desk">
                          <option>EU-DESK · Europe Desk</option>
                        </select>
                      </td>
                      <td>
                        <button type="button" className={styles.btnDeleteRow}>
                          <Icon icon="lucide:trash-2" width={16} />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <button type="button" className={styles.btnAddRow}>
                  + Add customer
                </button>
              </div>

              {/* Level 2 Section */}
              <div className={styles.levelSectionTitle}>
                <span>Level 2 · Each customer&apos;s share by rule</span>
              </div>

              {/* Customer A Breakdown */}
              <div className={styles.customerBreakdownCard}>
                <div
                  className={styles.customerBreakdownHeader}
                  onClick={() => toggleCustCollapse("custA")}
                  style={{
                    cursor: "pointer",
                    userSelect: "none",
                    borderBottom: collapsedCustomers.custA ? "none" : "1px solid #E2E8F0",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icon
                      icon={collapsedCustomers.custA ? "lucide:chevron-right" : "lucide:chevron-down"}
                      width={16}
                    />
                    <span>Customer A (Panama) · SGD {((custA_percent / 100) * currentTotalAmount).toFixed(2)}</span>
                  </div>
                  <span className={styles.customerRuleMeta}>SG-DRY · Version 2</span>
                </div>
                {!collapsedCustomers.custA && (
                  <table className={styles.table}>
                    <tbody>
                      <tr>
                        <td>Rachel Lim</td>
                        <td style={{ textAlign: "right", color: "#64748B" }}>40.00%</td>
                        <td style={{ textAlign: "right", fontWeight: 500 }}>
                          {((custA_percent / 100) * currentTotalAmount * 0.4).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Daniel Tan</td>
                        <td style={{ textAlign: "right", color: "#64748B" }}>40.00%</td>
                        <td style={{ textAlign: "right", fontWeight: 500 }}>
                          {((custA_percent / 100) * currentTotalAmount * 0.4).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Priya Nair</td>
                        <td style={{ textAlign: "right", color: "#64748B" }}>20.00%</td>
                        <td style={{ textAlign: "right", fontWeight: 500 }}>
                          {((custA_percent / 100) * currentTotalAmount * 0.2).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>

              {/* Customer B Breakdown */}
              <div className={styles.customerBreakdownCard}>
                <div
                  className={styles.customerBreakdownHeader}
                  onClick={() => toggleCustCollapse("custB")}
                  style={{
                    cursor: "pointer",
                    userSelect: "none",
                    borderBottom: collapsedCustomers.custB ? "none" : "1px solid #E2E8F0",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icon
                      icon={collapsedCustomers.custB ? "lucide:chevron-right" : "lucide:chevron-down"}
                      width={16}
                    />
                    <span>Customer B (BVI) · SGD {((custB_percent / 100) * currentTotalAmount).toFixed(2)}</span>
                  </div>
                  <span className={styles.customerRuleMeta}>EU-DESK · Version 1</span>
                </div>
                {!collapsedCustomers.custB && (
                  <table className={styles.table}>
                    <tbody>
                      <tr>
                        <td>Sofia Hassan</td>
                        <td style={{ textAlign: "right", color: "#64748B" }}>50.00%</td>
                        <td style={{ textAlign: "right", fontWeight: 500 }}>
                          {((custB_percent / 100) * currentTotalAmount * 0.5).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Marcus Goh</td>
                        <td style={{ textAlign: "right", color: "#64748B" }}>25.00%</td>
                        <td style={{ textAlign: "right", fontWeight: 500 }}>
                          {((custB_percent / 100) * currentTotalAmount * 0.25).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Priya Nair</td>
                        <td style={{ textAlign: "right", color: "#64748B" }}>25.00%</td>
                        <td style={{ textAlign: "right", fontWeight: 500 }}>
                          {((custB_percent / 100) * currentTotalAmount * 0.25).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>

              {/* Result By Staff Section */}
              <div className={styles.resultByStaffCard}>
                <span className={styles.levelSectionTitle}>Result by staff</span>
                <div className={styles.resultGrid}>
                  <div className={styles.resultRow}>
                    <span className={styles.resultName}>Sofia Hassan</span>
                    <span className={styles.resultAmount}>
                      {((custB_percent / 100) * currentTotalAmount * 0.5).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.resultRow}>
                    <span className={styles.resultName}>Priya Nair</span>
                    <span className={styles.resultAmount}>
                      {(
                        (custA_percent / 100) * currentTotalAmount * 0.2 +
                        (custB_percent / 100) * currentTotalAmount * 0.25
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.resultRow}>
                    <span className={styles.resultName}>Rachel Lim</span>
                    <span className={styles.resultAmount}>
                      {((custA_percent / 100) * currentTotalAmount * 0.4).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.resultRow}>
                    <span className={styles.resultName}>Daniel Tan</span>
                    <span className={styles.resultAmount}>
                      {((custA_percent / 100) * currentTotalAmount * 0.4).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.resultRow}>
                    <span className={styles.resultName}>Marcus Goh</span>
                    <span className={styles.resultAmount}>
                      {((custB_percent / 100) * currentTotalAmount * 0.25).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.resultRow} style={{ borderTop: "1px solid #E2E8F0", paddingTop: "6px" }}>
                    <span className={styles.resultName} style={{ fontWeight: 600, color: "#0F172A" }}>Total</span>
                    <span className={styles.resultAmount} style={{ fontWeight: 600, color: "#0F172A" }}>
                      {currentTotalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Validation Banner */}
              <div className={styles.validationBannerValid}>
                <Icon icon="lucide:check" width={18} />
                <span>Balanced — customers total 100%, and each rule totals 100%</span>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer (Sticky Bottom with Pill Buttons) */}
        <div className={styles.modalFooter}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.btnSubmit} onClick={handleSave}>
            Save Allocation
          </button>
        </div>
      </div>
    </div>
  );
}
