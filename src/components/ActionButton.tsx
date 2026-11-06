"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import styles from "./ActionButton.module.css";

export interface ActionButtonProps {
  type?: "view" | "edit" | "print" | "delete" | "download" | "custom";
  variant?: "primary" | "secondary" | "soft";
  icon?: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  tooltip?: string;
  size?: number;
  iconSize?: number;
  className?: string;
}

export default function ActionButton({
  type = "view",
  variant,
  icon,
  href,
  onClick,
  tooltip,
  size = 28,
  iconSize = 14,
  className = "",
}: ActionButtonProps) {
  let defaultIcon = "lucide:eye";
  let defaultTooltip = "View";

  if (type === "edit") {
    defaultIcon = "lucide:square-pen";
    defaultTooltip = "Edit";
  } else if (type === "print") {
    defaultIcon = "lucide:printer";
    defaultTooltip = "Print";
  } else if (type === "delete") {
    defaultIcon = "lucide:trash-2";
    defaultTooltip = "Delete";
  } else if (type === "download") {
    defaultIcon = "lucide:download";
    defaultTooltip = "Download";
  }

  const iconName = icon || defaultIcon;
  const tooltipText = tooltip || defaultTooltip;

  // Determine button variant style
  let styleClass = styles.viewBtn;
  if (variant === "primary") {
    styleClass = styles.primaryBtn;
  } else if (variant === "soft") {
    styleClass = styles.softBtn;
  } else if (variant === "secondary") {
    styleClass = styles.secondaryBtn;
  } else if (type === "edit") {
    styleClass = styles.primaryBtn;
  } else if (type === "print") {
    styleClass = styles.softBtn;
  } else if (type === "delete") {
    styleClass = styles.deleteBtn;
  } else if (type === "view") {
    styleClass = styles.viewBtn;
  }

  const buttonStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const btnClass = `${styles.btn} ${styleClass} ${className}`;

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
