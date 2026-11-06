"use client";
import React from "react";
import styles from "./StatusCard.module.css";
import { Icon } from "@iconify/react";

interface StatusCardProps {
  id: string;
  label: string;
  currency?: string;
  amount?: string;
  count: number;
  icon: string;
  color: string;
  bgColor: string;
  active?: boolean;
  onClick?: () => void;
}

export default function StatusCard({
  label,
  currency = "SGD",
  amount,
  count,
  icon,
  color,
  bgColor,
  active,
  onClick,
}: StatusCardProps) {
  const hasAmount = Boolean(amount && amount.trim() !== "");
  const displayAmount = hasAmount ? amount : "0.00";
  const isZero = count === 0;
  const effectiveColor = isZero ? "#475569" : color;
  const effectiveBg = isZero ? "#EEF2F6" : bgColor;

  return (
    <button
      type="button"
      className={`${styles.card} ${isZero ? styles.cardZero : ""} ${active ? styles.cardActive : ""}`}
      onClick={onClick}
      style={{ "--accent": effectiveColor, "--accent-bg": effectiveBg } as React.CSSProperties}
      aria-pressed={active}
      aria-label={label}
    >
      <div className={styles.topRow}>
        <span className={styles.label}>{label}</span>
        <span className={styles.countBadge}>{count}</span>
      </div>

      <div className={styles.middleRow}>
        <span className={styles.amount}>{displayAmount}</span>
        <span className={styles.currency}>{currency}</span>
      </div>

      <span className={styles.activeBar} />
    </button>
  );
}
