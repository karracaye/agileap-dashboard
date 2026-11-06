"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ExitConfirmationModal from "@/components/ExitConfirmationModal";
import styles from "./page.module.css";

export default function NewGoodsReceiptPage() {
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitTarget, setExitTarget] = useState("/goods-receipt");

  const handleRequestExit = (targetUrl: string = "/goods-receipt") => {
    setExitTarget(targetUrl);
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    router.push(exitTarget);
  };

  const [vendorOpen, setVendorOpen] = useState(true);
  const [grnInfoOpen, setGrnInfoOpen] = useState(true);
  const [attachmentOpen, setAttachmentOpen] = useState(true);
  const [lineItemsOpen, setLineItemsOpen] = useState(true);
  const [activityOpen, setActivityOpen] = useState(true);

  // Form Fields matching media_1791273813410.png
  const [vendor, setVendor] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [buyerReference, setBuyerReference] = useState("");

  const [receiptDate, setReceiptDate] = useState("2026-10-06");
  const [receiver, setReceiver] = useState("Joshua Lee (Test) (joshua+1@activants.com)");
  const [location, setLocation] = useState("Default");
  const [currency, setCurrency] = useState("SGD");
  const [exchangeRate, setExchangeRate] = useState("1.00000");
  const [poNumber, setPoNumber] = useState("");
  const [doRefNumber, setDoRefNumber] = useState("");
  const [notesTerms, setNotesTerms] = useState("");
  const [grnType, setGrnType] = useState("");

  // Attachments
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Line Items matching media_1791273813406.png
  const [lineItems, setLineItems] = useState([
    {
      id: "1",
      productCode: "",
      description: "",
      quantity: "0.00",
      receivedQty: "0.00",
      uom: "EA",
      poSNo: "",
      unitPrice: "0.00",
      taxes: "Purchases Tax 9%",
      taxAmount: "0.00",
    },
  ]);

  // Comments
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleAddRow = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        productCode: "",
        description: "",
        quantity: "0.00",
        receivedQty: "0.00",
        uom: "EA",
        poSNo: "",
        unitPrice: "0.00",
        taxes: "Purchases Tax 9%",
        taxAmount: "0.00",
      },
    ]);
  };

  const handleDuplicateRow = (index: number) => {
    const itemToDup = lineItems[index];
    setLineItems((prev) => [
      ...prev,
      { ...itemToDup, id: String(prev.length + 1) },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: string, value: any) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, [field]: value };
      })
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles((prev) => [...prev, e.target.files![0].name]);
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
              href="/goods-receipt"
              className={styles.breadcrumbLink}
              onClick={(e) => {
                e.preventDefault();
                handleRequestExit("/goods-receipt");
              }}
            >
              Goods Receipt
            </Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>New</span>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.titleGroup}>
              <div className={styles.titleRow}>
                <h1 className={styles.pageTitle}>Goods Receipt</h1>
                <span className={styles.badgeNew}>New</span>
              </div>
              <span className={styles.grnSubNo}>DF-20261006-073700756</span>
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
                onClick={() => handleRequestExit("/goods-receipt")}
              >
                Back
              </button>
            </div>
          </div>

          {/* Section 1: Vendor Information Card (matching media_1791273813410.png) */}
          <div className={styles.card}>
            <div className={styles.cardHeader} onClick={() => setVendorOpen((prev) => !prev)}>
              <span className={styles.cardTitle}>Vendor Information</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icon icon="lucide:columns-2" width={16} style={{ color: "#94A3B8" }} />
                <Icon icon={vendorOpen ? "lucide:chevron-up" : "lucide:chevron-down"} width={18} style={{ color: "#64748B" }} />
              </div>
            </div>

            {vendorOpen && (
              <div className={styles.formSectionGrid}>
                {/* Vendor* */}
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

                {/* Contact Person* */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>
                    Contact Person<span style={{ color: "#DC2626" }}>*</span>
                  </label>
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

                {/* Buyer Reference (i) */}
                <div className={`${styles.formRow} ${styles.fullWidthRow}`}>
                  <label className={styles.formLabel}>
                    <span>Buyer Reference</span>
                    <Icon icon="lucide:info" width={14} style={{ color: "#64748B" }} />
                  </label>
                  <div className={styles.fieldInputWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={buyerReference}
                      onChange={(e) => setBuyerReference(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: GRN Information Card (matching media_1791273813410.png 2-column layout) */}
          <div className={styles.card}>
            <div className={styles.cardHeader} onClick={() => setGrnInfoOpen((prev) => !prev)}>
              <span className={styles.cardTitle}>GRN Information</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icon icon="lucide:eye" width={16} style={{ color: "#94A3B8" }} />
                <Icon icon={grnInfoOpen ? "lucide:chevron-up" : "lucide:chevron-down"} width={18} style={{ color: "#64748B" }} />
              </div>
            </div>

            {grnInfoOpen && (
              <div className={styles.formSectionGrid}>
                {/* Receipt Date* */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>
                    Receipt Date<span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <div className={styles.fieldInputWrap}>
                    <input
                      type="date"
                      className={styles.fieldInput}
                      value={receiptDate}
                      onChange={(e) => setReceiptDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Receiver */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Receiver</label>
                  <div className={styles.selectWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={receiver}
                      onChange={(e) => setReceiver(e.target.value)}
                    />
                    {receiver && (
                      <button
                        type="button"
                        className={styles.clearIconBtn}
                        onClick={() => setReceiver("")}
                      >
                        <Icon icon="lucide:x" width={14} />
                      </button>
                    )}
                    <Icon icon="lucide:chevron-down" width={14} className={styles.selectIcon} />
                  </div>
                </div>

                {/* Location* */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>
                    Location<span style={{ color: "#DC2626" }}>*</span>
                  </label>
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

                {/* Currency* */}
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

                {/* Purchase Order Number */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Purchase Order Number</label>
                  <div className={styles.selectWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="Type to search"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                    />
                    <Icon icon="lucide:chevron-down" width={14} className={styles.selectIcon} />
                  </div>
                </div>

                {/* DO Ref Number */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>DO Ref Number</label>
                  <div className={styles.fieldInputWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={doRefNumber}
                      onChange={(e) => setDoRefNumber(e.target.value)}
                    />
                  </div>
                </div>

                {/* Notes / Terms (i) */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>
                    <span>Notes / Terms</span>
                    <Icon icon="lucide:info" width={14} style={{ color: "#64748B" }} />
                  </label>
                  <div className={styles.fieldInputWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={notesTerms}
                      onChange={(e) => setNotesTerms(e.target.value)}
                    />
                  </div>
                </div>

                {/* GRN Type */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>GRN Type</label>
                  <div className={styles.selectWrap}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="Type to search"
                      value={grnType}
                      onChange={(e) => setGrnType(e.target.value)}
                    />
                    <Icon icon="lucide:chevron-down" width={14} className={styles.selectIcon} />
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

          {/* Section 3: Attachment Card (matching media_1791273813406.png) */}
          <div className={styles.card}>
            <div className={styles.cardHeader} onClick={() => setAttachmentOpen((prev) => !prev)}>
              <span className={styles.cardTitle}>Attachment</span>
              <Icon icon={attachmentOpen ? "lucide:chevron-up" : "lucide:chevron-down"} width={18} style={{ color: "#64748B" }} />
            </div>

            {attachmentOpen && (
              <div>
                <div className={styles.dropzone}>
                  <input
                    type="file"
                    className={styles.fileInputHidden}
                    onChange={handleFileUpload}
                  />
                  <p className={styles.dropzoneTextRed}>
                    Click here to <span style={{ textDecoration: "underline" }}>upload</span> your file.
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className={styles.fileList}>
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className={styles.fileItem}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Icon icon="lucide:file-text" width={16} style={{ color: "#E8692A" }} />
                          <span>{file}</span>
                        </div>
                        <Icon icon="lucide:check" width={16} style={{ color: "#16A34A" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 4: Line Items Table Card (matching media_1791273813406.png) */}
          <div className={styles.card}>
            <div className={styles.cardHeader} onClick={() => setLineItemsOpen((prev) => !prev)}>
              <span className={styles.cardTitle}>Line Items</span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button type="button" className={styles.btnColumns}>
                  <Icon icon="lucide:columns-2" width={14} />
                  <span>Columns</span>
                </button>
                <Icon icon={lineItemsOpen ? "lucide:chevron-up" : "lucide:chevron-down"} width={18} style={{ color: "#64748B" }} />
              </div>
            </div>

            {lineItemsOpen && (
              <div className={styles.lineItemSection}>
                <p className={styles.tableNote}>*Note: Press Shift & scroll to move to the right</p>

                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th} style={{ width: "40px" }}>Move</th>
                        <th className={styles.th} style={{ width: "40px" }}>No.</th>
                        <th className={styles.th}>Product Code</th>
                        <th className={styles.th}>Description*</th>
                        <th className={styles.th} style={{ width: "90px" }}>Quantity*</th>
                        <th className={styles.th} style={{ width: "100px" }}>Received Qty.*</th>
                        <th className={styles.th} style={{ width: "90px" }}>UOM*</th>
                        <th className={styles.th} style={{ width: "90px" }}>PO S/No.</th>
                        <th className={styles.th} style={{ width: "100px" }}>Unit Price</th>
                        <th className={styles.th} style={{ width: "130px" }}>Taxes</th>
                        <th className={styles.th} style={{ width: "100px" }}>Tax Amount</th>
                        <th className={styles.th} style={{ width: "70px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((item, index) => (
                        <tr key={item.id}>
                          <td className={styles.td} style={{ color: "#94A3B8", cursor: "grab", textAlign: "center" }}>
                            <Icon icon="lucide:grip-vertical" width={16} />
                          </td>
                          <td className={styles.td} style={{ textAlign: "center" }}>{index + 1}</td>
                          <td className={styles.td}>
                            <div style={{ position: "relative" }}>
                              <input
                                type="text"
                                className={styles.tableInput}
                                value={item.productCode}
                                onChange={(e) => handleLineItemChange(item.id, "productCode", e.target.value)}
                              />
                              <Icon icon="lucide:search" width={14} style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                            </div>
                          </td>
                          <td className={styles.td}>
                            <input
                              type="text"
                              className={styles.tableInput}
                              value={item.description}
                              onChange={(e) => handleLineItemChange(item.id, "description", e.target.value)}
                            />
                          </td>
                          <td className={styles.td}>
                            <input
                              type="text"
                              className={styles.tableInput}
                              style={{ textAlign: "right" }}
                              value={item.quantity}
                              onChange={(e) => handleLineItemChange(item.id, "quantity", e.target.value)}
                            />
                          </td>
                          <td className={styles.td}>
                            <input
                              type="text"
                              className={styles.tableInput}
                              style={{ textAlign: "right" }}
                              value={item.receivedQty}
                              onChange={(e) => handleLineItemChange(item.id, "receivedQty", e.target.value)}
                            />
                          </td>
                          <td className={styles.td}>
                            <div className={styles.selectWrap}>
                              <select
                                className={styles.tableSelect}
                                value={item.uom}
                                onChange={(e) => handleLineItemChange(item.id, "uom", e.target.value)}
                              >
                                <option value="EA">EA</option>
                                <option value="PCS">PCS</option>
                                <option value="BOX">BOX</option>
                              </select>
                            </div>
                          </td>
                          <td className={styles.td}>
                            <input
                              type="text"
                              className={styles.tableInput}
                              value={item.poSNo}
                              onChange={(e) => handleLineItemChange(item.id, "poSNo", e.target.value)}
                            />
                          </td>
                          <td className={styles.td}>
                            <input
                              type="text"
                              className={styles.tableInput}
                              style={{ textAlign: "right" }}
                              value={item.unitPrice}
                              onChange={(e) => handleLineItemChange(item.id, "unitPrice", e.target.value)}
                            />
                          </td>
                          <td className={styles.td}>
                            <div className={styles.selectWrap}>
                              <select
                                className={styles.tableSelect}
                                value={item.taxes}
                                onChange={(e) => handleLineItemChange(item.id, "taxes", e.target.value)}
                              >
                                <option value="Purchases Tax 9%">Purchases Tax 9%</option>
                                <option value="GST 0%">GST 0%</option>
                              </select>
                            </div>
                          </td>
                          <td className={styles.td} style={{ textAlign: "right" }}>
                            {item.taxAmount}
                          </td>
                          <td className={styles.td}>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button
                                type="button"
                                title="Duplicate row"
                                onClick={() => handleDuplicateRow(index)}
                                style={{ border: "none", background: "none", color: "#64748B", cursor: "pointer" }}
                              >
                                <Icon icon="lucide:copy" width={14} />
                              </button>
                              <button
                                type="button"
                                title="Delete row"
                                onClick={() => handleRemoveRow(item.id)}
                                style={{ border: "none", background: "none", color: "#DC2626", cursor: "pointer" }}
                              >
                                <Icon icon="lucide:trash-2" width={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button type="button" className={styles.btnAddRow} onClick={handleAddRow}>
                  Add row
                </button>
              </div>
            )}
          </div>

          {/* Section 5: Activity Card (matching media_1791273813406.png) */}
          <div className={styles.card}>
            <div className={styles.cardHeader} onClick={() => setActivityOpen((prev) => !prev)}>
              <span className={styles.cardTitle}>Activity</span>
              <Icon icon={activityOpen ? "lucide:chevron-up" : "lucide:chevron-down"} width={18} style={{ color: "#64748B" }} />
            </div>

            {activityOpen && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <button type="button" className={styles.activeTab}>
                    Comments
                  </button>
                </div>

                {comments.length === 0 ? (
                  <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>No comments.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {comments.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "10px 14px",
                          background: "#F8FAFC",
                          borderRadius: "8px",
                          fontSize: "13px",
                          color: "#334155",
                          border: "1px solid #F1F5F9",
                        }}
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleAddComment} style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit" className={styles.btnPrimary} style={{ flexShrink: 0 }}>
                    Comment
                  </button>
                </form>
              </div>
            )}
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
