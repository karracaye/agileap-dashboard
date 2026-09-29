"use client";

import React, { useState } from "react";
import styles from "./NewRuleVersionModal.module.css";
import { Icon } from "@iconify/react";

export interface StaffAllocationRow {
  staffCode: string;
  staffName: string;
  entity: string;
  department: string;
  sharePercent: number;
}

interface NewRuleVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  costCentreCode?: string;
  costCentreName?: string;
  currentVersionNumber?: number;
  onSaveVersion?: (newVersion: {
    versionNumber: number;
    effectiveFrom: string;
    effectiveTo: string;
    approvalRef?: string;
    allocations: StaffAllocationRow[];
  }) => void;
}

const AVAILABLE_STAFF_LIST = [
  { code: "ST-001", name: "Priya Nair", entity: "Entity A", department: "Operations" },
  { code: "ST-002", name: "Rachel Lim", entity: "Entity A", department: "Chartering" },
  { code: "ST-004", name: "Aisha Rahman", entity: "Entity B", department: "Broking" },
  { code: "ST-005", name: "Joshua Lee", entity: "Entity A", department: "Chartering" },
  { code: "ST-006", name: "Daniel Tan", entity: "Entity C", department: "Accounts" },
];

export default function NewRuleVersionModal({
  isOpen,
  onClose,
  costCentreCode = "SG-DRY",
  costCentreName = "Singapore Dry Bulk",
  currentVersionNumber = 2,
  onSaveVersion,
}: NewRuleVersionModalProps) {
  const newVersionNumber = currentVersionNumber + 1;

  const [copyFrom, setCopyFrom] = useState(`Version ${currentVersionNumber} (Active)`);
  const [startDate, setStartDate] = useState("2027-01-01");
  const [approvalRef, setApprovalRef] = useState("Finance Head email, 22 Sep 2026");

  const [allocations, setAllocations] = useState<StaffAllocationRow[]>([
    {
      staffCode: "ST-001",
      staffName: "Priya Nair",
      entity: "Entity A",
      department: "Chartering",
      sharePercent: 40,
    },
    {
      staffCode: "ST-002",
      staffName: "Rachel Lim",
      entity: "Entity A",
      department: "Chartering",
      sharePercent: 35,
    },
    {
      staffCode: "ST-004",
      staffName: "Aisha Rahman",
      entity: "Entity B",
      department: "Operations",
      sharePercent: 20,
    },
  ]);

  if (!isOpen) return null;

  const totalPercent = allocations.reduce((sum, item) => sum + (Number(item.sharePercent) || 0), 0);
  const isValidTotal = totalPercent === 100;
  const remainingPercent = (100 - totalPercent).toFixed(2);

  const handleSelectStaff = (index: number, staffCode: string) => {
    const selectedObj = AVAILABLE_STAFF_LIST.find((s) => s.code === staffCode);
    if (!selectedObj) return;

    const next = [...allocations];
    next[index] = {
      ...next[index],
      staffCode: selectedObj.code,
      staffName: selectedObj.name,
      entity: selectedObj.entity,
      department: selectedObj.department,
    };
    setAllocations(next);
  };

  const handlePercentChange = (index: number, val: number) => {
    const next = [...allocations];
    next[index].sharePercent = val;
    setAllocations(next);
  };

  const handleRemoveRow = (index: number) => {
    setAllocations(allocations.filter((_, i) => i !== index));
  };

  const handleAddStaffRow = () => {
    setAllocations([
      ...allocations,
      {
        staffCode: "ST-005",
        staffName: "Joshua Lee",
        entity: "Entity A",
        department: "Chartering",
        sharePercent: 0,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidTotal) return;

    if (onSaveVersion) {
      onSaveVersion({
        versionNumber: newVersionNumber,
        effectiveFrom: startDate,
        effectiveTo: "31 Dec 2027",
        approvalRef,
        allocations,
      });
    }

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <h2 className={styles.modalTitle}>New Allocation Version</h2>
            <span className={styles.modalSub}>
              {costCentreCode} · {costCentreName} · this will be Version {newVersionNumber}
            </span>
          </div>
          <button className={styles.btnClose} onClick={onClose} aria-label="Close modal">
            <Icon icon="lucide:x" width={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Form Controls Grid */}
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Copy from</label>
                <select
                  className={styles.select}
                  value={copyFrom}
                  onChange={(e) => setCopyFrom(e.target.value)}
                >
                  <option value={`Version ${currentVersionNumber} (Active)`}>
                    Version {currentVersionNumber} (Active)
                  </option>
                  <option value="Version 1 (Superseded)">Version 1 (Superseded)</option>
                  <option value="Blank Allocation">Blank Allocation</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Effective from <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  className={styles.input}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroupFull} style={{ gridColumn: "span 2" }}>
                <label className={styles.label}>
                  Approval reference <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Finance Head email, 22 Sep 2026"
                  value={approvalRef}
                  onChange={(e) => setApprovalRef(e.target.value)}
                  required
                />
                <p className={styles.helperText}>
                  Who approved this change and where, e.g. the Finance Head&apos;s email and its date.
                </p>
              </div>
            </div>

            {/* Allocation Section Header */}
            <div>
              <h3 className={styles.sectionTitle}>Allocation</h3>
            </div>

            {/* Staff Share Percentages Allocation Table */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: "45%" }}>Staff</th>
                    <th style={{ width: "30%" }}>Department</th>
                    <th style={{ width: "20%", textAlign: "right" }}>Share %</th>
                    <th style={{ width: "5%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <select
                          className={styles.select}
                          value={item.staffCode}
                          onChange={(e) => handleSelectStaff(idx, e.target.value)}
                          style={{ padding: "7.5px 10px", fontSize: "13px" }}
                        >
                          {AVAILABLE_STAFF_LIST.map((s) => (
                            <option key={s.code} value={s.code}>
                              {s.name} ({s.code})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ color: "#475569", fontWeight: 500 }}>
                        {item.department}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className={styles.percentInputWrap} style={{ justifyContent: "flex-end" }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className={styles.percentInput}
                            value={item.sharePercent}
                            onChange={(e) => handlePercentChange(idx, Number(e.target.value))}
                          />
                          <span className={styles.percentSymbol}>%</span>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.btnDeleteRow}
                          onClick={() => handleRemoveRow(idx)}
                          title="Remove staff"
                        >
                          <Icon icon="lucide:trash-2" width={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Staff Link */}
            <div>
              <button
                type="button"
                className={styles.btnAddStaff}
                onClick={handleAddStaffRow}
              >
                + Add staff
              </button>
            </div>

            {/* Validation Alert Banner matching wireframe media_1790569720541.png */}
            {!isValidTotal ? (
              <div className={styles.validationBannerInvalid}>
                <Icon icon="lucide:alert-circle" width={18} style={{ flexShrink: 0 }} />
                <span>
                  Total {totalPercent.toFixed(2)}% — must be exactly 100.00% ({remainingPercent}% still to assign)
                </span>
              </div>
            ) : (
              <div className={styles.validationBannerValid}>
                <Icon icon="lucide:check-circle-2" width={18} style={{ flexShrink: 0 }} />
                <span>Total 100.00% — allocation is valid!</span>
              </div>
            )}

            {/* Version 2 Effective Date Info Banner matching wireframe media_1790569720541.png */}
            <div className={styles.infoBanner}>
              <Icon icon="lucide:info" width={18} className={styles.infoBannerIcon} />
              <span>
                Version {currentVersionNumber} stays active until 31 Dec 2026. Claims dated from 01 Jan 2027 will use Version {newVersionNumber}. Approved claims are not changed.
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={!isValidTotal}
            >
              Save Version
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
