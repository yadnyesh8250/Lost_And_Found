import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";
import {
  Database, LayoutGrid, Users, Package, FileSearch,
  MapPin, Tag, Bell, Megaphone, Flag, ScrollText, Star,
  Plus, Trash2, RefreshCw, ChevronDown, ChevronUp, Shield
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const TABS = [
  { id: "analytics",     label: "DBMS Analytics", icon: Database,   color: "from-slate-800 to-slate-900",   writable: false, deletable: false },
  { id: "users",         label: "Users",         icon: Users,      color: "from-blue-500 to-indigo-600",   writable: false, deletable: false },
  { id: "items",         label: "Items",          icon: Package,    color: "from-emerald-500 to-teal-600",  writable: false, deletable: true  },
  { id: "claimeds",      label: "Claims",         icon: FileSearch, color: "from-violet-500 to-purple-600", writable: false, deletable: false },
  { id: "locations",     label: "Locations",      icon: MapPin,     color: "from-amber-500 to-orange-600",  writable: true,  deletable: true  },
  { id: "categories",    label: "Categories",     icon: Tag,        color: "from-pink-500 to-rose-600",     writable: true,  deletable: true  },
  { id: "notifications", label: "Notifications",  icon: Bell,       color: "from-cyan-500 to-sky-600",      writable: false, deletable: false },
  { id: "announcements", label: "Announcements",  icon: Megaphone,  color: "from-yellow-500 to-amber-600",  writable: true,  deletable: true  },
  { id: "reports",       label: "Reports",        icon: Flag,       color: "from-red-500 to-rose-600",      writable: false, deletable: true  },
  { id: "auditlogs",     label: "Audit Logs",     icon: ScrollText, color: "from-slate-500 to-gray-600",    writable: false, deletable: false },
  { id: "karmas",        label: "Karma",          icon: Star,       color: "from-amber-400 to-yellow-500",  writable: false, deletable: false },
];

// Form field definitions for writable tables
const CREATE_FIELDS = {
  locations: [
    { key: "name", label: "Location Name", type: "text", required: true, placeholder: "e.g. Main Library" },
    { key: "zone", label: "Zone / Wing", type: "text", placeholder: "e.g. A Wing, Boys Hostel" },
    { key: "latitude", label: "Latitude", type: "number", placeholder: "21.2851644" },
    { key: "longitude", label: "Longitude", type: "number", placeholder: "74.8419764" },
  ],
  categories: [
    { key: "name", label: "Category Name", type: "text", required: true, placeholder: "e.g. Lab Equipment" },
    { key: "description", label: "Description", type: "text", placeholder: "Short description" },
  ],
  announcements: [
    { key: "title", label: "Title", type: "text", required: true, placeholder: "e.g. System maintenance tonight" },
    { key: "content", label: "Content", type: "textarea", required: true, placeholder: "Full announcement text..." },
  ],
};

const AdminDashboard = () => {
  const { isDark } = useTheme();
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("analytics");
  const [data, setData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const currentTabMeta = TABS.find((t) => t.id === activeTab);

  useEffect(() => {
    if (!userData || userData.email !== "temp1@gmail.com") navigate("/");
  }, [userData, navigate]);

  useEffect(() => {
    fetchTableData(activeTab);
    setShowForm(false);
    setFormData({});
  }, [activeTab]);

  const fetchTableData = async (table) => {
    setLoading(true);
    setError(null);
    try {
      if (table === "analytics") {
        const res = await axios.get(`${serverUrl}/api/admin/analytics`, { withCredentials: true });
        setAnalyticsData(res.data);
        setData([]);
      } else {
        const res = await axios.get(`${serverUrl}/api/admin/tables/${table}`, { withCredentials: true });
        setData(res.data.data);
        setAnalyticsData(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${serverUrl}/api/admin/tables/${activeTab}`, formData, { withCredentials: true });
      toast.success("Record created successfully!");
      setShowForm(false);
      setFormData({});
      fetchTableData(activeTab);
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${serverUrl}/api/admin/tables/${activeTab}/${id}`, { withCredentials: true });
      toast.success("Record deleted.");
      setData((prev) => prev.filter((row) => row.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Deletion failed.");
    }
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const CurrentIcon = currentTabMeta?.icon || Database;

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-[96rem] mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Admin Control Center</h1>
            <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Logged in as <span className="text-amber-500 font-bold">{userData?.email}</span> · 10 Tables Active
            </p>
          </div>
          <div className="ml-auto hidden sm:flex gap-2 flex-wrap justify-end">
            {TABS.map(t => (
              <div key={t.id} className={`px-2 py-1 rounded-lg text-[10px] font-black text-white bg-gradient-to-r ${t.color}`}>
                {t.label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">

          {/* SIDEBAR */}
          <div className="w-full xl:w-56 flex flex-row xl:flex-col gap-2 overflow-x-auto xl:overflow-visible pb-2 xl:pb-0 shrink-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 xl:gap-3 shrink-0 xl:w-full px-4 py-3 rounded-xl xl:rounded-2xl font-bold transition-all text-left text-sm ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : isDark
                      ? "bg-slate-900/50 text-slate-400 hover:bg-slate-800"
                      : "bg-white text-slate-500 hover:bg-slate-100 hover:shadow-md border border-slate-200"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="whitespace-nowrap xl:whitespace-normal">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* MAIN PANEL */}
          <div className={`flex-1 border rounded-[2rem] overflow-hidden flex flex-col ${
            isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200 shadow-xl"
          }`}>

            {/* PANEL HEADER */}
            <div className={`flex items-center gap-3 p-6 border-b ${isDark ? "border-slate-800" : "border-slate-100"}`}>
              <div className={`p-2 rounded-xl bg-gradient-to-br ${currentTabMeta?.color} text-white`}>
                <CurrentIcon size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-widest">{activeTab}</h2>
                <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  {data.length} records loaded
                </p>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => fetchTableData(activeTab)}
                  className={`p-2 rounded-xl transition-colors ${isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
                  title="Refresh"
                >
                  <RefreshCw size={16} />
                </button>

                {currentTabMeta?.writable && (
                  <button
                    onClick={() => setShowForm((prev) => !prev)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all bg-gradient-to-r ${currentTabMeta.color} text-white hover:opacity-90`}
                  >
                    {showForm ? <ChevronUp size={14} /> : <Plus size={14} />}
                    {showForm ? "Cancel" : "Add New"}
                  </button>
                )}
              </div>
            </div>

            {/* CREATE FORM */}
            {showForm && currentTabMeta?.writable && CREATE_FIELDS[activeTab] && (
              <form onSubmit={handleCreate} className={`p-6 border-b ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-100 bg-slate-50"}`}>
                <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-amber-500">
                  Create New {currentTabMeta.label} Record
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CREATE_FIELDS[activeTab].map((field) => (
                    <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2 lg:col-span-3" : ""}>
                      <label className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          rows={3}
                          required={field.required}
                          placeholder={field.placeholder}
                          value={formData[field.key] || ""}
                          onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                            isDark
                              ? "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                              : "bg-white border-slate-200 text-slate-900 focus:border-amber-500"
                          }`}
                        />
                      ) : (
                        <input
                          type={field.type}
                          required={field.required}
                          placeholder={field.placeholder}
                          value={formData[field.key] || ""}
                          onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                            isDark
                              ? "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                              : "bg-white border-slate-200 text-slate-900 focus:border-amber-500"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {submitting ? "Saving..." : `Save ${currentTabMeta.label}`}
                </button>
              </form>
            )}

            {/* TABLE CONTENT */}
            <div className="flex-1 overflow-auto p-4" style={{ maxHeight: "65vh" }}>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="font-bold tracking-widest uppercase text-xs text-slate-400">Querying Database...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-red-500 font-bold px-6 py-4 rounded-xl bg-red-500/10">{error}</p>
                </div>
              ) : activeTab === "analytics" && analyticsData ? (
                <div className="space-y-12 pb-8">
                  <AnalyticsTable 
                    title="1. Top Karma Users (GROUP BY & JOIN)"
                    data={analyticsData.karmaLeaderboard}
                    isDark={isDark}
                  />
                  <AnalyticsTable 
                    title="2. Item Claim Hotspots (Correlated Subquery)"
                    data={analyticsData.itemClaimStats}
                    isDark={isDark}
                  />
                  <AnalyticsTable 
                    title="3. Claims Resolution Matrix (Multi-Table JOIN)"
                    data={analyticsData.resolutionMatrix}
                    isDark={isDark}
                  />
                </div>
              ) : data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 opacity-40">
                  <LayoutGrid size={48} className="mb-4" />
                  <p className="font-bold tracking-widest uppercase text-sm">Table is empty</p>
                  {currentTabMeta?.writable && (
                    <p className="text-xs mt-2 opacity-70">Click "Add New" above to create the first record</p>
                  )}
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                  <thead className={`sticky top-0 z-10 uppercase text-[10px] font-black tracking-widest ${
                    isDark ? "bg-slate-950 text-slate-400" : "bg-slate-50 text-slate-500"
                  }`}>
                    <tr>
                      {columns.map((col) => (
                        <th key={col} className={`px-4 py-3 first:rounded-tl-lg last:rounded-tr-lg border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                          {col}
                        </th>
                      ))}
                      {currentTabMeta?.deletable && (
                        <th className={`px-4 py-3 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, idx) => (
                      <tr
                        key={row.id || idx}
                        className={`transition-colors ${
                          isDark
                            ? "hover:bg-slate-800/50 border-b border-slate-800/50"
                            : "hover:bg-slate-50 border-b border-slate-100"
                        }`}
                      >
                        {columns.map((col) => {
                          let cellValue = row[col];
                          if (typeof cellValue === "boolean") {
                            cellValue = (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${cellValue ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                                {cellValue ? "YES" : "NO"}
                              </span>
                            );
                          } else if (Array.isArray(cellValue)) {
                            cellValue = <span className="opacity-50 text-xs">[{cellValue.length} items]</span>;
                          } else if (typeof cellValue === "object" && cellValue !== null) {
                            cellValue = <span className="opacity-50 text-xs italic">Object</span>;
                          } else if (cellValue === null || cellValue === undefined) {
                            cellValue = <span className="opacity-30 italic text-xs">NULL</span>;
                          } else {
                            const str = String(cellValue);
                            cellValue = str.length > 60 ? (
                              <span title={str} className="cursor-help">{str.slice(0, 60)}…</span>
                            ) : str;
                          }
                          return (
                            <td key={col} className="px-4 py-3 max-w-xs">
                              {cellValue}
                            </td>
                          );
                        })}

                        {currentTabMeta?.deletable && (
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDelete(row.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable component to render complex analytics raw data
const AnalyticsTable = ({ title, data, isDark }) => {
  if (!data || data.length === 0) return null;
  const cols = Object.keys(data[0]);

  return (
    <div className={`rounded-[2rem] border overflow-hidden ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200 shadow-xl"}`}>
      <div className={`px-6 py-4 border-b ${isDark ? "border-slate-800 bg-slate-950/50" : "border-slate-100 bg-slate-50"}`}>
        <h3 className="font-black tracking-tight text-amber-500 flex items-center gap-2">
          <Database size={16} /> {title}
        </h3>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className={`uppercase text-[10px] font-black tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            <tr>
              {cols.map(c => <th key={c} className="px-4 py-2 border-b border-transparent">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={`transition-colors ${isDark ? "hover:bg-slate-800/60 border-b border-slate-800" : "hover:bg-slate-50 border-b border-slate-100"}`}>
                {cols.map(c => <td key={c} className="px-4 py-3 max-w-xs truncate">{String(row[c] || "NULL")}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
