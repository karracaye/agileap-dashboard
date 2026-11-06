"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import ExitConfirmationModal from "./ExitConfirmationModal";
import styles from "./ConvertFromPRModal.module.css";

export interface PRToConvertItem {
  id: string;
  prNo: string;
  prDate: string;
  status: string;
  vendorName: string;
  requesterName: string;
  totalAmount: number;
  currency: string;
  department: string;
  notes: string;
}

const SAMPLE_PR_DATA: PRToConvertItem[] = [
  {
    id: "1",
    prNo: "PR-2026-031",
    prDate: "01-Sep-2026",
    status: "Approved",
    vendorName: "CMH PTE LTD (CMH1)",
    requesterName: "Joshua Lee (Test)",
    totalAmount: 1750.0,
    currency: "SGD",
    department: "IT Operations",
    notes: "Server Hardware Upgrade",
  },
  {
    id: "2",
    prNo: "PR-2026-030",
    prDate: "28-Aug-2026",
    status: "Approved",
    vendorName: "BW LPG (ACT011)",
    requesterName: "Sarah Tan",
    totalAmount: 4240.0,
    currency: "SGD",
    department: "Logistics",
    notes: "Fuel and Transport Services",
  },
  {
    id: "3",
    prNo: "PR-2026-029",
    prDate: "25-Aug-2026",
    status: "Approved",
    vendorName: "IMDA TEST BUYER",
    requesterName: "Alex Heng",
    totalAmount: 66.0,
    currency: "SGD",
    department: "Procurement",
    notes: "Office Stationeries",
  },
  {
    id: "4",
    prNo: "PR-2026-028",
    prDate: "15-Aug-2026",
    status: "Approved",
    vendorName: "Activants Advance Order Pte Ltd",
    requesterName: "Joshua Lee (Test)",
    totalAmount: 100.0,
    currency: "SGD",
    department: "Administration",
    notes: "Software Subscriptions",
  },
];

interface ConvertFromPRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConvertFromPRModal({ isOpen, onClose }: ConvertFromPRModalProps) {
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleAttemptClose = () => {
    setShowExitModal(true);
  };

  const handleConfirmClose = () => {
    setShowExitModal(false);
    onClose();
  };

  const filteredItems = SAMPLE_PR_DATA.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.prNo.toLowerCase().includes(q) ||
      item.vendorName.toLowerCase().includes(q) ||
      item.requesterName.toLowerCase().includes(q) ||
      item.department.toLowerCase().includes(q)
    );
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConvertClick = () => {
    if (selectedIds.length === 0) return;
    setShowConfirm(true);
  };

  const handleConfirmYes = () => {
    setShowConfirm(false);
    const selectedPRs = SAMPLE_PR_DATA.filter((item) => selectedIds.includes(item.id));
    const prRefs = selectedPRs.map((item) => item.prNo).join(",");
    onClose();
    router.push(`/purchase-order/new?convertedFromPR=${encodeURIComponent(prRefs)}`);
  };

  const isAllSelected =
    filteredItems.length > 0 && selectedIds.length === filteredItems.length;

  return (
    <>
      <div className={styles.backdrop} onClick={handleAttemptClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 className={styles.title}>Convert From PR</h2>
            <button className={styles.closeBtn} onClick={handleAttemptClose} aria-label="Close modal">
              <Icon icon="lucide:x" width={20} height={20} />
            </button>
          </div>

        <div className={styles.actionBar}>
          <button
            className={`${styles.btnConvert} ${
              selectedIds.length > 0 ? styles.btnConvertActive : styles.btnConvertDisabled
            }`}
            disabled={selectedIds.length === 0}
            onClick={handleConvertClick}
          >
            Convert ({selectedIds.length}) PR to PO
          </button>

          <div className={styles.toolbarRow}>
            <div className={styles.searchBox}>
              <Icon icon="lucide:search" width={16} height={16} color="#64748B" />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search PR No., Vendor, Requester..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className={styles.selectedCountText}>
              {selectedIds.length} item(s) selected
            </span>
          </div>
        </div>

        <div className={styles.tableBody}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th} style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className={styles.th}>PR No.</th>
                <th className={styles.th}>PR Date</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Vendor / Business Unit</th>
                <th className={styles.th}>Requester</th>
                <th className={styles.th}>Department</th>
                <th className={styles.th + " " + styles.amountCol}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.td} style={{ textAlign: "center", padding: "32px 0", color: "#64748B" }}>
                    No purchase requisitions found available for conversion.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`${styles.tr} ${isSelected ? styles.trSelected : ""}`}
                      onClick={() => handleToggleSelect(item.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={isSelected}
                          onChange={() => handleToggleSelect(item.id)}
                        />
                      </td>
                      <td className={styles.td}>
                        <span className={styles.prNoText}>{item.prNo}</span>
                      </td>
                      <td className={styles.td}>{item.prDate}</td>
                      <td className={styles.td}>
                        <span className={styles.badgeApproved}>{item.status}</span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.vendorCell}>
                          <span className={styles.vendorName}>{item.vendorName}</span>
                          <span className={styles.vendorContact}>{item.notes}</span>
                        </div>
                      </td>
                      <td className={styles.td}>{item.requesterName}</td>
                      <td className={styles.td}>{item.department}</td>
                      <td className={styles.td + " " + styles.amountCol}>
                        <span className={styles.amountText}>
                          {item.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                        <span className={styles.currencyText}>{item.currency}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Prompt Modal Overlay (matching media_1791276513131.png) */}
      {showConfirm && (
        <div className={styles.confirmBackdrop} onClick={() => setShowConfirm(false)}>
          <div className={styles.confirmCard} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.confirmCloseBtn}
              onClick={() => setShowConfirm(false)}
              aria-label="Close dialog"
            >
              <Icon icon="lucide:x" width={18} height={18} />
            </button>

            <p className={styles.confirmText}>
              Are you sure you want to convert {selectedIds.length} Purchase Requisition(s) to Purchase Order?
            </p>

            <div className={styles.confirmBtnGroup}>
              <button
                type="button"
                className={styles.btnConfirmYes}
                onClick={handleConfirmYes}
              >
                Yes
              </button>
              <button
                type="button"
                className={styles.btnConfirmNo}
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    <ExitConfirmationModal
      isOpen={showExitModal}
      onConfirm={handleConfirmClose}
      onCancel={() => setShowExitModal(false)}
    />
  </>
  );
}
