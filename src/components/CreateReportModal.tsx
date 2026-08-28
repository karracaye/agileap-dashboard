"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import styles from "./CreateReportModal.module.css";

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function CreateReportModal({ isOpen, onClose, onCreate }: CreateReportModalProps) {
  const [reportName, setReportName] = useState("");
  const [moduleCategory, setModuleCategory] = useState("Accounts Payable");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportName.trim()) return;
    onCreate(reportName.trim());
    setReportName("");
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Create a Custom Report</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <Icon icon="lucide:x" width={18} height={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Report Title</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Monthly Vendor Summary V1"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Module Category</label>
              <select
                className={styles.select}
                value={moduleCategory}
                onChange={(e) => setModuleCategory(e.target.value)}
              >
                <option value="Accounts Payable">Accounts Payable</option>
                <option value="Accounts Receivable">Accounts Receivable</option>
                <option value="Configuration">Configuration</option>
                <option value="General Ledger">General Ledger</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Select Export Columns</label>
              <div className={styles.checkboxGrid}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" defaultChecked /> Document No
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" defaultChecked /> Vendor / Customer
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" defaultChecked /> Total Amount
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" defaultChecked /> Tax / GST Amount
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" defaultChecked /> Issue Date
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" defaultChecked /> Payment Status
                </label>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.createBtn}>
              Create Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
