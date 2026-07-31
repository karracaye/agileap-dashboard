"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatusCard from "@/components/StatusCard";
import InvoiceTable from "@/components/InvoiceTable";
import ImportModal from "@/components/ImportModal";
import styles from "./page.module.css";

const STATUS_CARDS = [
  { id: "history", label: "My History", currency: "AUD", amount: "1,627.40", count: 142, icon: "lucide:history", color: "#475569", bgColor: "#F1F5F9" },
  { id: "all", label: "All", currency: "AUD", amount: "1,627.40", count: 296, icon: "lucide:list", color: "#E8692A", bgColor: "#FFF0E8" },
  { id: "duplicated", label: "Duplicated", currency: "SGD", amount: "3,737,654.00", count: 20, icon: "lucide:copy", color: "#D97706", bgColor: "#FEF3C7" },
  { id: "draft", label: "Draft", currency: "SGD", amount: "3,792,482.90", count: 46, icon: "lucide:file-text", color: "#2563EB", bgColor: "#EFF6FF" },
  { id: "accepted", label: "Accepted", currency: "SGD", amount: "4,850.00", count: 3, icon: "lucide:check-circle-2", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "rejected", label: "Rejected", currency: "AUD", amount: "1,627.40", count: 142, icon: "lucide:x-circle", color: "#DC2626", bgColor: "#FEE2E2" },
  { id: "cancelled", label: "Cancelled", currency: "AUD", amount: "1,627.40", count: 296, icon: "lucide:ban", color: "#EA580C", bgColor: "#FFEDD5" },
  { id: "paid", label: "Paid", currency: "SGD", amount: "3,737,654.00", count: 20, icon: "lucide:link-2", color: "#16A34A", bgColor: "#DCFCE7" },
  { id: "partial-paid", label: "Partially Paid", currency: "SGD", amount: "3,792,482.90", count: 46, icon: "lucide:rotate-ccw", color: "#D97706", bgColor: "#FEF3C7" },
  { id: "incoming", label: "Incoming/Created", currency: "SGD", amount: "4,850.00", count: 3, icon: "lucide:mail", color: "#0D9488", bgColor: "#CCFBF1" },
  { id: "pending", label: "Pending", currency: "AUD", amount: "1,627.40", count: 142, icon: "lucide:clock-3", color: "#9333EA", bgColor: "#F3E8FF" },
];

export default function BillsToPayPage() {
  const [activeCard, setActiveCard] = useState("all");
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Bills To Pay</h1>
            <div className={styles.actions}>
              <button className={styles.btnOutline}>
                <Icon icon="lucide:refresh-cw" width={14} />
                Convert From
                <Icon icon="lucide:chevron-down" width={12} />
              </button>
              <button className={styles.btnOutlineOrange} onClick={() => setImportOpen(true)}>
                <Icon icon="lucide:download" width={14} />
                Import
              </button>
              <Link href="/bills-to-pay/new" className={styles.btnSolid}>
                <Icon icon="lucide:plus" width={15} />
                Create Bill
              </Link>
            </div>
          </div>

          <ImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />

          <div className={styles.cardsGrid}>
            {STATUS_CARDS.map((card) => (
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

          <InvoiceTable />
        </main>
      </div>
    </div>
  );
}
