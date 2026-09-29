"use client";

import React, { useState, useEffect } from "react";
import styles from "./AddStaffModal.module.css";
import { Icon } from "@iconify/react";
import Link from "next/link";

export interface StaffFormData {
  id?: string;
  staffCode: string;
  staffName: string;
  entity: string;
  department: string;
  costCentreCode: string;
  costCentreName: string;
  email: string;
  linkedUser: string;
  pnlAllocation: "Included" | "Not included";
  status: "Active" | "Inactive";
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitStaff: (staff: StaffFormData) => void;
  initialData?: StaffFormData | null;
}

export default function AddStaffModal({
  isOpen,
  onClose,
  onSubmitStaff,
  initialData,
}: AddStaffModalProps) {
  const isEditing = Boolean(initialData && initialData.staffCode);

  const [staffCode, setStaffCode] = useState("");
  const [staffName, setStaffName] = useState("");
  const [entity, setEntity] = useState("Entity A");
  const [department, setDepartment] = useState("Operations");
  const [costCentre, setCostCentre] = useState("EU-DESK · Europe Desk");
  const [email, setEmail] = useState("");
  const [linkedUser, setLinkedUser] = useState("Not linked");
  const [includePnl, setIncludePnl] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setStaffCode(initialData.staffCode || "");
      setStaffName(initialData.staffName || "");
      setEntity(initialData.entity || "Entity A");
      setDepartment(initialData.department || "Operations");
      setCostCentre(
        `${initialData.costCentreCode} · ${initialData.costCentreName}`
      );
      setEmail(
        initialData.email ||
          `${initialData.staffName.toLowerCase().replace(/\s+/g, ".")}@example.com`
      );
      setLinkedUser(initialData.linkedUser || "Not linked");
      setIncludePnl(initialData.pnlAllocation === "Included");
      setIsActive(initialData.status === "Active");
    } else {
      setStaffCode("");
      setStaffName("");
      setEntity("Entity A");
      setDepartment("Operations");
      setCostCentre("EU-DESK · Europe Desk");
      setEmail("");
      setLinkedUser("Not linked");
      setIncludePnl(true);
      setIsActive(true);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffCode.trim() || !staffName.trim()) return;

    const parts = costCentre.split("·").map((s) => s.trim());
    const costCentreCode = parts[0] || "SG-DRY";
    const costCentreName = parts[1] || "Singapore Dry Bulk";

    onSubmitStaff({
      id: initialData?.id,
      staffCode: staffCode.trim(),
      staffName: staffName.trim(),
      entity,
      department,
      costCentreCode,
      costCentreName,
      email: email.trim(),
      linkedUser,
      pnlAllocation: includePnl ? "Included" : "Not included",
      status: isActive ? "Active" : "Inactive",
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <h2 className={styles.modalTitle}>
              {isEditing ? "Edit Staff" : "Add Staff"}
            </h2>
            {isEditing && (
              <span className={styles.modalSub}>
                {staffCode} · {staffName}
              </span>
            )}
          </div>
          <button className={styles.btnClose} onClick={onClose} aria-label="Close modal">
            <Icon icon="lucide:x" width={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Upfront Dependency Warning Banner & Item 5 Rich Rule Cards */}
            {isEditing && (
              <>
                <div className={styles.warningBanner}>
                  <span className={styles.warningText}>
                    <Icon icon="lucide:alert-triangle" width={16} />
                    This staff member is used in 2 active allocation rules.
                  </span>
                  <a href="#used-rules" className={styles.warningLink}>
                    View Rules ↓
                  </a>
                </div>

                <div id="used-rules" className={styles.settingsGroupCard}>
                  <span className={styles.groupHeader}>Used in Allocation Rules (2)</span>
                  <p className={styles.groupText}>
                    Click a rule card below to jump directly to its cost centre rule version history:
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                    <Link href="/configuration/cost-centre/SG-DRY" className={styles.richRuleCard} onClick={onClose}>
                      <div className={styles.ruleCardLeft}>
                        <div className={styles.ruleCardTitle}>
                          <span>SG-DRY · Singapore Dry Bulk</span>
                          <span className={styles.ruleBadgeActive}>Active v2 (50% Share)</span>
                        </div>
                        <div className={styles.ruleCardMeta}>
                          <span>Effective: 01 Jan 2026 - 31 Dec 2026</span>
                          <span>•</span>
                          <span>4 Staff Members</span>
                        </div>
                      </div>
                      <div className={styles.ruleArrowBtn}>
                        <Icon icon="lucide:arrow-right" width={16} />
                      </div>
                    </Link>

                    <Link href="/configuration/cost-centre/EU-DESK" className={styles.richRuleCard} onClick={onClose}>
                      <div className={styles.ruleCardLeft}>
                        <div className={styles.ruleCardTitle}>
                          <span>EU-DESK · Europe Desk</span>
                          <span className={styles.ruleBadgeActive}>Active v1 (25% Share)</span>
                        </div>
                        <div className={styles.ruleCardMeta}>
                          <span>Effective: 01 Jun 2025 - Present</span>
                          <span>•</span>
                          <span>3 Staff Members</span>
                        </div>
                      </div>
                      <div className={styles.ruleArrowBtn}>
                        <Icon icon="lucide:arrow-right" width={16} />
                      </div>
                    </Link>
                  </div>
                </div>
              </>
            )}

            <div className={styles.formGrid}>
              {/* Staff Code */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Staff Code <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ST-003"
                  className={styles.input}
                  value={staffCode}
                  onChange={(e) => setStaffCode(e.target.value)}
                  required
                />
              </div>

              {/* Staff Name */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Staff Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Nair"
                  className={styles.input}
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  required
                />
              </div>

              {/* Entity */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Entity <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.select}
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                  required
                >
                  <option value="Entity A">Entity A</option>
                  <option value="Entity B">Entity B</option>
                  <option value="Entity C">Entity C</option>
                </select>
              </div>

              {/* Department */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Department</label>
                <select
                  className={styles.select}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="Operations">Operations</option>
                  <option value="Chartering">Chartering</option>
                  <option value="Broking">Broking</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>

              {/* Home Cost Centre */}
              <div className={styles.fieldGroupFull}>
                <label className={styles.label}>
                  Home Cost Centre <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.select}
                  value={costCentre}
                  onChange={(e) => setCostCentre(e.target.value)}
                  required
                >
                  <option value="EU-DESK · Europe Desk">EU-DESK · Europe Desk</option>
                  <option value="SG-DRY · Singapore Dry Bulk">
                    SG-DRY · Singapore Dry Bulk
                  </option>
                  <option value="NR-001 · Nesty Regional">NR-001 · Nesty Regional</option>
                  <option value="ADMIN · Administration">ADMIN · Administration</option>
                </select>
                <p className={styles.helperText}>Used when a claim line is not split.</p>
              </div>

              {/* Email */}
              <div className={styles.fieldGroupFull}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="e.g. priya.nair@example.com"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Group 1: System Access (Wireframe 1) */}
              <div className={styles.settingsGroupCard}>
                <span className={styles.groupHeader}>1. System Access</span>
                <div className={styles.fieldGroupFull}>
                  <label className={styles.label}>Linked System User Account</label>
                  <select
                    className={styles.select}
                    value={linkedUser}
                    onChange={(e) => setLinkedUser(e.target.value)}
                  >
                    <option value="Not linked">Not linked (No software user login account)</option>
                    <option value="rachel.lim">rachel.lim</option>
                    <option value="daniel.tan">daniel.tan</option>
                    <option value="sofia.hassan">sofia.hassan</option>
                    <option value="aisha.rahman">aisha.rahman</option>
                    <option value="joshua.lee">joshua.lee</option>
                  </select>
                  <p className={styles.helperText}>
                    Only needed if this person logs in to submit or approve claims. Staff without a login can still receive a share of split costs.
                  </p>
                </div>
              </div>

              {/* Group 2: Cost Allocation Eligibility (Wireframe 1) */}
              <div className={styles.settingsGroupCard}>
                <div className={styles.groupRow}>
                  <div>
                    <span className={styles.groupHeader}>2. Cost Allocation Eligibility</span>
                    <p className={styles.groupText}>
                      Allows staff to be selected when splitting claim expenses or creating cost-centre allocation rules.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className={styles.cb}
                    checked={includePnl}
                    onChange={(e) => setIncludePnl(e.target.checked)}
                  />
                </div>
              </div>

              {/* Group 3: Staff Status (Wireframe 1) */}
              <div className={styles.settingsGroupCard}>
                <div className={styles.groupRow}>
                  <div>
                    <span className={styles.groupHeader}>3. Staff Status</span>
                    <p className={styles.groupText}>
                      Active staff member. Can be selected on new claims. Inactive staff remain in historical records.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className={styles.cb}
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnSubmit}>
              {isEditing ? "Save" : "Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
