"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ActionButton from "@/components/ActionButton";
import AllocateExpenseModal, {
  LineItemData,
  AllocationMode,
} from "@/components/AllocateExpenseModal";
import styles from "./page.module.css";

const INITIAL_LINE_ITEMS: LineItemData[] = [
  {
    no: 1,
    type: "Local Transport",
    transDate: "12 Sep 2026",
    transNo: "TX-5521",
    company: "Taxi",
    glCode: "6100 · Local Travel",
    costCentre: "SG-DRY",
    amount: 38.5,
    allocationType: "Not split",
    allocationLabel: "Not split · SG-DRY",
  },
  {
    no: 2,
    type: "Entertainment",
    transDate: "10 Sep 2026",
    transNo: "INV-8830",
    company: "Harbour Bistro",
    glCode: "6200 · Entertainment",
    costCentre: "Split",
    amount: 1000.0,
    allocationType: "Manual",
    allocationLabel: "Manual · 4 staff",
  },
  {
    no: 3,
    type: "Entertainment",
    transDate: "11 Sep 2026",
    transNo: "INV-2291",
    company: "Marina Grill",
    glCode: "6200 · Entertainment",
    costCentre: "Split",
    amount: 1000.0,
    allocationType: "Two-level",
    allocationLabel: "Two-level · 2 customers",
  },
  {
    no: 4,
    type: "Overseas Travel",
    transDate: "05 Sep 2026",
    transNo: "BK-7719",
    company: "Airline",
    glCode: "6110 · Overseas Travel",
    costCentre: "NR-001",
    amount: 1000.0,
    allocationType: "Rule based",
    allocationLabel: "Rule · NR-001 v2",
  },
];

export default function ClaimDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const claimId = decodeURIComponent(params.id || "CL26-000123");

  const [claimant] = useState("Rachel Lim");
  const [employeeId] = useState("ST-001");
  const [entity] = useState("Entity A");
  const [department] = useState("Chartering");
  const [claimDate] = useState("14 Sep 2026");
  const [currency] = useState("SGD");
  const [exchangeRate] = useState("1.0000");
  const [notes] = useState("Client meetings, Sep 2026");

  const [lineItems, setLineItems] = useState<LineItemData[]>(INITIAL_LINE_ITEMS);
  const [selectedLine, setSelectedLine] = useState<LineItemData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAllocationModal = (line: LineItemData) => {
    setSelectedLine(line);
    setIsModalOpen(true);
  };

  const handleSaveAllocation = (
    lineNo: number,
    mode: AllocationMode,
    label: string
  ) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.no === lineNo) {
          return {
            ...item,
            allocationType: mode,
            allocationLabel: label,
            costCentre: mode === "Manual" || mode === "Two-level" ? "Split" : item.costCentre,
          };
        }
        return item;
      })
    );
  };

  const handleDeleteLine = (lineNo: number) => {
    setLineItems((prev) => prev.filter((item) => item.no !== lineNo));
  };

  const handleAddLine = () => {
    const nextNo = lineItems.length > 0 ? Math.max(...lineItems.map((i) => i.no)) + 1 : 1;
    setLineItems((prev) => [
      ...prev,
      {
        no: nextNo,
        type: "General Expense",
        transDate: "14 Sep 2026",
        transNo: `TX-${5520 + nextNo}`,
        company: "Vendor",
        glCode: "6300 · Miscellaneous",
        costCentre: "SG-DRY",
        amount: 250.0,
        allocationType: "Not split",
        allocationLabel: "Not split · SG-DRY",
      },
    ]);
  };

  const totalClaimAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const totalGst = 168.32;

  // Item 13 Hover Popover Content Generator
  const renderPopoverContent = (line: LineItemData) => {
    if (line.no === 1) {
      return (
        <div className={styles.popoverTooltip}>
          <span className={styles.popoverTitle}>Not Split · Home Cost Centre</span>
          <div className={styles.popoverItem}>
            <span>Home Cost Centre:</span>
            <strong>SG-DRY (100%)</strong>
          </div>
          <div className={styles.popoverItem}>
            <span>Amount:</span>
            <strong>SGD 38.50</strong>
          </div>
        </div>
      );
    }
    if (line.no === 2) {
      return (
        <div className={styles.popoverTooltip}>
          <span className={styles.popoverTitle}>Manual Split · 4 Staff Members</span>
          <div className={styles.popoverItem}>
            <span>Priya Nair (SG-DRY):</span>
            <strong>25% · $250.00</strong>
          </div>
          <div className={styles.popoverItem}>
            <span>Rachel Lim (SG-DRY):</span>
            <strong>25% · $250.00</strong>
          </div>
          <div className={styles.popoverItem}>
            <span>Sofia Hassan (EU-DESK):</span>
            <strong>25% · $250.00</strong>
          </div>
          <div className={styles.popoverItem}>
            <span>Aisha Rahman (NR-001):</span>
            <strong>25% · $250.00</strong>
          </div>
        </div>
      );
    }
    if (line.no === 3) {
      return (
        <div className={styles.popoverTooltip}>
          <span className={styles.popoverTitle}>Two-Level Customer Split</span>
          <div className={styles.popoverItem}>
            <span>Customer A (50%):</span>
            <strong>SG-DRY v2 ($500.00)</strong>
          </div>
          <div className={styles.popoverItem}>
            <span>Customer B (50%):</span>
            <strong>EU-DESK v1 ($500.00)</strong>
          </div>
          <div className={styles.popoverItem} style={{ borderTop: "1px solid #334155", paddingTop: "4px", marginTop: "2px" }}>
            <span>Sofia Hassan: $250 | Priya Nair:</span>
            <strong>$225.00</strong>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.popoverTooltip}>
        <span className={styles.popoverTitle}>Rule · NR-001 Nesty Regional v2</span>
        <div className={styles.popoverItem}>
          <span>Marcus Goh (12%):</span>
          <strong>$120.00</strong>
        </div>
        <div className={styles.popoverItem}>
          <span>Kenji Watanabe (10%):</span>
          <strong>$100.00</strong>
        </div>
        <div className={styles.popoverItem}>
          <span>Farhan Ismail (10%):</span>
          <strong>$100.00</strong>
        </div>
        <div className={styles.popoverItem}>
          <span>12 Other Staff:</span>
          <strong>68% · $680.00</strong>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainContent}>
        <Header />

        <div className={styles.pageBody}>
          {/* Top Breadcrumb */}
          <div>
            <Link href="/claims" className={styles.breadcrumbLink}>
              <Icon icon="lucide:arrow-left" width={16} />
              Claims / Petty Cash
            </Link>
          </div>

          {/* Page Header */}
          <div className={styles.topHeaderRow}>
            <div className={styles.titleGroup}>
              <h1 className={styles.pageTitle}>Claims / Petty Cash</h1>
              <span className={styles.badgeDraft}>Draft</span>
              <span className={styles.claimIdText}>{claimId}</span>
            </div>

            <div className={styles.controlsBar}>
              <button type="button" className={styles.btnSecondary}>
                Save Draft
              </button>
              <button type="button" className={styles.btnPrimary}>
                Submit
              </button>
            </div>
          </div>

          {/* Form Fields Card */}
          <div className={styles.card}>
            <div className={styles.fieldsGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Claimant</label>
                <input type="text" className={styles.input} value={claimant} readOnly />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Employee ID</label>
                <input type="text" className={styles.input} value={employeeId} readOnly />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Entity</label>
                <input type="text" className={styles.input} value={entity} readOnly />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Department</label>
                <input type="text" className={styles.input} value={department} readOnly />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Claim Date</label>
                <input type="text" className={styles.input} value={claimDate} readOnly />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Currency</label>
                <input type="text" className={styles.input} value={currency} readOnly />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Exchange Rate</label>
                <input type="text" className={styles.input} value={exchangeRate} readOnly />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Notes</label>
                <input type="text" className={styles.input} value={notes} readOnly />
              </div>
            </div>
          </div>

          {/* Line Items Card matching user wireframe media_1790570826680.png */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Line Items</h2>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: "36px" }}>No.</th>
                    <th>Claim Type</th>
                    <th>Trans. Date</th>
                    <th>Trans. No.</th>
                    <th>Company</th>
                    <th>GL Code</th>
                    <th>Cost Centre</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th style={{ textAlign: "right" }}>GST</th>
                    <th>
                      Allocation{" "}
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "white",
                          background: "#E8692A",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          marginLeft: "4px",
                        }}
                      >
                        NEW
                      </span>
                    </th>
                    <th style={{ width: "36px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((line) => {
                    const gstVal = line.no === 1 ? 3.18 : line.no === 4 ? 0.0 : 82.57;

                    let btnClass = styles.btnAllocNotSplit;
                    if (line.allocationType === "Manual") btnClass = styles.btnAllocManual;
                    if (line.allocationType === "Two-level") btnClass = styles.btnAllocTwoLevel;
                    if (line.allocationType === "Rule based") btnClass = styles.btnAllocRule;

                    return (
                      <tr key={line.no}>
                        <td>{line.no}</td>
                        <td style={{ fontWeight: 600 }}>{line.type}</td>
                        <td>{line.transDate}</td>
                        <td>{line.transNo}</td>
                        <td>{line.company}</td>
                        <td style={{ fontSize: "12.5px" }}>{line.glCode}</td>
                        <td style={{ fontWeight: 600 }}>{line.costCentre}</td>
                        <td style={{ textAlign: "right", fontWeight: 600 }}>
                          {line.amount.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right" }}>{gstVal.toFixed(2)}</td>
                        <td>
                          {/* Item 13 Allocation Chip Wrapper with Hover Popover */}
                          <div className={styles.chipWrapper}>
                            {renderPopoverContent(line)}
                            <button
                              type="button"
                              className={btnClass}
                              onClick={() => handleOpenAllocationModal(line)}
                            >
                              <span>{line.allocationLabel}</span>
                              <Icon icon="lucide:chevron-right" width={14} />
                            </button>
                          </div>
                        </td>
                        <td>
                          <div
                            className={styles.btnExpandIcon}
                            onClick={() => handleOpenAllocationModal(line)}
                            title="Expand Allocation Modal"
                          >
                            <Icon icon="lucide:arrow-up-right" width={16} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div>
              <button type="button" className={styles.btnAddRow} onClick={handleAddLine}>
                + Add row
              </button>
            </div>

            {/* Totals Summary Footer */}
            <div className={styles.totalsBox}>
              <div className={styles.totalRow}>
                <span>Total GST</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>
                  SGD {totalGst.toFixed(2)}
                </span>
              </div>
              <div className={styles.totalClaimRow}>
                <span>Total Claim</span>
                <span style={{ color: "#0F172A" }}>
                  SGD {totalClaimAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Allocate Expense Modal */}
      <AllocateExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lineItem={selectedLine}
        onSaveAllocation={handleSaveAllocation}
      />
    </div>
  );
}
