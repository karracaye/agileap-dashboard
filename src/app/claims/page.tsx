"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatusCard from "@/components/StatusCard";
import ImportModal from "@/components/ImportModal";
import CreateClaimModal, { NewClaimData } from "@/components/CreateClaimModal";
import ClaimsTable, { ClaimItem } from "@/components/ClaimsTable";
import styles from "./page.module.css";
import { Icon } from "@iconify/react";

const CLAIM_STATUS_CARDS = [
  { id: "my-task", label: "My Task", currency: "SGD", amount: "", count: 0, icon: "lucide:check-square", color: "#0284C7", bgColor: "#E0F2FE" },
  { id: "history", label: "My History", currency: "SGD", amount: "13,085.18", count: 30, icon: "lucide:history", color: "#475569", bgColor: "#F1F5F9" },
  { id: "all", label: "All", currency: "SGD", amount: "13,107.18", count: 31, icon: "lucide:list", color: "#E8692A", bgColor: "#FFF0E8" },
  { id: "draft", label: "Draft", currency: "SGD", amount: "4,873.40", count: 3, icon: "lucide:file-text", color: "#2563EB", bgColor: "#EFF6FF" },
  { id: "submitted", label: "Submitted", currency: "SGD", amount: "50.00", count: 3, icon: "lucide:send", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "pending-approval", label: "Pending Approval", currency: "SGD", amount: "266.00", count: 11, icon: "lucide:clock-3", color: "#D97706", bgColor: "#FEF3C7" },
  { id: "approved", label: "Approved", currency: "SGD", amount: "0.00", count: 0, icon: "lucide:check-circle-2", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "rejected", label: "Rejected", currency: "SGD", amount: "2,702.00", count: 2, icon: "lucide:x-circle", color: "#DC2626", bgColor: "#FEE2E2" },
  { id: "cancelled", label: "Cancelled", currency: "SGD", amount: "10.00", count: 1, icon: "lucide:ban", color: "#EA580C", bgColor: "#FFEDD5" },
  { id: "paid", label: "Paid", currency: "SGD", amount: "100.00", count: 5, icon: "lucide:wallet", color: "#059669", bgColor: "#D1FAE5" },
  { id: "awaiting-payment", label: "Awaiting Payment", currency: "SGD", amount: "283.00", count: 7, icon: "lucide:hourglass", color: "#E8692A", bgColor: "#FFF0E8" },
];

const INITIAL_CLAIMS: ClaimItem[] = [
  {
    id: "1",
    claimNo: "C-2026-034",
    userName: "Joshua Lee (Test)",
    userEmail: "joshua+1@activants.com",
    totalAmount: 10.00,
    totalTax: 0.90,
    totalClaim: 10.90,
    paymentMethod: "GIRO",
    transactionDate: "02-Sep-2026",
    status: "Pending Approval",
    description: "tsytl 2/9",
    createdDate: "02-Sep-2026 11:40:06 AM",
    lastModified: "14-Sep-2026 05:42:56 PM",
  },
  {
    id: "2",
    claimNo: "C-2026-032",
    userName: "Joshua Lee (Test)",
    userEmail: "joshua+1@activants.com",
    totalAmount: 123.00,
    totalTax: 11.07,
    totalClaim: 134.07,
    paymentMethod: "PayNow",
    transactionDate: "01-Sep-2026",
    status: "Submitted",
    description: "desc to test",
    createdDate: "02-Sep-2026 02:20:14 AM",
    lastModified: "02-Sep-2026 02:20:17 AM",
  },
  {
    id: "3",
    claimNo: "C-2026-033",
    userName: "Joshua Lee (Test)",
    userEmail: "joshua+1@activants.com",
    totalAmount: 123.00,
    totalTax: 11.07,
    totalClaim: 134.07,
    paymentMethod: "PayNow",
    transactionDate: "01-Sep-2026",
    status: "Submitted",
    description: "Desc Test",
    createdDate: "01-Sep-2026 07:07:17 PM",
    lastModified: "01-Sep-2026 07:07:17 PM",
  },
  {
    id: "4",
    claimNo: "C-2026-031",
    userName: "Joshua Lee (Test)",
    userEmail: "joshua+1@activants.com",
    totalAmount: 12.00,
    totalTax: 1.08,
    totalClaim: 13.08,
    paymentMethod: "COD",
    transactionDate: "13-Apr-2026",
    status: "Awaiting Payment",
    description: "TEST",
    createdDate: "13-Apr-2026 04:11:36 PM",
    lastModified: "24-Apr-2026 05:45:30 PM",
  },
  {
    id: "5",
    claimNo: "C-2026-030",
    userName: "Joshua Lee (Test)",
    userEmail: "joshua+1@activants.com",
    totalAmount: 10.00,
    totalTax: 0.90,
    totalClaim: 10.90,
    paymentMethod: "PayNow",
    transactionDate: "01-Apr-2026",
    status: "Awaiting Payment",
    description: "Taxi Fare",
    createdDate: "01-Apr-2026 03:58:24 PM",
    lastModified: "24-Apr-2026 05:46:30 PM",
  },
  {
    id: "6",
    claimNo: "C-2026-029",
    userName: "Sarah Tan",
    userEmail: "sarah.tan@activants.com",
    totalAmount: 4873.40,
    totalTax: 438.60,
    totalClaim: 5312.00,
    paymentMethod: "Bank Transfer",
    transactionDate: "15-Mar-2026",
    status: "Draft",
    description: "Quarterly Software Licenses Reimbursement",
    createdDate: "15-Mar-2026 09:12:40 AM",
    lastModified: "15-Mar-2026 10:00:15 AM",
  },
  {
    id: "7",
    claimNo: "C-2026-028",
    userName: "Michael Chen",
    userEmail: "michael.c@activants.com",
    totalAmount: 2702.00,
    totalTax: 243.18,
    totalClaim: 2945.18,
    paymentMethod: "GIRO",
    transactionDate: "10-Feb-2026",
    status: "Rejected",
    description: "Client Dinner Expenses",
    createdDate: "10-Feb-2026 04:45:00 PM",
    lastModified: "12-Feb-2026 01:20:00 PM",
  },
  {
    id: "8",
    claimNo: "C-2026-027",
    userName: "Amanda Ong",
    userEmail: "amanda.o@activants.com",
    totalAmount: 100.00,
    totalTax: 9.00,
    totalClaim: 109.00,
    paymentMethod: "PayNow",
    transactionDate: "05-Jan-2026",
    status: "Paid",
    description: "Office Stationeries and Supplies",
    createdDate: "05-Jan-2026 11:30:00 AM",
    lastModified: "08-Jan-2026 02:15:20 PM",
  },
];

export default function ClaimsPage() {
  const [activeCard, setActiveCard] = useState("all");
  const [importOpen, setImportOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [claimsList, setClaimsList] = useState<ClaimItem[]>(INITIAL_CLAIMS);

  const handleCreateSubmit = (newClaim: NewClaimData) => {
    const totalClaim = newClaim.totalAmount + newClaim.totalTax;
    const dateFormatted = new Date(newClaim.transactionDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const createdRecord: ClaimItem = {
      id: String(Date.now()),
      claimNo: `C-2026-${Math.floor(100 + Math.random() * 900)}`,
      userName: newClaim.userName,
      userEmail: newClaim.userEmail,
      totalAmount: newClaim.totalAmount,
      totalTax: newClaim.totalTax,
      totalClaim: totalClaim,
      paymentMethod: newClaim.paymentMethod,
      transactionDate: dateFormatted,
      status: "Submitted",
      description: newClaim.description,
      createdDate: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      lastModified: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    setClaimsList((prev) => [createdRecord, ...prev]);
  };

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Claims / Petty Cash</h1>
            <div className={styles.actions}>
              <button
                className={styles.btnOutline}
                title="Import claims data batch"
                onClick={() => setImportOpen(true)}
              >
                <Icon icon="lucide:download" width={14} />
                Import
              </button>

              <button
                className={styles.btnSolid}
                title="Create a new claim"
                onClick={() => setCreateOpen(true)}
              >
                <Icon icon="lucide:plus" width={15} />
                Create Claims
              </button>
            </div>
          </div>

          <ImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />
          <CreateClaimModal
            isOpen={createOpen}
            onClose={() => setCreateOpen(false)}
            onSubmitClaim={handleCreateSubmit}
          />

          {/* Metric Status Cards Grid */}
          <div className={styles.cardsGrid}>
            {CLAIM_STATUS_CARDS.map((card) => (
              <StatusCard
                key={card.id}
                id={card.id}
                label={card.label}
                currency={card.currency}
                amount={card.amount}
                count={card.count}
                color={card.color}
                bgColor={card.bgColor}
                active={activeCard === card.id}
                onClick={() => setActiveCard(card.id)}
                icon={card.icon}
              />
            ))}
          </div>

          {/* Claims Data Table */}
          <ClaimsTable claims={claimsList} activeFilter={activeCard} />
        </main>
      </div>
    </div>
  );
}
