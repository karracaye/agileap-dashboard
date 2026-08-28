"use client";

import React from "react";
import { Icon } from "@iconify/react";
import styles from "./GSTDocumentInfoDrawer.module.css";

interface GSTDocumentInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documentNo?: string;
}

export default function GSTDocumentInfoDrawer({
  isOpen,
  onClose,
  documentNo = "INV/202608/0032",
}: GSTDocumentInfoDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header with Close Button */}
        <div className={styles.drawerHeader}>
          <h3 className={styles.drawerTitle}>Invoice</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.drawerContent}>
          {/* Section: Document Information */}
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>GST InvoiceNow Document Information</h4>
            <p className={styles.sectionSub}>Created at 27-Aug-2026</p>
            <p className={styles.sectionSub}>Updated at 28-Aug-2026</p>
          </div>

          {/* Details Card */}
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Document UUID :</span>
              <span className={styles.infoValue}>c9d20d98-dc45-4300-b1a7-9045ddd4bbb1</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>GST InvoiceNow Trans. ID :</span>
              <span className={styles.infoValue}>87b016cf-4ebd-42a8-908a-12d6623e638a</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>InvoiceNow / Peppol Trans. ID :</span>
              <span className={styles.infoValue}>80a0db49-108a-4527-93b8-12a00281b741</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Type :</span>
              <span className={styles.infoValue}>Invoice</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Document No. :</span>
              <span className={styles.infoValue}>{documentNo}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Status :</span>
              <span className={styles.pillFiled}>Filed</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Submission Date :</span>
              <span className={styles.infoValue}>27-Aug-2026</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Filed Date :</span>
              <span className={styles.infoValue}>28-Aug-2026</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Exported Date :</span>
              <span className={styles.infoValue}>28-Aug-2026</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Source XML :</span>
              <div className={styles.xmlDownloadCard} title="Download Source XML">
                <div className={styles.xmlLeft}>
                  <Icon icon="lucide:file-code-2" width={16} height={16} className={styles.xmlIcon} />
                  <span>{documentNo}.xml</span>
                </div>
                <Icon icon="lucide:download" width={14} height={14} className={styles.downloadIcon} />
              </div>
            </div>
          </div>

          {/* Revise Document Button */}
          <button type="button" className={styles.btnRevise}>
            <Icon icon="lucide:rotate-ccw" width={16} height={16} />
            Revise Document
          </button>

          {/* Section: Peppol Transaction */}
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>Peppol Transaction</h4>
          </div>

          <div className={styles.tableCard}>
            <table className={styles.peppolTable}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Transaction No.</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>State</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Invoice</td>
                  <td style={{ fontSize: "0.78rem" }}>80a0db49-108a-4527-93b8-12a00281b741</td>
                  <td style={{ whiteSpace: "nowrap" }}>28-Aug-2026 00:41</td>
                  <td className={styles.statusSuccess}>SUCCESS</td>
                  <td className={styles.stateCompleted}>COMPLETED</td>
                  <td>
                    <button className={styles.searchIconBtn} title="Inspect Transaction">
                      <Icon icon="lucide:search" width={14} height={14} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className={styles.drawerFooter}>
          <button type="button" className={styles.btnCloseFooter} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
