"use client";

import React, { useRef, useEffect } from "react";
import styles from "./ColumnPicker.module.css";

export interface ColumnItem<T extends string = string> {
  key: T;
  label: string;
  locked?: boolean;
}

interface ColumnPickerProps<T extends string = string> {
  columns: readonly ColumnItem<T>[];
  visible: T[];
  defaultVisible: T[];
  onChange: (visible: T[]) => void;
  onClose: () => void;
}

export default function ColumnPicker<T extends string = string>({
  columns,
  visible,
  defaultVisible,
  onChange,
  onClose,
}: ColumnPickerProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const toggle = (key: T, locked?: boolean) => {
    if (locked) return;
    onChange(
      visible.includes(key)
        ? visible.filter((k) => k !== key)
        : [...visible, key]
    );
  };

  const reset = () => onChange([...defaultVisible]);

  return (
    <div className={styles.pickerCard} ref={ref}>
      {/* Header */}
      <div className={styles.pickerHeader}>
        <div>
          <p className={styles.pickerTitle}>Customize Columns</p>
          <p className={styles.pickerSub}>
            {visible.length} of {columns.length} columns visible
          </p>
        </div>
        <button className={styles.pickerReset} onClick={reset} title="Reset to defaults">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
          </svg>
          Reset
        </button>
      </div>

      {/* Column List */}
      <div className={styles.pickerList}>
        {columns.map((col) => {
          const isVisible = visible.includes(col.key);
          return (
            <label
              key={col.key}
              className={`${styles.pickerRow} ${col.locked ? styles.pickerRowLocked : ""}`}
              title={col.locked ? "This column is always visible" : undefined}
            >
              <span className={styles.pickerCheck}>
                <input
                  type="checkbox"
                  checked={isVisible}
                  disabled={col.locked}
                  onChange={() => toggle(col.key, col.locked)}
                  className={styles.pickerCb}
                  aria-label={`toggle ${col.label}`}
                />
                <span
                  className={`${styles.pickerCheckBox} ${
                    isVisible ? styles.pickerCheckBoxOn : ""
                  }`}
                >
                  {isVisible && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="2 6 5 9 10 3" />
                    </svg>
                  )}
                </span>
              </span>
              <span className={styles.pickerLabel}>{col.label}</span>
              {col.locked && <span className={styles.pickerLockBadge}>Always on</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
}
