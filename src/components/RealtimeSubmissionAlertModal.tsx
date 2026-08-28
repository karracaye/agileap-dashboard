"use client";

import React from "react";
import { Icon } from "@iconify/react";
import styles from "./RealtimeSubmissionAlertModal.module.css";

interface RealtimeSubmissionAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceNo?: string;
  onProceed?: () => void;
}

export default function RealtimeSubmissionAlertModal({
  isOpen,
  onClose,
  invoiceNo = "INV/202608/0032",
  onProceed,
}: RealtimeSubmissionAlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <div className={styles.iconBadge}>
              <Icon icon="lucide:zap" width={20} height={20} />
            </div>
            <h3 className={styles.modalTitle}>Real-Time (1A) IRAS Submission</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close alert modal">
            <Icon icon="lucide:x" width={18} height={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <div className={styles.alertBox}>
            <Icon icon="lucide:info" width={20} height={20} className={styles.alertIcon} />
            <p className={styles.alertText}>
              Sending this sales invoice via InvoiceNow will automatically transmit a copy of invoice details to IRAS via GST InvoiceNow in real time.
            </p>
          </div>

          <div className={styles.detailsBox}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Document Ref:</span>
              <span className={styles.detailVal}>{invoiceNo}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Submission Phase:</span>
              <span className={styles.detailVal}>Phase 1A Real-Time Automatic</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Filing Target:</span>
              <span className={styles.detailVal}>IRAS GST Network</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => {
              if (onProceed) onProceed();
              onClose();
            }}
          >
            <Icon icon="lucide:check" width={16} />
            Got it, Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
