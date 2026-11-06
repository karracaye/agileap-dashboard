"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ActionButton from "@/components/ActionButton";
import StatusSummarySection from "@/components/StatusSummarySection";
import ColumnPicker from "@/components/ColumnPicker";
import styles from "./page.module.css";

export interface PurchaseRequisitionItem {
  id: string;
  prNo: string;
  location: string;
  department: string;
  requestorName: string;
  requestorEmail: string;
  status: "Submitted" | "Pending Approval" | "Draft" | "Approved" | "Rejected" | "Cancelled";
  subTotal: number;
  totalTax: number;
  totalAmount: number;
  prDate: string;
  createdDate: string;
}

export const ALL_PR_COLUMNS = [
  { key: "action", label: "Action", locked: true },
  { key: "prNo", label: "PR No.", locked: true },
  { key: "department", label: "Department", locked: false },
  { key: "requestor", label: "Requestor", locked: false },
  { key: "status", label: "Status", locked: false },
  { key: "totalAmount", label: "Total Amount", locked: false },
  { key: "location", label: "Location", locked: false },
  { key: "subTotal", label: "Sub Total", locked: false },
  { key: "totalTax", label: "Total Tax", locked: false },
  { key: "prDate", label: "PR Date", locked: false },
  { key: "createdDate", label: "Created Date", locked: false },
] as const;

export type PRColKey = (typeof ALL_PR_COLUMNS)[number]["key"];

const DEFAULT_VISIBLE_PR_COLS: PRColKey[] = [
  "action",
  "prNo",
  "department",
  "requestor",
  "status",
  "totalAmount",
];

const INITIAL_PR_DATA: PurchaseRequisitionItem[] = [
  {
    id: "1",
    prNo: "PR-2026-031",
    location: "Default",
    department: "Super Admin",
    requestorName: "Joshua Lee (Test)",
    requestorEmail: "joshua+1@activants.com",
    status: "Submitted",
    subTotal: 2.00,
    totalTax: 0.18,
    totalAmount: 2.18,
    prDate: "18-Aug-2026",
    createdDate: "18-Aug-2026 05:40:26 PM",
  },
  {
    id: "2",
    prNo: "PRZMTEST003",
    location: "Default",
    department: "Super Admin",
    requestorName: "Joshua Lee (Test)",
    requestorEmail: "joshua+1@activants.com",
    status: "Pending Approval",
    subTotal: 2.00,
    totalTax: 0.18,
    totalAmount: 2.18,
    prDate: "22-Aug-2026",
    createdDate: "23-Aug-2026 07:55:45 AM",
  },
  {
    id: "3",
    prNo: "PRZMTEST002",
    location: "Default",
    department: "Super Admin",
    requestorName: "Joshua Lee (Test)",
    requestorEmail: "joshua+1@activants.com",
    status: "Pending Approval",
    subTotal: 2.00,
    totalTax: 0.18,
    totalAmount: 2.18,
    prDate: "22-Aug-2026",
    createdDate: "23-Aug-2026 07:50:04 AM",
  },
  {
    id: "4",
    prNo: "PRZMTEST001",
    location: "Default",
    department: "Super Admin",
    requestorName: "Joshua Lee (Test)",
    requestorEmail: "joshua+1@activants.com",
    status: "Pending Approval",
    subTotal: 2.00,
    totalTax: 0.18,
    totalAmount: 2.18,
    prDate: "22-Aug-2026",
    createdDate: "23-Aug-2026 07:43:28 AM",
  },
  {
    id: "5",
    prNo: "PR-2026-032",
    location: "Default",
    department: "Super Admin",
    requestorName: "Joshua Lee (Test)",
    requestorEmail: "joshua+1@activants.com",
    status: "Pending Approval",
    subTotal: 88339.86,
    totalTax: 7950.59,
    totalAmount: 96290.45,
    prDate: "14-Aug-2026",
    createdDate: "14-Aug-2026 11:08:41 AM",
  },
  {
    id: "6",
    prNo: "PR-2026-030",
    location: "Default",
    department: "Super Admin",
    requestorName: "Joshua Lee (Test)",
    requestorEmail: "joshua+1@activants.com",
    status: "Submitted",
    subTotal: 647165.40,
    totalTax: 58244.89,
    totalAmount: 705410.29,
    prDate: "14-Aug-2026",
    createdDate: "14-Aug-2026 11:01:29 AM",
  },
  {
    id: "7",
    prNo: "PR-2026-029",
    location: "Default",
    department: "Super Admin",
    requestorName: "Joshua Lee (Test)",
    requestorEmail: "joshua+1@activants.com",
    status: "Submitted",
    subTotal: 304.50,
    totalTax: 27.41,
    totalAmount: 331.91,
    prDate: "14-Aug-2026",
    createdDate: "14-Aug-2026 09:24:21 AM",
  },
  {
    id: "8",
    prNo: "PR-2026-028",
    location: "Default",
    department: "Super Admin",
    requestorName: "Joshua Lee (Test)",
    requestorEmail: "joshua+1@activants.com",
    status: "Submitted",
    subTotal: 304.50,
    totalTax: 27.41,
    totalAmount: 331.91,
    prDate: "14-Aug-2026",
    createdDate: "14-Aug-2026 09:21:30 AM",
  },
  {
    id: "9",
    prNo: "PR-2026-027",
    location: "Default",
    department: "Operations",
    requestorName: "Rachel Lim",
    requestorEmail: "rachel.lim@activants.com",
    status: "Draft",
    subTotal: 25666.22,
    totalTax: 2309.96,
    totalAmount: 27976.18,
    prDate: "12-Aug-2026",
    createdDate: "12-Aug-2026 02:15:10 PM",
  },
  {
    id: "10",
    prNo: "PR-2026-026",
    location: "Default",
    department: "Chartering",
    requestorName: "Priya Nair",
    requestorEmail: "priya.nair@activants.com",
    status: "Rejected",
    subTotal: 3952.00,
    totalTax: 355.68,
    totalAmount: 4307.68,
    prDate: "10-Aug-2026",
    createdDate: "10-Aug-2026 10:30:15 AM",
  },
  {
    id: "11",
    prNo: "PR-2026-025",
    location: "Default",
    department: "Logistics",
    requestorName: "David Tan",
    requestorEmail: "david.tan@activants.com",
    status: "Submitted",
    subTotal: 1500.00,
    totalTax: 135.00,
    totalAmount: 1635.00,
    prDate: "08-Aug-2026",
    createdDate: "08-Aug-2026 04:20:10 PM",
  },
  {
    id: "12",
    prNo: "PR-2026-024",
    location: "Default",
    department: "IT",
    requestorName: "Sarah Chen",
    requestorEmail: "sarah.chen@activants.com",
    status: "Approved",
    subTotal: 4200.00,
    totalTax: 378.00,
    totalAmount: 4578.00,
    prDate: "05-Aug-2026",
    createdDate: "05-Aug-2026 11:15:00 AM",
  },
  {
    id: "13",
    prNo: "PR-2026-023",
    location: "Default",
    department: "Finance",
    requestorName: "Alex Wong",
    requestorEmail: "alex.wong@activants.com",
    status: "Pending Approval",
    subTotal: 12500.00,
    totalTax: 1125.00,
    totalAmount: 13625.00,
    prDate: "03-Aug-2026",
    createdDate: "03-Aug-2026 09:10:30 AM",
  },
  {
    id: "14",
    prNo: "PR-2026-022",
    location: "Default",
    department: "Human Resources",
    requestorName: "Michelle Goh",
    requestorEmail: "michelle.goh@activants.com",
    status: "Draft",
    subTotal: 850.00,
    totalTax: 76.50,
    totalAmount: 926.50,
    prDate: "01-Aug-2026",
    createdDate: "01-Aug-2026 02:45:15 PM",
  },
  {
    id: "15",
    prNo: "PR-2026-021",
    location: "Default",
    department: "Marketing",
    requestorName: "Kevin Teo",
    requestorEmail: "kevin.teo@activants.com",
    status: "Cancelled",
    subTotal: 3100.00,
    totalTax: 279.00,
    totalAmount: 3379.00,
    prDate: "28-Jul-2026",
    createdDate: "28-Jul-2026 01:05:40 PM",
  },
];

const PR_STATUS_CARDS = [
  { id: "my-task", label: "My Task", currency: "SGD", amount: "0.00", count: 0, icon: "lucide:check-square", color: "#E8692A", bgColor: "#FFF0E8" },
  { id: "my-history", label: "My History", currency: "SGD", amount: "2,250,379.37", count: 38, icon: "lucide:history", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "all", label: "All", currency: "SGD", amount: "2,251,029.37", count: 39, icon: "lucide:list", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "draft", label: "Draft", currency: "SGD", amount: "25,666.22", count: 2, icon: "lucide:file-text", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "submitted", label: "Submitted", currency: "SGD", amount: "9,495.00", count: 23, icon: "lucide:send", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "pending-approval", label: "Pending Approval", currency: "SGD", amount: "121,856.08", count: 12, icon: "lucide:clock-3", color: "#E8692A", bgColor: "#FFF0E8" },
  { id: "approved", label: "Approved", currency: "SGD", amount: "0.00", count: 0, icon: "lucide:check-circle-2", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "rejected", label: "Rejected", currency: "SGD", amount: "3,952.00", count: 2, icon: "lucide:x-circle", color: "#E8692A", bgColor: "#FFF0E8" },
  { id: "cancelled", label: "Cancelled", currency: "SGD", amount: "0.00", count: 0, icon: "lucide:ban", color: "#16A34A", bgColor: "#DCFCE7" },
];

export default function PurchaseRequisitionPage() {
  const [activeKpi, setActiveKpi] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCols, setVisibleCols] = useState<PRColKey[]>([...DEFAULT_VISIBLE_PR_COLS]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const toggleExpandRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCol = (colKey: PRColKey) => {
    const colDef = ALL_PR_COLUMNS.find((c) => c.key === colKey);
    if (colDef?.locked) return;

    if (visibleCols.includes(colKey)) {
      if (visibleCols.length <= 2) return;
      setVisibleCols(visibleCols.filter((k) => k !== colKey));
    } else {
      setVisibleCols([...visibleCols, colKey]);
    }
  };

  const handleKpiSelect = (label: string) => {
    setActiveKpi(label);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const filteredPRs = INITIAL_PR_DATA.filter((item) => {
    const matchesSearch =
      item.prNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requestorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeKpi === "All") return true;
    if (activeKpi === "Draft") return item.status === "Draft";
    if (activeKpi === "Submitted") return item.status === "Submitted";
    if (activeKpi === "Pending Approval") return item.status === "Pending Approval";
    if (activeKpi === "Approved") return item.status === "Approved";
    if (activeKpi === "Rejected") return item.status === "Rejected";
    if (activeKpi === "Cancelled") return item.status === "Cancelled";

    return true;
  });

  const totalItems = filteredPRs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);
  const paginatedPRs = filteredPRs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusBadge = (status: PurchaseRequisitionItem["status"]) => {
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
      default:
        return <span className={styles.badge}>{status}</span>;
    }
  };

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>
          {/* Breadcrumb Navigation */}
          <div className={styles.breadcrumbNav}>
            <Link href="/" className={styles.breadcrumbLink}>
              <Icon icon="lucide:home" width={14} />
            </Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>Purchase Requisition</span>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Purchase Requisition</h1>
            <div className={styles.headerActions}>
              <button type="button" className={styles.btnOutline}>
                <Icon icon="lucide:download" width={16} />
                <span>Import</span>
              </button>
              <Link href="/purchase-requisition/new" className={styles.btnCreate}>
                <Icon icon="lucide:plus" width={16} />
                <span>Create Purchase Requisition</span>
              </Link>
            </div>
          </div>

          {/* KPI Summary Cards / Listing Toggle */}
          <StatusSummarySection
            cards={PR_STATUS_CARDS}
            activeId={activeKpi}
            matchBy="label"
            onSelect={(card) => handleKpiSelect(card.label)}
            gridClassName={styles.kpiGrid}
          />

          {/* Filter Toolbar with Column Management */}
          <div className={styles.filterToolbar}>
            <div className={styles.toolbarLeft}>
              {visibleCols.length < ALL_PR_COLUMNS.length && (
                <span className={styles.columnSummaryHint}>
                  Showing {visibleCols.length} of {ALL_PR_COLUMNS.length} columns (expand rows to view hidden details)
                </span>
              )}
            </div>

            <div className={styles.toolbarRight}>
              {/* Column Picker Button & Popover */}
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className={`${styles.colBtn} ${pickerOpen ? styles.colBtnActive : ""}`}
                  onClick={() => setPickerOpen((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={pickerOpen}
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

                {pickerOpen && (
                  <ColumnPicker<PRColKey>
                    columns={ALL_PR_COLUMNS}
                    visible={visibleCols}
                    defaultVisible={DEFAULT_VISIBLE_PR_COLS}
                    onChange={(cols) => {
                      setVisibleCols(cols);
                      setShowToast(true);
                    }}
                    onClose={() => setPickerOpen(false)}
                  />
                )}
              </div>

              <div className={styles.divider} />

              <button type="button" className={styles.filterBtn}>
                <Icon icon="lucide:filter" width={14} />
                <span>Filter</span>
              </button>

              <div className={styles.searchBox}>
                <Icon icon="lucide:search" width={14} className={styles.searchIco} />
                <input
                  type="text"
                  placeholder="Search by keywords"
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Listing Table Container Card */}
          <div className={styles.card}>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    {visibleCols.includes("action") && <th className={styles.th}>Action</th>}
                    {visibleCols.includes("prNo") && <th className={styles.th}>PR No. ↓</th>}
                    {visibleCols.includes("location") && <th className={styles.th}>Location ↓</th>}
                    {visibleCols.includes("department") && <th className={styles.th}>Department ↓</th>}
                    {visibleCols.includes("requestor") && <th className={styles.th}>Requestor ↓</th>}
                    {visibleCols.includes("status") && <th className={styles.th} style={{ color: "#E8692A" }}>Status ↑</th>}
                    {visibleCols.includes("subTotal") && (
                      <th className={styles.th} style={{ textAlign: "right" }}>Sub Total ↓</th>
                    )}
                    {visibleCols.includes("totalTax") && (
                      <th className={styles.th} style={{ textAlign: "right" }}>Total Tax ↓</th>
                    )}
                    {visibleCols.includes("totalAmount") && (
                      <th className={styles.th} style={{ textAlign: "right" }}>Total Amount ↓</th>
                    )}
                    {visibleCols.includes("prDate") && <th className={styles.th}>PR Date ↓</th>}
                    {visibleCols.includes("createdDate") && <th className={styles.th}>Created Date ↓</th>}
                    <th className={styles.thArrow} />
                  </tr>
                </thead>
                <tbody>
                  {paginatedPRs.map((item) => {
                    const isExp = expandedRows.includes(item.id);
                    const hiddenCols = ALL_PR_COLUMNS.filter(
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
                                  href={`/purchase-requisition/${item.prNo}`}
                                  tooltip="View PR"
                                  size={28}
                                  iconSize={14}
                                />
                                <ActionButton
                                  type="edit"
                                  href="/purchase-requisition/new"
                                  tooltip="Edit PR"
                                  size={28}
                                  iconSize={14}
                                />
                                <ActionButton
                                  type="print"
                                  onClick={() => window.print()}
                                  tooltip="Print PR"
                                  size={28}
                                  iconSize={14}
                                />
                              </div>
                            </td>
                          )}
                          {visibleCols.includes("prNo") && (
                            <td className={styles.td}>
                              <Link href={`/purchase-requisition/${item.prNo}`} className={styles.prLink} onClick={(e) => e.stopPropagation()}>
                                {item.prNo}
                              </Link>
                            </td>
                          )}
                          {visibleCols.includes("location") && <td className={styles.td}>{item.location}</td>}
                          {visibleCols.includes("department") && <td className={styles.td}>{item.department}</td>}
                          {visibleCols.includes("requestor") && (
                            <td className={styles.td}>
                              <div className={styles.requestorCell}>
                                <span className={styles.requestorName}>{item.requestorName}</span>
                                <span className={styles.requestorEmail}>({item.requestorEmail})</span>
                              </div>
                            </td>
                          )}
                          {visibleCols.includes("status") && <td className={styles.td}>{getStatusBadge(item.status)}</td>}
                          {visibleCols.includes("subTotal") && (
                            <td className={styles.td} style={{ textAlign: "right" }}>
                              <span className={styles.amountText}>
                                {item.subTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </span>{" "}
                              <span style={{ fontSize: "11px", color: "#64748B" }}>SGD</span>
                            </td>
                          )}
                          {visibleCols.includes("totalTax") && (
                            <td className={styles.td} style={{ textAlign: "right" }}>
                              <span className={styles.amountText}>
                                {item.totalTax.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </span>{" "}
                              <span style={{ fontSize: "11px", color: "#64748B" }}>SGD</span>
                            </td>
                          )}
                          {visibleCols.includes("totalAmount") && (
                            <td className={styles.td} style={{ textAlign: "right" }}>
                              <span className={styles.amountText}>
                                {item.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </span>{" "}
                              <span style={{ fontSize: "11px", color: "#64748B" }}>SGD</span>
                            </td>
                          )}
                          {visibleCols.includes("prDate") && <td className={styles.td}>{item.prDate}</td>}
                          {visibleCols.includes("createdDate") && <td className={styles.td}>{item.createdDate}</td>}

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
                                      if (col.key === "location") val = item.location;
                                      else if (col.key === "department") val = item.department;
                                      else if (col.key === "requestor") val = `${item.requestorName} (${item.requestorEmail})`;
                                      else if (col.key === "status") val = item.status;
                                      else if (col.key === "subTotal") val = `${item.subTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} SGD`;
                                      else if (col.key === "totalTax") val = `${item.totalTax.toLocaleString("en-US", { minimumFractionDigits: 2 })} SGD`;
                                      else if (col.key === "totalAmount") val = `${item.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} SGD`;
                                      else if (col.key === "prDate") val = item.prDate;
                                      else if (col.key === "createdDate") val = item.createdDate;

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
                                  <Link href={`/purchase-requisition/${item.prNo}`} className={styles.btnView}>
                                    <Icon icon="lucide:eye" width={14} height={14} />
                                    View
                                  </Link>
                                  <Link href="/purchase-requisition/new" className={styles.btnEdit}>
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
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className={styles.paginationRow}>
              <div className={styles.rowsPerPage}>
                <span>Rows per page</span>
                <select
                  className={styles.selectRows}
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className={styles.showingText}>
                  Showing {startIndex}–{endIndex} of {totalItems} items
                </span>
              </div>

              <div className={styles.pageControls}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  title="Previous page"
                >
                  <Icon icon="lucide:chevron-left" width={15} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`${styles.pageBtn} ${currentPage === pageNum ? styles.pageBtnActive : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={currentPage === totalPages || totalItems === 0}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  title="Next page"
                >
                  <Icon icon="lucide:chevron-right" width={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Toast Notification matching media_1791451857117.png */}
          {showToast && (
            <div className={styles.toastNotice}>
              <span className={styles.toastIcon}>
                <Icon icon="lucide:check-circle-2" width={16} />
              </span>
              <span>Filter update successfully.</span>
              <button
                type="button"
                className={styles.toastClose}
                onClick={() => setShowToast(false)}
                title="Dismiss"
              >
                <Icon icon="lucide:x" width={14} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
