"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ActionButton from "@/components/ActionButton";
import AddCostCentreModal, { CostCentreFormData } from "@/components/AddCostCentreModal";
import styles from "./page.module.css";

export interface CostCentreItem {
  id: string;
  no: number;
  code: string;
  name: string;
  active: boolean;
  lastUpdateDate: string;
}

export const ALL_CC_COLUMNS = [
  { key: "no", label: "No.", locked: true },
  { key: "code", label: "Cost Centre Code", locked: true },
  { key: "name", label: "Cost Centre Name", locked: true },
  { key: "active", label: "Active", locked: false },
  { key: "lastUpdateDate", label: "Last Update Date", locked: false },
] as const;

export type CCColKey = (typeof ALL_CC_COLUMNS)[number]["key"];

const DEFAULT_VISIBLE: CCColKey[] = [
  "no",
  "code",
  "name",
  "active",
  "lastUpdateDate",
];

const INITIAL_COST_CENTRES: CostCentreItem[] = [
  { id: "1", no: 1, code: "CC001", name: "Default", active: true, lastUpdateDate: "13-Mar-2024" },
  { id: "2", no: 2, code: "TSYT 23/9", name: "TSYT 23/9", active: true, lastUpdateDate: "23-Sep-2026" },
  { id: "3", no: 3, code: "1060D70001", name: "DTF - PG", active: true, lastUpdateDate: "19-Jan-2026" },
  { id: "4", no: 4, code: "stock", name: "Stock", active: true, lastUpdateDate: "06-Mar-2026" },
  { id: "5", no: 5, code: "VIS0", name: "Main", active: true, lastUpdateDate: "06-Mar-2026" },
  { id: "6", no: 6, code: "10000", name: "10000", active: true, lastUpdateDate: "12-May-2026" },
  { id: "7", no: 7, code: "20000", name: "20000", active: true, lastUpdateDate: "12-May-2026" },
  { id: "8", no: 8, code: "90000", name: "90000", active: true, lastUpdateDate: "12-May-2026" },
];

/* Column Picker Component */
function ColumnPicker({
  visible,
  onChange,
  onClose,
}: {
  visible: CCColKey[];
  onChange: (v: CCColKey[]) => void;
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

  const toggle = (key: CCColKey, locked: boolean) => {
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
            {visible.length} of {ALL_CC_COLUMNS.length} columns visible
          </p>
        </div>
        <button className={styles.pickerReset} onClick={reset}>
          Reset
        </button>
      </div>

      <div className={styles.pickerList}>
        {ALL_CC_COLUMNS.map((col) => {
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

export default function CostCentrePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CostCentreItem | null>(null);

  const [ccList, setCcList] = useState<CostCentreItem[]>(INITIAL_COST_CENTRES);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [visibleCols, setVisibleCols] = useState<CCColKey[]>([...DEFAULT_VISIBLE]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const closePicker = useCallback(() => setPickerOpen(false), []);

  const toggleSelect = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((i) => i !== id) : [...p, id]));
  const toggleExpand = (id: string) =>
    setExpanded((p) => (p.includes(id) ? p.filter((i) => i !== id) : [...p, id]));

  const openAddModal = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item: CostCentreItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSaveModal = (formData: CostCentreFormData) => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    if (editingItem) {
      setCcList((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                code: formData.code,
                name: formData.name,
                active: formData.active,
                lastUpdateDate: today,
              }
            : item
        )
      );
    } else {
      const nextNo = ccList.length > 0 ? Math.max(...ccList.map((s) => s.no)) + 1 : 1;
      const newItem: CostCentreItem = {
        id: String(Date.now()),
        no: nextNo,
        code: formData.code,
        name: formData.name,
        active: formData.active,
        lastUpdateDate: today,
      };
      setCcList((prev) => [...prev, newItem]);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this Cost Centre record?")) {
      setCcList((prev) => prev.filter((item) => item.id !== id));
      setSelected((prev) => prev.filter((i) => i !== id));
    }
  };

  const filteredList = ccList.filter((item) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCode = item.code.toLowerCase().includes(q);
      const matchName = item.name.toLowerCase().includes(q);
      if (!matchCode && !matchName) return false;
    }
    return true;
  });

  const allSelected = filteredList.length > 0 && filteredList.every((i) => selected.includes(i.id));
  const someSelected = selected.length > 0 && !allSelected;
  const toggleAll = () => setSelected(allSelected ? [] : filteredList.map((i) => i.id));

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
            <span className={styles.breadcrumbCurrent}>Cost Centre</span>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Cost Centre</h1>
            <button className={styles.btnCreate} onClick={openAddModal}>
              <Icon icon="lucide:plus" width={15} />
              Add Cost Centre
            </button>
          </div>

          <AddCostCentreModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleSaveModal}
            initialData={
              editingItem
                ? {
                    id: editingItem.id,
                    code: editingItem.code,
                    name: editingItem.name,
                    active: editingItem.active,
                  }
                : null
            }
          />

          {/* Toolbar */}
          <div className={styles.wrap}>
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>
                {selected.length > 0 && (
                  <span className={styles.selHint}>{selected.length} selected</span>
                )}
              </div>

              <div className={styles.toolbarRight}>
                <div className={styles.pickerWrap}>
                  <button
                    className={`${styles.colBtn} ${pickerOpen ? styles.colBtnActive : ""}`}
                    onClick={() => setPickerOpen((o) => !o)}
                  >
                    <Icon icon="lucide:columns-2" width={14} />
                    Columns
                    <span className={styles.colBadge}>{visibleCols.length}</span>
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

                <div className={styles.searchBox}>
                  <Icon icon="lucide:search" width={14} className={styles.searchIco} />
                  <input
                    className={styles.searchInput}
                    placeholder="Search by keywords"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

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
                      <th className={styles.th}>Action</th>
                      {visibleCols.includes("no") && <th className={styles.th}>No. ↓</th>}
                      {visibleCols.includes("name") && (
                        <th className={styles.th}>Cost Centre Name ↓</th>
                      )}
                      {visibleCols.includes("code") && (
                        <th className={styles.th}>Cost Centre Code ↓</th>
                      )}
                      {visibleCols.includes("active") && <th className={styles.th}>Active ↓</th>}
                      {visibleCols.includes("lastUpdateDate") && (
                        <th className={styles.th}>Last Update Date ↓</th>
                      )}
                      <th className={styles.thArrow} />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredList.map((item) => {
                      const isSel = selected.includes(item.id);
                      const isExp = expanded.includes(item.id);

                      return (
                        <React.Fragment key={item.id}>
                          <tr
                            className={`${styles.row} ${isSel ? styles.rowSel : ""} ${
                              isExp ? styles.rowExp : ""
                            }`}
                            onClick={() => toggleExpand(item.id)}
                          >
                            <td className={styles.tdCb} onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                className={styles.cb}
                                checked={isSel}
                                onChange={() => toggleSelect(item.id)}
                              />
                            </td>

                            <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                              <div className={styles.actionGroup}>
                                <ActionButton
                                  type="edit"
                                  tooltip="Edit Cost Centre"
                                  onClick={() => openEditModal(item)}
                                />
                                <button
                                  type="button"
                                  className={styles.btnIconDelete}
                                  title="Delete Cost Centre"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Icon icon="lucide:trash-2" width={15} />
                                </button>
                              </div>
                            </td>

                            {visibleCols.includes("no") && <td className={styles.td}>{item.no}</td>}
                            {visibleCols.includes("name") && (
                              <td className={`${styles.td} ${styles.ccName}`}>{item.name}</td>
                            )}
                            {visibleCols.includes("code") && (
                              <td className={`${styles.td} ${styles.ccCode}`}>
                                <Link
                                  href={`/configuration/cost-centre/${item.code}`}
                                  style={{ color: "#E8692A", textDecoration: "underline", fontWeight: 700 }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {item.code}
                                </Link>
                              </td>
                            )}
                            {visibleCols.includes("active") && (
                              <td className={styles.td}>
                                <span
                                  className={
                                    item.active ? styles.statusActive : styles.statusInactive
                                  }
                                >
                                  {item.active && <span className={styles.statusDot} />}
                                  {item.active ? "Yes" : "No"}
                                </span>
                              </td>
                            )}
                            {visibleCols.includes("lastUpdateDate") && (
                              <td className={styles.td}>{item.lastUpdateDate}</td>
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
                                        <span className={styles.chipLabel}>Cost Centre Code</span>
                                        <span className={styles.chipValue}>{item.code}</span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Cost Centre Name</span>
                                        <span className={styles.chipValue}>{item.name}</span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Active Status</span>
                                        <span className={styles.chipValue}>
                                          {item.active ? "Yes (Active)" : "No (Inactive)"}
                                        </span>
                                      </div>
                                      <div className={styles.chip}>
                                        <span className={styles.chipLabel}>Last Update Date</span>
                                        <span className={styles.chipValue}>{item.lastUpdateDate}</span>
                                      </div>
                                    </div>

                                    <div
                                      className={styles.panelActions}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button
                                        className={styles.btnEdit}
                                        onClick={() => openEditModal(item)}
                                      >
                                        <Icon icon="lucide:file-pen" width={14} /> Edit Cost Centre
                                      </button>
                                      <Link
                                        href={`/configuration/cost-centre/${item.code}`}
                                        className={styles.btnEdit}
                                        style={{ textDecoration: "none", background: "#FFF0E8", color: "#E8692A" }}
                                      >
                                        <Icon icon="lucide:history" width={14} /> Rule Versions & Audit Log
                                      </Link>
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

              {filteredList.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No Cost Centre records match your search criteria.</p>
                </div>
              )}

              {/* Table Footer */}
              <div className={styles.tableFooter}>
                <div>
                  Showing 1-{filteredList.length} of {ccList.length} cost centres
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
