"use client";

import React, { useState } from "react";
import styles from "./CreateClaimModal.module.css";
import { Icon } from "@iconify/react";

export interface NewClaimData {
  claimNo?: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  totalTax: number;
  paymentMethod: string;
  transactionDate: string;
  description: string;
}

interface CreateClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitClaim: (claim: NewClaimData) => void;
}

export default function CreateClaimModal({ isOpen, onClose, onSubmitClaim }: CreateClaimModalProps) {
  const [userName, setUserName] = useState("Joshua Lee (Test)");
  const [userEmail, setUserEmail] = useState("joshua+1@activants.com");
  const [amount, setAmount] = useState("");
  const [tax, setTax] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("GIRO");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount) || 0;
    const numTax = parseFloat(tax) || 0;

    onSubmitClaim({
      userName,
      userEmail,
      totalAmount: numAmount,
      totalTax: numTax,
      paymentMethod,
      transactionDate,
      description: description || "Petty cash claim",
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create New Claim</h2>
          <button className={styles.btnClose} onClick={onClose} aria-label="Close modal">
            <Icon icon="lucide:x" width={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Claimant Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Claimant Email <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  className={styles.input}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Amount (SGD) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={styles.input}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Tax Amount (SGD)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={styles.input}
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Payment Method <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.select}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="GIRO">GIRO</option>
                  <option value="PayNow">PayNow</option>
                  <option value="COD">COD</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Transaction Date <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  className={styles.input}
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroupFull}>
                <label className={styles.label}>Description / Purpose</label>
                <textarea
                  className={styles.textarea}
                  placeholder="e.g., Taxi fare for client meeting, team lunch, office supplies..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className={styles.fieldGroupFull}>
                <label className={styles.label}>Attach Receipt / Support Document</label>
                <div className={styles.fileDropzone}>
                  <Icon icon="lucide:paperclip" width={18} />
                  <span>Click to attach document (PDF, PNG, JPG)</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnSubmit}>
              <Icon icon="lucide:plus" width={16} />
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
