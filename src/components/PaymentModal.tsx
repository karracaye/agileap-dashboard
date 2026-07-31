"use client";

import React, { useState, useEffect } from "react";
import styles from "./PaymentModal.module.css";
import { Icon } from "@iconify/react";

export interface SelectedPaymentItem {
  id: string;
  type: string;
  refNo: string;
  payeeMain: string;
  dueDate: string;
  totalAmount: string;
  currency: string;
  glCode?: string;
  toBank?: string;
  payAmount?: string;
  remarks?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: SelectedPaymentItem[];
  onConfirmPayment: () => void;
  mode?: "full" | "partial";
}

export default function PaymentModal({
  isOpen,
  onClose,
  selectedItems,
  onConfirmPayment,
  mode = "full",
}: PaymentModalProps) {
  const [bankCollapsed, setBankCollapsed] = useState(false);
  const [detailsCollapsed, setDetailsCollapsed] = useState(false);
  const [attachCollapsed, setAttachCollapsed] = useState(false);

  const [paymentDate, setPaymentDate] = useState("2026-07-31");
  const [fromBank, setFromBank] = useState("Saving (BankABC)");
  const [paymentRefNo, setPaymentRefNo] = useState("");
  const [remarks, setRemarks] = useState("");

  // Items in payment details
  const [items, setItems] = useState<SelectedPaymentItem[]>([]);
  const [collapsedCardIds, setCollapsedCardIds] = useState<string[]>([]);

  // Partial Payment Specific State
  const [partialPayAmount, setPartialPayAmount] = useState("");
  const [partialGlCode, setPartialGlCode] = useState("");
  const [partialToBank, setPartialToBank] = useState("");
  const [partialRemarks, setPartialRemarks] = useState("");

  useEffect(() => {
    if (selectedItems && selectedItems.length > 0) {
      setItems(
        selectedItems.map((item) => ({
          ...item,
          payAmount: item.payAmount || item.totalAmount,
          remarks: item.remarks || "",
          glCode: item.glCode || "",
          toBank: item.toBank || "",
        }))
      );
      if (mode === "partial") {
        const initial = selectedItems[0];
        setPartialPayAmount(initial.payAmount || initial.totalAmount || "0.00");
        setPartialGlCode(initial.glCode || "");
        setPartialToBank(initial.toBank || "");
        setPartialRemarks(initial.remarks || "");
      }
    } else {
      setItems([]);
    }
  }, [selectedItems, isOpen, mode]);

  if (!isOpen) return null;

  const isPartial = mode === "partial";
  const singleItem = items[0] || {
    id: "1",
    type: "Bills To Pay",
    refNo: "INV-2026-010",
    payeeMain: "CMH PTE LTD",
    dueDate: "2026-07-08",
    totalAmount: "8,070.36",
    currency: "SGD",
  };

  const toggleCardCollapse = (id: string) => {
    setCollapsedCardIds((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((item) => item.id !== id));
    setCollapsedCardIds((prev) => prev.filter((cardId) => cardId !== id));
  };

  const handleFieldChange = (id: string, field: keyof SelectedPaymentItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateTotal = () => {
    if (isPartial) {
      const val = parseFloat(partialPayAmount.replace(/,/g, "")) || 0;
      return val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    const sum = items.reduce((acc, item) => {
      const val = parseFloat((item.payAmount || item.totalAmount || "0").replace(/,/g, "")) || 0;
      return acc + val;
    }, 0);
    return sum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calculateRemaining = () => {
    const orig = parseFloat((singleItem.totalAmount || "0").replace(/,/g, "")) || 0;
    const paying = parseFloat(partialPayAmount.replace(/,/g, "")) || 0;
    const rem = Math.max(0, orig - paying);
    return rem.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>

        {/* ── Modal Header ── */}
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.headerIconSlot}>
              <Icon icon={isPartial ? "lucide:receipt" : "lucide:credit-card"} width={18} />
            </div>
            <h2 className={styles.title}>{isPartial ? "Partial Payment" : "Payment"}</h2>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnMakePayment} onClick={onConfirmPayment}>
              {isPartial ? "Make Partial Payment" : "Make Payment"}
            </button>
            <button className={styles.btnClose} onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        {/* ── Scrollable Modal Body ── */}
        <div className={styles.body}>

          {/* 1. From Bank Details */}
          <div className={styles.section}>
            <div
              className={styles.sectionHeader}
              onClick={() => setBankCollapsed(!bankCollapsed)}
            >
              <div className={styles.sectionTitleGroup}>
                <span className={styles.sectionIcon}>
                  <Icon icon="lucide:building-2" width={16} />
                </span>
                <span className={styles.sectionTitle}>From Bank Details</span>
              </div>
              <Icon
                icon="lucide:chevron-up"
                className={`${styles.chevron} ${bankCollapsed ? styles.chevronCollapsed : ""}`}
                width={16}
              />
            </div>

            {!bankCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Payment Date<span className={styles.reqStar}>*</span>
                    </label>
                    <input
                      type="date"
                      className={styles.input}
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      From Bank Account<span className={styles.reqStar}>*</span>
                    </label>
                    <select
                      className={styles.select}
                      value={fromBank}
                      onChange={(e) => setFromBank(e.target.value)}
                    >
                      <option value="Saving (BankABC)">Saving (BankABC)</option>
                      <option value="Current (DBS Bank)">Current (DBS Bank)</option>
                      <option value="Corporate (OCBC Bank)">Corporate (OCBC Bank)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Currency<span className={styles.reqStar}>*</span>
                    </label>
                    <span className={styles.currencyPill}>SGD</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Payment Ref. No.</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. TR-2026-99"
                      value={paymentRefNo}
                      onChange={(e) => setPaymentRefNo(e.target.value)}
                    />
                    <div className={styles.subHint}>Remarks to appear on your bank statement</div>
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Remarks</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Optional payment notes..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Payment Details */}
          <div className={styles.section}>
            <div
              className={styles.sectionHeader}
              onClick={() => setDetailsCollapsed(!detailsCollapsed)}
            >
              <div className={styles.sectionTitleGroup}>
                <span className={styles.sectionIcon}>
                  <Icon icon="lucide:receipt" width={16} />
                </span>
                <span className={styles.sectionTitle}>Payment Details</span>
                {!isPartial && (
                  <span className={styles.itemBadge}>{items.length} {items.length === 1 ? "item" : "items"}</span>
                )}
              </div>
              <Icon
                icon="lucide:chevron-up"
                className={`${styles.chevron} ${detailsCollapsed ? styles.chevronCollapsed : ""}`}
                width={16}
              />
            </div>

            {!detailsCollapsed && (
              <div className={styles.sectionBody}>
                {isPartial ? (
                  /* ── Partial Payment Table View (Exact match to screenshot) ── */
                  <>
                    <div className={styles.noteText}>*Note: Press Shift & scroll to move to the right</div>
                    <div className={styles.tableScroll}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th className={styles.th}>Category</th>
                            <th className={styles.th}>Type</th>
                            <th className={styles.th}>Ref. No.</th>
                            <th className={styles.th}>Due Date</th>
                            <th className={styles.th}>GL Code</th>
                            <th className={styles.th}>To Bank Account</th>
                            <th className={styles.th} style={{ textAlign: "right" }}>Due Amount</th>
                            <th className={styles.th}>Trans. Currency</th>
                            <th className={styles.th} style={{ textAlign: "right" }}>Pay Amount (SGD)*</th>
                            <th className={styles.th}>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Row 1: Apply Payment */}
                          <tr className={styles.row}>
                            <td className={styles.td}>
                              <button className={styles.tdCategoryBtn}>
                                Apply Payment <Icon icon="lucide:chevron-down" width={14} />
                              </button>
                            </td>
                            <td className={styles.td}>Advance Payment</td>
                            <td className={styles.td} style={{ color: "#A0AEC0" }}>{singleItem.refNo}</td>
                            <td className={styles.td} style={{ color: "#A0AEC0" }}>{singleItem.dueDate}</td>
                            <td className={styles.td}>–</td>
                            <td className={styles.td}>–</td>
                            <td className={styles.tdBold} style={{ textAlign: "right" }}>0.00</td>
                            <td className={styles.tdBold}>SGD</td>
                            <td className={styles.td} style={{ textAlign: "right" }}>–</td>
                            <td className={styles.td}>–</td>
                          </tr>

                          {/* Row 2: Going to Pay */}
                          <tr className={styles.row}>
                            <td className={`${styles.td} ${styles.tdBold}`}>Going to Pay</td>
                            <td className={`${styles.td} ${styles.tdBold}`}>{singleItem.type}</td>
                            <td className={`${styles.td} ${styles.tdBold}`}>{singleItem.refNo}</td>
                            <td className={`${styles.td} ${styles.tdBold}`}>{singleItem.dueDate}</td>
                            <td className={styles.td}>
                              <select
                                className={styles.tableSelect}
                                value={partialGlCode}
                                onChange={(e) => setPartialGlCode(e.target.value)}
                              >
                                <option value="" disabled>Type to search</option>
                                <option value="6000">6000 - Operating Expense</option>
                                <option value="2000">2000 - Accounts Payable</option>
                              </select>
                            </td>
                            <td className={styles.td}>
                              <input
                                type="text"
                                className={styles.input}
                                style={{ height: "28px", fontSize: "12px", minWidth: "120px" }}
                                placeholder=""
                                value={partialToBank}
                                onChange={(e) => setPartialToBank(e.target.value)}
                              />
                            </td>
                            <td className={styles.tdBold} style={{ textAlign: "right" }}>{singleItem.totalAmount}</td>
                            <td className={styles.tdBold}>SGD</td>
                            <td className={styles.td} style={{ textAlign: "right" }}>
                              <input
                                type="text"
                                className={styles.tableInput}
                                value={partialPayAmount}
                                onChange={(e) => setPartialPayAmount(e.target.value)}
                              />
                            </td>
                            <td className={styles.td}>
                              <input
                                type="text"
                                className={styles.input}
                                style={{ height: "28px", fontSize: "12px", minWidth: "120px" }}
                                placeholder=""
                                value={partialRemarks}
                                onChange={(e) => setPartialRemarks(e.target.value)}
                              />
                            </td>
                          </tr>

                          {/* Row 3: Remaining */}
                          <tr className={styles.row}>
                            <td className={`${styles.td} ${styles.tdBold}`} style={{ color: "#718096" }}>Remaining</td>
                            <td className={styles.td} style={{ color: "#718096" }}>{singleItem.type}</td>
                            <td className={styles.td} style={{ color: "#A0AEC0" }}>{singleItem.refNo}</td>
                            <td className={styles.td} style={{ color: "#A0AEC0" }}>{singleItem.dueDate}</td>
                            <td className={styles.td}>–</td>
                            <td className={styles.td}>–</td>
                            <td className={styles.tdBold} style={{ textAlign: "right" }}>{calculateRemaining()}</td>
                            <td className={styles.tdBold}>SGD</td>
                            <td className={styles.td} style={{ textAlign: "right" }}>–</td>
                            <td className={styles.td}>–</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className={styles.totalRow}>
                      <span className={styles.totalLabel}>Total Pay Amount (SGD) :</span>
                      <span className={styles.totalValue}>{calculateTotal()}</span>
                    </div>
                  </>
                ) : (
                  /* ── Full Payment Dropdown Cards View ── */
                  <>
                    <div className={styles.itemCardsList}>
                      {items.map((item) => {
                        const isCollapsed = collapsedCardIds.includes(item.id);

                        return (
                          <div key={item.id} className={styles.itemCard}>
                            <div
                              className={styles.itemCardHeader}
                              onClick={() => toggleCardCollapse(item.id)}
                            >
                              <div className={styles.itemHeaderLeft}>
                                <button
                                  className={styles.removeBtn}
                                  onClick={(e) => removeItem(item.id, e)}
                                  title="Remove item"
                                >
                                  <Icon icon="lucide:trash-2" width={12} />
                                </button>
                                <div className={styles.itemTitleGroup}>
                                  <span className={styles.itemTypeTag}>{item.type}</span>
                                  <span className={styles.itemRefNo}>{item.refNo}</span>
                                  <span className={styles.itemPayee}>• {item.payeeMain}</span>
                                </div>
                              </div>

                              <div className={styles.itemHeaderRight}>
                                <span className={styles.itemDueAmount}>
                                  {item.totalAmount} {item.currency}
                                </span>
                                <Icon
                                  icon="lucide:chevron-down"
                                  width={16}
                                  style={{
                                    transform: isCollapsed ? "rotate(180deg)" : "none",
                                    transition: "transform 0.2s",
                                  }}
                                />
                              </div>
                            </div>

                            {!isCollapsed && (
                              <div className={styles.itemCardBody}>
                                <div className={styles.itemFieldsGrid}>
                                  <div className={styles.formGroup}>
                                    <label className={styles.label}>GL Code</label>
                                    <select
                                      className={styles.select}
                                      value={item.glCode}
                                      onChange={(e) => handleFieldChange(item.id, "glCode", e.target.value)}
                                    >
                                      <option value="" disabled>Type to search</option>
                                      <option value="6000">6000 - Operating Expense</option>
                                      <option value="2000">2000 - Accounts Payable</option>
                                      <option value="5000">5000 - Cost of Goods Sold</option>
                                    </select>
                                  </div>

                                  <div className={styles.formGroup}>
                                    <label className={styles.label}>To Bank Account</label>
                                    <input
                                      type="text"
                                      className={styles.input}
                                      placeholder="Enter bank account..."
                                      value={item.toBank}
                                      onChange={(e) => handleFieldChange(item.id, "toBank", e.target.value)}
                                    />
                                  </div>

                                  <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                      Pay Amount ({item.currency})<span className={styles.reqStar}>*</span>
                                    </label>
                                    <input
                                      type="text"
                                      className={styles.input}
                                      style={{ fontWeight: "600", textAlign: "right" }}
                                      value={item.payAmount}
                                      onChange={(e) => handleFieldChange(item.id, "payAmount", e.target.value)}
                                    />
                                  </div>

                                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Remarks</label>
                                    <input
                                      type="text"
                                      className={styles.input}
                                      placeholder="Remarks for this line item..."
                                      value={item.remarks}
                                      onChange={(e) => handleFieldChange(item.id, "remarks", e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {items.length === 0 && (
                        <div style={{ textAlign: "center", padding: "20px", color: "#A0AEC0", fontSize: "13px" }}>
                          No items selected for payment.
                        </div>
                      )}
                    </div>

                    <div className={styles.totalRow}>
                      <span className={styles.totalLabel}>Total Pay Amount (SGD) :</span>
                      <span className={styles.totalValue}>{calculateTotal()}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 3. Attachment */}
          <div className={styles.section}>
            <div
              className={styles.sectionHeader}
              onClick={() => setAttachCollapsed(!attachCollapsed)}
            >
              <div className={styles.sectionTitleGroup}>
                <span className={styles.sectionIcon}>
                  <Icon icon="lucide:paperclip" width={16} />
                </span>
                <span className={styles.sectionTitle}>Attachment</span>
              </div>
              <Icon
                icon="lucide:chevron-up"
                className={`${styles.chevron} ${attachCollapsed ? styles.chevronCollapsed : ""}`}
                width={16}
              />
            </div>

            {!attachCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.uploadBox}>
                  <Icon icon="lucide:cloud-upload" width={28} className={styles.uploadIcon} />
                  <p className={styles.uploadText}>
                    Click here to <span className={styles.uploadHighlight}>upload</span> your file or drag and drop.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
