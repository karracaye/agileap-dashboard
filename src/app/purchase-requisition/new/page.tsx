"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ExitConfirmationModal from "@/components/ExitConfirmationModal";
import styles from "./page.module.css";

export interface PRLineItem {
  id: string;
  no: number;
  productCode: string;
  description: string;
  longDescription: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  taxRate: string;
  taxAmount: number;
}

export default function NewPurchaseRequisitionPage() {
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitTarget, setExitTarget] = useState("/purchase-requisition");

  const handleRequestExit = (targetUrl: string = "/purchase-requisition") => {
    setExitTarget(targetUrl);
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    router.push(exitTarget);
  };

  const [vendorOpen, setVendorOpen] = useState(true);
  const [prInfoOpen, setPrInfoOpen] = useState(true);
  const [attachmentOpen, setAttachmentOpen] = useState(true);

  // Vendor Info State
  const [vendor, setVendor] = useState("");
  const [contactPerson, setContactPerson] = useState("");

  // PR Info State
  const [requestorName, setRequestorName] = useState("Joshua Lee (Test) (joshua+1@activants.com)");
  const [requestorDept, setRequestorDept] = useState("Super Admin");
  const [dateRequired, setDateRequired] = useState("2026-10-01");
  const [location, setLocation] = useState("Default");
  const [budget, setBudget] = useState("");
  const [notesTerms, setNotesTerms] = useState("");
  const [currency, setCurrency] = useState("SGD");
  const [exchangeRate, setExchangeRate] = useState("1.00000");
  const [reasonExpenditure, setReasonExpenditure] = useState("");

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

  const [lineItems, setLineItems] = useState<PRLineItem[]>([
    {
      id: "line_1",
      no: 1,
      productCode: "",
      description: "",
      longDescription: "",
      quantity: 0.00,
      uom: "EA",
      unitPrice: 0.00,
      taxRate: "Purchas...",
      taxAmount: 0.00,
    },
  ]);

  const handleAddRow = () => {
    const nextNo = lineItems.length + 1;
    setLineItems([
      ...lineItems,
      {
        id: `line_${Date.now()}`,
        no: nextNo,
        productCode: "",
        description: "",
        longDescription: "",
        quantity: 0.00,
        uom: "EA",
        unitPrice: 0.00,
        taxRate: "Purchas...",
        taxAmount: 0.00,
      },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (lineItems.length === 1) return;
    const updated = lineItems
      .filter((item) => item.id !== id)
      .map((item, idx) => ({ ...item, no: idx + 1 }));
    setLineItems(updated);
  };

  const handleDuplicateRow = (index: number) => {
    const target = lineItems[index];
    const duplicated: PRLineItem = {
      ...target,
      id: `line_${Date.now()}`,
      no: lineItems.length + 1,
    };
    setLineItems([...lineItems, duplicated]);
  };

  const handleFieldChange = (id: string, field: keyof PRLineItem, value: any) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, [field]: value };
      })
    );
  };

  // Math totals
  const subTotalExclTax = lineItems.reduce(
    (sum, row) => sum + (Number(row.quantity) || 0) * (Number(row.unitPrice) || 0),
    0
  );

  const totalTaxAmount = lineItems.reduce(
    (sum, row) => sum + (Number(row.taxAmount) || 0),
    0
  );

  const totalAmountInclTax = subTotalExclTax + totalTaxAmount;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      setUploadedFiles((prev) => [...prev, fileName]);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments((prev) => [...prev, newComment.trim()]);
    setNewComment("");
  };

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>
          {/* Breadcrumb Navigation */}
          <div className={styles.breadcrumbNav}>
            <Link
              href="/"
              className={styles.breadcrumbLink}
              onClick={(e) => {
                e.preventDefault();
                handleRequestExit("/");
              }}
            >
              <Icon icon="lucide:home" width={14} />
            </Link>
            <span>/</span>
            <Link
              href="/purchase-requisition"
              className={styles.breadcrumbLink}
              onClick={(e) => {
                e.preventDefault();
                handleRequestExit("/purchase-requisition");
              }}
            >
              Purchase Requisition
            </Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>New</span>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.titleGroup}>
              <div className={styles.titleRow}>
                <h1 className={styles.pageTitle}>Purchase Requisition</h1>
                <span className={styles.badgeNew}>New</span>
              </div>
              <span className={styles.prSubNo}>DF-20261001-070003889</span>
            </div>

            <div className={styles.headerActions}>
              <button type="button" className={styles.btnSecondary}>
                Save as Draft
              </button>
              <button type="button" className={styles.btnPrimary}>
                Save and Continue
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => handleRequestExit("/purchase-requisition")}
              >
                Back
              </button>
            </div>
          </div>

          {/* Section 1: Vendor Information Card (matching media_1790838630430.png) */}
          <div className={styles.card}>
            <div
              className={styles.cardHeader}
              onClick={() => setVendorOpen((prev) => !prev)}
            >
              <span className={styles.cardTitle}>Vendor Information</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icon icon="lucide:columns-2" width={16} style={{ color: "#94A3B8" }} />
                <Icon
                  icon={vendorOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
                  width={18}
                  style={{ color: "#64748B" }}
                />
              </div>
            </div>

            {vendorOpen && (
              <div className={styles.formSectionGrid}>
                {/* Vendor Field */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>
                    Vendor<span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <div className={styles.selectWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="Type to search"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                    />
                    <Icon icon="lucide:chevron-down" width={14} className={styles.selectIcon} />
                  </div>
                </div>

                {/* Contact Person Field */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Contact Person</label>
                  <div className={styles.selectWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="Type to search"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                    />
                    <Icon icon="lucide:chevron-down" width={14} className={styles.selectIcon} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: PR Information Card (matching media_1790838630430.png) */}
          <div className={styles.card}>
            <div
              className={styles.cardHeader}
              onClick={() => setPrInfoOpen((prev) => !prev)}
            >
              <span className={styles.cardTitle}>PR Information</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icon icon="lucide:settings" width={16} style={{ color: "#94A3B8" }} />
                <Icon
                  icon={prInfoOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
                  width={18}
                  style={{ color: "#64748B" }}
                />
              </div>
            </div>

            {prInfoOpen && (
              <div className={styles.formSectionGrid}>
                {/* Requestor Name */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>
                    Requestor Name<span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <div className={styles.selectWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={requestorName}
                      onChange={(e) => setRequestorName(e.target.value)}
                    />
                    {requestorName && (
                      <button
                        type="button"
                        className={styles.clearIconBtn}
                        onClick={() => setRequestorName("")}
                      >
                        <Icon icon="lucide:x" width={14} />
                      </button>
                    )}
                    <Icon icon="lucide:chevron-down" width={14} className={styles.selectIcon} />
                  </div>
                </div>

                {/* Requestor Department */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>
                    Requestor Department<span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <div className={styles.selectWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={requestorDept}
                      onChange={(e) => setRequestorDept(e.target.value)}
                    />
                    {requestorDept && (
                      <button
                        type="button"
                        className={styles.clearIconBtn}
                        onClick={() => setRequestorDept("")}
                      >
                        <Icon icon="lucide:x" width={14} />
                      </button>
                    )}
                    <Icon icon="lucide:chevron-down" width={14} className={styles.selectIcon} />
                  </div>
                </div>

                {/* Date Required */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>
                    Date Required<span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <div className={styles.fieldInputWrap}>
                    <input
                      type="date"
                      className={styles.fieldInput}
                      value={dateRequired}
                      onChange={(e) => setDateRequired(e.target.value)}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Location</label>
                  <div className={styles.selectWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    {location && (
                      <button
                        type="button"
                        className={styles.clearIconBtn}
                        onClick={() => setLocation("")}
                      >
                        <Icon icon="lucide:x" width={14} />
                      </button>
                    )}
                    <Icon icon="lucide:chevron-down" width={14} className={styles.selectIcon} />
                  </div>
                </div>

                {/* Budget */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Budget</label>
                  <div className={styles.selectWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="Type to search"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                    <Icon icon="lucide:chevron-down" width={14} className={styles.selectIcon} />
                  </div>
                </div>

                {/* Notes / Terms */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>
                    <span>Notes / Terms</span>
                    <Icon icon="lucide:info" width={14} style={{ color: "#64748B" }} />
                  </label>
                  <div className={styles.fieldInputWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="Enter notes or terms..."
                      value={notesTerms}
                      onChange={(e) => setNotesTerms(e.target.value)}
                    />
                  </div>
                </div>

                {/* Currency */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>
                    Currency<span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <div className={styles.selectWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    />
                    {currency && (
                      <button
                        type="button"
                        className={styles.clearIconBtn}
                        onClick={() => setCurrency("")}
                      >
                        <Icon icon="lucide:x" width={14} />
                      </button>
                    )}
                    <Icon icon="lucide:chevron-down" width={14} className={styles.selectIcon} />
                  </div>
                </div>

                {/* Exchange Rate */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Exchange Rate</label>
                  <div className={styles.fieldInputWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      style={{ textAlign: "right" }}
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Reason for Expenditure */}
                <div className={`${styles.formRow} ${styles.fullWidthRow}`}>
                  <label className={styles.formLabel}>Reason for Expenditure</label>
                  <div className={styles.fieldInputWrap}>
                    <textarea
                      rows={2}
                      className={styles.fieldInput}
                      placeholder="Reason..."
                      value={reasonExpenditure}
                      onChange={(e) => setReasonExpenditure(e.target.value)}
                    />
                  </div>
                </div>

                {/* Add Extra Info Button */}
                <div className={styles.fullWidthRow}>
                  <button type="button" className={styles.btnAddExtraInfo}>
                    + Add Extra Info
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Attachment Card */}
          <div className={styles.card}>
            <div
              className={styles.cardHeader}
              onClick={() => setAttachmentOpen((prev) => !prev)}
            >
              <span className={styles.cardTitle}>Attachment</span>
              <Icon
                icon={attachmentOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
                width={18}
                style={{ color: "#64748B" }}
              />
            </div>

            {attachmentOpen && (
              <div className={styles.uploadDropzone}>
                <label style={{ cursor: "pointer" }}>
                  <span>Click here to </span>
                  <span className={styles.uploadLink}>upload</span>
                  <span> your file.</span>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </label>
                {uploadedFiles.length > 0 && (
                  <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                    {uploadedFiles.map((file, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: "#E2E8F0",
                          padding: "2px 10px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          color: "#0F172A",
                        }}
                      >
                        📄 {file}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 4: Line Items Table Card */}
          <div className={styles.card}>
            <div className={styles.lineToolbar}>
              <span className={styles.noteText}>*Note: Press Shift &amp; scroll to move to the right</span>
              <button type="button" className={styles.btnColumns}>
                <Icon icon="lucide:columns-2" width={14} />
                <span>Columns</span>
              </button>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: "36px" }}>Move</th>
                    <th style={{ width: "36px" }}>No.</th>
                    <th style={{ width: "160px" }}>Product Code</th>
                    <th style={{ width: "180px" }}>Description*</th>
                    <th style={{ width: "180px" }}>Long Description</th>
                    <th style={{ width: "90px", textAlign: "right" }}>Quantity*</th>
                    <th style={{ width: "100px" }}>UOM*</th>
                    <th style={{ width: "100px", textAlign: "right" }}>Unit Price*</th>
                    <th style={{ width: "110px" }}>Taxes*</th>
                    <th style={{ width: "100px", textAlign: "right" }}>Tax Amount*</th>
                    <th style={{ width: "110px", textAlign: "right" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        Total (Excl. Tax)
                        <Icon icon="lucide:info" width={12} style={{ color: "#64748B" }} />
                      </span>
                    </th>
                    <th style={{ width: "110px", textAlign: "right" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        Total (Incl. Tax)*
                        <Icon icon="lucide:info" width={12} style={{ color: "#64748B" }} />
                      </span>
                    </th>
                    <th style={{ width: "80px", textAlign: "center" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, idx) => {
                    const rowExclTax = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                    const rowInclTax = rowExclTax + (Number(item.taxAmount) || 0);

                    return (
                      <tr key={item.id}>
                        <td style={{ textAlign: "center", color: "#94A3B8", cursor: "grab" }}>
                          <Icon icon="lucide:grip-vertical" width={14} />
                        </td>
                        <td style={{ textAlign: "center", fontWeight: 600, color: "#64748B" }}>
                          {item.no}
                        </td>
                        <td>
                          <div className={styles.productCodeWrap}>
                            <input
                              type="text"
                              className={styles.inputTable}
                              placeholder="Code..."
                              value={item.productCode}
                              onChange={(e) => handleFieldChange(item.id, "productCode", e.target.value)}
                            />
                            <button type="button" className={styles.searchIconBtn}>
                              <Icon icon="lucide:search" width={14} />
                            </button>
                          </div>
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.inputTable}
                            placeholder="Description..."
                            value={item.description}
                            onChange={(e) => handleFieldChange(item.id, "description", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.inputTable}
                            placeholder="Long description..."
                            value={item.longDescription}
                            onChange={(e) => handleFieldChange(item.id, "longDescription", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            className={styles.inputTable}
                            style={{ textAlign: "right" }}
                            value={item.quantity}
                            onChange={(e) => handleFieldChange(item.id, "quantity", parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td>
                          <select
                            className={styles.selectTable}
                            value={item.uom}
                            onChange={(e) => handleFieldChange(item.id, "uom", e.target.value)}
                          >
                            <option value="EA">EA</option>
                            <option value="BOX">BOX</option>
                            <option value="SET">SET</option>
                            <option value="KG">KG</option>
                            <option value="LOT">LOT</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            className={styles.inputTable}
                            style={{ textAlign: "right" }}
                            value={item.unitPrice}
                            onChange={(e) => handleFieldChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td>
                          <select
                            className={styles.selectTable}
                            value={item.taxRate}
                            onChange={(e) => handleFieldChange(item.id, "taxRate", e.target.value)}
                          >
                            <option value="Purchas...">Purchas...</option>
                            <option value="GST 9%">GST 9%</option>
                            <option value="Exempt">Exempt</option>
                          </select>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <button
                              type="button"
                              className={styles.iconBtnAction}
                              title="Calculate tax"
                              onClick={() => {
                                const calculatedTax = rowExclTax * 0.09;
                                handleFieldChange(item.id, "taxAmount", Math.round(calculatedTax * 100) / 100);
                              }}
                            >
                              <Icon icon="lucide:rotate-cw" width={13} />
                            </button>
                            <input
                              type="number"
                              step="0.01"
                              className={styles.inputTable}
                              style={{ textAlign: "right" }}
                              value={item.taxAmount}
                              onChange={(e) => handleFieldChange(item.id, "taxAmount", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 600, color: "#0F172A" }}>
                          {rowExclTax.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 600, color: "#0F172A" }}>
                          {rowInclTax.toFixed(2)}
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              type="button"
                              className={styles.iconBtnAction}
                              title="Duplicate row"
                              onClick={() => handleDuplicateRow(idx)}
                            >
                              <Icon icon="lucide:copy" width={15} />
                            </button>
                            <button
                              type="button"
                              className={styles.iconBtnAction}
                              title="Row history"
                            >
                              <Icon icon="lucide:rotate-ccw" width={15} />
                            </button>
                            <button
                              type="button"
                              className={styles.iconBtnDelete}
                              title="Remove row"
                              onClick={() => handleRemoveRow(item.id)}
                            >
                              <Icon icon="lucide:trash-2" width={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div>
              <button type="button" className={styles.btnAddRow} onClick={handleAddRow}>
                + Add row
              </button>
            </div>

            {/* Subtotals Summary */}
            <div className={styles.subtotalsBox}>
              <button type="button" className={styles.btnRefresh}>
                <Icon icon="lucide:rotate-cw" width={12} />
                <span>Refresh</span>
              </button>

              <div className={styles.totalRow}>
                <span>Sub Total (excl. tax) :</span>
                <span className={styles.totalVal}>{subTotalExclTax.toFixed(2)}</span>
              </div>

              <div className={styles.totalRow}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  Total Tax <Icon icon="lucide:info" width={12} style={{ color: "#64748B" }} /> :
                </span>
                <span className={styles.totalVal}>{totalTaxAmount.toFixed(2)}</span>
              </div>

              <div className={styles.totalGrandRow}>
                <span>Total Amount :</span>
                <span className={styles.totalGrandVal}>{totalAmountInclTax.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Activity Section */}
          <div className={styles.activityCard}>
            <h3 className={styles.cardTitle}>Activity</h3>

            <div className={styles.commentsTab}>
              <span>Comments</span>
            </div>

            {comments.length === 0 ? (
              <span className={styles.commentEmpty}>No comments.</span>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {comments.map((cmt, i) => (
                  <div key={i} style={{ background: "#F8FAFC", padding: "8px 12px", borderRadius: "6px", fontSize: "13px" }}>
                    💬 {cmt}
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddComment} style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <input
                type="text"
                placeholder="Add a comment..."
                className={styles.inputTable}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className={styles.btnSecondary}
                style={{ padding: "6px 16px", fontSize: "12.5px" }}
              >
                Post
              </button>
            </form>
          </div>
        </main>
      </div>

      <ExitConfirmationModal
        isOpen={showExitModal}
        onConfirm={handleConfirmExit}
        onCancel={() => setShowExitModal(false)}
      />
    </div>
  );
}
