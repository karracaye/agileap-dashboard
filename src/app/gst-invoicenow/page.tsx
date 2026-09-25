"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import GSTConfigurationModal from "@/components/GSTConfigurationModal";
import SendToIRASModal from "@/components/SendToIRASModal";
import RealtimeSubmissionAlertModal from "@/components/RealtimeSubmissionAlertModal";
import GSTDocumentInfoDrawer from "@/components/GSTDocumentInfoDrawer";
import ActionButton from "@/components/ActionButton";
import styles from "./page.module.css";

/* ── STATUS CARDS DATA ──────────────────────────────────── */
const CARDS = [
  { id: "all", label: "All", count: 477, amount: "249,747.19", icon: "lucide:copy", color: "#2563eb", bg: "#eff6ff" },
  { id: "invoice", label: "Invoice", count: 415, amount: "233,005.37", icon: "lucide:file-text", color: "#7c3aed", bg: "#f5f3ff" },
  { id: "bills-to-pay", label: "Bills To Pay", count: 29, amount: "6,721.00", icon: "lucide:wallet", color: "#e8692a", bg: "#fff3ee" },
  { id: "credit-note", label: "Credit Note", count: 20, amount: "7,561.03", icon: "lucide:file-check-2", color: "#16a34a", bg: "#f0fdf4" },
  { id: "vendor-credit-note", label: "Vendor Credit Note", count: 5, amount: "1,932.39", icon: "lucide:file-minus", color: "#dc2626", bg: "#fef2f2" },
  { id: "claims", label: "Claims / Petty Cash", count: 8, amount: "527.40", icon: "lucide:wallet-cards", color: "#9333ea", bg: "#faf5ff" },
];

/* ── COLUMN DEFINITIONS ─────────────────────────────────── */
const ALL_COLUMNS = [
  { key: "no", label: "No.", locked: true },
  { key: "docNo", label: "Document No.", locked: true },
  { key: "type", label: "Type", locked: false },
  { key: "subTotal", label: "Sub Total", locked: false },
  { key: "taxAmount", label: "Tax Amount", locked: false },
  { key: "totalAmount", label: "Total Amount (Incl Tax)", locked: false },
  { key: "dualStatus", label: "InvoiceNow / IRAS Status", locked: false },
  { key: "status", label: "Status", locked: false },
  { key: "outcome", label: "Outcome", locked: false },
  { key: "docHash", label: "Doc Hash", locked: false },
  { key: "gstTransId", label: "GST InvoiceNow Trans. ID", locked: false },
  { key: "peppolTransId", label: "InvoiceNow / Peppol Trans. ID", locked: false },
  { key: "acknowledgementId", label: "Acknowledgement ID", locked: false },
  { key: "filedDate", label: "Filed Date", locked: false },
  { key: "submissionDate", label: "Submission Date", locked: false },
  { key: "createdDate", label: "Created Date", locked: false },
] as const;

type ColKey = typeof ALL_COLUMNS[number]["key"];

const DEFAULT_VISIBLE: ColKey[] = [
  "no",
  "docNo",
  "type",
  "totalAmount",
  "dualStatus",
  "outcome",
];

/* ── UAT DATA ROWS ──────────────────────────────────────── */
const ALL_ROWS = [
  {
    no: 1,
    docNo: "INV/202608/0032",
    type: "Invoice",
    typeKey: "invoice",
    subTotal: "187.00",
    taxAmount: "0.00",
    totalAmount: "187.00",
    status: "Filed",
    outcome: "SUCCESS",
    docHash: "c9d...bbb",
    gstTransId: "b018cf-4ebd-42a8-908a-12d6623e63",
    peppolTransId: "80a0db49-108a-4527-93b8-12a00281b741",
    acknowledgementId: "260827-3e3759c1-ea19-48c4-94c9-b7b26067e216-s001",
    filedDate: "28-Aug-2026",
    submissionDate: "27-Aug-2026",
    createdDate: "27-Aug-2026"
  },
  {
    no: 2,
    docNo: "INV-2026-028",
    type: "Bills To Pay",
    typeKey: "bills-to-pay",
    subTotal: "70.20",
    taxAmount: "0.00",
    totalAmount: "70.20",
    status: "Pending",
    outcome: "-",
    docHash: "720...6b",
    gstTransId: "4ace4f-51b0-42a4-862f-aa327d1e93",
    peppolTransId: "-",
    acknowledgementId: "-",
    filedDate: "-",
    submissionDate: "26-Aug-2026",
    createdDate: "26-Aug-2026"
  },
  {
    no: 3,
    docNo: "INV/202608/0031",
    type: "Invoice",
    typeKey: "invoice",
    subTotal: "10.20",
    taxAmount: "0.00",
    totalAmount: "10.20",
    status: "Filed",
    outcome: "SUCCESS",
    docHash: "689...95",
    gstTransId: "alcc44-de16-4d5c-bf18-5c30a2646b",
    peppolTransId: "43f0221a-8bfa-4b13-9c18-40421a711022",
    acknowledgementId: "260825-2bc58555-0a77-452e-bd14-397807202df6-s001",
    filedDate: "26-Aug-2026",
    submissionDate: "25-Aug-2026",
    createdDate: "25-Aug-2026"
  },
  {
    no: 4,
    docNo: "NA",
    type: "Bills To Pay",
    typeKey: "bills-to-pay",
    subTotal: "96.00",
    taxAmount: "8.64",
    totalAmount: "104.64",
    status: "Pending",
    outcome: "-",
    docHash: "e19...a",
    gstTransId: "316535-eaf8-482e-9c10-99b5aa6384",
    peppolTransId: "-",
    acknowledgementId: "-",
    filedDate: "-",
    submissionDate: "24-Aug-2026",
    createdDate: "24-Aug-2026"
  },
  {
    no: 5,
    docNo: "INV/202608/0030",
    type: "Invoice",
    typeKey: "invoice",
    subTotal: "0.00",
    taxAmount: "0.00",
    totalAmount: "0.00",
    status: "Pending",
    outcome: "-",
    docHash: "612...57c",
    gstTransId: "1lea3f-8999-45d0-a34b-7d9flfa0b2b",
    peppolTransId: "-",
    acknowledgementId: "-",
    filedDate: "-",
    submissionDate: "22-Aug-2026",
    createdDate: "22-Aug-2026"
  },
  {
    no: 6,
    docNo: "INV/202608/0029",
    type: "Invoice",
    typeKey: "invoice",
    subTotal: "1,100.00",
    taxAmount: "110.00",
    totalAmount: "1,210.00",
    status: "Pending",
    outcome: "-",
    docHash: "8ca...6e8",
    gstTransId: "b8716a-9311-40aa-bf21-998ac91201",
    peppolTransId: "-",
    acknowledgementId: "-",
    filedDate: "-",
    submissionDate: "21-Aug-2026",
    createdDate: "21-Aug-2026"
  },
  {
    no: 7,
    docNo: "INV/202608/0028",
    type: "Invoice",
    typeKey: "invoice",
    subTotal: "12.00",
    taxAmount: "0.00",
    totalAmount: "12.00",
    status: "Pending",
    outcome: "-",
    docHash: "ce5...df4",
    gstTransId: "c9018f-1241-419b-a010-827618274a",
    peppolTransId: "-",
    acknowledgementId: "-",
    filedDate: "-",
    submissionDate: "20-Aug-2026",
    createdDate: "20-Aug-2026"
  },
  {
    no: 8,
    docNo: "INV/202608/0027",
    type: "Invoice",
    typeKey: "invoice",
    subTotal: "123.00",
    taxAmount: "11.07",
    totalAmount: "134.07",
    status: "Filed",
    outcome: "SUCCESS",
    docHash: "f7b...b",
    gstTransId: "f19034-77a8-4390-9901-7171a8091a",
    peppolTransId: "77a16b90-128a-4491-b010-7212001a8123",
    acknowledgementId: "260819-1ac19280-9b01-410a-8109-1920800a0192",
    filedDate: "20-Aug-2026",
    submissionDate: "19-Aug-2026",
    createdDate: "19-Aug-2026"
  },
  {
    no: 9,
    docNo: "INV/202608/0026",
    type: "Invoice",
    typeKey: "invoice",
    subTotal: "151,782.00",
    taxAmount: "13,660.38",
    totalAmount: "165,442.38",
    status: "Filed",
    outcome: "SUCCESS",
    docHash: "a26...c",
    gstTransId: "a99102-1200-471a-8102-8819070a19",
    peppolTransId: "99281a90-8812-4019-b001-9218201a0129",
    acknowledgementId: "260818-8bc10290-77a1-4019-9102-182091029101",
    filedDate: "19-Aug-2026",
    submissionDate: "18-Aug-2026",
    createdDate: "18-Aug-2026"
  },
  {
    no: 10,
    docNo: "INV-2026-011",
    type: "Bills To Pay",
    typeKey: "bills-to-pay",
    subTotal: "304.50",
    taxAmount: "27.41",
    totalAmount: "331.91",
    status: "Filed",
    outcome: "FAILED",
    docHash: "b5f...a2",
    gstTransId: "b51029-7102-4102-8012-9201820a10",
    peppolTransId: "10291a01-9920-4102-9102-820192010291",
    acknowledgementId: "260817-91029012-8812-4102-9102-820192010291",
    filedDate: "18-Aug-2026",
    submissionDate: "17-Aug-2026",
    createdDate: "17-Aug-2026"
  }
];

export default function GSTInvoiceNowPage() {
  const [activeCard, setActiveCard] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCols, setVisibleCols] = useState<ColKey[]>([...DEFAULT_VISIBLE]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [sendToIrasModalOpen, setSendToIrasModalOpen] = useState(false);
  const [realtimeAlertOpen, setRealtimeAlertOpen] = useState(false);
  const [realtimeInvoiceRef, setRealtimeInvoiceRef] = useState("INV/202608/0032");
  const [docInfoDrawerOpen, setDocInfoDrawerOpen] = useState(false);
  const [selectedDocNo, setSelectedDocNo] = useState("INV/202608/0032");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleExpandRow = (no: number) => {
    setExpandedRows((prev) =>
      prev.includes(no) ? prev.filter((id) => id !== no) : [...prev, no]
    );
  };

  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (key: ColKey, locked?: boolean) => {
    if (locked) return;
    setVisibleCols((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleSelectRow = (no: number) => {
    setSelectedRows((prev) =>
      prev.includes(no) ? prev.filter((item) => item !== no) : [...prev, no]
    );
  };

  const filteredRows = ALL_ROWS.filter((r) => {
    const matchesCard = activeCard === "all" || r.typeKey === activeCard;
    const matchesSearch =
      r.docNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.gstTransId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCard && matchesSearch;
  });

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>
          {/* Top Breadcrumb */}
          <div className={styles.topNavRow}>
            <Icon icon="lucide:home" width={16} height={16} className={styles.breadcrumbIcon} />
            <span className={styles.breadcrumbTitle}>GST InvoiceNow</span>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>GST InvoiceNow</h1>
            <div className={styles.headerTabGroup}>
              <button className={styles.tabBtnOutline} onClick={() => setConfigModalOpen(true)}>
                <Icon icon="lucide:settings" width={16} />
                Configuration
              </button>
            </div>
          </div>

          {/* 6 Metric Filter Cards */}
          <div className={styles.cardsGrid}>
            {CARDS.map((card) => {
              const isActive = activeCard === card.id;
              return (
                <div
                  key={card.id}
                  className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
                  onClick={() => setActiveCard(card.id)}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.cardIconWrap} style={{ background: card.bg, color: card.color }}>
                      <Icon icon={card.icon} width={18} height={18} />
                    </div>
                    <span className={styles.cardDocCount}>{card.count} Documents</span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardLabel}>{card.label}</div>
                    <div className={styles.cardAmount}>{card.amount}</div>
                    <div className={styles.cardSubLabel}>
                      SGD Tax Amount
                      <Icon icon="lucide:info" width={12} height={12} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Instruction H: IRAS Submission Deadline Reminder Banner */}
          <div className={styles.deadlineBanner}>
            <div className={styles.deadlineLeft}>
              <Icon icon="lucide:alert-circle" width={22} height={22} className={styles.deadlineIcon} />
              <div>
                <h4 className={styles.deadlineTitle}>IRAS GST F5 Submission Deadline Approaching</h4>
                <p className={styles.deadlineSub}>
                  Q3 GST Return due in <strong>4 days</strong> (30-Sep-2026). 12 pending sales invoices require submission via InvoiceNow.
                </p>
              </div>
            </div>
            <button
              type="button"
              className={styles.btnDeadlineAction}
              onClick={() => setActiveCard("pending")}
            >
              Review Pending Submissions
            </button>
          </div>

          {/* Redesigned Totals Banner & Right-Aligned Controls Group */}
          <div className={styles.toolbarRow}>
            {/* Left: Minimalist Totals Group */}
            <div className={styles.totalsGroup}>
              <div className={styles.totalStat}>
                <span className={styles.totalLabel}>Total Sub Amount</span>
                <span className={styles.totalVal}>
                  4,702,779.84 <span className={styles.currencyUnit}>SGD</span>
                </span>
              </div>

              <div className={styles.dividerVertical} />

              <div className={styles.totalStat}>
                <span className={styles.totalLabel}>Total Tax Amount</span>
                <span className={styles.totalVal}>
                  249,747.19 <span className={styles.currencyUnit}>SGD</span>
                </span>
              </div>

              <div className={styles.dividerVertical} />

              <div className={styles.totalStat}>
                <span className={styles.totalLabel}>Total Amount (Incl Tax)</span>
                <span className={styles.totalValHighlight}>
                  4,952,527.04 <span className={styles.currencyUnit}>SGD</span>
                </span>
              </div>
            </div>

            {/* Right: Controls & Filter Group */}
            <div className={styles.controlsRightGroup}>
              {/* Columns Visibility Picker */}
              <div className={styles.colPickerWrap} ref={pickerRef}>
                <button
                  className={`${styles.colBtn} ${pickerOpen ? styles.colBtnActive : ""}`}
                  onClick={() => setPickerOpen((prev) => !prev)}
                >
                  <Icon icon="lucide:columns-3" width={15} />
                  Columns
                  <span className={styles.colBadge}>{visibleCols.length}</span>
                  <Icon icon="lucide:chevron-down" width={13} />
                </button>

                {pickerOpen && (
                  <div className={styles.pickerCard}>
                    <div className={styles.pickerHeader}>
                      <div>
                        <h4 className={styles.pickerTitle}>Customize Columns</h4>
                        <p className={styles.pickerSub}>
                          {visibleCols.length} of {ALL_COLUMNS.length} visible
                        </p>
                      </div>
                      <button
                        className={styles.pickerReset}
                        onClick={() => setVisibleCols([...DEFAULT_VISIBLE])}
                      >
                        <Icon icon="lucide:rotate-ccw" width={12} />
                        Reset
                      </button>
                    </div>

                    <div className={styles.pickerList}>
                      {ALL_COLUMNS.map((col) => {
                        const isVisible = visibleCols.includes(col.key);
                        return (
                          <label key={col.key} className={styles.pickerRow}>
                            <input
                              type="checkbox"
                              checked={isVisible}
                              disabled={col.locked}
                              onChange={() => toggleColumn(col.key, col.locked)}
                            />
                            <span>{col.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Button */}
              <button className={styles.btnFilter}>
                <Icon icon="lucide:sliders-horizontal" width={14} />
                Filter
              </button>

              {/* Send to IRAS Button (Selection Guarded) */}
              <button
                className={styles.btnSendToIRAS}
                disabled={selectedRows.length === 0}
                onClick={() => setSendToIrasModalOpen(true)}
                title={selectedRows.length === 0 ? "Select at least 1 record in the list below to send to IRAS" : undefined}
              >
                <Icon icon="lucide:send" width={14} />
                {selectedRows.length > 0 ? `Send to IRAS (${selectedRows.length})` : "Send to IRAS"}
              </button>

              {/* Search Box */}
              <div className={styles.searchInputWrap}>
                <Icon icon="lucide:search" width={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by keywords"
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Main Data Table with Horizontal Scroll */}
          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Action</th>
                    {visibleCols.includes("no") && <th>No.</th>}
                    {visibleCols.includes("docNo") && <th>Document No. ↓</th>}
                    {visibleCols.includes("type") && <th>Type ↓</th>}
                    {visibleCols.includes("subTotal") && <th>Sub Total ↓</th>}
                    {visibleCols.includes("taxAmount") && <th>Tax Amount ↓</th>}
                    {visibleCols.includes("totalAmount") && <th>Total Amount (Incl Tax) ↓</th>}
                    {visibleCols.includes("dualStatus") && <th>InvoiceNow / IRAS Status ↓</th>}
                    {visibleCols.includes("status") && <th>Status ↓</th>}
                    {visibleCols.includes("outcome") && <th>Outcome ↓</th>}
                    {visibleCols.includes("docHash") && <th>Doc Hash</th>}
                    {visibleCols.includes("gstTransId") && <th>GST InvoiceNow Trans. ID ↓</th>}
                    {visibleCols.includes("peppolTransId") && <th>InvoiceNow / Peppol Trans. ID ↓</th>}
                    {visibleCols.includes("acknowledgementId") && <th>Acknowledgement ID ↓</th>}
                    {visibleCols.includes("filedDate") && <th>Filed Date ↓</th>}
                    {visibleCols.includes("submissionDate") && <th>Submission Date ↓</th>}
                    {visibleCols.includes("createdDate") && <th>Created Date ↓</th>}
                    <th className={styles.thArrow} />
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => {
                    const isSelected = selectedRows.includes(row.no);
                    const isExpanded = expandedRows.includes(row.no);

                    // Columns NOT visible in table go into expand panel
                    const panelCols = ALL_COLUMNS.filter(
                      (c) => !visibleCols.includes(c.key) && !c.locked
                    );
                    const colSpan = visibleCols.length + 2;

                    const getRowVal = (key: string) => {
                      switch (key) {
                        case "type": return row.type;
                        case "subTotal": return row.subTotal;
                        case "taxAmount": return row.taxAmount;
                        case "totalAmount": return row.totalAmount;
                        case "dualStatus": return "Sent via InvoiceNow";
                        case "status": return row.status;
                        case "outcome": return row.outcome;
                        case "docHash": return row.docHash;
                        case "gstTransId": return row.gstTransId;
                        case "peppolTransId": return row.peppolTransId;
                        case "acknowledgementId": return row.acknowledgementId;
                        case "filedDate": return row.filedDate;
                        case "submissionDate": return row.submissionDate;
                        case "createdDate": return row.createdDate;
                        default: return "–";
                      }
                    };

                    return (
                      <React.Fragment key={row.no}>
                        {/* Main Table Row */}
                        <tr
                          className={`${styles.row} ${isSelected ? styles.rowSel : ""} ${isExpanded ? styles.rowExp : ""}`}
                          onClick={() => toggleExpandRow(row.no)}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <ActionButton
                                type="view"
                                tooltip="View"
                                onClick={() => {
                                  setSelectedDocNo(row.docNo);
                                  setDocInfoDrawerOpen(true);
                                }}
                              />
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectRow(row.no)}
                                className={styles.actionCheckbox}
                              />
                            </div>
                          </td>

                          {visibleCols.includes("no") && <td>{row.no}</td>}
                          {visibleCols.includes("docNo") && (
                            <td>
                              <a
                                href="#"
                                className={styles.docLink}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedDocNo(row.docNo);
                                  setDocInfoDrawerOpen(true);
                                }}
                              >
                                {row.docNo}
                              </a>
                            </td>
                          )}
                          {visibleCols.includes("type") && <td>{row.type}</td>}
                          {visibleCols.includes("subTotal") && <td>{row.subTotal}</td>}
                          {visibleCols.includes("taxAmount") && <td>{row.taxAmount}</td>}
                          {visibleCols.includes("totalAmount") && <td>{row.totalAmount}</td>}
                          
                          {/* Dual Status Indicators: Sent via InvoiceNow vs Filed to IRAS */}
                          {visibleCols.includes("dualStatus") && (
                            <td>
                              <div className={styles.indicatorGroup}>
                                <span className={styles.invoicenowSentBadge}>
                                  <Icon icon="lucide:check-circle-2" width={12} height={12} />
                                  Sent via InvoiceNow
                                </span>
                                {row.status === "Filed" && row.outcome === "SUCCESS" && (
                                  <span className={styles.irasFiledBadge}>
                                    <Icon icon="lucide:check-circle" width={12} height={12} />
                                    Filed to IRAS
                                  </span>
                                )}
                                {row.status === "Filed" && row.outcome === "FAILED" && (
                                  <span className={styles.irasNotFiledBadge}>
                                    <Icon icon="lucide:x-circle" width={12} height={12} />
                                    Filing Failed
                                  </span>
                                )}
                                {row.status === "Pending" && (
                                  <span className={styles.irasPendingBadge}>
                                    <Icon icon="lucide:clock" width={12} height={12} />
                                    Pending Filing
                                  </span>
                                )}
                              </div>
                            </td>
                          )}

                          {/* Status Pill */}
                          {visibleCols.includes("status") && (
                            <td>
                              <span className={row.status === "Filed" ? styles.pillFiled : styles.pillPending}>
                                <Icon
                                  icon={row.status === "Filed" ? "lucide:send" : "lucide:clock"}
                                  width={12}
                                  height={12}
                                />
                                {row.status}
                              </span>
                            </td>
                          )}

                          {/* High-Contrast Outcome Badge */}
                          {visibleCols.includes("outcome") && (
                            <td>
                              {row.outcome === "SUCCESS" && (
                                <span className={styles.badgeSuccess}>
                                  <Icon icon="lucide:check-circle-2" width={13} height={13} />
                                  SUCCESS
                                </span>
                              )}
                              {row.outcome === "FAILED" && (
                                <span className={styles.badgeFailed}>
                                  <Icon icon="lucide:alert-triangle" width={13} height={13} />
                                  FAILED
                                </span>
                              )}
                              {row.outcome === "-" && <span className={styles.badgeDash}>-</span>}
                            </td>
                          )}
                          {visibleCols.includes("docHash") && <td className={styles.hashText}>{row.docHash}</td>}
                          {visibleCols.includes("gstTransId") && <td className={styles.hashText}>{row.gstTransId}</td>}
                          {visibleCols.includes("peppolTransId") && <td className={styles.hashText}>{row.peppolTransId}</td>}
                          {visibleCols.includes("acknowledgementId") && (
                            <td className={styles.hashText}>{row.acknowledgementId}</td>
                          )}
                          {visibleCols.includes("filedDate") && <td>{row.filedDate}</td>}
                          {visibleCols.includes("submissionDate") && <td>{row.submissionDate}</td>}
                          {visibleCols.includes("createdDate") && <td>{row.createdDate}</td>}

                          {/* Far Right Chevron Expand Cell */}
                          <td className={styles.tdArrow}>
                            <span className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}>
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </span>
                          </td>
                        </tr>

                        {/* Expandable Details Panel */}
                        <tr className={styles.expandTr}>
                          <td colSpan={colSpan} className={styles.expandTd}>
                            <div className={`${styles.panel} ${isExpanded ? styles.panelOpen : ""}`}>
                              <div className={styles.panelBody}>
                                <div className={styles.panelGrid}>
                                  {panelCols.length > 0 ? (
                                    panelCols.map((col) => (
                                      <div key={col.key} className={styles.chip}>
                                        <span className={styles.chipLabel}>{col.label}</span>
                                        <span className={styles.chipValue}>{getRowVal(col.key)}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className={styles.panelAllVisible}>
                                      All columns are currently visible in the table view.
                                    </p>
                                  )}
                                </div>

                                <div className={styles.panelActions} onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    className={styles.btnPanelAction}
                                    onClick={() => {
                                      setSelectedRows([row.no]);
                                      setSendToIrasModalOpen(true);
                                    }}
                                  >
                                    <Icon icon="lucide:send" width={14} />
                                    Send to IRAS
                                  </button>
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

            {/* Pagination Controls */}
            <div className={styles.paginationRow}>
              <div className={styles.rowsPerPage}>
                <span>Rows per page</span>
                <select className={styles.selectRows} defaultValue="10">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span>Showing 1-10 of 477</span>
              </div>
              <div className={styles.pageControls}>
                <button className={styles.pageBtn}>
                  <Icon icon="lucide:chevron-left" width={14} />
                </button>
                <button
                  className={`${styles.pageBtn} ${currentPage === 1 ? styles.pageBtnActive : ""}`}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>
                <button
                  className={`${styles.pageBtn} ${currentPage === 2 ? styles.pageBtnActive : ""}`}
                  onClick={() => setCurrentPage(2)}
                >
                  2
                </button>
                <button
                  className={`${styles.pageBtn} ${currentPage === 3 ? styles.pageBtnActive : ""}`}
                  onClick={() => setCurrentPage(3)}
                >
                  3
                </button>
                <button
                  className={`${styles.pageBtn} ${currentPage === 4 ? styles.pageBtnActive : ""}`}
                  onClick={() => setCurrentPage(4)}
                >
                  4
                </button>
                <button
                  className={`${styles.pageBtn} ${currentPage === 5 ? styles.pageBtnActive : ""}`}
                  onClick={() => setCurrentPage(5)}
                >
                  5
                </button>
                <button className={styles.pageBtn}>
                  <Icon icon="lucide:chevron-right" width={14} />
                </button>
              </div>
            </div>
          </div>

          <GSTConfigurationModal
            isOpen={configModalOpen}
            onClose={() => setConfigModalOpen(false)}
          />

          <SendToIRASModal
            isOpen={sendToIrasModalOpen}
            onClose={() => setSendToIrasModalOpen(false)}
            selectedCount={selectedRows.length}
            onConfirm={() => {
              setSelectedRows([]);
            }}
          />

          <RealtimeSubmissionAlertModal
            isOpen={realtimeAlertOpen}
            onClose={() => setRealtimeAlertOpen(false)}
            invoiceNo={realtimeInvoiceRef}
          />

          <GSTDocumentInfoDrawer
            isOpen={docInfoDrawerOpen}
            onClose={() => setDocInfoDrawerOpen(false)}
            documentNo={selectedDocNo}
          />
        </main>
      </div>
    </div>
  );
}
