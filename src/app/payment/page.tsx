"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatusSummarySection from "@/components/StatusSummarySection";
import PaymentTable from "@/components/PaymentTable";
import ImportModal from "@/components/ImportModal";
import styles from "./page.module.css";
import { Icon } from "@iconify/react";

const PAYMENT_STATUS_CARDS = [
  { id: "pending-approval", label: "Pending Approval", currency: "SGD", amount: "1,627.40", count: 5, icon: "lucide:clock-3", color: "#E8692A", bgColor: "#FFF0E8" },
  { id: "approved", label: "Approved", currency: "SGD", amount: "4,850.00", count: 5, icon: "lucide:check-circle-2", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "awaiting-payment", label: "Awaiting Payment", currency: "SGD", amount: "3,737,654.00", count: 22, icon: "lucide:hourglass", color: "#E8692A", bgColor: "#FFF0E8" },
];

export default function PaymentPage() {
  const [activeCard, setActiveCard] = useState("awaiting-payment");
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>

          {/* Page Header with Primary, Secondary, and Tertiary Button Hierarchy */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Payment</h1>
            <div className={styles.actions}>
              {/* Tertiary Action: Data utility */}
              <button className={styles.btnOutline} title="Import payment data batch" onClick={() => setImportOpen(true)}>
                <Icon icon="lucide:download" width={14} />
                Import
              </button>

              <ImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />

              {/* Secondary Action: Financial transaction */}
              <button className={styles.btnOutlineOrange} title="Receive incoming payment">
                <Icon icon="lucide:hand-coins" width={14} />
                Receive Payment
              </button>

              {/* Primary Action: Most important payment action */}
              <button className={styles.btnSolid} title="Make advance payment">
                <Icon icon="lucide:circle-dollar-sign" width={15} />
                Make Advance Payment
              </button>
            </div>
          </div>

          {/* Status Cards / Listing Toggle (Pending Approval, Approved, Awaiting Payment) */}
          <StatusSummarySection
            cards={PAYMENT_STATUS_CARDS}
            activeId={activeCard}
            onSelect={(card) => setActiveCard(card.id)}
            gridClassName={styles.cardsGrid}
            gridStyle={{ gridTemplateColumns: "repeat(3, minmax(220px, 300px))" }}
          />

          {/* Payment Table */}
          <PaymentTable />
        </main>
      </div>
    </div>
  );
}
