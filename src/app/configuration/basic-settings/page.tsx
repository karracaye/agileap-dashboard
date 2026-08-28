"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import styles from "./page.module.css";

export default function BasicSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "information" | "azure" | "global" | "peppol" | "layout"
  >("information");

  // Tab 1: Information Form State
  const [infoForm, setInfoForm] = useState({
    businessRegNo: "200003528Magic",
    taxRegNo: "200003528Magic",
    taxScheme: "GST",
    companyName: "Activants PINT Test",
    address: "24 Sin Ming Ln #08-105 Midview City",
    country: "Preset",
    postalCode: "573970",
    currency: "SGD",
    phoneNo: "23123132131231321321321321313",
    companyEmail: "junior@activants.com",
    paymentTerms: "30 Days",
    entityCode: "",
    subHeader: "",
    notesTerms: "",
  });

  // Tab 2: Azure AD Sync State
  const [azureForm, setAzureForm] = useState({
    autoInvite: false,
    adDepartment: "",
    appClientId: "",
    tenantId: "",
    clientSecret: "",
  });

  // Tab 3: Global Settings State
  const [globalForm, setGlobalForm] = useState({
    fiscalYearPeriod: "2026-01-01",
    fxAccountingMode: "",
    autoSendAgileAP: false,
    matchingProcess: "2/3 Way Matching (Manual)",
    toleranceLevel: "",
    totalAmountExclTax: "",
    allowDiffDescSamePrice: true,
    allowUomConversion: true,
    publishBusinessUnit: true,
    ifsConnection: false,
    sapConnection: false,
    companyCode: "",
    decimalPoint: "2",
    defaultTax: "GST Sales 9%",
  });

  // Tab 4: InvoiceNow (Peppol) Configuration State
  const [peppolForm, setPeppolForm] = useState({
    peppolId: "0195:SGTST333333333JPC",
    stopEmailNotif: false,
    stopAttachment: true,
    autoAck: true,
    autoResponse: false,
  });

  // Tab 5: Document Layout State
  const [layoutForm, setLayoutForm] = useState({
    supportEmail: "joshua+1@activants.com",
    dateFormat: "dd-MMM-yyyy (28-Aug-2026)",
    logoTitlePos: "Left: Logo, Right: Title",
    paymentInstruction: "",
    hideLogo: false,
    hideFooter: false,
    hidePaymentTerm: false,
    hideReceiverBU: false,
    hideReceiverContactName: false,
    hideReceiverContactEmail: false,
    showBankDetail: false,
    showPaynowQR: true,
    paynowMobile: false,
    paynowCompName: "Vicki",
    paynowUen: "09131231243",
    showSysText: true,
    sysText: "This is a computer generated document and does not required any signature.",
    hidePoweredByAgileAP: false,
    showGLEntries: false,
    titleQuotation: "QUOTATION",
    titleDeliveryOrder: "DELIVERY ORDER",
    titleInvoice: "TAX INVOICE",
    titleCreditNote: "CREDIT NOTE",
    titleDebitNote: "DEBIT NOTE",
    attachPR: false,
    attachPO: false,
    attachGRN: false,
    attachBillToPay: false,
    attachVendorCN: false,
    attachVendorDN: false,
  });

  const [roleMode, setRoleMode] = useState<"admin" | "user">("admin");

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>
          {/* Top Nav Breadcrumb & Role Preview Pill */}
          <div className={styles.topNavRow}>
            <div className={styles.breadcrumbLeft}>
              <Icon icon="lucide:home" width={14} height={14} className={styles.breadcrumbIcon} />
              <Link href="/configuration" className={styles.breadcrumbLink}>
                Configuration
              </Link>
              <Icon icon="lucide:chevron-right" width={12} height={12} />
              <span className={styles.breadcrumbCurrent}>Basic Settings</span>
            </div>

            {/* Instruction F Role Preview Switcher */}
            <div className={styles.rolePreviewPill}>
              <Icon icon="lucide:eye" width={14} height={14} style={{ color: "#64748b" }} />
              <select
                className={styles.roleSelect}
                value={roleMode}
                onChange={(e) => setRoleMode(e.target.value as "admin" | "user")}
              >
                <option value="admin">View as: Super Admin</option>
                <option value="user">View as: Standard User</option>
              </select>
            </div>
          </div>

          {/* Header Bar + Spacious Action Buttons */}
          <div className={styles.headerBar}>
            <div className={styles.headerLeft}>
              <h1 className={styles.pageTitle}>Basic Settings</h1>
              <p className={styles.pageSub}>
                Configure core company profiles, tax registrations, integration rules, and document layouts
              </p>
            </div>

            {/* Action Bar with Primary and Secondary Buttons */}
            <div className={styles.actionBar}>
              <Link href="/configuration" className={styles.btnSecondary}>
                <Icon icon="lucide:arrow-left" width={16} height={16} />
                Back
              </Link>

              <button type="button" className={styles.btnSecondary}>
                <Icon icon="lucide:refresh-cw" width={16} height={16} />
                Sync Now
              </button>

              <button type="button" className={styles.btnPrimary}>
                <Icon icon="lucide:check" width={16} height={16} />
                Save &amp; Continue
              </button>
            </div>
          </div>

          {/* Minimalist Tabs Bar - Dynamically Filtered by roleMode (Instruction F) */}
          <div className={styles.tabsBar}>
            <button
              type="button"
              className={`${styles.tabPill} ${activeTab === "information" ? styles.tabPillActive : ""}`}
              onClick={() => setActiveTab("information")}
            >
              Information
            </button>
            {roleMode === "admin" && (
              <button
                type="button"
                className={`${styles.tabPill} ${activeTab === "azure" ? styles.tabPillActive : ""}`}
                onClick={() => setActiveTab("azure")}
              >
                Azure AD Sync
              </button>
            )}
            <button
              type="button"
              className={`${styles.tabPill} ${activeTab === "global" ? styles.tabPillActive : ""}`}
              onClick={() => setActiveTab("global")}
            >
              Global Settings
            </button>
            {roleMode === "admin" && (
              <button
                type="button"
                className={`${styles.tabPill} ${activeTab === "peppol" ? styles.tabPillActive : ""}`}
                onClick={() => setActiveTab("peppol")}
              >
                InvoiceNow (Peppol) Configuration
              </button>
            )}
            <button
              type="button"
              className={`${styles.tabPill} ${activeTab === "layout" ? styles.tabPillActive : ""}`}
              onClick={() => setActiveTab("layout")}
            >
              Document Layout
            </button>
          </div>

          {/* Main Form Card Container */}
          <div className={styles.formCard}>
            {/* Instruction F Role Notice Banner */}
            {roleMode === "user" ? (
              <div className={styles.userModeNotice}>
                <Icon icon="lucide:shield-check" width={22} height={22} className={styles.userModeIcon} />
                <div>
                  <h4 className={styles.userModeTitle}>
                    Standard User View <span className={styles.userBadge}>User Mode</span>
                  </h4>
                  <p className={styles.userModeSub}>
                    Technical integration credentials (Azure AD Sync keys, SAP RFC parameters, and Access Point SMP bindings) are simplified and hidden from standard user accounts. Switch to <strong>Super Admin View</strong> to configure technical API keys.
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.userModeNotice} style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <Icon icon="lucide:shield" width={22} height={22} style={{ color: "#16a34a", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 className={styles.userModeTitle} style={{ color: "#14532d" }}>
                    Super Admin View <span className={styles.adminBadge}>Full Admin Access</span>
                  </h4>
                  <p className={styles.userModeSub} style={{ color: "#166534" }}>
                    All technical credentials, Azure AD Client Secrets, SAP RFC connection settings, and Peppol SMP bindings are fully accessible for editing.
                  </p>
                </div>
              </div>
            )}
            {/* TAB 1: INFORMATION */}
            {activeTab === "information" && (
              <div className={styles.formGrid1}>
                {/* Company & Registration Details */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionHeading}>
                    <Icon icon="lucide:building-2" width={18} height={18} />
                    Company &amp; Tax Registration
                  </h3>
                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Business Registration Number*</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={infoForm.businessRegNo}
                        onChange={(e) => setInfoForm({ ...infoForm, businessRegNo: e.target.value })}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Tax Registration Number</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={infoForm.taxRegNo}
                        onChange={(e) => setInfoForm({ ...infoForm, taxRegNo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Tax Scheme*</label>
                      <select
                        className={styles.fieldSelect}
                        value={infoForm.taxScheme}
                        onChange={(e) => setInfoForm({ ...infoForm, taxScheme: e.target.value })}
                      >
                        <option value="GST">GST</option>
                        <option value="VAT">VAT</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Company Name*</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={infoForm.companyName}
                        onChange={(e) => setInfoForm({ ...infoForm, companyName: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Contact Information */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionHeading}>
                    <Icon icon="lucide:map-pin" width={18} height={18} />
                    Location &amp; Contact Information
                  </h3>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Address*</label>
                    <textarea
                      className={styles.fieldTextarea}
                      value={infoForm.address}
                      onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Country*</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={infoForm.country}
                        onChange={(e) => setInfoForm({ ...infoForm, country: e.target.value })}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Postal Code*</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={infoForm.postalCode}
                        onChange={(e) => setInfoForm({ ...infoForm, postalCode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Currency*</label>
                      <select
                        className={styles.fieldSelect}
                        value={infoForm.currency}
                        onChange={(e) => setInfoForm({ ...infoForm, currency: e.target.value })}
                      >
                        <option value="SGD">SGD</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Phone Number*</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={infoForm.phoneNo}
                        onChange={(e) => setInfoForm({ ...infoForm, phoneNo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Company Email</label>
                      <input
                        type="email"
                        className={styles.fieldInput}
                        value={infoForm.companyEmail}
                        onChange={(e) => setInfoForm({ ...infoForm, companyEmail: e.target.value })}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Payment Terms*</label>
                      <select
                        className={styles.fieldSelect}
                        value={infoForm.paymentTerms}
                        onChange={(e) => setInfoForm({ ...infoForm, paymentTerms: e.target.value })}
                      >
                        <option value="30 Days">30 Days</option>
                        <option value="15 Days">15 Days</option>
                        <option value="Net 60">Net 60</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Entity Code</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={infoForm.entityCode}
                        onChange={(e) => setInfoForm({ ...infoForm, entityCode: e.target.value })}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Sub Header</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={infoForm.subHeader}
                        onChange={(e) => setInfoForm({ ...infoForm, subHeader: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Notes / Terms</label>
                    <textarea
                      className={styles.fieldTextarea}
                      value={infoForm.notesTerms}
                      onChange={(e) => setInfoForm({ ...infoForm, notesTerms: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AZURE AD SYNC */}
            {activeTab === "azure" && (
              <div className={styles.formGrid1}>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionHeading}>
                    <Icon icon="lucide:cloud" width={18} height={18} />
                    Azure Active Directory Integration
                  </h3>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={azureForm.autoInvite}
                        onChange={(e) => setAzureForm({ ...azureForm, autoInvite: e.target.checked })}
                      />
                      <span className={styles.slider} />
                    </label>
                    <span className={styles.toggleLabel}>Auto Invite New AD Users</span>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>AD Department</label>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="Type to search"
                      value={azureForm.adDepartment}
                      onChange={(e) => setAzureForm({ ...azureForm, adDepartment: e.target.value })}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Application (Client) ID</label>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={azureForm.appClientId}
                      onChange={(e) => setAzureForm({ ...azureForm, appClientId: e.target.value })}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Tenant ID</label>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={azureForm.tenantId}
                      onChange={(e) => setAzureForm({ ...azureForm, tenantId: e.target.value })}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Client Secret</label>
                    <input
                      type="password"
                      className={styles.fieldInput}
                      value={azureForm.clientSecret}
                      onChange={(e) => setAzureForm({ ...azureForm, clientSecret: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GLOBAL SETTINGS */}
            {activeTab === "global" && (
              <div className={styles.formGrid1}>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionHeading}>
                    <Icon icon="lucide:sliders" width={18} height={18} />
                    Accounting &amp; Matching Controls
                  </h3>

                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Fiscal Year Period</label>
                      <input
                        type="date"
                        className={styles.fieldInput}
                        value={globalForm.fiscalYearPeriod}
                        onChange={(e) =>
                          setGlobalForm({ ...globalForm, fiscalYearPeriod: e.target.value })
                        }
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Decimal Point</label>
                      <select
                        className={styles.fieldSelect}
                        value={globalForm.decimalPoint}
                        onChange={(e) =>
                          setGlobalForm({ ...globalForm, decimalPoint: e.target.value })
                        }
                      >
                        <option value="2">2</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Foreign Currency Accounting Mode</label>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="Type to search"
                      value={globalForm.fxAccountingMode}
                      onChange={(e) =>
                        setGlobalForm({ ...globalForm, fxAccountingMode: e.target.value })
                      }
                    />
                    <p className={styles.helperText}>
                      Simplified option is suitable for immaterial FX exposures and may not comply with full IFRS/GAAP treatment. Please consult your auditor.
                    </p>
                  </div>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={globalForm.autoSendAgileAP}
                        onChange={(e) =>
                          setGlobalForm({ ...globalForm, autoSendAgileAP: e.target.checked })
                        }
                      />
                      <span className={styles.slider} />
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span className={styles.toggleLabel}>
                        Auto Send Via AgileAP for Invoice (BU) and Credit Note (BU) Type
                      </span>
                      <p className={styles.helperText}>
                        When enabled, Invoice (BU) And Credit Note (BU) Type submitted by this company are automatically sent to the receiving company via AgileAP.
                      </p>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Matching Process</label>
                    <select
                      className={styles.fieldSelect}
                      value={globalForm.matchingProcess}
                      onChange={(e) =>
                        setGlobalForm({ ...globalForm, matchingProcess: e.target.value })
                      }
                    >
                      <option value="2/3 Way Matching (Manual)">2/3 Way Matching (Manual)</option>
                      <option value="2 Way Matching Only">2 Way Matching Only</option>
                      <option value="3 Way Matching Strict">3 Way Matching Strict</option>
                    </select>
                    <p className={styles.helperText}>
                      2-way matching compares vendor invoice to purchase order (PO). 3-way matching validates supplier invoice against PO and goods receipt note (GRN).
                    </p>
                  </div>

                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Tolerance Level</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        placeholder="Type to search"
                        value={globalForm.toleranceLevel}
                        onChange={(e) =>
                          setGlobalForm({ ...globalForm, toleranceLevel: e.target.value })
                        }
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Total Amount (Excl. Tax)</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={globalForm.totalAmountExclTax}
                        onChange={(e) =>
                          setGlobalForm({ ...globalForm, totalAmountExclTax: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={globalForm.allowDiffDescSamePrice}
                        onChange={(e) =>
                          setGlobalForm({
                            ...globalForm,
                            allowDiffDescSamePrice: e.target.checked,
                          })
                        }
                      />
                      <span className={styles.slider} />
                    </label>
                    <span className={styles.toggleLabel}>
                      Allow different Description &amp; same Unit Price to match
                    </span>
                  </div>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={globalForm.allowUomConversion}
                        onChange={(e) =>
                          setGlobalForm({ ...globalForm, allowUomConversion: e.target.checked })
                        }
                      />
                      <span className={styles.slider} />
                    </label>
                    <span className={styles.toggleLabel}>Allow UOM Conversion to auto match</span>
                  </div>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={globalForm.publishBusinessUnit}
                        onChange={(e) =>
                          setGlobalForm({ ...globalForm, publishBusinessUnit: e.target.checked })
                        }
                      />
                      <span className={styles.slider} />
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span className={styles.toggleLabel}>Publish Business Unit</span>
                      <p className={styles.helperText}>
                        Lets vendor or customer see your Business Units and associated Locations during transactions.
                      </p>
                    </div>
                  </div>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={globalForm.ifsConnection}
                        onChange={(e) =>
                          setGlobalForm({ ...globalForm, ifsConnection: e.target.checked })
                        }
                      />
                      <span className={styles.slider} />
                    </label>
                    <span className={styles.toggleLabel}>IFS Connection</span>
                  </div>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={globalForm.sapConnection}
                        onChange={(e) =>
                          setGlobalForm({ ...globalForm, sapConnection: e.target.checked })
                        }
                      />
                      <span className={styles.slider} />
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span className={styles.toggleLabel}>SAP Connection</span>
                      <p className={styles.helperText}>
                        Allows posting transaction data via SAP RFC into SAP System.
                      </p>
                    </div>
                  </div>

                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Company Code</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={globalForm.companyCode}
                        onChange={(e) => setGlobalForm({ ...globalForm, companyCode: e.target.value })}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Default Tax</label>
                      <select
                        className={styles.fieldSelect}
                        value={globalForm.defaultTax}
                        onChange={(e) => setGlobalForm({ ...globalForm, defaultTax: e.target.value })}
                      >
                        <option value="GST Sales 9%">GST Sales 9%</option>
                        <option value="GST Sales 8%">GST Sales 8%</option>
                        <option value="Zero Rated 0%">Zero Rated 0%</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: INVOICENOW (PEPPOL) CONFIGURATION */}
            {activeTab === "peppol" && (
              <div className={styles.formGrid1}>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionHeading}>
                    <Icon icon="lucide:radio" width={18} height={18} />
                    InvoiceNow &amp; Peppol Network Parameters
                  </h3>

                  <div className={styles.peppolStatusGrid}>
                    <div className={styles.peppolStatusCard}>
                      <span className={styles.peppolCardTitle}>GST InvoiceNow</span>
                      <span className={styles.peppolCardSub}>
                        Status: <strong style={{ color: "#16a34a" }}>Active</strong> —{" "}
                        <span className={styles.deactiveLink}>Request Deactivation</span>
                      </span>
                    </div>

                    <div className={styles.peppolStatusCard}>
                      <span className={styles.peppolCardTitle}>InvoiceNow (Peppol)</span>
                      <span className={styles.peppolCardSub}>
                        Status: <strong style={{ color: "#16a34a" }}>Active</strong> —{" "}
                        <span className={styles.deactiveLink}>Request Deactivation</span>
                      </span>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      Peppol ID
                      <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#d946ef", textTransform: "uppercase" }}>
                        Invoice Now
                      </span>
                    </label>
                    <div className={styles.peppolInputWrapper}>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={peppolForm.peppolId}
                        onChange={(e) => setPeppolForm({ ...peppolForm, peppolId: e.target.value })}
                      />
                      <Icon icon="lucide:search" width={16} height={16} className={styles.searchIconInside} />
                    </div>
                  </div>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={peppolForm.stopEmailNotif}
                        onChange={(e) => setPeppolForm({ ...peppolForm, stopEmailNotif: e.target.checked })}
                      />
                      <span className={styles.slider} />
                    </label>
                    <span className={styles.toggleLabel}>Stop sending email notifications when send via InvoiceNow</span>
                  </div>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={peppolForm.stopAttachment}
                        onChange={(e) => setPeppolForm({ ...peppolForm, stopAttachment: e.target.checked })}
                      />
                      <span className={styles.slider} />
                    </label>
                    <span className={styles.toggleLabel}>Stop including attachment when send via InvoiceNow</span>
                  </div>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={peppolForm.autoAck}
                        onChange={(e) => setPeppolForm({ ...peppolForm, autoAck: e.target.checked })}
                      />
                      <span className={styles.slider} />
                    </label>
                    <span className={styles.toggleLabel}>Auto Acknowledgement (Bill to Pay, Vendor CN/DN)</span>
                  </div>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={peppolForm.autoResponse}
                        onChange={(e) => setPeppolForm({ ...peppolForm, autoResponse: e.target.checked })}
                      />
                      <span className={styles.slider} />
                    </label>
                    <span className={styles.toggleLabel}>Auto Response (InvoiceNow)</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: DOCUMENT LAYOUT */}
            {activeTab === "layout" && (
              <div className={styles.formGrid1}>
                {/* Branding & Logo */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionHeading}>
                    <Icon icon="lucide:image" width={18} height={18} />
                    Company Logo &amp; Document Branding
                  </h3>
                  <p className={styles.helperText}>
                    *Recommended image size: 21:9 aspect ratio rectangle, under 200KB.
                  </p>
                  <div className={styles.logoCard}>
                    <div className={styles.logoPreviewBox}>
                      <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#5b21b6", letterSpacing: "-0.04em" }}>
                        activants
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                      <button type="button" className={styles.btnSecondary}>
                        <Icon icon="lucide:upload" width={14} height={14} />
                        Update Logo
                      </button>
                      <p className={styles.helperText} style={{ textAlign: "right", fontSize: "0.72rem" }}>
                        Accepted: .jpg, .png, .jpeg (max 1000px width/height)
                      </p>
                    </div>
                  </div>
                </div>

                {/* PDF Layout Settings */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionHeading}>
                    <Icon icon="lucide:file-text" width={18} height={18} />
                    Report Layout &amp; Header Options
                  </h3>

                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Support Email Address*</label>
                      <input
                        type="email"
                        className={styles.fieldInput}
                        value={layoutForm.supportEmail}
                        onChange={(e) => setLayoutForm({ ...layoutForm, supportEmail: e.target.value })}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Date Format</label>
                      <select
                        className={styles.fieldSelect}
                        value={layoutForm.dateFormat}
                        onChange={(e) => setLayoutForm({ ...layoutForm, dateFormat: e.target.value })}
                      >
                        <option value="dd-MMM-yyyy (28-Aug-2026)">dd-MMM-yyyy (28-Aug-2026)</option>
                        <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                        <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Theme Color</label>
                      <div className={styles.colorSwatch} />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Logo &amp; Title Position*</label>
                      <select
                        className={styles.fieldSelect}
                        value={layoutForm.logoTitlePos}
                        onChange={(e) => setLayoutForm({ ...layoutForm, logoTitlePos: e.target.value })}
                      >
                        <option value="Left: Logo, Right: Title">Left: Logo, Right: Title</option>
                        <option value="Left: Title, Right: Logo">Left: Title, Right: Logo</option>
                        <option value="Center: Logo & Title">Center: Logo & Title</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Payment Instruction*</label>
                    <textarea
                      className={styles.fieldTextarea}
                      value={layoutForm.paymentInstruction}
                      onChange={(e) => setLayoutForm({ ...layoutForm, paymentInstruction: e.target.value })}
                    />
                  </div>
                </div>

                {/* Display Visibility Toggles */}
                <div className={styles.subCardBox}>
                  <h4 className={styles.subCardTitle}>Visibility Settings</h4>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={layoutForm.hideLogo}
                        onChange={(e) => setLayoutForm({ ...layoutForm, hideLogo: e.target.checked })}
                      />
                      <span className={styles.slider} />
                    </label>
                    <span className={styles.toggleLabel}>Hide Logo in Document</span>
                  </div>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={layoutForm.hideFooter}
                        onChange={(e) => setLayoutForm({ ...layoutForm, hideFooter: e.target.checked })}
                      />
                      <span className={styles.slider} />
                    </label>
                    <span className={styles.toggleLabel}>Hide Footer of Document</span>
                  </div>

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={layoutForm.showPaynowQR}
                        onChange={(e) => setLayoutForm({ ...layoutForm, showPaynowQR: e.target.checked })}
                      />
                      <span className={styles.slider} />
                    </label>
                    <span className={styles.toggleLabel}>Show PayNow QR Code in Invoice</span>
                  </div>

                  {layoutForm.showPaynowQR && (
                    <div className={styles.subCardBox} style={{ backgroundColor: "#f8fafc" }}>
                      <div className={styles.formGrid2}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Company Name*</label>
                          <input
                            type="text"
                            className={styles.fieldInput}
                            value={layoutForm.paynowCompName}
                            onChange={(e) => setLayoutForm({ ...layoutForm, paynowCompName: e.target.value })}
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>PayNow UEN*</label>
                          <input
                            type="text"
                            className={styles.fieldInput}
                            value={layoutForm.paynowUen}
                            onChange={(e) => setLayoutForm({ ...layoutForm, paynowUen: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.toggleRow}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={layoutForm.showSysText}
                        onChange={(e) => setLayoutForm({ ...layoutForm, showSysText: e.target.checked })}
                      />
                      <span className={styles.slider} />
                    </label>
                    <span className={styles.toggleLabel}>Show System Generated Text</span>
                  </div>

                  {layoutForm.showSysText && (
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={layoutForm.sysText}
                      onChange={(e) => setLayoutForm({ ...layoutForm, sysText: e.target.value })}
                    />
                  )}
                </div>

                {/* Custom Document Titles */}
                <div className={styles.subCardBox}>
                  <h4 className={styles.subCardTitle}>Document Titles</h4>
                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Quotation</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={layoutForm.titleQuotation}
                        onChange={(e) => setLayoutForm({ ...layoutForm, titleQuotation: e.target.value })}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Invoice</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={layoutForm.titleInvoice}
                        onChange={(e) => setLayoutForm({ ...layoutForm, titleInvoice: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
