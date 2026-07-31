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

  return (
    <button
      type="button"
      className={`${styles.card} ${active ? styles.cardActive : ""}`}
      onClick={onClick}
      style={{ "--accent": color, "--accent-bg": bgColor } as React.CSSProperties}
      aria-pressed={active}
      aria-label={label}
    >
      <div className={styles.topRow}>
        <div className={styles.iconWrap} style={{ background: bgColor, color }}>
          <Icon icon={icon} width={16} height={16} aria-hidden="true" />
        </div>
        <span className={styles.countBadge}>{count}</span>
      </div>

      <div>
        <div className={styles.middleRow}>
          <span className={styles.amount}>{displayAmount}</span>
          <span className={styles.currency}>{currency}</span>
        </div>
        <p className={styles.label}>{label}</p>
      </div>

      <span className={styles.activeBar} />
    </button>
  );
}
