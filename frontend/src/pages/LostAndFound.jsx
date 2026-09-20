import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, CalendarDays, User, CheckCircle, Search, Plus, Filter, LayoutGrid, Clock, Tag, FileSearch } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchItems } from "../servers/api"
import { useTheme } from "../context/ThemeContext"

const LostAndFound = () => {
  const { isDark } = useTheme()
  const { userData } = useSelector((state) => state.user)
  const { itemData } = useSelector((state) => state.item)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [identifierQuery, setIdentifierQuery] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    fetchItems(dispatch)
  }, [dispatch])

  const filteredItems = itemData.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false
    if (filterCategory !== "all" && item.category !== filterCategory) return false

    // Date Range Logic
    const itemDate = new Date(item.date)
    if (startDate && itemDate < new Date(startDate)) return false
    if (endDate && itemDate > new Date(endDate)) return false

    // Identifier Exact Matching (if provided)
    if (identifierQuery.trim() !== "") {
       if (!item.identifier?.toLowerCase().includes(identifierQuery.toLowerCase())) return false
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase()
      if (
        !item.title?.toLowerCase().includes(q) &&
        !item.description?.toLowerCase().includes(q) &&
        !item.postedByUser?.name?.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  const handleClaim = (e, item) => {
    e.preventDefault()
    e.stopPropagation()
    if (item.type === "found") {
      navigate(`/claim-item/${item.id}`)
    } else {
      navigate(`/item/${item.id}`)
    }
  }

  // Define global colors based on theme
  const accentColor = "blue"

  return (
    <div
      className={`min-h-screen pt-28 pb-20 px-6 relative overflow-hidden ${
        isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* DECORATIVE BACKGROUND ACCENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden text-center justify-center flex">
        <div className={`absolute top-0 right-0 w-64 h-64 ${isDark ? "bg-amber-600/5" : "bg-amber-500/5"} blur-[100px] rounded-full`} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-4 text-amber-500 font-bold tracking-widest uppercase text-xs">
              <Clock size={16} />
              <span>Real-time Network</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Lost & <span className="bg-linear-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent italic">Found</span>
            </h1>
            <p className={`max-w-xl text-lg ${isDark ? "text-slate-400" : "text-slate-600"} font-medium`}>
              The official campus lost and found. Report lost items and view found items safely and securely.
            </p>
          </motion.div>

          {userData && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/lost-found/add")}
              className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-8 py-4 rounded-2xl text-white font-bold shadow-2xl hover:bg-amber-500 hover:text-slate-950 transition-all"
            >
              <Plus size={20} />
              Log New Item
            </motion.button>
          )}
        </div>

        {/* SEARCH SECTION */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className={`p-10 rounded-[3rem] border backdrop-blur-2xl mb-16 ${
             isDark ? "bg-slate-900/40 border-blue-500/10" : "bg-white/80 border-slate-200 shadow-xl"
           }`}
        >
          <div className="mb-10 text-center">
             <h2 className="text-3xl font-bold mb-3">Item <span className="text-blue-500">Search</span></h2>
             <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Search for items by category, unique identifiers, or date range.
             </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
             {/* KEYWORD */}
             <div className="lg:col-span-2 relative group">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                <input
                  type="text"
                  placeholder="Keyword search (e.g. Black Phone)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border ${
                    isDark ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                />
             </div>

             {/* IDENTIFIER */}
             <div className="lg:col-span-2 relative group">
                <FileSearch className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                <input
                  type="text"
                  placeholder="Serial No / Student ID / Reg No..."
                  value={identifierQuery}
                  onChange={(e) => setIdentifierQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border ${
                    isDark ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                />
             </div>

             {/* CATEGORY */}
             <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`w-full pl-10 pr-4 py-4 rounded-2xl border appearance-none ${
                    isDark ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <option value="all">Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="documents">Documents</option>
                  <option value="id_cards">ID Cards</option>
                  <option value="keys">Keys</option>
                  <option value="wallet">Wallet</option>
                  <option value="bag">Bag</option>
                  <option value="other">Other</option>
                </select>
             </div>

             {/* TYPE */}
             <div className="flex bg-slate-950/20 rounded-2xl p-1 border border-slate-800/50">
               {["all", "lost", "found"].map((t) => (
                 <button
                   key={t}
                   onClick={() => setFilterType(t)}
                   className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                     filterType === t ? "bg-blue-600 text-white" : "text-slate-500"
                   }`}
                 >
                   {t}
                 </button>
               ))}
             </div>

             {/* DATE START */}
             <div className="relative group">
                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full pl-10 pr-4 py-4 rounded-2xl border ${
                    isDark ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                />
             </div>

             {/* DATE END */}
             <div className="relative group">
                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full pl-10 pr-4 py-4 rounded-2xl border ${
                    isDark ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                />
             </div>
          </div>
        </motion.div>

        {/* LIVE STATS BAR */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mb-12"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-blue-500">{itemData.filter(i => i.status === "active").length}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Active Posts</span>
          </div>
          <div className="w-px h-8 bg-slate-800 hidden md:block" />
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-emerald-500">{itemData.filter(i => i.status === "claimed" || i.status === "resolved").length}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Returned to Owners</span>
          </div>
          <div className="w-px h-8 bg-slate-800 hidden md:block" />
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl md:text-3xl font-black text-amber-500">
               {Math.round((itemData.filter(i => i.status === "claimed" || i.status === "resolved").length / (itemData.length || 1)) * 100)}%
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Recovery Rate</span>
          </div>
        </motion.div>
        <motion.div 
           layout
           className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => {
              const isOwner = item.postedByUser?.id === userData?.id
              const isRecentlyAdded = (new Date() - new Date(item.date)) < (3 * 24 * 60 * 60 * 1000)

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/item/${item.id}`)}
                  className={`group relative rounded-[2.5rem] p-3 border transition-all duration-500 cursor-pointer overflow-hidden ${
                    isDark
                      ? "border-slate-800 bg-slate-900/40 hover:border-blue-500/30 hover:bg-slate-900/60"
                      : "border-slate-200 bg-white hover:shadow-2xl hover:shadow-blue-500/10"
                  }`}
                >
                  {/* IMAGE WRAPPER */}
                  <div className="relative h-60 w-full rounded-[2rem] overflow-hidden mb-6">
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {item.images?.[0] ? (
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`flex items-center justify-center h-full ${isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400"}`}>
                        No Preview
                      </div>
                    )}

                    {/* STATUS BADGE */}
                    <div className={`absolute top-4 right-4 z-20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border ${
                      item.status === "claimed"
                        ? "bg-slate-700 border-slate-600 text-slate-300"
                        : item.type === "lost" 
                          ? "bg-red-500 border-red-400 text-white" 
                          : "bg-emerald-500 border-emerald-400 text-white"
                    }`}>
                      {item.status === "claimed" ? "Claimed" : item.type}
                    </div>

                    {isRecentlyAdded && item.status !== "claimed" && (
                       <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-blue-500 text-white rounded-full text-[10px] font-bold animate-pulse">
                         NEW
                       </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="px-3 pb-4">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h3 className={`text-xl font-bold truncate ${
                        item.status === "claimed" 
                          ? "text-slate-500 line-through" 
                          : isDark ? "text-white group-hover:text-blue-400" : "text-slate-900 group-hover:text-blue-600"
                      } transition-colors`}>
                        {item.title}
                      </h3>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className={`flex items-center gap-2 text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        <div className={`p-1.5 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                          <MapPin className="w-3 h-3 text-blue-500" />
                        </div>
                        {item.location}
                      </div>

                      <div className={`flex items-center gap-2 text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        <div className={`p-1.5 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                          <CalendarDays className="w-3 h-3 text-indigo-500" />
                        </div>
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>

                    {/* BUTTON */}
                    {userData && !isOwner && item.status === "active" && (
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => handleClaim(e, item)}
                        className={`mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-bold shadow-xl transition-all ${
                          item.type === "found" 
                            ? "bg-linear-to-r from-amber-500 to-amber-600 text-white shadow-amber-500/10 group-hover:shadow-amber-500/20" 
                            : "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/10 group-hover:shadow-blue-500/20"
                        }`}
                      >
                        {item.type === "found" ? (
                          <>
                            <CheckCircle size={14} />
                            SUBMIT CLAIM REQUEST
                          </>
                        ) : (
                          <>
                            <Search size={14} />
                            I HAVE FOUND THIS
                          </>
                        )}
                      </motion.button>
                    )}

                    {item.status === "claimed" && (
                      <div className="mt-6 w-full py-3 rounded-2xl bg-slate-800/10 border border-dashed border-slate-700 flex items-center justify-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                        <CheckCircle size={12} />
                        Returned to Owner
                      </div>
                    )}

                    {isOwner && (
                      <div className="mt-6 flex justify-center py-2 border-t border-dashed border-blue-500/20">
                         <span className="text-[10px] font-black tracking-tighter text-blue-500/60 uppercase">Owner View</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-40 border-2 border-dashed rounded-[3rem] ${
              isDark ? "border-slate-800 text-slate-600" : "border-slate-200 text-slate-400"
            }`}
          >
            <div className="mb-4 flex justify-center">
               <LayoutGrid size={48} className="opacity-20" />
            </div>
            <p className="text-xl font-medium">Looking for something? No data found here.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default LostAndFound