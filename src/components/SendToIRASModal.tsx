"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import styles from "./SendToIRASModal.module.css";

interface SendToIRASModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onConfirm: () => void;
}

export default function SendToIRASModal({
  isOpen,
  onClose,
  selectedCount,
  onConfirm,
}: SendToIRASModalProps) {
  const [submissionDate, setSubmissionDate] = useState("2026-08-28");

  if (!isOpen) return null;

  // Calculate estimated completion date (5 days after submission date)
  const computeEstFinishDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "2026-09-02";
      d.setDate(d.getDate() + 5);
      return d.toISOString().split("T")[0];
    } catch {
      return "2026-09-02";
    }
  };

  const estDate = computeEstFinishDate(submissionDate);
  const countDisplay = selectedCount > 0 ? selectedCount : 5;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Top Gradient Bar */}
        <div className={styles.topGradientBar} />

        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.brandIconWrap}>
              <Icon icon="lucide:send" width={20} height={20} />
            </div>
            <div className={styles.titleMeta}>
              <h3 className={styles.modalTitle}>Confirm IRAS Filing</h3>
              <span className={styles.subTitlePill}>
                Module: <span className={styles.pillBadge}>GST InvoiceNow</span>
              </span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <Icon icon="lucide:x" width={18} height={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {/* Parameter Card: Editable Submission Date & Dynamic Estimated Finish */}
          <div className={styles.paramCard}>
            <div className={styles.paramRow}>
              <div className={styles.fieldBox}>
                <label className={styles.fieldLabel}>
                  Submission Date<span className={styles.reqStar}>*</span>
                </label>
                <input
                  type="date"
                  className={styles.dateInput}
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldBox}>
                <label className={styles.fieldLabel}>Est. Completion</label>
                <div className={styles.estBox}>
                  <Icon icon="lucide:clock-3" width={16} height={16} className={styles.estIcon} />
                  <span>{estDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selection & Status Summary Grid */}
          <div className={styles.summaryGrid}>
            <div className={styles.summaryStat}>
              <span className={styles.statTag}>Records Selected</span>
              <span className={styles.statVal}>{countDisplay} Documents</span>
            </div>
            <div className={styles.summaryStat}>
              <span className={styles.statTag}>Filing Target</span>
              <span className={styles.statVal}>IRAS Peppol</span>
            </div>
          </div>

          {/* Supplier Warning Alert */}
          <div className={styles.warningAlert}>
            <Icon icon="lucide:shield-alert" width={18} height={18} className={styles.warningIcon} />
            <div className={styles.warningContent}>
              <h5 className={styles.warningTitle}>Non-GST Registered Supplier Warning</h5>
              <p className={styles.warningDesc}>
                1 of {countDisplay} selected record is from a Non-GST Registered supplier.
              </p>
            </div>
          </div>

          {/* Confirmation Notice */}
          <div className={styles.noticeBox}>
            <Icon icon="lucide:info" width={15} height={15} className={styles.noticeIcon} />
            <span>Do you confirm that the records will be filed to IRAS for further processing?</span>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div className={styles.modalFooter}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>
            No, cancel
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            <Icon icon="lucide:send" width={15} />
            Yes, Send to IRAS
          </button>
        </div>
      </div>
    </div>
  );
}
