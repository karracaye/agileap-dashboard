"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UserGroupModal from "@/components/UserGroupModal";
import BusinessUnitModal from "@/components/BusinessUnitModal";
import styles from "./page.module.css";

export default function ConfigurationPage() {
  const [buModalOpen, setBuModalOpen] = useState(false);
  const [userGroupModalOpen, setUserGroupModalOpen] = useState(false);

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>
          {/* Breadcrumb Row */}
          <div className={styles.breadcrumbRow}>
            <Icon icon="lucide:home" width={16} height={16} className={styles.breadcrumbIcon} />
            <span>Configuration</span>
          </div>

          {/* Simple 2-Column Category Grid */}
          <div className={styles.grid}>
            {/* Column 1 (Left) */}
            <div className={styles.column}>
              {/* Company */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Company</h3>
                <div className={styles.list}>
                  <Link href="/configuration/basic-settings" className={styles.cardBtn}>
                    Basic Settings
                  </Link>
                  <div className={styles.cardBtn}>Location Management</div>
                  <div className={styles.cardBtn}>GL Codes</div>
                  <Link href="/configuration/cost-centre" className={styles.cardBtn}>
                    Cost Centre
                  </Link>
                  <div className={styles.cardBtn}>Taxes</div>
                  <div className={styles.cardBtn}>Custom Numbering</div>
                  <div className={styles.cardBtn}>Payment Terms</div>
                  <div className={styles.cardBtn}>Currency Rates</div>
                  <div className={styles.cardBtn}>Company Subsidiary</div>
                  <div
                    className={styles.cardBtn}
                    onClick={() => setBuModalOpen(true)}
                    style={{ cursor: "pointer" }}
                  >
                    Business Unit
                  </div>
                  <div className={styles.cardBtn}>Payment Method</div>
                </div>
              </div>

              {/* Inventory */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Inventory</h3>
                <div className={styles.list}>
                  <div className={styles.cardBtn}>Products and Services</div>
                  <div className={styles.cardBtn}>Inventory</div>
                  <div className={styles.cardBtn}>Unit of Measurement</div>
                  <div className={styles.cardBtn}>Category Management</div>
                </div>
              </div>

              {/* Vendor / Customer */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Vendor / Customer</h3>
                <div className={styles.list}>
                  <div className={styles.cardBtn}>Vendor / Customer Configuration</div>
                </div>
              </div>

              {/* Accounting */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Accounting</h3>
                <div className={styles.list}>
                  <div className={styles.cardBtn}>GL Entry Template</div>
                </div>
              </div>
            </div>

            {/* Column 2 (Right) */}
            <div className={styles.column}>
              {/* User Management */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>User Management</h3>
                <div className={styles.list}>
                  <div className={styles.cardBtn}>User Management</div>
                  <Link href="/configuration/staff-management" className={styles.cardBtn}>
                    Staff Management
                  </Link>
                  <div className={styles.cardBtn}>Role Access</div>
                  <div
                    className={styles.cardBtn}
                    onClick={() => setUserGroupModalOpen(true)}
                    style={{ cursor: "pointer" }}
                  >
                    User Group
                  </div>
                  <div className={styles.cardBtn}>Department</div>
                </div>
              </div>

              {/* Claims */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Claims</h3>
                <div className={styles.list}>
                  <div className={styles.cardBtn}>Claim Type</div>
                </div>
              </div>

              {/* Approval Workflow */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Approval Workflow</h3>
                <div className={styles.list}>
                  <div className={styles.cardBtn}>Workflow</div>
                </div>
              </div>

              {/* Others */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Others</h3>
                <div className={styles.list}>
                  <div className={styles.cardBtn}>Items Custom Fields</div>
                  <div className={styles.cardBtn}>Menu Management</div>
                  <div className={styles.cardBtn}>Template Header Configuration</div>
                  <div className={styles.cardBtn}>Financial Calendar</div>
                  <div className={styles.cardBtn}>Posting Period</div>
                </div>
              </div>

              {/* Timesheet */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Timesheet</h3>
                <div className={styles.list}>
                  <div className={styles.cardBtn}>Timesheet Management</div>
                </div>
              </div>

              {/* Sales */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Sales</h3>
                <div className={styles.list}>
                  <div className={styles.cardBtn}>Sales Management</div>
                </div>
              </div>

              {/* Security */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Security</h3>
                <div className={styles.list}>
                  <div className={styles.cardBtn}>Password Policy</div>
                </div>
              </div>
            </div>
          </div>

          <BusinessUnitModal
            isOpen={buModalOpen}
            onClose={() => setBuModalOpen(false)}
          />

          <UserGroupModal
            isOpen={userGroupModalOpen}
            onClose={() => setUserGroupModalOpen(false)}
          />
        </main>
      </div>
    </div>
  );
}
