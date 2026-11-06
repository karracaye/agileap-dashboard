"use client";

import React from "react";
import styles from "./ExitConfirmationModal.module.css";

interface ExitConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ExitConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  message = "Are you sure you want to exit? The current progress will not be saved.",
  confirmText = "Yes, I'm sure",
  cancelText = "No, cancel",
}: ExitConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonGroup}>
          <button type="button" className={styles.btnConfirm} onClick={onConfirm}>
            {confirmText}
          </button>
          <button type="button" className={styles.btnCancel} onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
