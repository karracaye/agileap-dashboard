"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import styles from "./ActionButton.module.css";

export interface ActionButtonProps {
  type: "view" | "edit";
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  tooltip?: string;
  size?: number;
  iconSize?: number;
  className?: string;
}

export default function ActionButton({
  type,
  href,
  onClick,
  tooltip,
  size = 32,
  iconSize = 16,
  className = "",
}: ActionButtonProps) {
  const isView = type === "view";
  const tooltipText = tooltip || (isView ? "View" : "Edit");
  const iconName = isView ? "lucide:eye" : "lucide:square-pen";

  const buttonStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const btnClass = `${styles.btn} ${isView ? styles.viewBtn : styles.editBtn} ${className}`;

  const content = (
    <Icon
      icon={iconName}
      width={iconSize}
      height={iconSize}
      style={{ display: "block" }}
    />
  );

  return (
    <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
      <span className={styles.tooltip}>{tooltipText}</span>

      {href ? (
        <Link href={href} className={btnClass} style={buttonStyle} aria-label={tooltipText}>
          {content}
        </Link>
      ) : (
        <button
          type="button"
          className={btnClass}
          style={buttonStyle}
          onClick={onClick}
          aria-label={tooltipText}
        >
          {content}
        </button>
      )}
    </div>
  );
}
