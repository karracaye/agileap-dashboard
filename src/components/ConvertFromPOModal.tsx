"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import ExitConfirmationModal from "./ExitConfirmationModal";
import styles from "./ConvertFromPOModal.module.css";

export interface POToConvertItem {
  id: string;
  poNo: string;
  poDate: string;
  status: string;
  vendorName: string;
  contact: string;
  subTotal: number;
  totalTax: number;
  totalAmount: number;
  sendVia: string;
  notesTerms: string;
  lastModified: string;
  createdDate: string;
  type: string;
  prRef: string;
}

const SAMPLE_PO_DATA: POToConvertItem[] = [
  {
    id: "1",
    poNo: "PO-2026-144",
    poDate: "03-Sep-2026",
    status: "Submitted",
    vendorName: "CMH PTE LTD (CMH1)",
    contact: "-",
    subTotal: 1750.0,
    totalTax: 0.0,
    totalAmount: 1750.0,
    sendVia: "-",
    notesTerms: "N/A",
    lastModified: "03-Sep-2026 10:54:11 AM",
    createdDate: "03-Sep-2026 10:54:11 AM",
    type: "Converted to IR",
    prRef: "N/A",
  },
  {
    id: "2",
    poNo: "PO-2026-145",
    poDate: "03-Sep-2026",
    status: "Submitted",
    vendorName: "CMH PTE LTD (CMH1)",
    contact: "-",
    subTotal: 1750.0,
    totalTax: 0.0,
    totalAmount: 1750.0,
    sendVia: "-",
    notesTerms: "N/A",
    lastModified: "03-Sep-2026 12:13:06 PM",
    createdDate: "03-Sep-2026 12:13:06 PM",
    type: "N/A",
    prRef: "N/A",
  },
  {
    id: "3",
    poNo: "PO-2026-141",
    poDate: "31-Aug-2026",
    status: "Submitted",
    vendorName: "IMDA TEST BUYER",
    contact: "IMDA BUYER TESTER (noreply_invoice...)",
    subTotal: 66.0,
    totalTax: 0.0,
    totalAmount: 66.0,
    sendVia: "InvoiceNow",
    notesTerms: "N/A",
    lastModified: "31-Aug-2026 05:24:18 PM",
    createdDate: "31-Aug-2026 05:22:05 PM",
    type: "N/A",
    prRef: "N/A",
  },
  {
    id: "4",
    poNo: "PO-2026-097",
    poDate: "15-Jul-2026",
    status: "Submitted",
    vendorName: "Activants Advance Order Pte Ltd (...)",
    contact: "-",
    subTotal: 100.0,
    totalTax: 0.0,
    totalAmount: 100.0,
    sendVia: "InvoiceNow",
    notesTerms: "N/A",
    lastModified: "31-Aug-2026 04:22:18 PM",
    createdDate: "15-Jul-2026 01:11:19 PM",
    type: "N/A",
    prRef: "N/A",
  },
  {
    id: "5",
    poNo: "PO-2026-138",
    poDate: "18-Aug-2026",
    status: "Submitted",
    vendorName: "BW LPG (ACT011)",
    contact: "-",
    subTotal: 4240.0,
    totalTax: 0.0,
    totalAmount: 4240.0,
    sendVia: "-",
    notesTerms: "N/A",
    lastModified: "18-Aug-2026 03:20:22 PM",
    createdDate: "18-Aug-2026 03:04:08 PM",
    type: "N/A",
    prRef: "N/A",
  },
  {
    id: "6",
    poNo: "PO-2026-123",
    poDate: "31-Jul-2026",
    status: "Submitted",
    vendorName: "BW LPG (ACT011)",
    contact: "-",
    subTotal: 4240.0,
    totalTax: 0.0,
    totalAmount: 4240.0,
    sendVia: "InvoiceNow",
    notesTerms: "N/A",
    lastModified: "31-Jul-2026 05:09:41 PM",
    createdDate: "31-Jul-2026 04:41:15 PM",
    type: "Converted to GRN",
    prRef: "N/A",
  },
  {
    id: "7",
    poNo: "PO-2026-136",
    poDate: "14-Aug-2026",
    status: "Submitted",
    vendorName: "BW LNG (BWL001)",
    contact: "Jerry (jeremie@activants.com)",
    subTotal: 108.0,
    totalTax: 0.0,
    totalAmount: 108.0,
    sendVia: "-",
    notesTerms: "N/A",
    lastModified: "14-Aug-2026 03:18:40 PM",
    createdDate: "14-Aug-2026 03:15:43 PM",
    type: "Converted to GRN",
    prRef: "N/A",
  },
  {
    id: "8",
    poNo: "PO-2028-137",
    poDate: "14-Aug-2026",
    status: "Submitted",
    vendorName: "TASTER FOOD PTE LTD (TAS004)",
    contact: "dtf_sg_ap@breadtalk.com",
    subTotal: 11811.66,
    totalTax: 0.0,
    totalAmount: 11811.66,
    sendVia: "-",
    notesTerms: "N/A",
    lastModified: "14-Aug-2026 05:06:06 PM",
    createdDate: "14-Aug-2026 04:56:27 PM",
    type: "N/A",
    prRef: "N/A",
  },
];

interface ConvertFromPOModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConvertFromPOModal({ isOpen, onClose }: ConvertFromPOModalProps) {
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleAttemptClose = () => {
    setShowExitModal(true);
  };

  const handleConfirmClose = () => {
    setShowExitModal(false);
    onClose();
  };

  const filteredPOList = SAMPLE_PO_DATA.filter((po) => {
    return (
      po.poNo.toLowerCase().includes(search.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      po.contact.toLowerCase().includes(search.toLowerCase())
    );
  });

  const allSelected =
    filteredPOList.length > 0 && selectedIds.length === filteredPOList.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPOList.map((item) => item.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleConvertClick = () => {
    if (selectedIds.length === 0) return;
    setShowConfirm(true);
  };

  const handleConfirmYes = () => {
    setShowConfirm(false);
    onClose();
    router.push("/goods-receipt/new");
  };

  return (
    <>
      <div className={styles.backdrop} onClick={handleAttemptClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>Convert from Purchase Order</h2>
            <button type="button" className={styles.closeBtn} onClick={handleAttemptClose} aria-label="Close modal">
              <Icon icon="lucide:x" width={20} height={20} />
            </button>
          </div>

        {/* Action Bar with Top Convert Button */}
        <div className={styles.actionBar}>
          <button
            type="button"
            className={`${styles.btnConvert} ${
              selectedIds.length > 0 ? styles.btnConvertActive : styles.btnConvertDisabled
            }`}
            disabled={selectedIds.length === 0}
            onClick={handleConvertClick}
          >
            {selectedIds.length > 0
              ? `Convert (${selectedIds.length} Purchase Order${selectedIds.length > 1 ? "s" : ""} Selected)`
              : "Convert"}
          </button>

          <div className={styles.toolbarRow}>
            <div className={styles.searchBox}>
              <Icon icon="lucide:search" width={14} style={{ color: "#94A3B8" }} />
              <input
                type="text"
                placeholder="Search by PO No. or Vendor..."
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {selectedIds.length > 0 && (
              <span className={styles.selectedCountText}>
                {selectedIds.length} of {filteredPOList.length} items selected
              </span>
            )}
          </div>
        </div>

        {/* Table Area */}
        <div className={styles.tableBody}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th} style={{ width: "90px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={allSelected}
                      onChange={toggleSelectAll}
                    />
                    <span>To convert</span>
                  </label>
                </th>
                <th className={styles.th}>PO No. ↓</th>
                <th className={styles.th}>PO Date ↓</th>
                <th className={styles.th}>Status ↓</th>
                <th className={styles.th}>Vendor / Business Unit / Contact ↓</th>
                <th className={`${styles.th} ${styles.amountCol}`}>Sub Total ↓</th>
                <th className={`${styles.th} ${styles.amountCol}`}>Total Tax ↓</th>
                <th className={`${styles.th} ${styles.amountCol}`}>Total Amount ↓</th>
                <th className={styles.th}>Send Via ↓</th>
                <th className={styles.th}>Notes / Terms ↓</th>
                <th className={styles.th}>Last Modified ↓</th>
                <th className={styles.th}>Created Date ↓</th>
                <th className={styles.th}>Type ↓</th>
                <th className={styles.th}>PR Ref. ↓</th>
              </tr>
            </thead>
            <tbody>
              {filteredPOList.map((po) => {
                const isSelected = selectedIds.includes(po.id);
                return (
                  <tr
                    key={po.id}
                    className={`${styles.tr} ${isSelected ? styles.trSelected : ""}`}
                    onClick={() => toggleSelectOne(po.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={isSelected}
                        onChange={() => toggleSelectOne(po.id)}
                      />
                    </td>
                    <td className={`${styles.td} ${styles.poNoText}`}>{po.poNo}</td>
                    <td className={styles.td}>{po.poDate}</td>
                    <td className={styles.td}>
                      <span className={styles.badgeSubmitted}>{po.status}</span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.vendorCell}>
                        <span className={styles.vendorName}>{po.vendorName}</span>
                        {po.contact !== "-" && (
                          <span className={styles.vendorContact}>{po.contact}</span>
                        )}
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.amountCol}`}>
                      <span className={styles.amountText}>
                        {po.subTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                      <span className={styles.currencyText}>SGD</span>
                    </td>
                    <td className={`${styles.td} ${styles.amountCol}`}>
                      <span className={styles.amountText}>
                        {po.totalTax.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                      <span className={styles.currencyText}>SGD</span>
                    </td>
                    <td className={`${styles.td} ${styles.amountCol}`}>
                      <span className={styles.amountText}>
                        {po.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                      <span className={styles.currencyText}>SGD</span>
                    </td>
                    <td className={styles.td}>{po.sendVia}</td>
                    <td className={styles.td}>{po.notesTerms}</td>
                    <td className={styles.td}>{po.lastModified}</td>
                    <td className={styles.td}>{po.createdDate}</td>
                    <td className={styles.td}>{po.type}</td>
                    <td className={styles.td}>{po.prRef}</td>
                  </tr>
                );
              })}
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
              Are you sure you want to convert {selectedIds.length} Purchase Order(s) to Goods Receipt?
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
