"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ActionButton from "@/components/ActionButton";
import StatusSummarySection from "@/components/StatusSummarySection";
import ConvertFromPRModal from "@/components/ConvertFromPRModal";
import ImportModal from "@/components/ImportModal";
import ColumnPicker from "@/components/ColumnPicker";
import styles from "./page.module.css";

export interface PurchaseOrderItem {
  id: string;
  poNo: string;
  poDate: string;
  status: "Draft" | "Submitted" | "Pending Approval" | "Approved" | "Rejected" | "Cancelled" | "Confirmed" | "Converted";
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

export const ALL_PO_COLUMNS = [
  { key: "action", label: "Action", locked: true },
  { key: "poNo", label: "PO No.", locked: true },
  { key: "poDate", label: "PO Date", locked: false },
  { key: "status", label: "Status", locked: false },
  { key: "vendor", label: "Vendor / Business Unit / Contact", locked: false },
  { key: "subTotal", label: "Sub Total", locked: false },
  { key: "totalTax", label: "Total Tax", locked: false },
  { key: "totalAmount", label: "Total Amount", locked: false },
  { key: "sendVia", label: "Send Via", locked: false },
  { key: "notesTerms", label: "Notes / Terms", locked: false },
  { key: "lastModified", label: "Last Modified", locked: false },
  { key: "createdDate", label: "Created Date", locked: false },
  { key: "type", label: "Type", locked: false },
  { key: "prRef", label: "PR Ref.", locked: false },
] as const;

export type POColKey = (typeof ALL_PO_COLUMNS)[number]["key"];

const DEFAULT_VISIBLE_PO_COLS: POColKey[] = [
  "action",
  "poNo",
  "poDate",
  "status",
  "vendor",
  "totalAmount",
];

const INITIAL_PO_DATA: PurchaseOrderItem[] = [
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
    poNo: "PO-2026-143",
    poDate: "03-Sep-2026",
    status: "Pending Approval",
    vendorName: "CMH PTE LTD (CMH1)",
    contact: "-",
    subTotal: 1750.0,
    totalTax: 0.0,
    totalAmount: 1750.0,
    sendVia: "-",
    notesTerms: "N/A",
    lastModified: "03-Sep-2026 06:45:56 PM",
    createdDate: "03-Sep-2026 06:45:43 PM",
    type: "No PR",
    prRef: "N/A",
  },
  {
    id: "3",
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
    type: "No PR",
    prRef: "N/A",
  },
  {
    id: "4",
    poNo: "PO-2026-142",
    poDate: "02-Sep-2026",
    status: "Draft",
    vendorName: "CMH PTE LTD (CMH1)",
    contact: "-",
    subTotal: 2.0,
    totalTax: 0.18,
    totalAmount: 2.18,
    sendVia: "-",
    notesTerms: "N/A",
    lastModified: "02-Sep-2026 02:20:46 PM",
    createdDate: "02-Sep-2026 02:20:46 PM",
    type: "Converted from PR",
    prRef: "PR-2026-031",
  },
  {
    id: "5",
    poNo: "PO-2026-141",
    poDate: "31-Aug-2026",
    status: "Submitted",
    vendorName: "IMDA TEST BUYER",
    contact: "IMDA BUYER TESTER (noreply_invoice...)",
    subTotal: 66.0,
    totalTax: 0.0,
    totalAmount: 66.0,
    sendVia: "Sent Successful",
    notesTerms: "N/A",
    lastModified: "31-Aug-2026 05:24:18 PM",
    createdDate: "31-Aug-2026 05:22:05 PM",
    type: "No PR",
    prRef: "N/A",
  },
  {
    id: "6",
    poNo: "PO-2026-097",
    poDate: "15-Jul-2026",
    status: "Submitted",
    vendorName: "Activants Advance Order Pte Ltd (A...)",
    contact: "-",
    subTotal: 100.0,
    totalTax: 0.0,
    totalAmount: 100.0,
    sendVia: "Sent Successful",
    notesTerms: "N/A",
    lastModified: "31-Aug-2026 04:22:18 PM",
    createdDate: "15-Jul-2026 01:11:19 PM",
    type: "No PR",
    prRef: "N/A",
  },
  {
    id: "7",
    poNo: "PO-2026-140",
    poDate: "28-Aug-2026",
    status: "Draft",
    vendorName: "CMH PTE LTD (CMH1)",
    contact: "-",
    subTotal: 2.0,
    totalTax: 0.18,
    totalAmount: 2.18,
    sendVia: "-",
    notesTerms: "N/A",
    lastModified: "28-Aug-2026 05:43:48 PM",
    createdDate: "28-Aug-2026 05:43:48 PM",
    type: "Converted from PR",
    prRef: "PR-2026-031",
  },
  {
    id: "8",
    poNo: "PO-2026-139",
    poDate: "22-Aug-2026",
    status: "Pending Approval",
    vendorName: "BW LPG (ACT011)",
    contact: "-",
    subTotal: 4240.0,
    totalTax: 0.0,
    totalAmount: 4240.0,
    sendVia: "-",
    notesTerms: "N/A",
    lastModified: "22-Aug-2026 11:03:44 PM",
    createdDate: "22-Aug-2026 10:36:21 PM",
    type: "No PR",
    prRef: "N/A",
  },
  {
    id: "9",
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
    type: "No PR",
    prRef: "N/A",
  },
  {
    id: "10",
    poNo: "PO-2026-123",
    poDate: "31-Jul-2026",
    status: "Submitted",
    vendorName: "BW LPG (ACT011)",
    contact: "-",
    subTotal: 4240.0,
    totalTax: 0.0,
    totalAmount: 4240.0,
    sendVia: "Sent Successful",
    notesTerms: "N/A",
    lastModified: "31-Jul-2026 05:09:41 PM",
    createdDate: "31-Jul-2026 04:41:15 PM",
    type: "Converted to GRN",
    prRef: "N/A",
  },
];

export default function PurchaseOrderPage() {
  const [items, setItems] = useState<PurchaseOrderItem[]>(INITIAL_PO_DATA);
  const [activeCard, setActiveCard] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConvertDropdownOpen, setIsConvertDropdownOpen] = useState(false);
  const [showDateBadge, setShowDateBadge] = useState(true);

  const [visibleCols, setVisibleCols] = useState<POColKey[]>(DEFAULT_VISIBLE_PO_COLS);
  const [showColPicker, setShowColPicker] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPageInput, setJumpPageInput] = useState<string>("1");

  // Filtering
  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.poNo.toLowerCase().includes(q) ||
      item.vendorName.toLowerCase().includes(q) ||
      item.prRef.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (activeCard === "my-task") return false;
    if (activeCard === "draft") return item.status === "Draft";
    if (activeCard === "submitted") return item.status === "Submitted";
    if (activeCard === "pending") return item.status === "Pending Approval";
    if (activeCard === "approved") return item.status === "Approved";
    if (activeCard === "rejected") return item.status === "Rejected";
    if (activeCard === "cancelled") return item.status === "Cancelled";
    if (activeCard === "confirmed") return item.status === "Confirmed";
    if (activeCard === "converted") return item.type.includes("Converted");

    return true; // "all" or "my-history"
  });

  const totalCount = 103; // Total mock count matching wireframe
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setJumpPageInput(String(p));
    }
  };

  const handleGoToPage = () => {
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
    } else {
      setJumpPageInput(String(currentPage));
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this draft Purchase Order?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const toggleColumn = (key: POColKey) => {
    if (key === "action" || key === "poNo") return;
    setVisibleCols((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const toggleExpandRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderStatusBadge = (status: PurchaseOrderItem["status"]) => {
    switch (status) {
      case "Submitted":
        return <span className={`${styles.badge} ${styles.badgeSubmitted}`}>Submitted</span>;
      case "Pending Approval":
        return <span className={`${styles.badge} ${styles.badgePending}`}>Pending Approval</span>;
      case "Draft":
        return <span className={`${styles.badge} ${styles.badgeDraft}`}>Draft</span>;
      case "Approved":
        return <span className={`${styles.badge} ${styles.badgeApproved}`}>Approved</span>;
      case "Rejected":
        return <span className={`${styles.badge} ${styles.badgeRejected}`}>Rejected</span>;
      case "Cancelled":
        return <span className={`${styles.badge} ${styles.badgeCancelled}`}>Cancelled</span>;
      case "Confirmed":
        return <span className={`${styles.badge} ${styles.badgeConfirmed}`}>Confirmed</span>;
      case "Converted":
        return <span className={`${styles.badge} ${styles.badgeSubmitted}`}>Converted</span>;
      default:
        return <span className={`${styles.badge} ${styles.badgeDraft}`}>{status}</span>;
    }
  };

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />

        <main className={styles.content}>
          {/* Breadcrumb Navigation */}
          <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink}>
              <Icon icon="lucide:home" width={14} height={14} />
            </Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>Purchase Order</span>
          </nav>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Purchase Order</h1>

            <div className={styles.headerActions}>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className={styles.btnConvertFrom}
                  onClick={() => setIsConvertDropdownOpen((prev) => !prev)}
                >
                  <Icon icon="lucide:refresh-cw" width={15} height={15} />
                  <span>Convert From</span>
                  <Icon icon="lucide:chevron-down" width={14} height={14} />
                </button>

                {isConvertDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <button
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => {
                        setIsConvertDropdownOpen(false);
                        setIsConvertModalOpen(true);
                      }}
                    >
                      <Icon icon="lucide:clipboard-list" width={15} height={15} />
                      <span>Convert From PR</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                className={styles.btnImport}
                onClick={() => setIsImportModalOpen(true)}
              >
                <Icon icon="lucide:upload-cloud" width={15} height={15} />
                <span>Import</span>
              </button>

              <Link href="/purchase-order/new" className={styles.btnCreate}>
                <Icon icon="lucide:plus" width={16} height={16} />
                <span>Create Purchase Order</span>
              </Link>
            </div>
          </div>

          {/* KPI Summary Cards / Listing Toggle (11 Cards) */}
          <StatusSummarySection
            cards={[
              { id: "my-task", label: "My Task", count: 0, amount: "0.00", icon: "lucide:clipboard-edit", color: "#E8692A", bgColor: "#FFF0E8" },
              { id: "my-history", label: "My History", count: 105, amount: "17,013,089.81", icon: "lucide:history", color: "#16A34A", bgColor: "#DCFCE7" },
              { id: "all", label: "All", count: 103, amount: "17,011,565.73", icon: "lucide:list", color: "#16A34A", bgColor: "#DCFCE7" },
              { id: "draft", label: "Draft", count: 7, amount: "3,235,831.00", icon: "lucide:file-text", color: "#16A34A", bgColor: "#DCFCE7" },
              { id: "submitted", label: "Submitted", count: 69, amount: "3,199,993.73", icon: "lucide:send", color: "#16A34A", bgColor: "#DCFCE7" },
              { id: "pending", label: "Pending Approval", count: 27, amount: "10,575,741.00", icon: "lucide:clock", color: "#E8692A", bgColor: "#FFF0E8" },
              { id: "approved", label: "Approved", count: 0, amount: "0.00", icon: "lucide:check-circle-2", color: "#16A34A", bgColor: "#DCFCE7" },
              { id: "rejected", label: "Rejected", count: 0, amount: "0.00", icon: "lucide:x-circle", color: "#E8692A", bgColor: "#FFF0E8" },
              { id: "cancelled", label: "Cancelled", count: 2, amount: "1,524.08", icon: "lucide:ban", color: "#16A34A", bgColor: "#DCFCE7" },
              { id: "confirmed", label: "Confirmed", count: 0, amount: "0.00", icon: "lucide:check-check", color: "#16A34A", bgColor: "#DCFCE7" },
              { id: "converted", label: "Converted", count: 0, amount: "0.00", icon: "lucide:list-checks", color: "#16A34A", bgColor: "#DCFCE7" },
            ]}
            activeId={activeCard}
            onSelect={(card) => setActiveCard(card.id)}
            gridClassName={styles.kpiGrid}
          />

          {/* Filter Bar matching Bills to Pay design */}
          <div className={styles.filterToolbar}>
            <div className={styles.toolbarLeft}>
              {showDateBadge && (
                <div className={styles.filterBadge}>
                  <span>PO Date: <strong>2026-01-01 - 2026-10-01</strong></span>
                  <button
                    type="button"
                    className={styles.filterBadgeClose}
                    onClick={() => setShowDateBadge(false)}
                    aria-label="Remove PO Date filter"
                  >
                    <Icon icon="lucide:x" width={14} height={14} />
                  </button>
                </div>
              )}
            </div>

            <div className={styles.toolbarRight}>
              {/* Column Picker */}
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className={`${styles.colBtn} ${showColPicker ? styles.colBtnActive : ""}`}
                  onClick={() => setShowColPicker((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={showColPicker}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  <span>Columns</span>
                  <span className={styles.colBadge}>
                    {visibleCols.length}
                  </span>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {showColPicker && (
                  <ColumnPicker<POColKey>
                    columns={ALL_PO_COLUMNS}
                    visible={visibleCols}
                    defaultVisible={DEFAULT_VISIBLE_PO_COLS}
                    onChange={(cols) => setVisibleCols(cols)}
                    onClose={() => setShowColPicker(false)}
                  />
                )}
              </div>

              <div className={styles.divider} />

              <button type="button" className={styles.filterBtn}>
                <Icon icon="lucide:filter" width={14} height={14} />
                <span>Filter</span>
              </button>

              <div className={styles.searchBox}>
                <Icon icon="lucide:search" width={14} height={14} className={styles.searchIco} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search by PO No."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table Container Card */}
          <div className={styles.card}>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    {visibleCols.includes("action") && <th className={styles.th}>ACTION</th>}
                    {visibleCols.includes("poNo") && <th className={styles.th}>PO NUMBER</th>}
                    {visibleCols.includes("poDate") && <th className={styles.th}>PO DATE</th>}
                    {visibleCols.includes("status") && <th className={styles.th}>STATUS</th>}
                    {visibleCols.includes("vendor") && <th className={styles.th}>VENDOR / CONTACT</th>}
                    {visibleCols.includes("subTotal") && <th className={styles.th + " " + styles.amountCol}>SUB TOTAL</th>}
                    {visibleCols.includes("totalTax") && <th className={styles.th + " " + styles.amountCol}>TOTAL TAX</th>}
                    {visibleCols.includes("totalAmount") && <th className={styles.th + " " + styles.amountCol}>TOTAL AMOUNT</th>}
                    {visibleCols.includes("sendVia") && <th className={styles.th}>SEND VIA</th>}
                    {visibleCols.includes("notesTerms") && <th className={styles.th}>NOTES / TERMS</th>}
                    {visibleCols.includes("lastModified") && <th className={styles.th}>LAST MODIFIED</th>}
                    {visibleCols.includes("createdDate") && <th className={styles.th}>CREATED DATE</th>}
                    {visibleCols.includes("type") && <th className={styles.th}>TYPE / SOURCE</th>}
                    {visibleCols.includes("prRef") && <th className={styles.th}>PR REF.</th>}
                    <th className={styles.thArrow} />
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={visibleCols.length + 1}
                        className={styles.td}
                        style={{ textAlign: "center", padding: "40px 0", color: "#64748B" }}
                      >
                        No purchase orders found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const isExp = expandedRows.includes(item.id);
                      const hiddenCols = ALL_PO_COLUMNS.filter(
                        (col) => !visibleCols.includes(col.key) && !col.locked
                      );

                      return (
                        <React.Fragment key={item.id}>
                          <tr
                            className={`${styles.tr} ${isExp ? styles.rowExp : ""}`}
                            onClick={() => toggleExpandRow(item.id)}
                            style={{ cursor: "pointer" }}
                          >
                            {visibleCols.includes("action") && (
                              <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                                <div className={styles.actionCell}>
                                  <ActionButton
                                    type="view"
                                    href={`/purchase-order/${item.id}`}
                                    tooltip="View PO Details"
                                  />
                                  <ActionButton
                                    type="edit"
                                    href={`/purchase-order/new?edit=${item.id}`}
                                    tooltip="Edit PO"
                                  />
                                  <ActionButton
                                    type="print"
                                    onClick={() => alert(`Printing ${item.poNo}...`)}
                                    tooltip="Print PO"
                                  />
                                  {item.status === "Draft" && (
                                    <ActionButton
                                      type="delete"
                                      onClick={() => handleDeleteItem(item.id)}
                                      tooltip="Delete Draft PO"
                                    />
                                  )}
                                </div>
                              </td>
                            )}

                            {visibleCols.includes("poNo") && (
                              <td className={styles.td}>
                                <Link href={`/purchase-order/${item.id}`} className={styles.poLink} onClick={(e) => e.stopPropagation()}>
                                  {item.poNo}
                                </Link>
                              </td>
                            )}

                            {visibleCols.includes("poDate") && <td className={styles.td}>{item.poDate}</td>}

                            {visibleCols.includes("status") && (
                              <td className={styles.td}>{renderStatusBadge(item.status)}</td>
                            )}

                            {visibleCols.includes("vendor") && (
                              <td className={styles.td}>
                                <div className={styles.vendorCell}>
                                  <span className={styles.vendorName}>{item.vendorName}</span>
                                  <span className={styles.vendorContact}>{item.contact}</span>
                                </div>
                              </td>
                            )}

                            {visibleCols.includes("subTotal") && (
                              <td className={styles.td + " " + styles.amountCol}>
                                <span className={styles.amountText}>
                                  {item.subTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </span>
                                <span className={styles.currencyText}>SGD</span>
                              </td>
                            )}

                            {visibleCols.includes("totalTax") && (
                              <td className={styles.td + " " + styles.amountCol}>
                                <span className={styles.amountText}>
                                  {item.totalTax.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </span>
                                <span className={styles.currencyText}>SGD</span>
                              </td>
                            )}

                            {visibleCols.includes("totalAmount") && (
                              <td className={styles.td + " " + styles.amountCol}>
                                <span className={styles.amountText}>
                                  {item.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </span>
                                <span className={styles.currencyText}>SGD</span>
                              </td>
                            )}

                            {visibleCols.includes("sendVia") && (
                              <td className={styles.td}>
                                {item.sendVia === "Sent Successful" ? (
                                  <div>
                                    <span>Sent Successful</span>
                                    <div>
                                      <span className={styles.invoicenowBadge}>INVOICENOW</span>
                                    </div>
                                  </div>
                                ) : (
                                  item.sendVia
                                )}
                              </td>
                            )}

                            {visibleCols.includes("notesTerms") && <td className={styles.td}>{item.notesTerms}</td>}

                            {visibleCols.includes("lastModified") && <td className={styles.td}>{item.lastModified}</td>}

                            {visibleCols.includes("createdDate") && <td className={styles.td}>{item.createdDate}</td>}

                            {visibleCols.includes("type") && <td className={styles.td}>{item.type}</td>}

                            {visibleCols.includes("prRef") && <td className={styles.td}>{item.prRef}</td>}

                            <td className={styles.tdArrow}>
                              <span className={`${styles.chevron} ${isExp ? styles.chevronOpen : ""}`}>
                                <Icon icon="lucide:chevron-down" width={15} height={15} />
                              </span>
                            </td>
                          </tr>

                          {/* Hidden Columns Expand Panel matching Bills to Pay */}
                          <tr className={styles.expandTr}>
                            <td colSpan={visibleCols.length + 1} className={styles.expandTd}>
                              <div className={`${styles.panel} ${isExp ? styles.panelOpen : ""}`}>
                                <div className={styles.panelBody}>
                                  {hiddenCols.length > 0 ? (
                                    <div className={styles.panelGrid}>
                                      {hiddenCols.map((col) => {
                                        let val: string = "N/A";
                                        if (col.key === "subTotal") val = `${item.subTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} SGD`;
                                        else if (col.key === "totalTax") val = `${item.totalTax.toLocaleString("en-US", { minimumFractionDigits: 2 })} SGD`;
                                        else if (col.key === "totalAmount") val = `${item.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} SGD`;
                                        else if (col.key === "sendVia") val = item.sendVia;
                                        else if (col.key === "notesTerms") val = item.notesTerms;
                                        else if (col.key === "lastModified") val = item.lastModified;
                                        else if (col.key === "createdDate") val = item.createdDate;
                                        else if (col.key === "type") val = item.type;
                                        else if (col.key === "prRef") val = item.prRef;
                                        else if (col.key === "poDate") val = item.poDate;
                                        else if (col.key === "status") val = item.status;
                                        else if (col.key === "vendor") val = item.vendorName;

                                        return (
                                          <div key={col.key} className={styles.chip}>
                                            <span className={styles.chipLabel}>{col.label}</span>
                                            <span className={styles.chipValue}>{val}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <p className={styles.panelAllVisible}>
                                      All columns are currently visible in the main table.
                                    </p>
                                  )}

                                  <div className={styles.panelActions} onClick={(e) => e.stopPropagation()}>
                                    <Link href={`/purchase-order/${item.id}`} className={styles.btnView}>
                                      <Icon icon="lucide:eye" width={14} height={14} />
                                      View
                                    </Link>
                                    <Link href={`/purchase-order/new?edit=${item.id}`} className={styles.btnEdit}>
                                      <Icon icon="lucide:square-pen" width={14} height={14} />
                                      Edit
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Interactive Pagination Footer */}
            <div className={styles.paginationRow}>
              <div className={styles.paginationLeft}>
                <div className={styles.rowsPerPage}>
                  <span>Rows per page</span>
                  <select
                    className={styles.selectRows}
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <span className={styles.showingText}>Showing 1-10 of {totalCount}</span>
              </div>

              <div className={styles.paginationRight}>
                <div className={styles.goToPageWrap}>
                  <span>Go to page</span>
                  <input
                    type="text"
                    className={styles.pageInput}
                    value={jumpPageInput}
                    onChange={(e) => setJumpPageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleGoToPage();
                    }}
                  />
                  <span>/ {totalPages}</span>
                  <button type="button" className={styles.btnGo} onClick={handleGoToPage}>
                    Go
                  </button>
                </div>

                <div className={styles.pageControls}>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <Icon icon="lucide:chevron-left" width={16} height={16} />
                  </button>

                  {[1, 2, 3, 4, 5].map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`${styles.pageBtn} ${
                        currentPage === pageNum ? styles.pageBtnActive : ""
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    <Icon icon="lucide:chevron-right" width={16} height={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Convert From PR Modal */}
      <ConvertFromPRModal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}
