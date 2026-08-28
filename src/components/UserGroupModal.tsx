"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import styles from "./UserGroupModal.module.css";

interface UserGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_GROUPS = [
  { id: "g1", name: "Finance Approvers", members: ["Joshua Lee", "Vicki Tan", "Sarah Wong"] },
  { id: "g2", name: "AP Reviewers", members: ["Michael Chen", "Amanda Lim"] },
  { id: "g3", name: "Procurement Officers", members: ["David Ng", "Karen Teo", "Benjamin Ho"] },
];

export default function UserGroupModal({ isOpen, onClose }: UserGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSourceGroup, setSelectedSourceGroup] = useState("");
  const [members, setMembers] = useState<string[]>(["Joshua Lee"]);
  const [showCopyDropdown, setShowCopyDropdown] = useState(false);

  if (!isOpen) return null;

  const handleCopyFromGroup = (groupId: string) => {
    const source = PRESET_GROUPS.find((g) => g.id === groupId);
    if (source) {
      setGroupName(`${source.name} (Copy)`);
      setDescription(`Copied from ${source.name}`);
      setMembers([...source.members]);
      setShowCopyDropdown(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Create User Group</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Instruction G: Copy from existing group banner */}
          <div className={styles.copyBox}>
            <div className={styles.copyLeft}>
              <Icon icon="lucide:copy" width={22} height={22} style={{ color: "#2563eb" }} />
              <div>
                <h4 className={styles.copyTitle}>Quick Setup: Copy Existing Group</h4>
                <p className={styles.copySub}>Clone members and permissions from an existing group</p>
              </div>
            </div>
            <button
              type="button"
              className={styles.btnCopyAction}
              onClick={() => setShowCopyDropdown(!showCopyDropdown)}
            >
              <Icon icon="lucide:copy" width={14} height={14} />
              Copy from Group
            </button>
          </div>

          {showCopyDropdown && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Select Source Group to Copy</label>
              <select
                className={styles.fieldSelect}
                value={selectedSourceGroup}
                onChange={(e) => {
                  setSelectedSourceGroup(e.target.value);
                  handleCopyFromGroup(e.target.value);
                }}
              >
                <option value="">-- Choose a group to duplicate --</option>
                {PRESET_GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.members.length} members)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Form Fields */}
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Group Name*</label>
              <input
                type="text"
                className={styles.fieldInput}
                placeholder="e.g. Senior Finance Approvers"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Description</label>
              <input
                type="text"
                className={styles.fieldInput}
                placeholder="Group purpose or department details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Group Members ({members.length})</label>
              <div className={styles.membersBox}>
                {members.map((m) => (
                  <span key={m} className={styles.memberChip}>
                    <Icon icon="lucide:user" width={12} height={12} />
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.btnSave} onClick={onClose}>
            Save User Group
          </button>
        </div>
      </div>
    </div>
  );
}
