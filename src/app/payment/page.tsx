"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatusCard from "@/components/StatusCard";
import PaymentTable from "@/components/PaymentTable";
import ImportModal from "@/components/ImportModal";
import styles from "./page.module.css";
import { Icon } from "@iconify/react";

const PAYMENT_STATUS_CARDS = [
  { id: "pending-approval", label: "Pending Approval", currency: "SGD", amount: "1,627.40", count: 5, icon: "lucide:clock-3", color: "#D97706", bgColor: "#FEF3C7" },
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

          {/* Status Cards Grid (Pending Approval, Approved, Awaiting Payment) */}
          <div className={styles.cardsGrid} style={{ gridTemplateColumns: "repeat(3, minmax(220px, 300px))" }}>
            {PAYMENT_STATUS_CARDS.map((card) => (
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

          {/* Payment Table */}
          <PaymentTable />
        </main>
      </div>
    </div>
  );
}
