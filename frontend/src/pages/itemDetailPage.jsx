import React, { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import {
  MapPin,
  CalendarDays,
  Tag,
  Mail,
  MessageCircle,
  User,
  ArrowLeft,
  Clock,
  BadgeCheck,
  FileSearch,
  Phone,
  Sparkles,
  ShieldCheck,
  Share2,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { fetchItems } from "../servers/api"
import { useTheme } from "../context/ThemeContext"
import { setSelectedUser } from "../redux/messageSlice"

const ItemDetailPage = () => {
  const { isDark } = useTheme()
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { itemData } = useSelector((state) => state.item)
  const { userData } = useSelector((state) => state.user)
  

  useEffect(() => {
    if (!itemData || itemData.length === 0) {
      fetchItems(dispatch)
    }
  }, [dispatch, itemData])

  const item = itemData.find((i) => String(i.id) === String(id))

  const [timedOut, setTimedOut] = React.useState(false)
  
  // REPORT STATE
  const [showReportModal, setShowReportModal] = React.useState(false)
  const [reportReason, setReportReason] = React.useState("")
  const [reportDetails, setReportDetails] = React.useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
       if (!item) setTimedOut(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [item])

  if (!item) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
        }`}
      >
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="flex flex-col items-center gap-6 p-12 rounded-[3rem] border border-slate-800 bg-slate-900/40 backdrop-blur-xl max-w-md text-center"
        >
          {timedOut ? (
             <>
               <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                  <FileSearch size={40} />
               </div>
               <h2 className="text-2xl font-black tracking-tight mb-2">Item Not Found</h2>
               <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                 The requested item could not be located in the database. It may have been resolved or deleted.
               </p>
               <button 
                  onClick={() => navigate("/lost-found")}
                  className="w-full py-4 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest"
               >
                 Return to Items
               </button>
             </>
          ) : (
             <>
               <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-xl font-black tracking-widest uppercase">Loading...</p>
             </>
          )}
        </motion.div>
      </div>
    )
  }

  const isOwnItem = userData?.id === item.postedByUser?.id

  const related = itemData
    .filter((i) => i.category === item.category && i.id !== id)
    .slice(0, 4)

  const handleEmail = () => {
    const subject = `Regarding your ${item.type} item: ${item.title}`
    window.location.href = `mailto:${item.postedByUser?.email}?subject=${encodeURIComponent(
      subject
    )}`
  }

  const handleMessage = () => {
    dispatch(
      setSelectedUser({
        id: item?.postedByUser?.id,
        name: item?.postedByUser?.name || "User",
        profileImage: item?.postedByUser?.profileImage || item?.postedByUser?.ProfileImage || "",
      })
    )
    navigate("/chat", { state: { initialMessage: `Hey, I found your lost item: ${item.title}! Let's coordinate the return.` } });
  }

  const handleResolve = () => {
    console.log("Resolve item clicked.");
    alert("Item marked as resolved. (Functionality pending API integration)");
  }

  const handleReport = async () => {
    try {
      await axios.post(`${serverUrl}/api/item/${id}/report`, {
        reason: reportReason,
        details: reportDetails
      }, { withCredentials: true });
      toast.success("Item reported successfully.");
      setShowReportModal(false);
      setReportReason("");
      setReportDetails("");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to report item.");
    }
  }

  return (
    <div
      className={`min-h-screen pt-28 pb-20 px-6 relative overflow-hidden ${
        isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* BACKGROUND ACCENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isDark ? "bg-blue-600/10" : "bg-blue-500/5"} blur-[150px] rounded-full`} />
        <div className={`absolute -bottom-20 -left-20 w-[400px] h-[400px] ${isDark ? "bg-purple-600/10" : "bg-purple-500/5"} blur-[120px] rounded-full`} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* NAVIGATION HEAD */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              isDark 
                ? "bg-slate-900/60 border-slate-800 text-amber-300 hover:text-white hover:border-amber-500/30" 
                : "bg-white border-slate-200 text-slate-600 hover:text-amber-600"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <div className="flex gap-2">
             <button 
               onClick={() => setShowReportModal(true)}
               className={`p-2 rounded-xl border ${isDark ? "bg-slate-900/60 border-slate-800 text-red-500" : "bg-white border-slate-200 text-red-600"}`}
               title="Report this Item"
             >
               <AlertTriangle size={18} />
             </button>
             <button className={`p-2 rounded-xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
               <Share2 size={18} className="text-slate-500" />
             </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* GALLERY SECTION */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div
              className={`relative aspect-square rounded-[3rem] overflow-hidden border p-3 group ${
                isDark ? "bg-slate-900/40 border-amber-500/10" : "bg-white border-slate-200"
              }`}
            >
              <div className="absolute top-8 left-8 z-20 flex gap-2">
                 <div className="bg-slate-900 border border-amber-500/20 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2">
                   <Sparkles size={12} className="text-amber-500" />
                   Verified Item
                 </div>
              </div>

              <div className="h-full w-full rounded-[2.5rem] overflow-hidden">
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                ) : (
                  <div className={`h-full flex flex-col items-center justify-center ${isDark ? "bg-slate-800 text-slate-600" : "bg-slate-100 text-slate-400"}`}>
                    <FileSearch size={48} className="mb-4 opacity-20" />
                    <p className="font-bold tracking-widest text-sm uppercase">No Image Available</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`p-6 rounded-[2rem] border backdrop-blur-md ${isDark ? "bg-slate-900/30 border-blue-500/10" : "bg-white border-slate-200"}`}>
               <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <h4 className="font-bold tracking-tight">Security Note</h4>
               </div>
               <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                 CampusSync ensures that all information exchanged is encrypted. When claiming, please provide specific proof of ownership to the original poster.
               </p>
            </div>
          </motion.div>

          {/* DATA SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
          >
            {/* BADGE */}
            <div className="flex gap-3 mb-6">
              <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border tracking-[0.2em] uppercase ${
                item.type === "lost" ? "bg-red-500 border-red-400 text-white" : "bg-emerald-500 border-emerald-400 text-white"
              }`}>
                {item.type}
              </span>
              <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border tracking-[0.2em] uppercase ${
                isDark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
              }`}>
                {item.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tighter">
              {item.title}
            </h1>

            {/* DETAILS BLOCK */}
            <div className={`grid grid-cols-2 gap-4 mb-8 p-6 rounded-[2.5rem] border ${
              isDark ? "bg-slate-950/50 border-slate-800" : "bg-slate-100/50 border-slate-100"
            }`}>
              <DetailMeta icon={<MapPin />} label="Location" value={item.location} isDark={isDark} />
              <DetailMeta icon={<CalendarDays />} label="Date Reported" value={new Date(item.date).toLocaleDateString()} isDark={isDark} />
              <DetailMeta icon={<Clock />} label="Post Status" value={item.status} isDark={isDark} />
              <DetailMeta icon={<BadgeCheck />} label="Report ID" value={`CS-${String(item.id).toUpperCase()}`} isDark={isDark} />
            </div>

            <div className="space-y-4 mb-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-500">Description</h3>
              <p className={`text-lg leading-relaxed font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {item.description}
              </p>
            </div>

            <div className="mt-auto space-y-6">
              {/* POSTED BY */}
              <div className={`flex items-center justify-between p-6 rounded-[2rem] border ${
                isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold animate-pulse-soft`}
                >
                  {item.postedByUser?.name?.charAt(0) || "U"}
                </div>
                  <div>
                    <p className="font-bold text-lg leading-none mb-1">{item.postedByUser?.name}</p>
                    <p className={`text-xs uppercase tracking-tighter font-bold ${isDark ? "text-slate-500" : "text-slate-400"}`}>Reporter</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                   {item.postedByUser?.phone && (
                     <a href={`tel:${item.postedByUser.phone}`} className={`p-3 rounded-xl border ${isDark ? "bg-slate-800 border-slate-700 text-blue-400" : "bg-slate-50 border-slate-200 text-blue-600"}`}>
                       <Phone size={18} />
                     </a>
                   )}
                </div>
              </div>

              {/* ACTIONS */}
              {!isOwnItem && item.status === "active" && (
                 <div className="flex w-full">
                    <button
                      onClick={() => navigate(`/claim-item/${item.id}`)}
                      className={`w-full flex items-center justify-center gap-3 py-6 rounded-[2rem] border text-white font-black transition-all shadow-2xl group ${
                        item.type === "found" 
                          ? "bg-slate-900 border-slate-800 hover:bg-amber-500 hover:text-slate-950" 
                          : "bg-blue-600 border-blue-500 hover:bg-blue-500"
                      }`}
                    >
                      <FileSearch size={22} className="group-hover:scale-110 transition-transform" />
                      {item.type === "found" ? "SUBMIT CLAIM REQUEST" : "I HAVE FOUND THIS"}
                    </button>
                 </div>
              )}

              {item.status === "claimed" && (
                <div className="w-full py-8 rounded-[2.5rem] bg-slate-800/10 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-4 text-slate-500">
                  <CheckCircle size={48} className="opacity-40" />
                  <div className="text-center">
                    <span className="font-black text-xl uppercase tracking-widest italic block">Item Successfully Returned</span>
                    {isOwnItem && item.claimedByUser && (
                      <span className="text-sm font-bold mt-2 text-blue-500 block">
                        Recovered by: {item.claimedByUser.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {item.status === "resolved" && (
                <div className="w-full py-8 rounded-[2.5rem] bg-slate-800/10 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-4 text-slate-500">
                  <CheckCircle size={48} className="opacity-40" />
                  <span className="font-black text-xl uppercase tracking-widest italic text-center">Item Successfully Resolved</span>
                </div>
              )}

              {isOwnItem && item.status === "active" && (
                <div className="py-8 flex flex-col gap-4 border-t-2 border-dashed border-slate-800">
                  <button
                    onClick={handleResolve}
                    className="w-full py-5 rounded-[2rem] bg-emerald-600 text-white font-black hover:bg-emerald-500 transition-all shadow-xl"
                  >
                    MARK AS RESOLVED
                  </button>
                  <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px] text-center">
                    Owner Options
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <div className="mt-32">
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-3xl font-black tracking-tight">Similar Items</h2>
               <div className="h-0.5 flex-1 mx-8 bg-linear-to-r from-amber-500/10 to-transparent rounded-full" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    navigate(`/item/${r.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className={`group cursor-pointer rounded-[2rem] p-3 border transition-all duration-500 ${
                    isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                  }`}
                >
                  <div className={`h-40 w-full rounded-[1.5rem] overflow-hidden mb-4 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                    {r.images?.[0] && (
                      <img src={r.images[0]} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                    )}
                  </div>

                  <div className="px-2">
                    <p className="font-bold truncate text-base mb-1">{r.title}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-500">
                      <MapPin size={10} />
                      {r.location}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md p-6 rounded-[2rem] border shadow-2xl ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"}`}
          >
            <h3 className="text-xl font-bold mb-2">Report Item</h3>
            <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Please let us know why you are reporting this item.</p>

            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className={`w-full p-3 rounded-xl mb-4 text-sm outline-none border ${
                isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
              }`}
            >
              <option value="">Select a reason...</option>
              <option value="Spam">Spam or misleading</option>
              <option value="Inappropriate Content">Inappropriate content</option>
              <option value="Fake Item">Fake or non-existent item</option>
              <option value="Other">Other</option>
            </select>

            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Provide more details..."
              rows={4}
              className={`w-full p-3 rounded-xl mb-6 text-sm resize-none outline-none border ${
                isDark ? "bg-slate-950 border-slate-800 focus:border-red-500/50 text-white" : "bg-slate-50 border-slate-200 focus:border-red-500/50"
              }`}
            />

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowReportModal(false)}
                 className={`px-6 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                  isDark ? "border-slate-800 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-600"
                }`}
              >
                Cancel
              </button>
              <button 
                onClick={handleReport}
                disabled={!reportReason}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-500 transition-colors disabled:opacity-50`}
              >
                Submit Report
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

const DetailMeta = ({ icon, label, value, isDark }) => (
  <div className="space-y-1">
    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter ${isDark ? "text-slate-500" : "text-slate-400"}`}>
      {React.cloneElement(icon, { size: 10, className: "text-amber-500" })}
      {label}
    </div>
    <p className="text-sm font-bold truncate">{value}</p>
  </div>
)

export default ItemDetailPage