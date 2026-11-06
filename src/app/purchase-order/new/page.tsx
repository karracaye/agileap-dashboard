"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ExitConfirmationModal from "@/components/ExitConfirmationModal";
import styles from "./page.module.css";

interface LineItemRow {
  id: string;
  productCode: string;
  description: string;
  quantity: string;
  remainingQty: string;
  remainingTotal: string;
  uom: string;
  location: string;
  unitPrice: string;
  reasonCode: string;
}

function CreatePurchaseOrderForm() {
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitTarget, setExitTarget] = useState("/purchase-order");

  const handleRequestExit = (targetUrl: string = "/purchase-order") => {
    setExitTarget(targetUrl);
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    router.push(exitTarget);
  };
  const searchParams = useSearchParams();
  const convertedFromPR = searchParams.get("convertedFromPR");

  // Section Collapse States
  const [vendorInfoOpen, setVendorInfoOpen] = useState(true);
  const [poInfoOpen, setPoInfoOpen] = useState(true);
  const [deliveryOpen, setDeliveryOpen] = useState(true);
  const [attachmentOpen, setAttachmentOpen] = useState(true);
  const [itemsOpen, setItemsOpen] = useState(true);
  const [activityOpen, setActivityOpen] = useState(true);

  // Section 1: Vendor Information
  const [vendor, setVendor] = useState(convertedFromPR ? "CMH PTE LTD (CMH1)" : "");
  const [contactPerson, setContactPerson] = useState(convertedFromPR ? "John Tan" : "");

  // Section 2: PO Information
  const [initialPoNo, setInitialPoNo] = useState("");
  const [poChangeSeqId, setPoChangeSeqId] = useState("");
  const [buyerRef, setBuyerRef] = useState("");
  const [poDate, setPoDate] = useState("2026-10-08");
  const [quotationNo, setQuotationNo] = useState("");
  const [initialPoDate, setInitialPoDate] = useState("");
  const [currency, setCurrency] = useState("SGD");
  const [exchangeRate, setExchangeRate] = useState("1.00000");
  const [contractNo, setContractNo] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [shippingContact, setShippingContact] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [grnRequired, setGrnRequired] = useState("Yes");

  // Section 3: Delivery
  const [deliveryDate, setDeliveryDate] = useState("2026-10-22");
  const [deliveryLocation, setDeliveryLocation] = useState("Main Warehouse (C300)");
  const [deliveryAddress, setDeliveryAddress] = useState("10 Anson Road #23-01, International Plaza, Singapore 079903");

  // Attachments
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Line Items matching media_1791439206636.png
  const [lineItems, setLineItems] = useState<LineItemRow[]>([
    {
      id: "1",
      productCode: convertedFromPR ? "IT-SRV-001" : "",
      description: convertedFromPR ? "Server Hardware Upgrade Kit" : "",
      quantity: convertedFromPR ? "1.00" : "0.00",
      remainingQty: "0.00",
      remainingTotal: "0.00",
      uom: "EA",
      location: "",
      unitPrice: convertedFromPR ? "1750.00" : "0.00",
      reasonCode: "",
    },
  ]);

  const handleAddRow = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        productCode: "",
        description: "",
        quantity: "0.00",
        remainingQty: "0.00",
        remainingTotal: "0.00",
        uom: "EA",
        location: "",
        unitPrice: "0.00",
        reasonCode: "",
      },
    ]);
  };

  const handleDuplicateRow = (id: string) => {
    const target = lineItems.find((item) => item.id === id);
    if (!target) return;
    setLineItems((prev) => [
      ...prev,
      {
        ...target,
        id: String(Date.now()),
      },
    ]);
  };

  const handleResetRow = (id: string) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          productCode: "",
          description: "",
          quantity: "0.00",
          remainingQty: "0.00",
          remainingTotal: "0.00",
          unitPrice: "0.00",
          reasonCode: "",
        };
      })
    );
  };

  const handleRemoveRow = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: keyof LineItemRow, value: string) => {
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

  const calculateSubTotal = () => {
    return lineItems.reduce((acc, item) => {
      const q = parseFloat(item.quantity) || 0;
      const p = parseFloat(item.unitPrice) || 0;
      return acc + q * p;
    }, 0);
  };

  const subTotal = calculateSubTotal();
  const totalAmount = subTotal;

  const handleSaveDraft = () => {
    alert("Purchase Order saved as Draft (DF-20261008-053051293) successfully!");
    router.push("/purchase-order");
  };

  const handleSaveContinue = () => {
    alert("Purchase Order saved successfully!");
  };

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />

        <main className={styles.content}>
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
            <Link
              href="/"
              className={styles.breadcrumbLink}
              onClick={(e) => {
                e.preventDefault();
                handleRequestExit("/");
              }}
            >
              <Icon icon="lucide:home" width={14} height={14} />
            </Link>
            <span>/</span>
            <Link
              href="/purchase-order"
              className={styles.breadcrumbLink}
              onClick={(e) => {
                e.preventDefault();
                handleRequestExit("/purchase-order");
              }}
            >
              Purchase Order
            </Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>New</span>
          </nav>

          {/* Page Header matching media_1791439206632.png */}
          <div className={styles.pageHeader}>
            <div className={styles.headerTitleGroup}>
              <div className={styles.headerTitleRow}>
                <h1 className={styles.pageTitle}>Purchase Order</h1>
                <span className={styles.newBadge}>New</span>
              </div>
              <span className={styles.docRefNo}>DF-20261008-053051293</span>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={handleSaveDraft}
              >
                Save as Draft
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleSaveContinue}
              >
                Save and Continue
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => handleRequestExit("/purchase-order")}
              >
                Back
              </button>
            </div>
          </div>

          {/* Section 1: Vendor Information */}
          <div className={styles.sectionCard}>
            <div
              className={styles.cardHeader}
              onClick={() => setVendorInfoOpen((prev) => !prev)}
            >
              <h2 className={styles.cardTitle}>Vendor Information</h2>
              <Icon
                icon={vendorInfoOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
                width={18}
                height={18}
                color="#64748B"
              />
            </div>

            {vendorInfoOpen && (
              <div className={styles.cardBody}>
                <div className={styles.formGrid2Col}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Vendor <span className={styles.required}>*</span>
                    </label>
                    <select
                      className={styles.select}
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                    >
                      <option value="">Select Vendor</option>
                      <option value="CMH PTE LTD (CMH1)">CMH PTE LTD (CMH1)</option>
                      <option value="BW LPG (ACT011)">BW LPG (ACT011)</option>
                      <option value="IMDA TEST BUYER">IMDA TEST BUYER</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Contact Person <span className={styles.required}>*</span>
                    </label>
                    <select
                      className={styles.select}
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                    >
                      <option value="">Select Contact Person</option>
                      <option value="John Tan">John Tan (CMH Contact)</option>
                      <option value="Mary Lim">Mary Lim</option>
                      <option value="Alex Wong">Alex Wong</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: PO Information */}
          <div className={styles.sectionCard}>
            <div
              className={styles.cardHeader}
              onClick={() => setPoInfoOpen((prev) => !prev)}
            >
              <h2 className={styles.cardTitle}>PO Information</h2>
              <Icon
                icon={poInfoOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
                width={18}
                height={18}
                color="#64748B"
              />
            </div>

            {poInfoOpen && (
              <div className={styles.cardBody}>
                <div className={styles.formGrid2Col}>
                  <div className={styles.formGroup}>
                    <label className={styles.labelWithInfo}>
                      <span>Initial PO Number</span>
                      <Icon icon="lucide:info" width={14} height={14} color="#94A3B8" />
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      value={initialPoNo}
                      onChange={(e) => setInitialPoNo(e.target.value)}
                      placeholder=""
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.labelWithInfo}>
                      <span>PO Change Sequence Id</span>
                      <Icon icon="lucide:info" width={14} height={14} color="#94A3B8" />
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      value={poChangeSeqId}
                      onChange={(e) => setPoChangeSeqId(e.target.value)}
                      placeholder=""
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.labelWithInfo}>
                      <span>Buyer Reference</span>
                      <Icon icon="lucide:info" width={14} height={14} color="#94A3B8" />
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      value={buyerRef}
                      onChange={(e) => setBuyerRef(e.target.value)}
                      placeholder=""
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      PO Date <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="date"
                      className={styles.input}
                      value={poDate}
                      onChange={(e) => setPoDate(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Quotation Number</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={quotationNo}
                      onChange={(e) => setQuotationNo(e.target.value)}
                      placeholder=""
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Initial PO Date</label>
                    <input
                      type="date"
                      className={styles.input}
                      value={initialPoDate}
                      onChange={(e) => setInitialPoDate(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Currency <span className={styles.required}>*</span>
                    </label>
                    <select
                      className={styles.select}
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="SGD">SGD</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="MYR">MYR</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Exchange Rate</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Contract Number</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={contractNo}
                      onChange={(e) => setContractNo(e.target.value)}
                      placeholder=""
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Budget</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder=""
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label className={styles.labelWithInfo}>
                      <span>Notes / PO Description</span>
                      <Icon icon="lucide:info" width={14} height={14} color="#94A3B8" />
                    </label>
                    <textarea
                      className={styles.textarea}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder=""
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Shipping Contact Number</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={shippingContact}
                      onChange={(e) => setShippingContact(e.target.value)}
                      placeholder=""
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>GRN Required</label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="grnRequired"
                          value="Yes"
                          checked={grnRequired === "Yes"}
                          onChange={(e) => setGrnRequired(e.target.value)}
                        />
                        <span>Yes</span>
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="grnRequired"
                          value="No"
                          checked={grnRequired === "No"}
                          onChange={(e) => setGrnRequired(e.target.value)}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Shipping Address</label>
                    <textarea
                      className={styles.textarea}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Delivery */}
          <div className={styles.sectionCard}>
            <div
              className={styles.cardHeader}
              onClick={() => setDeliveryOpen((prev) => !prev)}
            >
              <h2 className={styles.cardTitle}>Delivery</h2>
              <div className={styles.cardIcons}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Toggling delivery section visibility...");
                  }}
                  title="Toggle section visibility"
                >
                  <Icon icon="lucide:eye" width={18} height={18} />
                </button>
                <Icon
                  icon={deliveryOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
                  width={18}
                  height={18}
                />
              </div>
            </div>

            {deliveryOpen && (
              <div className={styles.cardBody}>
                <div className={styles.formGrid2Col}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Expected Delivery Date</label>
                    <input
                      type="date"
                      className={styles.input}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Delivery Location</label>
                    <select
                      className={styles.select}
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                    >
                      <option value="Main Warehouse (C300)">Main Warehouse (C300)</option>
                      <option value="HQ Office">HQ Office</option>
                      <option value="Site B Hub">Site B Hub</option>
                    </select>
                  </div>

                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Delivery Address</label>
                    <textarea
                      className={styles.textarea}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter delivery location address..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Attachment */}
          <div className={styles.sectionCard}>
            <div
              className={styles.cardHeader}
              onClick={() => setAttachmentOpen((prev) => !prev)}
            >
              <h2 className={styles.cardTitle}>Attachment</h2>
              <Icon
                icon={attachmentOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
                width={18}
                height={18}
                color="#64748B"
              />
            </div>

            {attachmentOpen && (
              <div className={styles.cardBody}>
                <label className={styles.attachmentDropzone}>
                  <span>
                    Click here to{" "}
                    <span className={styles.uploadLink}>upload</span> your file.
                  </span>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </label>

                {uploadedFiles.length > 0 && (
                  <div className={styles.uploadedFileList}>
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className={styles.uploadedFileItem}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Icon icon="lucide:file-text" width={16} height={16} color="#E8692A" />
                          <span>{file}</span>
                        </div>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() =>
                            setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))
                          }
                        >
                          <Icon icon="lucide:trash-2" width={15} height={15} color="#EF4444" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 5: Line Items / Products Table */}
          <div className={styles.sectionCard}>
            <div className={styles.cardBody}>
              {/* Toolbar above table */}
              <div className={styles.tableToolbar}>
                <span className={styles.noteText}>
                  *Note: Press Shift &amp; scroll to move to the right
                </span>
                <button
                  type="button"
                  className={styles.btnColumns}
                  onClick={() => alert("Customizing table columns...")}
                >
                  <Icon icon="lucide:columns-3" width={15} height={15} />
                  <span>Columns</span>
                </button>
              </div>

              {/* Table */}
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <th className={styles.th} style={{ width: 40, textAlign: "center" }}>Move</th>
                      <th className={styles.th} style={{ width: 40, textAlign: "center" }}>No.</th>
                      <th className={styles.th} style={{ width: 180 }}>Product Code</th>
                      <th className={styles.th} style={{ width: 240 }}>Description*</th>
                      <th className={styles.th} style={{ width: 100, textAlign: "right" }}>Quantity*</th>
                      <th className={styles.th} style={{ width: 140, textAlign: "right" }}>
                        <span className={styles.thInfo}>
                          <span>Remaining Quantity</span>
                          <Icon icon="lucide:info" width={14} height={14} color="#64748B" />
                        </span>
                      </th>
                      <th className={styles.th} style={{ width: 120, textAlign: "right" }}>Remaining Total</th>
                      <th className={styles.th} style={{ width: 90 }}>UOM*</th>
                      <th className={styles.th} style={{ width: 150 }}>Location</th>
                      <th className={styles.th} style={{ width: 120, textAlign: "right" }}>Unit Price*</th>
                      <th className={styles.th} style={{ width: 140, textAlign: "right" }}>
                        <span className={styles.thInfo}>
                          <span>Total (Excl. Tax)*</span>
                          <Icon icon="lucide:info" width={14} height={14} color="#64748B" />
                        </span>
                      </th>
                      <th className={styles.th} style={{ width: 140, textAlign: "right" }}>
                        <span className={styles.thInfo}>
                          <span>Total (Incl. Tax)*</span>
                          <Icon icon="lucide:info" width={14} height={14} color="#64748B" />
                        </span>
                      </th>
                      <th className={styles.th} style={{ width: 130 }}>Reason Code</th>
                      <th className={styles.th} style={{ width: 100, textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, index) => {
                      const q = parseFloat(item.quantity) || 0;
                      const p = parseFloat(item.unitPrice) || 0;
                      const lineTotal = q * p;

                      return (
                        <tr key={item.id}>
                          <td className={styles.td} style={{ textAlign: "center" }}>
                            <span className={styles.gripHandle}>
                              <Icon icon="lucide:grip-vertical" width={16} height={16} />
                            </span>
                          </td>
                          <td className={styles.td} style={{ textAlign: "center", fontWeight: 600 }}>
                            {index + 1}
                          </td>
                          <td className={styles.td}>
                            <div className={styles.tableInputWrap}>
                              <input
                                type="text"
                                className={`${styles.tableInput} ${styles.tableInputSearch}`}
                                placeholder=""
                                value={item.productCode}
                                onChange={(e) =>
                                  handleLineItemChange(item.id, "productCode", e.target.value)
                                }
                              />
                              <Icon
                                icon="lucide:search"
                                width={15}
                                height={15}
                                className={styles.searchIconInside}
                              />
                            </div>
                          </td>
                          <td className={styles.td}>
                            <input
                              type="text"
                              className={styles.tableInput}
                              placeholder=""
                              value={item.description}
                              onChange={(e) =>
                                handleLineItemChange(item.id, "description", e.target.value)
                              }
                            />
                          </td>
                          <td className={styles.td}>
                            <input
                              type="number"
                              className={styles.tableInput}
                              style={{ textAlign: "right" }}
                              value={item.quantity}
                              onChange={(e) =>
                                handleLineItemChange(item.id, "quantity", e.target.value)
                              }
                            />
                          </td>
                          <td className={styles.td} style={{ textAlign: "right", color: "#475569" }}>
                            {item.remainingQty}
                          </td>
                          <td className={styles.td} style={{ textAlign: "right", color: "#475569" }}>
                            {item.remainingTotal}
                          </td>
                          <td className={styles.td}>
                            <select
                              className={styles.tableSelect}
                              value={item.uom}
                              onChange={(e) =>
                                handleLineItemChange(item.id, "uom", e.target.value)
                              }
                            >
                              <option value="EA">EA</option>
                              <option value="BOX">BOX</option>
                              <option value="SET">SET</option>
                              <option value="UNIT">UNIT</option>
                            </select>
                          </td>
                          <td className={styles.td}>
                            <select
                              className={styles.tableSelect}
                              value={item.location}
                              onChange={(e) =>
                                handleLineItemChange(item.id, "location", e.target.value)
                              }
                            >
                              <option value="">Type to search</option>
                              <option value="C300">Main Warehouse (C300)</option>
                              <option value="HQ">HQ Office</option>
                            </select>
                          </td>
                          <td className={styles.td}>
                            <input
                              type="number"
                              className={styles.tableInput}
                              style={{ textAlign: "right" }}
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleLineItemChange(item.id, "unitPrice", e.target.value)
                              }
                            />
                          </td>
                          <td className={styles.td} style={{ textAlign: "right", fontWeight: 600 }}>
                            {lineTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                          <td className={styles.td} style={{ textAlign: "right", fontWeight: 600 }}>
                            {lineTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                          <td className={styles.td}>
                            <select
                              className={styles.tableSelect}
                              value={item.reasonCode}
                              onChange={(e) =>
                                handleLineItemChange(item.id, "reasonCode", e.target.value)
                              }
                            >
                              <option value="">Select Reason Code</option>
                              <option value="NORMAL">Normal Purchase</option>
                              <option value="URGENT">Urgent Stock</option>
                            </select>
                          </td>
                          <td className={styles.td} style={{ textAlign: "center" }}>
                            <div className={styles.rowActionBtns}>
                              <button
                                type="button"
                                className={styles.rowActionBtn}
                                title="Duplicate Row"
                                onClick={() => handleDuplicateRow(item.id)}
                              >
                                <Icon icon="lucide:copy" width={14} height={14} color="#64748B" />
                              </button>
                              <button
                                type="button"
                                className={styles.rowActionBtn}
                                title="Reset Row"
                                onClick={() => handleResetRow(item.id)}
                              >
                                <Icon icon="lucide:rotate-ccw" width={14} height={14} color="#64748B" />
                              </button>
                              <button
                                type="button"
                                className={styles.rowActionBtn}
                                title="Delete Row"
                                onClick={() => handleRemoveRow(item.id)}
                              >
                                <Icon icon="lucide:trash-2" width={14} height={14} color="#EF4444" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Controls */}
              <div className={styles.tableFooterRow}>
                <button type="button" className={styles.btnAddRow} onClick={handleAddRow}>
                  <Icon icon="lucide:plus" width={16} height={16} />
                  <span>Add row</span>
                </button>

                <div className={styles.totalsArea}>
                  <button
                    type="button"
                    className={styles.btnRefresh}
                    onClick={() => alert("Refreshed line calculations")}
                  >
                    <Icon icon="lucide:refresh-cw" width={14} height={14} />
                    <span>Refresh</span>
                  </button>

                  <div className={styles.totalsSummary}>
                    <div className={styles.subTotalRow}>
                      <span>Sub Total (excl. tax) :</span>
                      <strong>
                        SGD {subTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                    <div className={styles.grandTotalRow}>
                      <span>Total Amount :</span>
                      <strong>
                        SGD {totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Activity */}
          <div className={styles.sectionCard}>
            <div
              className={styles.cardHeader}
              onClick={() => setActivityOpen((prev) => !prev)}
            >
              <h2 className={styles.cardTitle}>Activity</h2>
              <Icon
                icon={activityOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
                width={18}
                height={18}
                color="#64748B"
              />
            </div>

            {activityOpen && (
              <div className={styles.cardBody}>
                <span className={styles.activityTab}>Comments</span>
                <p className={styles.noCommentsText}>No comments.</p>
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

export default function NewPurchaseOrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32 }}>Loading Purchase Order form...</div>}>
      <CreatePurchaseOrderForm />
    </Suspense>
  );
}
