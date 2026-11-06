"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ActionButton from "@/components/ActionButton";
import StatusSummarySection from "@/components/StatusSummarySection";
import ConvertFromPOModal from "@/components/ConvertFromPOModal";
import ColumnPicker from "@/components/ColumnPicker";
import styles from "./page.module.css";

export interface GoodsReceiptItem {
  id: string;
  grnNo: string;
  type: string;
  location: string;
  poRef: string;
  vendorName: string;
  receiverName: string;
  receiverEmail: string;
  status: "Draft" | "Submitted" | "Incoming" | "Approved" | "Rejected" | "Cancelled";
  receiptDate: string;
  createdDate: string;
  lastModified: string;
}

export const ALL_GRN_COLUMNS = [
  { key: "action", label: "Action", locked: true },
  { key: "grnNo", label: "GRN No.", locked: true },
  { key: "type", label: "Type", locked: false },
  { key: "location", label: "Location", locked: false },
  { key: "poRef", label: "PO Ref.", locked: false },
  { key: "vendorName", label: "Vendor Name", locked: false },
  { key: "receiver", label: "Receiver", locked: false },
  { key: "status", label: "Status", locked: false },
  { key: "receiptDate", label: "Receipt Date", locked: false },
  { key: "createdDate", label: "Created Date", locked: false },
  { key: "lastModified", label: "Last Modified", locked: false },
] as const;

export type GRNColKey = (typeof ALL_GRN_COLUMNS)[number]["key"];

const DEFAULT_VISIBLE_GRN_COLS: GRNColKey[] = [
  "action",
  "grnNo",
  "poRef",
  "vendorName",
  "status",
  "receiptDate",
];

const INITIAL_GRN_DATA: GoodsReceiptItem[] = [
  {
    id: "1",
    grnNo: "DF-20251211-005710098",
    type: "N/A",
    location: "C300 (C300)",
    poRef: "PO-2026-117",
    vendorName: "Acme Inc. (ACM001)",
    receiverName: "Joshua Lee (Test)",
    receiverEmail: "joshua+1@activants.com",
    status: "Draft",
    receiptDate: "11-Dec-2025",
    createdDate: "11-Dec-2025 08:57:14 AM",
    lastModified: "15-Aug-2026 12:17:06 PM",
  },
  {
    id: "2",
    grnNo: "GR-2026-036",
    type: "Converted from PO",
    location: "N/A",
    poRef: "PO-2026-123",
    vendorName: "BW LPG (ACT011)",
    receiverName: "N/A",
    receiverEmail: "",
    status: "Draft",
    receiptDate: "15-Aug-2026",
    createdDate: "15-Aug-2026 12:15:13 PM",
    lastModified: "15-Aug-2026 12:15:13 PM",
  },
  {
    id: "3",
    grnNo: "GR-2026-035",
    type: "Converted from PO",
    location: "N/A",
    poRef: "PO-2026-136",
    vendorName: "BW LNG (BWL001)",
    receiverName: "N/A",
    receiverEmail: "",
    status: "Draft",
    receiptDate: "15-Aug-2026",
    createdDate: "15-Aug-2026 12:10:19 PM",
    lastModified: "15-Aug-2026 12:10:19 PM",
  },
  {
    id: "4",
    grnNo: "GR-2026-034",
    type: "N/A",
    location: "Default",
    poRef: "N/A",
    vendorName: "Activants (ACT006)",
    receiverName: "Joshua Lee (Test)",
    receiverEmail: "joshua+1@activants.com",
    status: "Submitted",
    receiptDate: "15-Aug-2026",
    createdDate: "15-Aug-2026 11:53:06 AM",
    lastModified: "15-Aug-2026 11:53:06 AM",
  },
  {
    id: "5",
    grnNo: "GR-2026-033",
    type: "Converted from PO",
    location: "Default",
    poRef: "PO-2026-129",
    vendorName: "NAM LEONG CO PTE. LTD. (NAM001)",
    receiverName: "N/A",
    receiverEmail: "",
    status: "Submitted",
    receiptDate: "14-Aug-2026",
    createdDate: "14-Aug-2026 11:14:58 AM",
    lastModified: "14-Aug-2026 11:16:03 AM",
  },
  {
    id: "6",
    grnNo: "GR-2026-032",
    type: "From agileap",
    location: "N/A",
    poRef: "PO-2026-127",
    vendorName: "CMH PTE LTD",
    receiverName: "N/A",
    receiverEmail: "",
    status: "Incoming",
    receiptDate: "14-Aug-2026",
    createdDate: "14-Aug-2026 09:51:16 AM",
    lastModified: "14-Aug-2026 09:51:16 AM",
  },
  {
    id: "7",
    grnNo: "GR-2026-031",
    type: "Converted from PO",
    location: "Default",
    poRef: "PO-2026-126",
    vendorName: "GrandCentral Engineering Pte Ltd (GRA001)",
    receiverName: "N/A",
    receiverEmail: "",
    status: "Submitted",
    receiptDate: "13-Aug-2026",
    createdDate: "13-Aug-2026 04:27:20 PM",
    lastModified: "13-Aug-2026 04:28:43 PM",
  },
  {
    id: "8",
    grnNo: "GR-2026-030",
    type: "Converted from PO",
    location: "Singapore",
    poRef: "PO-2026-077",
    vendorName: "Acme Inc.",
    receiverName: "Kitz Cali",
    receiverEmail: "calimbas+11@activants.com",
    status: "Submitted",
    receiptDate: "19-May-2026",
    createdDate: "19-May-2026 02:42:36 AM",
    lastModified: "19-May-2026 03:17:20 AM",
  },
  {
    id: "9",
    grnNo: "GR-2026-029",
    type: "Converted to IR",
    location: "Default",
    poRef: "PO-2026-071",
    vendorName: "CMH PTE LTD (CMH1)",
    receiverName: "Joshua Lee (Test)",
    receiverEmail: "joshua+1@activants.com",
    status: "Submitted",
    receiptDate: "17-Apr-2026",
    createdDate: "17-Apr-2026 11:40:58 AM",
    lastModified: "13-May-2026 03:12:03 PM",
  },
  {
    id: "10",
    grnNo: "GR-2026-028",
    type: "Converted from PO",
    location: "Default",
    poRef: "PO-2026-069",
    vendorName: "CMH PTE LTD (CMH1)",
    receiverName: "Joshua Lee (Test)",
    receiverEmail: "joshua+1@activants.com",
    status: "Submitted",
    receiptDate: "15-Apr-2026",
    createdDate: "15-Apr-2026 03:11:11 PM",
    lastModified: "13-May-2026 03:12:02 PM",
  },
  {
    id: "11",
    grnNo: "GR-2026-027",
    type: "Converted from PO",
    location: "Default",
    poRef: "PO-2026-065",
    vendorName: "Singapore Logistics Pte Ltd",
    receiverName: "David Tan",
    receiverEmail: "david.tan@activants.com",
    status: "Approved",
    receiptDate: "10-Apr-2026",
    createdDate: "10-Apr-2026 09:15:20 AM",
    lastModified: "10-Apr-2026 10:00:00 AM",
  },
  {
    id: "12",
    grnNo: "GR-2026-026",
    type: "N/A",
    location: "Default",
    poRef: "PO-2026-060",
    vendorName: "TechCorp Global (TCG001)",
    receiverName: "Sarah Chen",
    receiverEmail: "sarah.chen@activants.com",
    status: "Rejected",
    receiptDate: "05-Apr-2026",
    createdDate: "05-Apr-2026 02:10:45 PM",
    lastModified: "06-Apr-2026 09:30:10 AM",
  },
  {
    id: "13",
    grnNo: "GR-2026-025",
    type: "From agileap",
    location: "Default",
    poRef: "PO-2026-058",
    vendorName: "Global Trade Inc.",
    receiverName: "N/A",
    receiverEmail: "",
    status: "Cancelled",
    receiptDate: "01-Apr-2026",
    createdDate: "01-Apr-2026 11:20:00 AM",
    lastModified: "02-Apr-2026 04:15:30 PM",
  },
  {
    id: "14",
    grnNo: "GR-2026-024",
    type: "Converted from PO",
    location: "Default",
    poRef: "PO-2026-055",
    vendorName: "Maritime Supplies Ltd",
    receiverName: "Alex Wong",
    receiverEmail: "alex.wong@activants.com",
    status: "Submitted",
    receiptDate: "28-Mar-2026",
    createdDate: "28-Mar-2026 04:45:10 PM",
    lastModified: "29-Mar-2026 08:30:00 AM",
  },
  {
    id: "15",
    grnNo: "GR-2026-023",
    type: "Converted to IR",
    location: "Singapore",
    poRef: "PO-2026-050",
    vendorName: "Pacific Ocean Traders",
    receiverName: "Michelle Goh",
    receiverEmail: "michelle.goh@activants.com",
    status: "Approved",
    receiptDate: "20-Mar-2026",
    createdDate: "20-Mar-2026 10:00:00 AM",
    lastModified: "21-Mar-2026 11:15:00 AM",
  },
];

const GRN_STATUS_CARDS = [
  { id: "my-task", label: "My Task", currency: "SGD", amount: "0.00", count: 0, icon: "lucide:check-square", color: "#E8692A", bgColor: "#FFF0E8" },
  { id: "my-history", label: "My History", currency: "SGD", amount: "32,059.59", count: 39, icon: "lucide:history", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "all", label: "All", currency: "SGD", amount: "33,211.39", count: 39, icon: "lucide:list", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "duplicated", label: "Duplicated", currency: "SGD", amount: "0.00", count: 0, icon: "lucide:copy", color: "#E8692A", bgColor: "#FFF0E8" },
  { id: "draft", label: "Draft", currency: "SGD", amount: "0.00", count: 13, icon: "lucide:file-text", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "submitted", label: "Submitted", currency: "SGD", amount: "33,211.39", count: 25, icon: "lucide:send", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "pending-approval", label: "Pending Approval", currency: "SGD", amount: "0.00", count: 0, icon: "lucide:clock-3", color: "#E8692A", bgColor: "#FFF0E8" },
  { id: "approved", label: "Approved", currency: "SGD", amount: "0.00", count: 0, icon: "lucide:check-circle-2", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "rejected", label: "Rejected", currency: "SGD", amount: "0.00", count: 0, icon: "lucide:x-circle", color: "#E8692A", bgColor: "#FFF0E8" },
  { id: "cancelled", label: "Cancelled", currency: "USD", amount: "5.50", count: 1, icon: "lucide:ban", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "validating", label: "Validating", currency: "SGD", amount: "0.00", count: 0, icon: "lucide:file-search", color: "#E8692A", bgColor: "#FFF0E8" },
  { id: "awaiting-payment", label: "Awaiting Payment", currency: "SGD", amount: "0.00", count: 0, icon: "lucide:hourglass", color: "#E8692A", bgColor: "#FFF0E8" },
  { id: "incoming", label: "Incoming/Created", currency: "SGD", amount: "304.50", count: 1, icon: "lucide:mail", color: "#16A34A", bgColor: "#DCFCE7" },
];

export default function GoodsReceiptPage() {
  const [activeKpi, setActiveKpi] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCols, setVisibleCols] = useState<GRNColKey[]>([...DEFAULT_VISIBLE_GRN_COLS]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [convertMenuOpen, setConvertMenuOpen] = useState(false);
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpPageInput, setJumpPageInput] = useState<string>("1");

  const toggleCol = (colKey: GRNColKey) => {
    const colDef = ALL_GRN_COLUMNS.find((c) => c.key === colKey);
    if (colDef?.locked) return;

    if (visibleCols.includes(colKey)) {
      if (visibleCols.length <= 2) return;
      setVisibleCols(visibleCols.filter((k) => k !== colKey));
    } else {
      setVisibleCols([...visibleCols, colKey]);
    }
  };

  const toggleExpandRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleKpiSelect = (label: string) => {
    setActiveKpi(label);
    setCurrentPage(1);
    setJumpPageInput("1");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setJumpPageInput("1");
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    setJumpPageInput("1");
  };

  const filteredGRNs = INITIAL_GRN_DATA.filter((item) => {
    const matchesSearch =
      item.grnNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.receiverName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeKpi === "All") return true;
    if (activeKpi === "Draft") return item.status === "Draft";
    if (activeKpi === "Submitted") return item.status === "Submitted";
    if (activeKpi === "Incoming/Created" || activeKpi === "Incoming") return item.status === "Incoming";
    if (activeKpi === "Approved") return item.status === "Approved";
    if (activeKpi === "Rejected") return item.status === "Rejected";
    if (activeKpi === "Cancelled") return item.status === "Cancelled";

    return true;
  });

  const totalItems = filteredGRNs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);
  const paginatedGRNs = filteredGRNs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpPageInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setCurrentPage(parsed);
    } else {
      setJumpPageInput(String(currentPage));
    }
  };

  const getStatusBadge = (status: GoodsReceiptItem["status"]) => {
    switch (status) {
      case "Submitted":
        return <span className={`${styles.badge} ${styles.badgeSubmitted}`}>Submitted</span>;
      case "Draft":
        return <span className={`${styles.badge} ${styles.badgeDraft}`}>Draft</span>;
      case "Incoming":
        return <span className={`${styles.badge} ${styles.badgeIncoming}`}>Incoming</span>;
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
            <span className={styles.breadcrumbCurrent}>Goods Receipt</span>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Goods Receipt</h1>
            <div className={styles.headerActions}>
              {/* Convert From Dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className={styles.btnConvertFrom}
                  onClick={() => setConvertMenuOpen((prev) => !prev)}
                >
                  <Icon icon="lucide:refresh-cw" width={14} />
                  <span>Convert From</span>
                  <Icon icon="lucide:chevron-down" width={12} />
                </button>

                {convertMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      right: 0,
                      zIndex: 100,
                      background: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "10px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      padding: "8px 0",
                      width: "180px",
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "100%",
                        padding: "8px 16px",
                        border: "none",
                        background: "none",
                        fontSize: "13px",
                        color: "#334155",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                      onClick={() => {
                        setConvertMenuOpen(false);
                        setPoModalOpen(true);
                      }}
                    >
                      <Icon icon="lucide:shopping-cart" width={14} /> Convert From PO
                    </button>
                    <button
                      type="button"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "100%",
                        padding: "8px 16px",
                        border: "none",
                        background: "none",
                        fontSize: "13px",
                        color: "#334155",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                      onClick={() => alert("Converting from Purchase Requisition...")}
                    >
                      <Icon icon="lucide:clipboard-list" width={14} /> Convert From PR
                    </button>
                  </div>
                )}
              </div>

              {/* Import Button */}
              <button type="button" className={styles.btnImport}>
                <Icon icon="lucide:download" width={16} />
                <span>Import</span>
              </button>

              {/* Create GRN Button */}
              <Link href="/goods-receipt/new" className={styles.btnCreate}>
                <Icon icon="lucide:plus" width={16} />
                <span>Create GRN</span>
              </Link>
            </div>
          </div>

          {/* KPI Summary Cards / Listing Toggle (13 status cards) */}
          <StatusSummarySection
            cards={GRN_STATUS_CARDS}
            activeId={activeKpi}
            matchBy="label"
            onSelect={(card) => handleKpiSelect(card.label)}
            gridClassName={styles.kpiGrid}
          />

          {/* Filter Toolbar with Column Management */}
          <div className={styles.filterToolbar}>
            <div className={styles.toolbarLeft} />

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
                  <ColumnPicker<GRNColKey>
                    columns={ALL_GRN_COLUMNS}
                    visible={visibleCols}
                    defaultVisible={DEFAULT_VISIBLE_GRN_COLS}
                    onChange={(cols) => setVisibleCols(cols)}
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
                  placeholder="Search by GRN No."
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
                    {visibleCols.includes("action") && <th className={styles.th}>ACTION</th>}
                    {visibleCols.includes("grnNo") && <th className={styles.th}>GRN NUMBER</th>}
                    {visibleCols.includes("type") && <th className={styles.th}>TYPE / SOURCE</th>}
                    {visibleCols.includes("location") && <th className={styles.th}>LOCATION</th>}
                    {visibleCols.includes("poRef") && <th className={styles.th}>PO REF.</th>}
                    {visibleCols.includes("vendorName") && <th className={styles.th}>VENDOR / CONTACT</th>}
                    {visibleCols.includes("receiver") && <th className={styles.th}>RECEIVER</th>}
                    {visibleCols.includes("status") && <th className={styles.th}>STATUS</th>}
                    {visibleCols.includes("receiptDate") && <th className={styles.th}>RECEIPT DATE</th>}
                    {visibleCols.includes("createdDate") && <th className={styles.th}>CREATED DATE</th>}
                    {visibleCols.includes("lastModified") && <th className={styles.th}>LAST MODIFIED</th>}
                    <th className={styles.thArrow} />
                  </tr>
                </thead>
                <tbody>
                  {paginatedGRNs.map((item) => {
                    const isExp = expandedRows.includes(item.id);
                    const hiddenCols = ALL_GRN_COLUMNS.filter(
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
                                  href={`/goods-receipt/${item.grnNo}`}
                                  tooltip="View GRN"
                                  size={28}
                                  iconSize={14}
                                />
                                <ActionButton
                                  type="edit"
                                  href="/goods-receipt/new"
                                  tooltip="Edit GRN"
                                  size={28}
                                  iconSize={14}
                                />
                                <ActionButton
                                  type="print"
                                  onClick={() => window.print()}
                                  tooltip="Print GRN"
                                  size={28}
                                  iconSize={14}
                                />
                                <ActionButton
                                  type="delete"
                                  onClick={() => alert(`Deleting GRN ${item.grnNo}`)}
                                  tooltip="Delete GRN"
                                  size={28}
                                  iconSize={14}
                                />
                              </div>
                            </td>
                          )}
                          {visibleCols.includes("grnNo") && (
                            <td className={styles.td}>
                              <Link href={`/goods-receipt/${item.grnNo}`} className={styles.grnLink} onClick={(e) => e.stopPropagation()}>
                                {item.grnNo}
                              </Link>
                            </td>
                          )}
                          {visibleCols.includes("type") && <td className={styles.td}>{item.type}</td>}
                          {visibleCols.includes("location") && <td className={styles.td}>{item.location}</td>}
                          {visibleCols.includes("poRef") && <td className={styles.td}>{item.poRef}</td>}
                          {visibleCols.includes("vendorName") && <td className={styles.td}>{item.vendorName}</td>}
                          {visibleCols.includes("receiver") && (
                            <td className={styles.td}>
                              {item.receiverName !== "N/A" ? (
                                <div className={styles.receiverCell}>
                                  <span className={styles.receiverName}>{item.receiverName}</span>
                                  {item.receiverEmail && (
                                    <span className={styles.receiverEmail}>({item.receiverEmail})</span>
                                  )}
                                </div>
                              ) : (
                                <span>N/A</span>
                              )}
                            </td>
                          )}
                          {visibleCols.includes("status") && <td className={styles.td}>{getStatusBadge(item.status)}</td>}
                          {visibleCols.includes("receiptDate") && <td className={styles.td}>{item.receiptDate}</td>}
                          {visibleCols.includes("createdDate") && <td className={styles.td}>{item.createdDate}</td>}
                          {visibleCols.includes("lastModified") && <td className={styles.td}>{item.lastModified}</td>}

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
                                      if (col.key === "type") val = item.type;
                                      else if (col.key === "location") val = item.location;
                                      else if (col.key === "poRef") val = item.poRef;
                                      else if (col.key === "vendorName") val = item.vendorName;
                                      else if (col.key === "receiver") val = item.receiverName !== "N/A" ? `${item.receiverName} (${item.receiverEmail})` : "N/A";
                                      else if (col.key === "status") val = item.status;
                                      else if (col.key === "receiptDate") val = item.receiptDate;
                                      else if (col.key === "createdDate") val = item.createdDate;
                                      else if (col.key === "lastModified") val = item.lastModified;

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
                                  <Link href={`/goods-receipt/${item.grnNo}`} className={styles.btnView}>
                                    <Icon icon="lucide:eye" width={14} height={14} />
                                    View
                                  </Link>
                                  <Link href="/goods-receipt/new" className={styles.btnEdit}>
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

            {/* Pagination Controls Footer (matching image 2) */}
            <div className={styles.paginationRow}>
              <div className={styles.paginationLeft}>
                <div className={styles.rowsPerPage}>
                  <span>Rows per page</span>
                  <select
                    className={styles.selectRows}
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <span className={styles.showingText}>
                  Showing {startIndex}-{endIndex} of {totalItems}
                </span>
              </div>

              <div className={styles.paginationRight}>
                {/* Jump to Page Input Form */}
                <form onSubmit={handleGoToPage} className={styles.goToPageWrap}>
                  <span>Go to page</span>
                  <input
                    type="text"
                    className={styles.pageInput}
                    value={jumpPageInput}
                    onChange={(e) => setJumpPageInput(e.target.value)}
                  />
                  <span>/ {totalPages}</span>
                  <button type="submit" className={styles.btnGo}>
                    Go
                  </button>
                </form>

                {/* Page Number Buttons */}
                <div className={styles.pageControls}>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    disabled={currentPage === 1}
                    onClick={() => {
                      const prev = Math.max(1, currentPage - 1);
                      setCurrentPage(prev);
                      setJumpPageInput(String(prev));
                    }}
                    title="Previous page"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`${styles.pageBtn} ${currentPage === pageNum ? styles.pageBtnActive : ""}`}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        setJumpPageInput(String(pageNum));
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className={styles.pageBtn}
                    disabled={currentPage === totalPages || totalItems === 0}
                    onClick={() => {
                      const next = Math.min(totalPages, currentPage + 1);
                      setCurrentPage(next);
                      setJumpPageInput(String(next));
                    }}
                    title="Next page"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Convert From PO Modal */}
      <ConvertFromPOModal
        isOpen={poModalOpen}
        onClose={() => setPoModalOpen(false)}
      />
    </div>
  );
}
