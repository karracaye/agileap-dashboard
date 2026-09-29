"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ActionButton from "@/components/ActionButton";
import ImportModal from "@/components/ImportModal";
import AddStaffModal, { StaffFormData } from "@/components/AddStaffModal";
import styles from "./page.module.css";

export interface StaffItem {
  id: string;
  no: number;
  staffCode: string;
  staffName: string;
  entity: string;
  department: string;
  costCentreCode: string;
  costCentreName: string;
  email: string;
  pnlAllocation: "Included" | "Not included";
  linkedUser: string;
  status: "Active" | "Inactive";
}

export const ALL_STAFF_COLUMNS = [
  { key: "no", label: "No.", locked: false },
  { key: "staffCode", label: "Staff Code", locked: false },
  { key: "staffName", label: "Staff Name", locked: true },
  { key: "entity", label: "Entity", locked: false },
  { key: "department", label: "Department", locked: false },
  { key: "costCentre", label: "Home Cost Centre", locked: false },
  { key: "pnlAllocation", label: "P&L Allocation", locked: false },
  { key: "linkedUser", label: "Linked User", locked: false },
  { key: "status", label: "Status", locked: false },
] as const;

export type StaffColKey = (typeof ALL_STAFF_COLUMNS)[number]["key"];

const DEFAULT_VISIBLE: StaffColKey[] = [
  "staffName",
  "department",
  "costCentre",
  "pnlAllocation",
  "linkedUser",
  "status",
];

const INITIAL_STAFF_DATA: StaffItem[] = [
  {
    id: "1",
    no: 1,
    staffCode: "ST-001",
    staffName: "Rachel Lim",
    entity: "Entity A",
    department: "Chartering",
    costCentreCode: "SG-DRY",
    costCentreName: "Singapore Dry Bulk",
    email: "rachel.lim@example.com",
    pnlAllocation: "Included",
    linkedUser: "rachel.lim",
    status: "Active",
  },
  {
    id: "2",
    no: 2,
    staffCode: "ST-002",
    staffName: "Daniel Tan",
    entity: "Entity A",
    department: "Chartering",
    costCentreCode: "SG-DRY",
    costCentreName: "Singapore Dry Bulk",
    email: "daniel.tan@example.com",
    pnlAllocation: "Included",
    linkedUser: "daniel.tan",
    status: "Active",
  },
  {
    id: "3",
    no: 3,
    staffCode: "ST-003",
    staffName: "Priya Nair",
    entity: "Entity A",
    department: "Operations",
    costCentreCode: "EU-DESK",
    costCentreName: "Europe Desk",
    email: "priya.nair@example.com",
    pnlAllocation: "Included",
    linkedUser: "No login",
    status: "Active",
  },
  {
    id: "4",
    no: 4,
    staffCode: "ST-004",
    staffName: "Marcus Goh",
    entity: "Entity B",
    department: "Broking",
    costCentreCode: "NR-001",
    costCentreName: "Nesty Regional",
    email: "marcus.goh@example.com",
    pnlAllocation: "Included",
    linkedUser: "No login",
    status: "Active",
  },
  {
    id: "5",
    no: 5,
    staffCode: "ST-005",
    staffName: "Sofia Hassan",
    entity: "Entity B",
    department: "Broking",
    costCentreCode: "EU-DESK",
    costCentreName: "Europe Desk",
    email: "sofia.hassan@example.com",
    pnlAllocation: "Included",
    linkedUser: "sofia.hassan",
    status: "Active",
  },
  {
    id: "6",
    no: 6,
    staffCode: "ST-006",
    staffName: "Kenji Watanabe",
    entity: "Entity B",
    department: "Broking",
    costCentreCode: "NR-001",
    costCentreName: "Nesty Regional",
    email: "kenji.w@example.com",
    pnlAllocation: "Included",
    linkedUser: "No login",
    status: "Active",
  },
  {
    id: "7",
    no: 7,
    staffCode: "ST-007",
    staffName: "Aisha Rahman",
    entity: "Entity C",
    department: "Accounts",
    costCentreCode: "ADMIN",
    costCentreName: "Administration",
    email: "aisha.rahman@example.com",
    pnlAllocation: "Not included",
    linkedUser: "aisha.rahman",
    status: "Active",
  },
  {
    id: "8",
    no: 8,
    staffCode: "ST-008",
    staffName: "Wong Mei Ling",
    entity: "Entity C",
    department: "Operations",
    costCentreCode: "ADMIN",
    costCentreName: "Administration",
    email: "meiling.wong@example.com",
    pnlAllocation: "Not included",
    linkedUser: "No login",
    status: "Active",
  },
];

/* Column Picker Component */
function ColumnPicker({
  visible,
  onChange,
  onClose,
}: {
  visible: StaffColKey[];
  onChange: (v: StaffColKey[]) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const toggle = (key: StaffColKey, locked: boolean) => {
    if (locked) return;
    onChange(
      visible.includes(key) ? visible.filter((k) => k !== key) : [...visible, key]
    );
  };

  const reset = () => onChange([...DEFAULT_VISIBLE]);

  return (
    <div className={styles.pickerCard} ref={ref}>
      <div className={styles.pickerHeader}>
        <div>
          <p className={styles.pickerTitle}>Customize Columns</p>
          <p className={styles.pickerSub}>
            {visible.length} of {ALL_STAFF_COLUMNS.length} columns visible
          </p>
        </div>
        <button className={styles.pickerReset} onClick={reset}>
          Reset
        </button>
      </div>

      <div className={styles.pickerList}>
        {ALL_STAFF_COLUMNS.map((col) => {
          const isVisible = visible.includes(col.key);
          return (
            <label
              key={col.key}
              className={`${styles.pickerRow} ${col.locked ? styles.pickerRowLocked : ""}`}
            >
              <input
                type="checkbox"
                checked={isVisible}
                disabled={col.locked}
                onChange={() => toggle(col.key, !!col.locked)}
                className={styles.pickerCb}
              />
              <span
                className={`${styles.pickerCheckBox} ${
                  isVisible ? styles.pickerCheckBoxOn : ""
                }`}
              >
                {isVisible && (
                  <Icon icon="lucide:check" width={10} style={{ color: "white" }} />
                )}
              </span>
              <span className={styles.pickerLabel}>{col.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function StaffManagementPage() {
  const [importOpen, setImportOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);

  const [staffList, setStaffList] = useState<StaffItem[]>(INITIAL_STAFF_DATA);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [pnlFilter, setPnlFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("Active");

  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [visibleCols, setVisibleCols] = useState<StaffColKey[]>([...DEFAULT_VISIBLE]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const closePicker = useCallback(() => setPickerOpen(false), []);

  const toggleSelect = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((i) => i !== id) : [...p, id]));
  const toggleExpand = (id: string) =>
    setExpanded((p) => (p.includes(id) ? p.filter((i) => i !== id) : [...p, id]));

  const openAddModal = () => {
    setEditingStaff(null);
    setStaffModalOpen(true);
  };

  const openEditModal = (staff: StaffItem) => {
    setEditingStaff(staff);
    setStaffModalOpen(true);
  };

  const handleSaveStaff = (formData: StaffFormData) => {
    if (editingStaff) {
      // Edit existing staff
      setStaffList((prev) =>
        prev.map((item) =>
          item.id === editingStaff.id
            ? {
                ...item,
                staffCode: formData.staffCode,
                staffName: formData.staffName,
                entity: formData.entity,
                department: formData.department,
                costCentreCode: formData.costCentreCode,
                costCentreName: formData.costCentreName,
                email: formData.email,
                linkedUser: formData.linkedUser,
                pnlAllocation: formData.pnlAllocation,
                status: formData.status,
              }
            : item
        )
      );
    } else {
      // Add new staff
      const nextNo = staffList.length > 0 ? Math.max(...staffList.map((s) => s.no)) + 1 : 1;
      const newItem: StaffItem = {
        id: String(Date.now()),
        no: nextNo,
        staffCode: formData.staffCode,
        staffName: formData.staffName,
        entity: formData.entity,
        department: formData.department,
        costCentreCode: formData.costCentreCode,
        costCentreName: formData.costCentreName,
        email: formData.email,
        linkedUser: formData.linkedUser,
        pnlAllocation: formData.pnlAllocation,
        status: formData.status,
      };
      setStaffList((prev) => [...prev, newItem]);
    }
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm("Are you sure you want to delete this staff record?")) {
      setStaffList((prev) => prev.filter((item) => item.id !== id));
      setSelected((prev) => prev.filter((i) => i !== id));
    }
  };

  const filteredStaff = staffList.filter((item) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCode = item.staffCode.toLowerCase().includes(q);
      const matchName = item.staffName.toLowerCase().includes(q);
      const matchCost =
        item.costCentreCode.toLowerCase().includes(q) ||
        item.costCentreName.toLowerCase().includes(q);
      const matchUser = item.linkedUser.toLowerCase().includes(q);
      if (!matchCode && !matchName && !matchCost && !matchUser) return false;
    }

    if (entityFilter !== "all" && item.entity !== entityFilter) return false;
    if (deptFilter !== "all" && item.department !== deptFilter) return false;
    if (pnlFilter !== "all" && item.pnlAllocation !== pnlFilter) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;

    return true;
  });

  const allSelected = filteredStaff.length > 0 && filteredStaff.every((i) => selected.includes(i.id));
  const someSelected = selected.length > 0 && !allSelected;
  const toggleAll = () => setSelected(allSelected ? [] : filteredStaff.map((i) => i.id));

  const colSpan = visibleCols.length + 3;

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>
          {/* Breadcrumbs */}
          <div className={styles.breadcrumbNav}>
            <Icon icon="lucide:home" width={14} />
            <Link href="/configuration" className={styles.breadcrumbLink}>
              Configuration
            </Link>
            <Icon icon="lucide:chevron-right" width={12} />
            <span>User Management</span>
            <Icon icon="lucide:chevron-right" width={12} />
            <span className={styles.breadcrumbCurrent}>Staff Management</span>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Staff Management</h1>
            <div className={styles.headerActions}>
              <button className={styles.btnOutline} onClick={() => setImportOpen(true)}>
                <Icon icon="lucide:download" width={14} />
                Import
              </button>

              <button className={styles.btnCreate} onClick={openAddModal}>
                <Icon icon="lucide:plus" width={15} />
                + Add Staff
              </button>
            </div>
          </div>

          <ImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />
          <AddStaffModal
            isOpen={staffModalOpen}
            onClose={() => setStaffModalOpen(false)}
            onSubmitStaff={handleSaveStaff}
            initialData={editingStaff}
          />

          {/* Filter Card */}
          <div className={styles.filterCard}>
            <div className={styles.filterGrid}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Search</label>
                <div className={styles.filterInputWrap}>
                  <input
                    className={styles.searchInput}
                    placeholder="Staff name or code"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Entity</label>
                <select
                  className={styles.filterSelect}
                  value={entityFilter}
                  onChange={(e) => setEntityFilter(e.target.value)}
                >
                  <option value="all">All entities</option>
                  <option value="Entity A">Entity A</option>
                  <option value="Entity B">Entity B</option>
                  <option value="Entity C">Entity C</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Department</label>
                <select
                  className={styles.filterSelect}
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <option value="all">All departments</option>
                  <option value="Chartering">Chartering</option>
                  <option value="Operations">Operations</option>
                  <option value="Broking">Broking</option>
                  <option value="Accounts">Accounts</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>P&L allocation</label>
                <select
                  className={styles.filterSelect}
                  value={pnlFilter}
                  onChange={(e) => setPnlFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="Included">Included</option>
                  <option value="Not included">Not included</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Status</label>
                <select
                  className={styles.filterSelect}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="all">All</option>
                </select>
              </div>

              {/* Column Filter Inside Filtering Bar */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Columns</label>
                <div className={styles.pickerWrap}>
                  <button
                    type="button"
                    className={`${styles.colBtnFilter} ${
                      pickerOpen ? styles.colBtnFilterActive : ""
                    }`}
                    onClick={() => setPickerOpen((o) => !o)}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <Icon icon="lucide:columns-2" width={14} />
                      <span>{visibleCols.length} Visible</span>
                    </span>
                    <Icon icon="lucide:chevron-down" width={12} />
                  </button>

                  {pickerOpen && (
                    <ColumnPicker
                      visible={visibleCols}
                      onChange={setVisibleCols}
                      onClose={closePicker}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table Wrap */}
          <div className={styles.wrap}>
            {selected.length > 0 && (
              <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                  <span className={styles.selHint}>{selected.length} selected</span>
                </div>
              </div>
            )}

            {/* Table Container Card */}
            <div className={styles.card}>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.thead}>
                      <th className={styles.thCb}>
                        <input
                          type="checkbox"
                          className={styles.cb}
                          checked={allSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someSelected;
                          }}
                          onChange={toggleAll}
                        />
                      </th>
                      <th className={styles.th}>Actions</th>
                      {visibleCols.includes("no") && <th className={styles.th}>No.</th>}
                      {visibleCols.includes("staffCode") && (
                        <th className={styles.th}>Staff Code</th>
                      )}
                      {visibleCols.includes("staffName") && (
                        <th className={styles.th}>Staff Name</th>
                      )}
                      {visibleCols.includes("entity") && <th className={styles.th}>Entity</th>}
                      {visibleCols.includes("department") && (
                        <th className={styles.th}>Department</th>
                      )}
                      {visibleCols.includes("costCentre") && (
                        <th className={styles.th}>Home Cost Centre</th>
                      )}
                      {visibleCols.includes("pnlAllocation") && (
                        <th className={styles.th}>
                          <div className={styles.thHeaderWithInfo}>
                            <span>P&amp;L Allocation</span>
                            <div className={styles.infoTooltipWrap}>
                              <Icon icon="lucide:info" width={14} className={styles.infoIcon} />
                              <div className={styles.tooltipPopover}>
                                <div className={styles.tooltipTitle}>P&amp;L Allocation</div>
                                <div className={styles.tooltipBody}>
                                  Allows staff to be selected when splitting claim expenses or creating allocation rules.
                                </div>
                              </div>
                            </div>
                          </div>
                        </th>
                      )}
                      {visibleCols.includes("linkedUser") && (
                        <th className={styles.th}>Linked User</th>
                      )}
                      {visibleCols.includes("status") && (
                        <th className={styles.th}>Status</th>
                      )}
                      <th className={styles.thArrow} />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStaff.map((staff) => {
                      const isSel = selected.includes(staff.id);
                      const isExp = expanded.includes(staff.id);

                      return (
                        <React.Fragment key={staff.id}>
                          <tr
                            className={`${styles.row} ${isSel ? styles.rowSel : ""} ${
                              isExp ? styles.rowExp : ""
                            }`}
                            onClick={() => toggleExpand(staff.id)}
                          >
                            <td className={styles.tdCb} onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                className={styles.cb}
                                checked={isSel}
                                onChange={() => toggleSelect(staff.id)}
                              />
                            </td>

                            <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                              <div className={styles.actionGroup}>
                                <ActionButton
                                  type="edit"
                                  tooltip="Edit Staff"
                                  onClick={() => openEditModal(staff)}
                                />
                                <button
                                  type="button"
                                  className={styles.btnIconDelete}
                                  title="Delete Staff"
                                  onClick={() => handleDeleteStaff(staff.id)}
                                >
                                  <Icon icon="lucide:trash-2" width={15} />
                                </button>
                              </div>
                            </td>

                            {visibleCols.includes("no") && (
                              <td className={styles.td}>{staff.no}</td>
                            )}
                            {visibleCols.includes("staffCode") && (
                              <td className={`${styles.td} ${styles.staffCode}`}>
                                {staff.staffCode}
                              </td>
                            )}
                            {visibleCols.includes("staffName") && (
                              <td className={`${styles.td} ${styles.staffName}`}>
                                {staff.staffName}
                              </td>
                            )}
                            {visibleCols.includes("entity") && (
                              <td className={styles.td}>{staff.entity}</td>
                            )}
                            {visibleCols.includes("department") && (
                              <td className={styles.td}>{staff.department}</td>
                            )}
                            {visibleCols.includes("costCentre") && (
                              <td className={styles.td}>
                                <div className={styles.costCentreCode}>
                                  {staff.costCentreCode}
                                </div>
                                <div className={styles.costCentreName}>
                                  {staff.costCentreName}
                                </div>
                              </td>
                            )}
                            {visibleCols.includes("pnlAllocation") && (
                              <td className={styles.td}>
                                {staff.pnlAllocation === "Included" ? (
                                  <span className={styles.pnlIncluded}>Included</span>
                                ) : (
                                  <span className={styles.pnlNotIncluded}>Not included</span>
                                )}
                              </td>
                            )}
                            {visibleCols.includes("linkedUser") && (
                              <td className={styles.td}>
                                {staff.linkedUser === "No login" ||
                                staff.linkedUser === "Not linked" ? (
                                  <span className={styles.noLoginText}>No login</span>
                                ) : (
                                  <span className={styles.linkedUserText}>
                                    {staff.linkedUser}
                                  </span>
                                )}
                              </td>
                            )}
                            {visibleCols.includes("status") && (
                              <td className={styles.td}>
                                <span
                                  className={
                                    staff.status === "Active"
                                      ? styles.statusActive
                                      : styles.statusInactive
                                  }
                                >
                                  {staff.status === "Active" && (
                                    <span className={styles.statusDot} />
                                  )}
                                  {staff.status}
                                </span>
                              </td>
                            )}

                            <td className={styles.tdArrow}>
                              <span
                                className={`${styles.chevron} ${
                                  isExp ? styles.chevronOpen : ""
                                }`}
                              >
                                <Icon icon="lucide:chevron-down" width={15} />
                              </span>
                            </td>
                          </tr>

                          {/* Row Expand Collapsible Details Panel */}
                          {isExp && (
                            <tr className={styles.expandTd}>
                              <td colSpan={colSpan} className={styles.expandTd}>
                                <div className={`${styles.panel} ${styles.panelOpen}`}>
                                  <div className={styles.panelBody}>
                                    <div className={styles.panelGrid}>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Staff Code &amp; Name</span>
                                        <span className={styles.chipValue}>
                                          {staff.staffCode} — {staff.staffName}
                                        </span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Email Address</span>
                                        <span className={styles.chipValue}>{staff.email}</span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Entity &amp; Dept</span>
                                        <span className={styles.chipValue}>
                                          {staff.entity} / {staff.department}
                                        </span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Home Cost Centre</span>
                                        <span className={styles.chipValue}>
                                          {staff.costCentreCode} ({staff.costCentreName})
                                        </span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>P&L Allocation</span>
                                        <span className={styles.chipValue}>
                                          {staff.pnlAllocation}
                                        </span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Linked User</span>
                                        <span className={styles.chipValue}>
                                          {staff.linkedUser}
                                        </span>
                                      </div>
                                    </div>

                                    <div
                                      className={styles.panelActions}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button
                                        className={styles.btnEdit}
                                        onClick={() => openEditModal(staff)}
                                      >
                                        <Icon icon="lucide:file-pen" width={14} /> Edit Staff
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredStaff.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No staff records match your criteria.</p>
                </div>
              )}

              {/* Table Footer */}
              <div className={styles.tableFooter}>
                <div>
                  Showing 1-{filteredStaff.length} of {staffList.length} staff
                </div>
                <div className={styles.pagination}>
                  <button className={styles.pageBtn} title="Previous page">
                    ‹
                  </button>
                  <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                  <button className={styles.pageBtn} title="Next page">
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
