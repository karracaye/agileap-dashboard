"use client";
import React from "react";
import StatusCard from "./StatusCard";
import styles from "./StatusSummarySection.module.css";

export interface StatusSummaryItem {
  id: string;
  label: string;
  currency?: string;
  amount?: string;
  count: number;
  icon?: string;
  color: string;
  bgColor: string;
}

interface StatusSummarySectionProps {
  cards: StatusSummaryItem[];
  activeId: string;
  onSelect: (card: StatusSummaryItem) => void;
  matchBy?: "id" | "label";
  gridClassName?: string;
  gridStyle?: React.CSSProperties;
}

export default function StatusSummarySection({
  cards,
  activeId,
  onSelect,
  matchBy = "id",
  gridClassName,
  gridStyle,
}: StatusSummarySectionProps) {
  const isCardActive = (card: StatusSummaryItem) =>
    matchBy === "label" ? activeId === card.label : activeId === card.id;

  return (
    <div className={gridClassName || styles.defaultTilesGrid} style={gridStyle}>
      {cards.map((card) => (
        <StatusCard
          key={card.id}
          id={card.id}
          label={card.label}
          currency={card.currency}
          amount={card.amount}
          count={card.count}
          icon={card.icon || "lucide:circle"}
          color={card.color}
          bgColor={card.bgColor}
          active={isCardActive(card)}
          onClick={() => onSelect(card)}
        />
      ))}
    </div>
  );
}
