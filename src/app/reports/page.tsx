"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CreateReportModal from "@/components/CreateReportModal";
import ActionButton from "@/components/ActionButton";
import styles from "./page.module.css";

const STANDARD_REPORTS = [
  "Payment Export",
  "Credit Note Export",
  "Vendor Credit Note Export",
  "Inventory Report Export",
  "Budget Usage Export",
  "Invoice Export",
  "Quotation Export",
  "Delivery Order Export",
  "PO Received Export",
  "Timesheet Export",
  "Sales Export",
  "Bills To Pay for Xero",
  "Debit Note Export",
  "Vendor Debit Note Export",
  "Claims / Petty Cash Export",
  "User Management Export",
  "Vendor / Customer Export",
  "OCR Reconciliation Report",
  "SAP Report",
  "Bills Details Report",
  "GST InvoiceNow Report",
];

const INITIAL_CUSTOM_REPORTS = [
  { id: "1", title: "INV V2", author: "Created By Joshua" },
  { id: "2", title: "PO V1 123", author: "Created By Joshua" },
  { id: "3", title: "Invoice Report", author: "Created By Joshua" },
];

export default function ReportsPage() {
  const [customReports, setCustomReports] = useState(INITIAL_CUSTOM_REPORTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleCreateReport = (title: string) => {
    const newReport = {
      id: Date.now().toString(),
      title,
      author: "Created By Joshua",
    };
    setCustomReports([newReport, ...customReports]);
  };

  const handleDeleteReport = (id: string) => {
    setCustomReports(customReports.filter((r) => r.id !== id));
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>
          {/* Breadcrumb Header */}
          <div className={styles.breadcrumbRow}>
            <Icon icon="lucide:home" width={16} height={16} className={styles.breadcrumbIcon} />
            <span className={styles.breadcrumbCurrent}>Reports</span>
          </div>

          {/* Section 1: Standard System Reports */}
          <div className={styles.cardsGrid}>
            {STANDARD_REPORTS.map((title) => (
              <div key={title} className={styles.reportCard}>
                <div className={styles.reportCardTitle}>{title}</div>
                <div className={styles.reportCardMeta}>
                  <span className={styles.reportCardAuthor}>Created By AgileAP</span>
                </div>
              </div>
            ))}
          </div>

          {/* Section 2: Save Reports */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Save Reports</h2>
          </div>

          <div className={styles.cardsGrid}>
            {/* Create Custom Report Action Button */}
            <div className={styles.createReportCard} onClick={() => setIsModalOpen(true)}>
              <div className={styles.createReportText}>CREATE A CUSTOM REPORT</div>
              <div className={styles.createReportPlus}>+</div>
            </div>

            {/* Custom Report Cards */}
            {customReports.map((report) => (
              <div key={report.id} className={styles.reportCard}>
                <div className={styles.reportCardTitle}>{report.title}</div>
                <div className={styles.reportCardMeta}>
                  <span className={styles.reportCardAuthor}>{report.author}</span>
                  <div className={styles.cardActions}>
                    <ActionButton type="edit" tooltip="Edit" size={28} iconSize={14} />
                    <button
                      className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                      title="Delete report"
                      onClick={() => handleDeleteReport(report.id)}
                    >
                      <Icon icon="lucide:trash-2" width={16} height={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 3: Audit Reports */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Audit Reports</h2>
          </div>

          <div className={styles.auditContainer}>
            {/* Configuration Module */}
            <div className={styles.accordionItem}>
              <button
                className={styles.accordionHeader}
                onClick={() => toggleAccordion("config")}
              >
                <Icon
                  icon="lucide:chevron-right"
                  width={16}
                  height={16}
                  className={`${styles.accordionChevron} ${
                    openAccordion === "config" ? styles.accordionChevronOpen : ""
                  }`}
                />
                <span>Configuration Module (33 items)</span>
              </button>
              {openAccordion === "config" && (
                <div className={styles.accordionBody}>
                  <ul className={styles.auditList}>
                    <li className={styles.auditListItem}>
                      <span className={styles.auditLogTitle}>Role Permission Changes Log</span>
                      <span className={styles.auditLogDate}>Updated 2 hours ago</span>
                    </li>
                    <li className={styles.auditListItem}>
                      <span className={styles.auditLogTitle}>System Integration Endpoints Audit</span>
                      <span className={styles.auditLogDate}>Updated Yesterday</span>
                    </li>
                    <li className={styles.auditListItem}>
                      <span className={styles.auditLogTitle}>User Authentication History Log</span>
                      <span className={styles.auditLogDate}>Updated 3 days ago</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Account Receivable Module */}
            <div className={styles.accordionItem}>
              <button
                className={styles.accordionHeader}
                onClick={() => toggleAccordion("ar")}
              >
                <Icon
                  icon="lucide:chevron-right"
                  width={16}
                  height={16}
                  className={`${styles.accordionChevron} ${
                    openAccordion === "ar" ? styles.accordionChevronOpen : ""
                  }`}
                />
                <span>Account Receivable Module (10 items)</span>
              </button>
              {openAccordion === "ar" && (
                <div className={styles.accordionBody}>
                  <ul className={styles.auditList}>
                    <li className={styles.auditListItem}>
                      <span className={styles.auditLogTitle}>Customer Invoice Dispatches Audit</span>
                      <span className={styles.auditLogDate}>Updated 1 hour ago</span>
                    </li>
                    <li className={styles.auditListItem}>
                      <span className={styles.auditLogTitle}>Payment Reminders Trigger Log</span>
                      <span className={styles.auditLogDate}>Updated 4 hours ago</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Account Payable Module */}
            <div className={styles.accordionItem}>
              <button
                className={styles.accordionHeader}
                onClick={() => toggleAccordion("ap")}
              >
                <Icon
                  icon="lucide:chevron-right"
                  width={16}
                  height={16}
                  className={`${styles.accordionChevron} ${
                    openAccordion === "ap" ? styles.accordionChevronOpen : ""
                  }`}
                />
                <span>Account Payable Module (14 items)</span>
              </button>
              {openAccordion === "ap" && (
                <div className={styles.accordionBody}>
                  <ul className={styles.auditList}>
                    <li className={styles.auditListItem}>
                      <span className={styles.auditLogTitle}>Vendor Bill Approval Workflow Audit</span>
                      <span className={styles.auditLogDate}>Updated 30 mins ago</span>
                    </li>
                    <li className={styles.auditListItem}>
                      <span className={styles.auditLogTitle}>Peppol E-Invoicing Inbound Log</span>
                      <span className={styles.auditLogDate}>Updated Today</span>
                    </li>
                    <li className={styles.auditListItem}>
                      <span className={styles.auditLogTitle}>FAST Payment Reconciliations Log</span>
                      <span className={styles.auditLogDate}>Updated Yesterday</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <CreateReportModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateReport}
          />
        </main>
      </div>
    </div>
  );
}
