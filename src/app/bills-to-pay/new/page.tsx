"use client";

import React, { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import styles from "./page.module.css";
import { Icon } from "@iconify/react";

interface LineItem {
  id: string;
  poSNo: string;
  productCode: string;
  description: string;
  category: string;
  costCentre: string;
  glCode: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  taxes: string;
  taxAmount: number;
}

export default function CreateBillPage() {
  // Collapsible Sections
  const [vendorCollapsed, setVendorCollapsed] = useState(false);
  const [additionalCollapsed, setAdditionalCollapsed] = useState(false);
  const [billInfoCollapsed, setBillInfoCollapsed] = useState(false);
  const [deliveryCollapsed, setDeliveryCollapsed] = useState(false);
  const [attachCollapsed, setAttachCollapsed] = useState(false);
  const [lineItemsCollapsed, setLineItemsCollapsed] = useState(false);

  // Line items view mode: "dropdown" vs "table"
  const [viewMode, setViewMode] = useState<"dropdown" | "table">("dropdown");

  // Form Fields State
  const [vendor, setVendor] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [vendorRef, setVendorRef] = useState("");
  const [contractNo, setContractNo] = useState("");
  const [budget, setBudget] = useState("");
  const [validityStart, setValidityStart] = useState("");
  const [validityEnd, setValidityEnd] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  const [billType, setBillType] = useState("Invoice");
  const [refNo, setRefNo] = useState("");
  const [prNo, setPrNo] = useState("");
  const [poNo, setPoNo] = useState("");
  const [grnNo, setGrnNo] = useState("");
  const [vendorCnNo, setVendorCnNo] = useState("");
  const [currency] = useState("SGD");
  const [exchangeRate] = useState("1.00000");
  const [issueDate, setIssueDate] = useState("2026-07-31");
  const [dueDate, setDueDate] = useState("2026-08-30");
  const [paymentTerms, setPaymentTerms] = useState("30 Days");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("Default");

  // Delivery
  const [locationId, setLocationId] = useState("");
  const [delAddress, setDelAddress] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [delStart, setDelStart] = useState("");
  const [delEnd, setDelEnd] = useState("");

  // Line Items
  const [items, setItems] = useState<LineItem[]>([
    {
      id: "1",
      poSNo: "",
      productCode: "Lenovo",
      description: "Test",
      category: "Others",
      costCentre: "",
      glCode: "0000",
      quantity: 220,
      uom: "Each",
      unitPrice: 123.00,
      taxes: "Purchases Tax (0%)",
      taxAmount: 0,
    },
  ]);

  const addLineItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        poSNo: "",
        productCode: "",
        description: "",
        category: "Others",
        costCentre: "",
        glCode: "",
        quantity: 1,
        uom: "EA",
        unitPrice: 0,
        taxes: "Purchases Tax (0%)",
        taxAmount: 0,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, val: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          if (field === "quantity" || field === "unitPrice") {
            const sub = (updated.quantity || 0) * (updated.unitPrice || 0);
            updated.taxAmount = 0;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const calculateSubtotal = () =>
    items.reduce((sum, i) => sum + (i.quantity || 0) * (i.unitPrice || 0), 0);
  const calculateTotalTax = () =>
    items.reduce((sum, i) => sum + (i.taxAmount || 0), 0);
  const calculateGrandTotal = () => calculateSubtotal() + calculateTotalTax();

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>

          {/* Breadcrumb Navigation */}
          <div className={styles.breadcrumb}>
            <Icon icon="lucide:home" width={14} />
            <Link href="/" className={styles.breadcrumbLink}>Bills To Pay</Link>
            <span>&gt;</span>
            <span className={styles.breadcrumbActive}>Create Bill</span>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerTitleGroup}>
              <div className={styles.titleRow}>
                <h1 className={styles.pageTitle}>Create Bill</h1>
                <span className={styles.newBadge}>New Draft</span>
              </div>
              <span className={styles.docId}>DF-20260731-060233567</span>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnSecondary}>Save as Draft</button>
              <button className={styles.btnPrimary}>Save and Continue</button>
              <Link href="/" className={styles.btnIconButton} title="Back to Bills To Pay">
                <Icon icon="lucide:chevron-left" width={18} />
              </Link>
            </div>
          </div>

          {/* 1. Vendor Information */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setVendorCollapsed(!vendorCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:building-2" width={16} />
                </div>
                <span className={styles.sectionTitle}>Vendor Information</span>
              </div>
              <Icon icon="lucide:chevron-up" className={`${styles.chevron} ${vendorCollapsed ? styles.chevronCollapsed : ""}`} width={16} />
            </div>
            {!vendorCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formRow}>
                    <label className={styles.label}>Vendor<span className={styles.reqStar}>*</span></label>
                    <select className={styles.select} value={vendor} onChange={(e) => setVendor(e.target.value)}>
                      <option value="" disabled>Type to search</option>
                      <option value="CMH PTE LTD">CMH PTE LTD (CMH1)</option>
                      <option value="Global Tech Pte Ltd">Global Tech Pte Ltd</option>
                      <option value="BW LNG">BW LNG</option>
                    </select>
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Contact Person<span className={styles.reqStar}>*</span></label>
                    <select className={styles.select} value={contactPerson} onChange={(e) => setContactPerson(e.target.value)}>
                      <option value="" disabled>Type to search</option>
                      <option value="IMDA TESTER BUYER">IMDA TESTER BUYER (junior+1@activants.com)</option>
                      <option value="John Tan">John Tan (john@globaltech.sg)</option>
                    </select>
                  </div>

                  <div className={styles.formRow} style={{ gridColumn: "1 / -1" }}>
                    <label className={styles.label}>Vendor Reference ⓘ</label>
                    <input type="text" className={styles.input} placeholder="Vendor reference..." value={vendorRef} onChange={(e) => setVendorRef(e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Additional Field */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setAdditionalCollapsed(!additionalCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:folder-code" width={16} />
                </div>
                <span className={styles.sectionTitle}>Additional Field</span>
              </div>
              <Icon icon="lucide:chevron-up" className={`${styles.chevron} ${additionalCollapsed ? styles.chevronCollapsed : ""}`} width={16} />
            </div>
            {!additionalCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formRow}>
                    <label className={styles.label}>Contract Number</label>
                    <input type="text" className={styles.input} placeholder="Contract number..." value={contractNo} onChange={(e) => setContractNo(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Budget</label>
                    <input type="text" className={styles.input} placeholder="Budget amount..." value={budget} onChange={(e) => setBudget(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Validity Period Start</label>
                    <input type="date" className={styles.input} value={validityStart} onChange={(e) => setValidityStart(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Validity Period End</label>
                    <input type="date" className={styles.input} value={validityEnd} onChange={(e) => setValidityEnd(e.target.value)} />
                  </div>

                  <div className={styles.formRow} style={{ gridColumn: "1 / -1" }}>
                    <label className={styles.label}>Shipping Address</label>
                    <input type="text" className={styles.input} placeholder="Shipping address..." value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Bill Information */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setBillInfoCollapsed(!billInfoCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:receipt" width={16} />
                </div>
                <span className={styles.sectionTitle}>Bill Information</span>
              </div>
              <Icon icon="lucide:chevron-up" className={`${styles.chevron} ${billInfoCollapsed ? styles.chevronCollapsed : ""}`} width={16} />
            </div>
            {!billInfoCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formRow}>
                    <label className={styles.label}>Bill Type</label>
                    <select className={styles.select} value={billType} onChange={(e) => setBillType(e.target.value)}>
                      <option value="Invoice">Invoice</option>
                      <option value="Credit Note">Credit Note</option>
                    </select>
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Reference No.<span className={styles.reqStar}>*</span> ⓘ</label>
                    <input type="text" className={styles.input} placeholder="e.g. INVWAPT51" value={refNo} onChange={(e) => setRefNo(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>PR Number</label>
                    <input type="text" className={styles.input} value={prNo} onChange={(e) => setPrNo(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Purchase Order Number</label>
                    <input type="text" className={styles.input} value={poNo} onChange={(e) => setPoNo(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>GRN Number</label>
                    <input type="text" className={styles.input} value={grnNo} onChange={(e) => setGrnNo(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Vendor CN Number</label>
                    <input type="text" className={styles.input} value={vendorCnNo} onChange={(e) => setVendorCnNo(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Issue Date<span className={styles.reqStar}>*</span></label>
                    <input type="date" className={styles.input} value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Due Date<span className={styles.reqStar}>*</span></label>
                    <input type="date" className={styles.input} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Payment Terms</label>
                    <select className={styles.select} value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
                      <option value="30 Days">30 Days</option>
                      <option value="60 Days">60 Days</option>
                      <option value="Immediate">Immediate</option>
                    </select>
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Location<span className={styles.reqStar}>*</span></label>
                    <input type="text" className={styles.input} value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>

                  <div className={styles.formRow} style={{ gridColumn: "1 / -1" }}>
                    <label className={styles.label}>Notes / Description ⓘ</label>
                    <textarea className={styles.textarea} placeholder="Notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Delivery */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setDeliveryCollapsed(!deliveryCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:truck" width={16} />
                </div>
                <span className={styles.sectionTitle}>Delivery</span>
              </div>
              <Icon icon="lucide:chevron-up" className={`${styles.chevron} ${deliveryCollapsed ? styles.chevronCollapsed : ""}`} width={16} />
            </div>
            {!deliveryCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formRow}>
                    <label className={styles.label}>Location ID</label>
                    <input type="text" className={styles.input} value={locationId} onChange={(e) => setLocationId(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Country</label>
                    <input type="text" className={styles.input} value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Postal Code</label>
                    <input type="text" className={styles.input} value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Delivery Period Start</label>
                    <input type="date" className={styles.input} value={delStart} onChange={(e) => setDelStart(e.target.value)} />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.label}>Delivery Period End</label>
                    <input type="date" className={styles.input} value={delEnd} onChange={(e) => setDelEnd(e.target.value)} />
                  </div>

                  <div className={styles.formRow} style={{ gridColumn: "1 / -1" }}>
                    <label className={styles.label}>Address</label>
                    <input type="text" className={styles.input} value={delAddress} onChange={(e) => setDelAddress(e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Attachment */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setAttachCollapsed(!attachCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:paperclip" width={16} />
                </div>
                <span className={styles.sectionTitle}>Attachment</span>
              </div>
              <Icon icon="lucide:chevron-up" className={`${styles.chevron} ${attachCollapsed ? styles.chevronCollapsed : ""}`} width={16} />
            </div>
            {!attachCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.uploadBox}>
                  <Icon icon="lucide:cloud-upload" width={28} style={{ color: "#E8692A" }} />
                  <p className={styles.uploadText}>
                    Click here to <span className={styles.uploadHighlight}>upload</span> your file.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 6. Line Items Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} onClick={() => setLineItemsCollapsed(!lineItemsCollapsed)}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:shopping-bag" width={16} />
                </div>
                <span className={styles.sectionTitle}>Line Items</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px" }} onClick={(e) => e.stopPropagation()}>
                <div className={styles.viewModeToggle}>
                  <button className={`${styles.viewModeBtn} ${viewMode === "dropdown" ? styles.viewModeBtnActive : ""}`} onClick={() => setViewMode("dropdown")}>
                    <Icon icon="lucide:layout-list" width={13} /> Dropdown View
                  </button>
                  <button className={`${styles.viewModeBtn} ${viewMode === "table" ? styles.viewModeBtnActive : ""}`} onClick={() => setViewMode("table")}>
                    <Icon icon="lucide:table" width={13} /> Table View
                  </button>
                </div>

                <button className={styles.btnColumns}>
                  <Icon icon="lucide:columns-2" width={14} /> Columns
                </button>
                <Icon icon="lucide:chevron-up" className={`${styles.chevron} ${lineItemsCollapsed ? styles.chevronCollapsed : ""}`} width={16} onClick={() => setLineItemsCollapsed(!lineItemsCollapsed)} />
              </div>
            </div>

            {!lineItemsCollapsed && (
              <div className={styles.sectionBody}>
                <div className={styles.scrollNote}>
                  *Note: Press Shift & scroll to move to the right
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.lineTable}>
                    <thead>
                      <tr>
                        <th>S/No.</th>
                        <th>PO S/No.</th>
                        <th>Product Code</th>
                        <th>Description*</th>
                        <th>Cost Centre</th>
                        <th>GL Code*</th>
                        <th style={{ textAlign: "right" }}>Quantity*</th>
                        <th>UOM*</th>
                        <th style={{ textAlign: "right" }}>Unit Price*</th>
                        <th style={{ textAlign: "right" }}>Taxes*</th>
                        <th style={{ textAlign: "right" }}>Tax Amount*</th>
                        <th style={{ textAlign: "right" }}>Total (Excl. Tax)*</th>
                        <th style={{ width: "50px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td><input type="text" className={styles.tblInput} value={item.poSNo} onChange={(e) => updateLineItem(item.id, "poSNo", e.target.value)} /></td>
                          <td><input type="text" className={styles.tblInput} value={item.productCode} onChange={(e) => updateLineItem(item.id, "productCode", e.target.value)} /></td>
                          <td><input type="text" className={styles.tblInput} value={item.description} onChange={(e) => updateLineItem(item.id, "description", e.target.value)} /></td>
                          <td><input type="text" className={styles.tblInput} value={item.costCentre} onChange={(e) => updateLineItem(item.id, "costCentre", e.target.value)} /></td>
                          <td><input type="text" className={styles.tblInput} value={item.glCode} onChange={(e) => updateLineItem(item.id, "glCode", e.target.value)} /></td>
                          <td><input type="number" className={styles.tblInput} style={{ textAlign: "right" }} value={item.quantity} onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)} /></td>
                          <td><input type="text" className={styles.tblInput} value={item.uom} onChange={(e) => updateLineItem(item.id, "uom", e.target.value)} /></td>
                          <td><input type="number" className={styles.tblInput} style={{ textAlign: "right" }} value={item.unitPrice} onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)} /></td>
                          <td>
                            <select className={styles.tblInput} value={item.taxes} onChange={(e) => updateLineItem(item.id, "taxes", e.target.value)}>
                              <option value="Purchases Tax (0%)">0%</option>
                              <option value="Purchases Tax (9%)">9%</option>
                            </select>
                          </td>
                          <td style={{ textAlign: "right" }}>{item.taxAmount.toFixed(2)}</td>
                          <td style={{ textAlign: "right", fontWeight: "600" }}>{((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}</td>
                          <td style={{ textAlign: "center" }}>
                            <span title="Delete item" onClick={() => removeLineItem(item.id)}>
                              <Icon icon="lucide:trash-2" width={15} style={{ cursor: "pointer", color: "#EF4444" }} />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button className={styles.btnAddRow} onClick={addLineItem}>
                  <Icon icon="lucide:plus" width={14} /> Add Line Item
                </button>

                <div className={styles.totalsBlock}>
                  <div className={styles.totalRowItem}>
                    <span className={styles.totalLabel}>Sub Total (excl. tax)*:</span>
                    <span className={styles.totalVal}>{calculateSubtotal().toFixed(2)} {currency}</span>
                  </div>
                  <div className={styles.totalRowItem}>
                    <span className={styles.totalLabel}>Total Tax ⓘ:</span>
                    <span className={styles.totalVal}>{calculateTotalTax().toFixed(2)} {currency}</span>
                  </div>
                  <div className={styles.totalRowItem}>
                    <span className={styles.totalLabel} style={{ fontWeight: 600, color: "#0F172A" }}>Total Amount*:</span>
                    <span className={styles.totalVal} style={{ fontWeight: 700, fontSize: "15px", color: "var(--brand-orange, #E8692A)" }}>
                      {calculateGrandTotal().toFixed(2)} {currency}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 7. Activity */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIconBadge}>
                  <Icon icon="lucide:message-square" width={16} />
                </div>
                <span className={styles.sectionTitle}>Activity</span>
              </div>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.commentTab}>Comments</div>
              <p style={{ fontSize: "13px", color: "#64748B" }}>No comments recorded.</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
