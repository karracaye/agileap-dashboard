"use client";

import React, { useState, useEffect } from "react";
import styles from "./AddCostCentreModal.module.css";
import { Icon } from "@iconify/react";

export interface CostCentreFormData {
  id?: string;
  code: string;
  name: string;
  active: boolean;
}

interface AddCostCentreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CostCentreFormData) => void;
  initialData?: CostCentreFormData | null;
}

export default function AddCostCentreModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddCostCentreModalProps) {
  const isEditing = Boolean(initialData && initialData.code);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code || "");
      setName(initialData.name || "");
      setActive(initialData.active ?? true);
    } else {
      setCode("");
      setName("");
      setActive(true);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    onSubmit({
      id: initialData?.id,
      code: code.trim(),
      name: name.trim(),
      active,
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <h2 className={styles.modalTitle}>
              {isEditing ? "Edit Cost Centre" : "Add Cost Centre"}
            </h2>
            {isEditing && <span className={styles.modalSub}>{code} · {name}</span>}
          </div>
          <button className={styles.btnClose} onClick={onClose} aria-label="Close modal">
            <Icon icon="lucide:x" width={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Cost Centre Code <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CC001"
                className={styles.input}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Cost Centre Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Default, Administration, Dry Bulk"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <label className={styles.checkboxCard}>
              <input
                type="checkbox"
                className={styles.cb}
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <div className={styles.cbTextGroup}>
                <span className={styles.cbTitle}>Active Status</span>
                <span className={styles.cbSub}>
                  Active cost centres can be assigned to claims and invoices.
                </span>
              </div>
            </label>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnSubmit}>
              {isEditing ? "Save" : "Add Cost Centre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
