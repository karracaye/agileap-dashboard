"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import styles from "./GSTConfigurationModal.module.css";

interface GSTConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (schedule: { active: boolean; frequency: string; time: string; day?: string }) => void;
}

export default function GSTConfigurationModal({ isOpen, onClose, onSave }: GSTConfigurationModalProps) {
  const [active, setActive] = useState(true);
  const [frequency, setFrequency] = useState<"daily" | "monthly" | "quarterly">("daily");
  const [monthlyOption, setMonthlyOption] = useState("last-day");
  const [quarterlyOption, setQuarterlyOption] = useState("end-quarter");
  const [executionTime, setExecutionTime] = useState("16:40");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        active,
        frequency,
        time: executionTime,
        day: frequency === "monthly" ? monthlyOption : frequency === "quarterly" ? quarterlyOption : undefined,
      });
    }
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>IRAS Automated Submission Schedule</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <Icon icon="lucide:x" width={18} height={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Master Control Card */}
            <div className={styles.controlCard}>
              <div className={styles.controlRow}>
                <span className={styles.controlTitle}>Enable Scheduled IRAS Submission</span>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
              <p className={styles.controlDesc}>
                Automatically files pending manual-filing InvoiceNow transactions to IRAS based on your set schedule. Generated filing logs can be viewed under Reports.
              </p>
            </div>

            {/* Section: Frequency Selection */}
            <div className={styles.fieldGroup}>
              <h4 className={styles.sectionTitle}>Select Submission Frequency</h4>
              <div className={styles.frequencyGrid}>
                <div
                  className={`${styles.freqCard} ${frequency === "daily" ? styles.freqCardActive : ""}`}
                  onClick={() => active && setFrequency("daily")}
                >
                  <Icon icon="lucide:calendar-days" width={22} height={22} className={styles.freqIcon} />
                  <span className={styles.freqLabel}>Daily</span>
                </div>

                <div
                  className={`${styles.freqCard} ${frequency === "monthly" ? styles.freqCardActive : ""}`}
                  onClick={() => active && setFrequency("monthly")}
                >
                  <Icon icon="lucide:calendar-range" width={22} height={22} className={styles.freqIcon} />
                  <span className={styles.freqLabel}>Monthly</span>
                </div>

                <div
                  className={`${styles.freqCard} ${frequency === "quarterly" ? styles.freqCardActive : ""}`}
                  onClick={() => active && setFrequency("quarterly")}
                >
                  <Icon icon="lucide:calendar-clock" width={22} height={22} className={styles.freqIcon} />
                  <span className={styles.freqLabel}>Quarterly</span>
                </div>
              </div>
            </div>

            {/* Section: Schedule Timing Details */}
            <div className={styles.subPanel}>
              {frequency === "monthly" && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Execution Day of Month</label>
                  <select
                    className={styles.select}
                    value={monthlyOption}
                    onChange={(e) => setMonthlyOption(e.target.value)}
                    disabled={!active}
                  >
                    <option value="first-day">First day of the month</option>
                    <option value="last-day">Last day of the month</option>
                  </select>
                </div>
              )}

              {frequency === "quarterly" && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Quarterly Filing Window</label>
                  <select
                    className={styles.select}
                    value={quarterlyOption}
                    onChange={(e) => setQuarterlyOption(e.target.value)}
                    disabled={!active}
                  >
                    <option value="end-quarter">End of Quarter (Mar 31, Jun 30, Sep 30, Dec 31)</option>
                    <option value="f5-deadline">1 Month Post-Quarter (F5 Return Deadline Window)</option>
                  </select>
                </div>
              )}

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Execution Time</label>
                <input
                  type="time"
                  className={styles.input}
                  value={executionTime}
                  onChange={(e) => setExecutionTime(e.target.value)}
                  disabled={!active}
                  required
                />
              </div>
            </div>

            {/* IRAS Filing Deadline Reference Notice */}
            <div className={styles.deadlineBox}>
              <Icon icon="lucide:shield-alert" width={18} height={18} className={styles.deadlineIcon} />
              <div>
                <h5 className={styles.deadlineTitle}>IRAS GST F5 Filing Deadline Reference</h5>
                <p className={styles.deadlineText}>
                  GST F5 returns and full payments are due no later than 1 month after the end of each accounting quarter.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
