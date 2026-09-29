"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ActionButton from "@/components/ActionButton";
import NewRuleVersionModal, { StaffAllocationRow } from "@/components/NewRuleVersionModal";
import styles from "./page.module.css";

interface CostCentreOption {
  code: string;
  name: string;
  activeVersion: string;
  staffCount: number;
}

const MOCK_COST_CENTRES: CostCentreOption[] = [
  { code: "SG-DRY", name: "Singapore Dry Bulk", activeVersion: "v2", staffCount: 3 },
  { code: "EU-DESK", name: "Europe Desk", activeVersion: "v1", staffCount: 4 },
  { code: "NR-001", name: "Nesty Regional", activeVersion: "v1", staffCount: 2 },
  { code: "ADMIN", name: "Administration", activeVersion: "v1", staffCount: 5 },
  { code: "CC001", name: "Default", activeVersion: "v1", staffCount: 1 },
  { code: "90000", name: "90000", activeVersion: "v1", staffCount: 1 },
];

interface RuleVersion {
  versionNumber: number;
  status: "Active" | "Scheduled" | "Superseded";
  effectiveFrom: string;
  effectiveTo: string;
  descriptor: string;
  allocations: StaffAllocationRow[];
}

const INITIAL_VERSIONS: RuleVersion[] = [
  {
    versionNumber: 3,
    status: "Scheduled",
    effectiveFrom: "01 Jan 2027",
    effectiveTo: "31 Dec 2027",
    descriptor: "Scheduled — Starts on 01 Jan 2027 for next fiscal period",
    allocations: [
      { staffCode: "ST-001", staffName: "Priya Nair", entity: "Entity A", department: "Operations", sharePercent: 40 },
      { staffCode: "ST-002", staffName: "Rachel Lim", entity: "Entity A", department: "Chartering", sharePercent: 40 },
      { staffCode: "ST-004", staffName: "Aisha Rahman", entity: "Entity B", department: "Broking", sharePercent: 20 },
    ],
  },
  {
    versionNumber: 2,
    status: "Active",
    effectiveFrom: "01 Jan 2026",
    effectiveTo: "31 Dec 2026",
    descriptor: "Active — Currently used for new claims & active cost splits",
    allocations: [
      { staffCode: "ST-001", staffName: "Priya Nair", entity: "Entity A", department: "Operations", sharePercent: 50 },
      { staffCode: "ST-002", staffName: "Rachel Lim", entity: "Entity A", department: "Chartering", sharePercent: 30 },
      { staffCode: "ST-004", staffName: "Aisha Rahman", entity: "Entity B", department: "Broking", sharePercent: 20 },
    ],
  },
  {
    versionNumber: 1,
    status: "Superseded",
    effectiveFrom: "01 Jan 2025",
    effectiveTo: "31 Dec 2025",
    descriptor: "Superseded — Past historical rule version. Claims locked.",
    allocations: [
      { staffCode: "ST-001", staffName: "Priya Nair", entity: "Entity A", department: "Operations", sharePercent: 60 },
      { staffCode: "ST-002", staffName: "Rachel Lim", entity: "Entity A", department: "Chartering", sharePercent: 40 },
    ],
  },
];

interface AuditEvent {
  id: string;
  title: string;
  user: string;
  time: string;
  type: "Version Activations" | "Approvals" | "Other";
}

const INITIAL_AUDIT_LOG: AuditEvent[] = [
  {
    id: "a1",
    title: "Version 2 Rule Activated",
    user: "System Admin",
    time: "01 Jan 2026 09:00 AM",
    type: "Version Activations",
  },
  {
    id: "a2",
    title: "Version 2 Created & Approved",
    user: "Rachel Lim (Chartering Lead)",
    time: "28 Dec 2025 04:30 PM",
    type: "Approvals",
  },
  {
    id: "a3",
    title: "Staff ST-004 Aisha Rahman Added (20% Share)",
    user: "Daniel Tan",
    time: "28 Dec 2025 02:15 PM",
    type: "Other",
  },
  {
    id: "a4",
    title: "Version 1 Deactivated & Marked Superseded",
    user: "System Admin",
    time: "31 Dec 2025 11:59 PM",
    type: "Version Activations",
  },
];

export default function CostCentreDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const currentCode = decodeURIComponent(params.id || "SG-DRY");

  const activeCC =
    MOCK_COST_CENTRES.find(
      (c) => c.code.toLowerCase() === currentCode.toLowerCase()
    ) || {
      code: currentCode,
      name: currentCode === "SG-DRY" ? "Singapore Dry Bulk" : `${currentCode} Desk`,
      activeVersion: "v2",
      staffCount: 3,
    };

  const [ccSearch, setCcSearch] = useState("");
  const [versions, setVersions] = useState<RuleVersion[]>(INITIAL_VERSIONS);
  const [selectedVersionNum, setSelectedVersionNum] = useState<number>(3); // Default Version 3

  const [auditSearch, setAuditSearch] = useState("");
  const [auditTab, setAuditTab] = useState<"All" | "Version Activations" | "Approvals">("All");

  const [isNewVersionModalOpen, setIsNewVersionModalOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  const selectedVersion =
    versions.find((v) => v.versionNumber === selectedVersionNum) || versions[0];

  const totalSharePercent = selectedVersion.allocations.reduce(
    (sum, item) => sum + item.sharePercent,
    0
  );

  const filteredCCList = MOCK_COST_CENTRES.filter(
    (c) =>
      c.code.toLowerCase().includes(ccSearch.toLowerCase()) ||
      c.name.toLowerCase().includes(ccSearch.toLowerCase())
  );

  const filteredAuditLog = INITIAL_AUDIT_LOG.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(auditSearch.toLowerCase()) ||
      ev.user.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesTab = auditTab === "All" || ev.type === auditTab;
    return matchesSearch && matchesTab;
  });

  const handleSaveNewVersion = (newVer: {
    versionNumber: number;
    effectiveFrom: string;
    effectiveTo: string;
    allocations: StaffAllocationRow[];
  }) => {
    const created: RuleVersion = {
      versionNumber: newVer.versionNumber,
      status: "Scheduled",
      effectiveFrom: newVer.effectiveFrom,
      effectiveTo: newVer.effectiveTo,
      descriptor: `Scheduled — Starts on ${newVer.effectiveFrom} for future period`,
      allocations: newVer.allocations,
    };
    setVersions([created, ...versions]);
    setSelectedVersionNum(created.versionNumber);
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainContent}>
        <Header />

        <div className={styles.pageBody}>
          {/* Top Header Row with Right-Aligned Controls */}
          <div className={styles.topHeaderRow}>
            <div className={styles.titleArea}>
              <Link href="/configuration/cost-centre" className={styles.breadcrumbLink}>
                <Icon icon="lucide:arrow-left" width={16} />
                Back to Cost Centres
              </Link>
              <h1 className={styles.pageTitle}>
                {activeCC.code} · {activeCC.name}
              </h1>
              <p className={styles.pageSub}>
                Cost allocation rule versioning, staff split history, and audit log.
              </p>
            </div>

            {/* Top Control Bar: Version Dropdown (without 'Select Version:' text), Audit History Button, New Version Button */}
            <div className={styles.controlsBar}>
              {/* Clean Rule Version Dropdown */}
              <select
                className={styles.versionSelectDropdown}
                value={selectedVersionNum}
                onChange={(e) => setSelectedVersionNum(Number(e.target.value))}
                aria-label="Rule Version"
              >
                {versions.map((ver) => (
                  <option key={ver.versionNumber} value={ver.versionNumber}>
                    Version {ver.versionNumber} ({ver.status})
                  </option>
                ))}
              </select>

              {/* Audit History Log Button */}
              <button
                type="button"
                className={styles.btnSecondaryIcon}
                onClick={() => setIsAuditDrawerOpen(true)}
              >
                <Icon icon="lucide:history" width={17} />
                Audit History Log ({INITIAL_AUDIT_LOG.length})
              </button>

              {/* + New Version Primary Button */}
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => setIsNewVersionModalOpen(true)}
              >
                <Icon icon="lucide:plus" width={18} />
                + New Version
              </button>
            </div>
          </div>

          {/* 2-Column Grid Layout: Minimized Left Switcher (200px) + Highlighted Main Content */}
          <div className={styles.layoutGrid}>
            {/* Minimized & Simple Left Panel: Cost Centres Quick Switcher */}
            <div className={styles.card}>
              <div className={styles.leftHeader}>
                <span className={styles.leftTitle}>Cost Centres</span>
                <div className={styles.searchBox}>
                  <Icon icon="lucide:search" width={13} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Filter..."
                    className={styles.searchInput}
                    value={ccSearch}
                    onChange={(e) => setCcSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.ccList}>
                {filteredCCList.map((cc) => {
                  const isSelected = cc.code.toLowerCase() === activeCC.code.toLowerCase();
                  return (
                    <Link
                      key={cc.code}
                      href={`/configuration/cost-centre/${cc.code}`}
                      className={`${styles.ccItem} ${isSelected ? styles.ccItemActive : ""}`}
                    >
                      <span className={styles.ccCode}>{cc.code}</span>
                      <span className={styles.ccBadge}>{cc.activeVersion}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Main Content: Highlighting the Active Version & Allocation Table */}
            <div className={styles.mainStack}>
              {/* Compact Protection Alert Banner (Item 2 UX Analysis) */}
              <div className={styles.protectionBanner}>
                <Icon icon="lucide:shield-check" width={18} className={styles.protectionBannerIcon} />
                <div className={styles.protectionText}>
                  <strong>Past Claim Integrity Protected:</strong> Rule version changes take effect strictly on their start date. Historical approved claims remain unchanged and locked to their respective active version.
                </div>
              </div>

              {/* Highlighted Version Allocation Table Card */}
              <div className={styles.card}>
                <div className={styles.activeVersionHeader}>
                  <div className={styles.activeVersionTitle}>
                    <span style={{ fontSize: "16px", fontWeight: 700 }}>
                      Version {selectedVersion.versionNumber}
                    </span>
                    <span
                      className={
                        selectedVersion.status === "Active"
                          ? styles.versionBadgeActive
                          : selectedVersion.status === "Scheduled"
                          ? styles.badgeScheduled
                          : styles.badgeSuperseded
                      }
                    >
                      {selectedVersion.status}
                    </span>
                    <span className={styles.versionMeta}>
                      Effective: {selectedVersion.effectiveFrom} — {selectedVersion.effectiveTo}
                    </span>
                  </div>

                  {/* Temporal Descriptor Box - Right side & smaller (User Request) */}
                  <div className={styles.versionDescriptorBox}>
                    {selectedVersion.descriptor}
                  </div>
                </div>

                {/* Highlighted Staff Allocation Table */}
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Staff Code</th>
                        <th>Staff Name</th>
                        <th>Entity</th>
                        <th>Department</th>
                        <th style={{ textAlign: "right" }}>Share %</th>
                        <th style={{ textAlign: "right", paddingRight: "24px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedVersion.allocations.map((staff, idx) => (
                        <tr key={idx} className={styles.tableRow}>
                          <td style={{ fontWeight: 700 }}>{staff.staffCode}</td>
                          <td style={{ fontWeight: 600 }}>{staff.staffName}</td>
                          <td>{staff.entity}</td>
                          <td>{staff.department}</td>
                          <td style={{ textAlign: "right" }}>
                            <span className={styles.percentBadge}>{staff.sharePercent}%</span>
                          </td>
                          <td style={{ textAlign: "right", paddingRight: "20px" }}>
                            <div className={styles.actionCell}>
                              <ActionButton
                                type="edit"
                                tooltip="Edit Share"
                                onClick={() => alert(`Editing share for ${staff.staffName}`)}
                              />
                              <button
                                type="button"
                                className={styles.btnIconDelete}
                                title="Remove Staff"
                                onClick={() => alert(`Remove ${staff.staffName} from version`)}
                              >
                                <Icon icon="lucide:trash-2" width={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Card Footer */}
                <div className={styles.cardFooter}>
                  <span>Showing {selectedVersion.allocations.length} allocated staff members</span>
                  <span style={{ fontWeight: 700, color: "#E8692A" }}>
                    Total Allocation Share: {totalSharePercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right-Side Audit History Slide-Over Drawer Modal */}
      {isAuditDrawerOpen && (
        <div
          className={styles.drawerOverlay}
          onClick={() => setIsAuditDrawerOpen(false)}
        >
          <div className={styles.drawerCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Audit History Log</span>
              <button
                className={styles.btnCloseDrawer}
                onClick={() => setIsAuditDrawerOpen(false)}
                aria-label="Close Audit History Log"
              >
                <Icon icon="lucide:x" width={18} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* Search Box */}
              <div className={styles.drawerSearchBox}>
                <Icon icon="lucide:search" width={15} className={styles.drawerSearchIcon} />
                <input
                  type="text"
                  placeholder="Search audit log..."
                  className={styles.drawerSearchInput}
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                />
              </div>

              {/* Filter Tabs */}
              <div className={styles.auditTabRow}>
                <button
                  className={`${styles.auditTab} ${auditTab === "All" ? styles.auditTabActive : ""}`}
                  onClick={() => setAuditTab("All")}
                >
                  All Events
                </button>
                <button
                  className={`${styles.auditTab} ${
                    auditTab === "Version Activations" ? styles.auditTabActive : ""
                  }`}
                  onClick={() => setAuditTab("Version Activations")}
                >
                  Activations
                </button>
                <button
                  className={`${styles.auditTab} ${
                    auditTab === "Approvals" ? styles.auditTabActive : ""
                  }`}
                  onClick={() => setAuditTab("Approvals")}
                >
                  Approvals
                </button>
              </div>

              {/* Timeline Items */}
              <div className={styles.auditTimeline}>
                {filteredAuditLog.map((ev) => (
                  <div key={ev.id} className={styles.auditItem}>
                    <div className={styles.auditIconDot}>
                      <Icon icon="lucide:clock" width={14} />
                    </div>
                    <div className={styles.auditContent}>
                      <span className={styles.auditEventTitle}>{ev.title}</span>
                      <span className={styles.auditEventMeta}>by {ev.user}</span>
                      <span className={styles.auditEventTime}>{ev.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Version Modal */}
      <NewRuleVersionModal
        isOpen={isNewVersionModalOpen}
        onClose={() => setIsNewVersionModalOpen(false)}
        costCentreCode={activeCC.code}
        costCentreName={activeCC.name}
        currentVersionNumber={versions[0]?.versionNumber || 2}
        onSaveVersion={handleSaveNewVersion}
      />
    </div>
  );
}
