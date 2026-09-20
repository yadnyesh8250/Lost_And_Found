import React, { useEffect, useState } from "react"
import axios from "axios"
import { serverUrl } from "../main"
import { motion } from "framer-motion"
import { CalendarDays, MapPin, User, BadgeCheck, FileText, MessageCircle } from "lucide-react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchClaimRequests } from "../servers/api"
import { setSelectedUser } from "../redux/messageSlice"
import { useTheme } from "../context/ThemeContext"

const ClaimRequestPages = () => {
  const { isDark } = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { claimData } = useSelector((state) => state.claim)

  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [scoreInputs, setScoreInputs] = useState({})
  const [reasonInputs, setReasonInputs] = useState({})

  useEffect(() => {
    const load = async () => {
      try {
        await fetchClaimRequests(dispatch)
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load claim requests")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [dispatch])

  useEffect(() => {
    setClaims(claimData || [])
    const initialScores = {}
    ;(claimData || []).forEach((c) => {
      if (c.score !== null && c.score !== undefined) {
        initialScores[c.id] = c.score
      }
    })
    setScoreInputs(initialScores)
  }, [claimData])

  const handleReasonChange = (id, value) => {
    setReasonInputs((prev) => ({ ...prev, [id]: value }))
  }

  const handleAction = async (id, action) => {
    try {
      const status = action === "approve" ? "approved" : "rejected"
      const payload = { status }
      
      if (status === "rejected") {
        const reason = reasonInputs[id]
        if (!reason || reason.trim() === "") {
          toast.error("Please provide a reason for rejecting")
          return
        }
        payload.rejectReason = reason
      }

      await axios.patch(`${serverUrl}/api/item/claim/${id}/score`, payload, {
        withCredentials: true,
      })

      toast.success(status === "approved" ? "Claim Approved!" : "Claim Rejected")
      
      // Refresh global state
      await fetchClaimRequests(dispatch)
      
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update request")
    }
  }

  const handleMessage = (user) => {
    if (user) {
      dispatch(setSelectedUser(user))
      navigate("/messages")
    }
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark
          ? "bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Claim <span className="text-blue-500">Requests</span>
          </h1>
          <p className={isDark ? "text-blue-200/80 text-sm" : "text-slate-600 text-sm"}>
            Review requests for items you posted
          </p>
        </div>

        {loading && (
          <div className={isDark ? "text-blue-200/70" : "text-slate-500"}>
            Loading requests...
          </div>
        )}

        {!loading && claims.length === 0 && (
          <div className={isDark ? "text-blue-300/70" : "text-slate-500"}>
            No claim requests yet.
          </div>
        )}

        <div className="grid gap-6">
          {claims.map((claim) => (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-5 ${
                isDark
                  ? "border-blue-500/20 bg-white/5"
                  : "border-slate-200 bg-white shadow-sm"
              }`}
            >
              {/* TOP */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    {claim.item?.title || "Item"}
                  </h2>
                  <p className={isDark ? "text-blue-200/70 text-sm" : "text-slate-500 text-sm"}>
                    {claim.item?.category} • {claim.item?.location}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    claim.status === "approved"
                      ? "bg-green-600 text-white"
                      : claim.status === "rejected"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {claim.status}
                </span>
              </div>

              {/* INFO PANELS */}
              <div className="mt-4 grid lg:grid-cols-2 gap-6">
                {/* ITEM */}
                <div
                  className={`rounded-xl border p-4 ${
                    isDark
                      ? "border-blue-500/20 bg-slate-900/40"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <h3 className={isDark ? "text-blue-200 text-sm font-semibold mb-3" : "text-slate-700 text-sm font-semibold mb-3"}>
                    Your Posted Item Info
                  </h3>

                  <div className={isDark ? "space-y-2 text-sm text-blue-100/90" : "space-y-2 text-sm text-slate-700"}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {claim.item?.location || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      {claim.item?.date ? new Date(claim.item.date).toLocaleDateString() : "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4" />
                      {claim.item?.status || "-"}
                    </div>

                    {claim.item?.images?.[0] && (
                      <img
                        src={claim.item.images[0]}
                        alt="item"
                        className={`mt-2 max-h-36 rounded-lg border object-cover ${
                          isDark ? "border-blue-500/20" : "border-slate-200"
                        }`}
                      />
                    )}
                  </div>
                </div>

                {/* CLAIMANT */}
                <div
                  className={`rounded-xl border p-4 ${
                    isDark
                      ? "border-blue-500/20 bg-slate-900/40"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={isDark ? "text-blue-200 text-sm font-semibold" : "text-slate-700 text-sm font-semibold"}>
                      {claim.item?.type === "lost" ? "Finder's Discovery Report" : "Seeker's Ownership Claim"}
                    </h3>
                    {claim.claimantUser && (
                      <button 
                        onClick={() => handleMessage(claim.claimantUser)}
                        title="Chat with claimant"
                        className="flex items-center gap-1 text-xs font-bold text-blue-500 hover:text-blue-600 bg-blue-500/10 px-2 py-1 rounded"
                      >
                        <MessageCircle size={14}/>
                        Message
                      </button>
                    )}
                  </div>

                  <div className={isDark ? "space-y-2 text-sm text-blue-100/90" : "space-y-2 text-sm text-slate-700"}>
                    <div className="flex items-center gap-2">
                       <User className="w-4 h-4 text-blue-500" />
                       <span className="font-bold">{claim.claimantUser?.name || "User"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <span className="opacity-60">{claim.item?.type === "lost" ? "Location Found:" : "Location Lost:"}</span>
                      {claim.lostLocation || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-indigo-500" />
                      <span className="opacity-60">{claim.item?.type === "lost" ? "Date Found:" : "Date Lost:"}</span>
                      {claim.lostDate ? new Date(claim.lostDate).toLocaleDateString() : "-"}
                    </div>
                    <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">
                        {claim.item?.type === "lost" ? "Proof of Discovery" : "Proof of Ownership"}
                      </p>
                      <div className="flex items-start gap-2 italic">
                        {claim.identifyingDetails}
                      </div>
                    </div>

                    {claim.itemImage && (
                      <img
                        src={claim.itemImage}
                        alt="claim"
                        className={`mt-2 max-h-36 rounded-lg border object-cover ${
                          isDark ? "border-blue-500/20" : "border-slate-200"
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* META */}
              <div className={isDark ? "mt-4 flex flex-wrap gap-4 text-xs text-blue-200/70" : "mt-4 flex flex-wrap gap-4 text-xs text-slate-500"}>
                Requested: {new Date(claim.createdAt).toLocaleDateString()}
              </div>

              {/* ACTIONS */}
              {claim.status === "pending" && (
                <div className="mt-6 flex flex-col gap-3">
                   <button
                     onClick={() => handleAction(claim.id, "approve")}
                     className="w-full py-3 rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white transition shadow-lg"
                   >
                     {claim.item?.type === "lost" ? "Match Confirmed (Accept)" : "Approve Claim (Return to Owner)"}
                   </button>
                   
                   <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-dashed border-slate-500/30">
                     <input
                       type="text"
                       placeholder="Reason for rejection (Required if rejecting)"
                       value={reasonInputs[claim.id] ?? ""}
                       onChange={(e) => handleReasonChange(claim.id, e.target.value)}
                       className={`flex-1 px-4 py-3 rounded-xl border text-sm ${
                         isDark
                           ? "bg-slate-900 border-red-500/20 text-white"
                           : "bg-white border-red-200 text-slate-800"
                       }`}
                     />
                     <button
                       onClick={() => handleAction(claim.id, "reject")}
                       className="px-6 py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white transition shadow-md whitespace-nowrap"
                     >
                       Reject Request
                     </button>
                   </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClaimRequestPages