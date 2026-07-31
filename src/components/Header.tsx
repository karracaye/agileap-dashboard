"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import { Icon } from "@iconify/react";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [companyCollapsed, setCompanyCollapsed] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("Activants PINT Test");

  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.right}>
        {/* Top Right Utilities */}
        <div className={styles.iconGroup}>
          <button className={styles.iconBtn} title="Notifications" aria-label="Notifications">
            <Icon icon="lucide:bell" width={18} height={18} />
          </button>
          <button className={styles.iconBtn} title="Language / Translation" aria-label="Language">
            <Icon icon="lucide:languages" width={18} height={18} />
          </button>
          <button className={styles.helpBtn} title="Help Center">
            <Icon icon="lucide:help-circle" width={18} height={18} />
            <span>Help</span>
          </button>
        </div>

        {/* User Account Profile Trigger */}
        <div className={styles.profileWrapper} ref={profileRef}>
          <div
            className={styles.userProfile}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className={styles.avatar}>
              <span>J</span>
            </div>
            <div className={styles.userInfo}>
              <span className={styles.welcome}>Welcome</span>
              <span className={styles.userName}>Joshua Lee (Test)</span>
            </div>
            <Icon
              icon="lucide:chevron-down"
              width={14}
              className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ""}`}
            />
          </div>

          {/* User Account Dropdown Menu (Exact Match to User Screenshot) */}
          {dropdownOpen && (
            <div className={styles.userDropdown}>

              {/* 1. Switch Company Accordion */}
              <div
                className={styles.companyHeader}
                onClick={() => setCompanyCollapsed(!companyCollapsed)}
              >
                <span className={styles.companyTitle}>Switch Company</span>
                <Icon
                  icon="lucide:chevron-up"
                  width={16}
                  style={{ transform: companyCollapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                />
              </div>

              {!companyCollapsed && (
                <div className={styles.companyList}>
                  {/* Primary Selected Company */}
                  <div className={`${styles.companyItem} ${styles.companyPrimary}`}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "14.5px" }}>Activants PINT Test</div>
                    </div>
                    <span className={styles.primaryBadge}>Primary</span>
                  </div>

                  {/* Other Companies */}
                  <div
                    className={styles.companyItem}
                    onClick={() => {
                      setSelectedCompany("Acme Inc.");
                      setDropdownOpen(false);
                    }}
                  >
                    Acme Inc.
                  </div>

                  <div
                    className={styles.companyItem}
                    onClick={() => {
                      setSelectedCompany("Activants UAT");
                      setDropdownOpen(false);
                    }}
                  >
                    Activants UAT
                  </div>
                </div>
              )}

              {/* 2. Menu Items */}
              <div className={styles.menuNav}>
                <div className={styles.menuItem}>Subscription &amp; Billing</div>
                <div className={styles.menuItem}>Profile</div>
                <div className={styles.menuItem}>Logout</div>
              </div>

              {/* 3. Monthly Usage Card */}
              <div className={styles.usageCard}>
                <span className={styles.usageTitle}>Monthly Usage</span>

                {/* Usage Bar 1: User Management */}
                <div className={styles.usageItem}>
                  <div className={styles.usageLabelRow}>
                    <span>User Management</span>
                    <span className={styles.usageCount}>15 / 500</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressBar} style={{ width: "3%" }} />
                  </div>
                </div>

                {/* Usage Bar 2: InvoiceNow (Peppol) Documents */}
                <div className={styles.usageItem}>
                  <div className={styles.usageLabelRow}>
                    <span>InvoiceNow (Peppol) Documents (Invoice, CN, PO)</span>
                    <span className={styles.usageCount}>33 / 300</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressBar} style={{ width: "11%" }} />
                  </div>
                </div>

                {/* Usage Bar 3: Email Documents */}
                <div className={styles.usageItem}>
                  <div className={styles.usageLabelRow}>
                    <span>Email Documents (Invoice, CN, PO)</span>
                    <span className={styles.usageCount}>3 / 300</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressBar} style={{ width: "1%" }} />
                  </div>
                </div>
              </div>

              {/* 4. Footer Version Tag */}
              <div className={styles.versionText}>
                Version e108e874f56d
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
