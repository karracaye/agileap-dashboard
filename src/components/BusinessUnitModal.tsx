"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import styles from "./BusinessUnitModal.module.css";

interface BusinessUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BusinessUnitModal({ isOpen, onClose }: BusinessUnitModalProps) {
  const [buName, setBuName] = useState("");
  const [buCode, setBuCode] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [linkedVendor, setLinkedVendor] = useState("Activants PINT Test");
  const [location, setLocation] = useState("Midview City Hub");

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Unified Business Unit Setup</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <p style={{ fontSize: "0.813rem", color: "#64748b", margin: 0 }}>
            Create your Business Unit, enable it, and link vendors and locations in a single streamlined step.
          </p>

          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Business Unit Name*</label>
              <input
                type="text"
                className={styles.fieldInput}
                placeholder="e.g. Asia Pacific Regional Sales"
                value={buName}
                onChange={(e) => setBuName(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>BU Code / Identifier*</label>
              <input
                type="text"
                className={styles.fieldInput}
                placeholder="e.g. BU-APAC-01"
                value={buCode}
                onChange={(e) => setBuCode(e.target.value)}
              />
            </div>

            {/* Toggle Enablement */}
            <div className={styles.toggleRow}>
              <div>
                <span className={styles.fieldLabel}>Enable &amp; Publish Business Unit</span>
                <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
                  Makes BU available for selection during transactions
                </p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                />
                <span className={styles.slider} />
              </label>
            </div>

            {/* Instant Link Vendor/Customer Record */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Link to Vendor / Company Record</label>
              <select
                className={styles.fieldSelect}
                value={linkedVendor}
                onChange={(e) => setLinkedVendor(e.target.value)}
              >
                <option value="Activants PINT Test">Activants PINT Test</option>
                <option value="Global Logistics Pte Ltd">Global Logistics Pte Ltd</option>
                <option value="Apex Supplies Corp">Apex Supplies Corp</option>
              </select>
            </div>

            {/* Instant Location Link */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Associated Location</label>
              <input
                type="text"
                className={styles.fieldInput}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.btnSave} onClick={onClose}>
            Create &amp; Link Business Unit
          </button>
        </div>
      </div>
    </div>
  );
}
