"use client";

import React, { useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, Legend,
} from "recharts";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import styles from "./page.module.css";

/* ── DATA ───────────────────────────────────────────────── */
const KPI = [
  { label: "Total Payable",   value: "SGD 1,627,400.00", change: "+12.5%", up: true,  icon: "lucide:wallet-cards", color: "#E8692A", bg: "#FFF3EE" },
  { label: "Paid Amount",     value: "SGD 197,613.59",   change: "+8.2%",  up: true,  icon: "lucide:badge-check",  color: "#38A169", bg: "#F0FFF4" },
  { label: "Pending Amount",  value: "SGD 716,450.77",   change: "+5.4%",  up: false, icon: "lucide:hourglass",    color: "#D69E2E", bg: "#FFFBEB" },
  { label: "Total Documents", value: "686",              change: "+10.1%", up: true,  icon: "lucide:files",        color: "#6B46C1", bg: "#FAF5FF" },
];

const DONUT_DATA = [
  { name: "All",       value: 296, color: "#4A90D9" },
  { name: "Draft",     value: 46,  color: "#F6AD55" },
  { name: "Submitted", value: 20,  color: "#68D391" },
  { name: "Approved",  value: 4,   color: "#48BB78" },
  { name: "Paid",      value: 22,  color: "#9F7AEA" },
  { name: "Others",    value: 298, color: "#CBD5E0" },
];

const BAR_DATA = [
  { name: "Draft",     amount: 3790000 },
  { name: "Submitted", amount: 3740000 },
  { name: "Approved",  amount: 12250 },
  { name: "Rejected",  amount: 41420 },
  { name: "Paid",      amount: 197610 },
  { name: "Cancelled", amount: 28900 },
  { name: "Others",    amount: 113700 },
];

const BAR_COLORS = ["#E8692A","#4A90D9","#68D391","#FC8181","#9F7AEA","#F6AD55","#CBD5E0"];

const TREND_DATA = [
  { month: "Dec 23", Payable: 1300000, Paid: 580000, Pending: 720000 },
  { month: "Jan 24", Payable: 1580000, Paid: 620000, Pending: 960000 },
  { month: "Feb 24", Payable: 2100000, Paid: 680000, Pending: 1100000 },
  { month: "Mar 24", Payable: 2350000, Paid: 750000, Pending: 1320000 },
  { month: "Apr 24", Payable: 1900000, Paid: 800000, Pending: 1050000 },
  { month: "May 24", Payable: 1627400, Paid: 197613, Pending: 716450 },
];

const VENDORS = [
  { name: "Tech Supplies Pte Ltd",  initials: "TS", color: "#4A90D9", amount: "SGD 256,430.00", pct: 15.8 },
  { name: "Office Solutions SG",    initials: "OS", color: "#E8692A", amount: "SGD 189,750.00", pct: 11.7 },
  { name: "Global Services Ltd",    initials: "GS", color: "#38A169", amount: "SGD 143,210.00", pct: 8.8  },
  { name: "Business World Pte Ltd", initials: "BW", color: "#9F7AEA", amount: "SGD 128,900.00", pct: 7.9  },
  { name: "Prime Solutions SG",     initials: "PS", color: "#F6AD55", amount: "SGD 110,450.00", pct: 6.8  },
];

const TABS = ["Bills To Pay", "Purchase Requisition", "Purchase Order", "Claims / Petty Cash"];

/* ── HELPERS ────────────────────────────────────────────── */
function DashboardIcon({ icon, size = 16 }: { icon: string; size?: number }) {
  return <Icon icon={icon} width={size} height={size} aria-hidden="true" />;
}

function fmtM(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

const CustomDonutTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{payload[0].name}</span>
      <span className={styles.tooltipValue}>{payload[0].value}</span>
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{label}</span>
      <span className={styles.tooltipValue}>SGD {fmtM(payload[0].value)}</span>
    </div>
  );
};

const CustomTrendTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: p.color }} />
          <span>{p.name}: SGD {fmtM(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

/* ── PAGE ───────────────────────────────────────────────── */
export default function APDashboard() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>

          {/* Page title row */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Dashboard</h1>
              <p className={styles.pageSubtitle}>Welcome to your financial command center</p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.dateBtn}>
                <DashboardIcon icon="lucide:calendar-days" size={14} />
                01 May 2024 – 31 May 2024
                <DashboardIcon icon="lucide:chevron-down" size={12} />
              </button>
              <button className={styles.filterBtn}>
                <DashboardIcon icon="lucide:sliders-horizontal" size={14} />
                Filters
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {TABS.map((t, i) => (
              <button
                key={t}
                className={`${styles.tab} ${activeTab === i ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(i)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* KPI Cards */}
          <div className={styles.kpiGrid}>
            {KPI.map((k) => (
              <div key={k.label} className={styles.kpiCard}>
                <div className={styles.kpiIconWrap} style={{ background: k.bg }}>
                  <span className={styles.kpiIcon} style={{ color: k.color }}>
                    <DashboardIcon icon={k.icon} size={22} />
                  </span>
                </div>
                <div className={styles.kpiBody}>
                  <div className={styles.kpiLabel}>{k.label}</div>
                  <div className={styles.kpiValue}>{k.value}</div>
                  <div className={`${styles.kpiChange} ${k.up ? styles.kpiUp : styles.kpiDown}`}>
                    <DashboardIcon icon={k.up ? "lucide:trending-up" : "lucide:trending-down"} size={12} />
                    {k.change} vs last month
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row 1 */}
          <div className={styles.chartsRow}>

            {/* Donut */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>
                  <span className={styles.chartTitleIcon}><DashboardIcon icon="lucide:pie-chart" size={15} /></span>
                  Document Overview
                </span>
                <button className={styles.chartFilter}>By Count <DashboardIcon icon="lucide:chevron-down" size={12} /></button>
              </div>
              <div className={styles.donutWrap}>
                <div className={styles.donutChart}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={DONUT_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {DONUT_DATA.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Pie>
                      <ReTooltip content={<CustomDonutTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Centre label */}
                  <div className={styles.donutCenter}>
                    <div className={styles.donutTotal}>686</div>
                    <div className={styles.donutLabel}>Total</div>
                  </div>
                </div>
                <div className={styles.donutLegend}>
                  {DONUT_DATA.map((d) => (
                    <div key={d.name} className={styles.legendRow}>
                      <span className={styles.legendDot} style={{ background: d.color }} />
                      <span className={styles.legendName}>{d.name}</span>
                      <span className={styles.legendCount}>{d.value}</span>
                      <span className={styles.legendPct}>({((d.value / 686) * 100).toFixed(1)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className={styles.viewAll}>View all documents →</button>
            </div>

            {/* Bar chart */}
            <div className={styles.chartCard} style={{ flex: 1.4 }}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>
                  <span className={styles.chartTitleIcon}><DashboardIcon icon="lucide:bar-chart-3" size={15} /></span>
                  Amount Overview (SGD)
                </span>
                <button className={styles.chartFilter}>By Status <DashboardIcon icon="lucide:chevron-down" size={12} /></button>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={BAR_DATA} barCategoryGap="35%" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#F0F4F8" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#A0AEC0" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={fmtM}
                    tick={{ fontSize: 11, fill: "#A0AEC0" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <ReTooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {BAR_DATA.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i]} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts row 2 */}
          <div className={styles.chartsRow}>

            {/* Trend line chart */}
            <div className={styles.chartCard} style={{ flex: 1.4 }}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>
                  <span className={styles.chartTitleIcon}><DashboardIcon icon="lucide:chart-no-axes-combined" size={15} /></span>
                  Trend Overview (SGD)
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={TREND_DATA} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gPayable" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4A90D9" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4A90D9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gPaid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#38A169" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#38A169" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#E8692A" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#E8692A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#F0F4F8" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#A0AEC0" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={fmtM}
                    tick={{ fontSize: 11, fill: "#A0AEC0" }}
                    axisLine={false}
                    tickLine={false}
                    width={46}
                  />
                  <ReTooltip content={<CustomTrendTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    formatter={(v: string) => <span style={{ color: "#718096" }}>{v}</span>}
                  />
                  <Area type="monotone" dataKey="Payable" stroke="#4A90D9" strokeWidth={2} fill="url(#gPayable)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="Paid"    stroke="#38A169" strokeWidth={2} fill="url(#gPaid)"    dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="Pending" stroke="#E8692A" strokeWidth={2} fill="url(#gPending)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Vendors */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>
                  <span className={styles.chartTitleIcon}><DashboardIcon icon="lucide:building-2" size={15} /></span>
                  Top Vendors by Payable Amount
                </span>
                <button className={styles.viewAllBtn}>View all</button>
              </div>
              <div className={styles.vendorList}>
                {VENDORS.map((v) => (
                  <div key={v.name} className={styles.vendorRow}>
                    <div className={styles.vendorAvatar} style={{ background: v.color }}>
                      <span>{v.initials}</span>
                    </div>
                    <div className={styles.vendorInfo}>
                      <div className={styles.vendorMeta}>
                        <span className={styles.vendorName}>{v.name}</span>
                        <span className={styles.vendorAmount}>{v.amount}</span>
                      </div>
                      <div className={styles.vendorBarTrack}>
                        <div
                          className={styles.vendorBarFill}
                          style={{ width: `${v.pct}%`, background: v.color }}
                        />
                      </div>
                      <div className={styles.vendorPct}>{v.pct}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
