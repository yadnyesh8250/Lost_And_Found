// components/FloatingActions.jsx
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Package } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

const FloatingActions = () => {
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      
      {/* ACTION BUTTONS */}
      <AnimatePresence>
        {open && (
            <ActionBtn
              to="/lost-found/add"
              label="Log New Item"
              icon={Package}
              delay={0.05}
              isDark={isDark}
            />
        )}
      </AnimatePresence>

      {/* MAIN FAB */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isDark 
              ? "bg-amber-500 text-slate-950 shadow-amber-500/20" 
              : "bg-slate-900 text-white shadow-slate-900/10"
        }`}
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }}>
          <Plus size={24} />
        </motion.div>
      </motion.button>
    </div>
  )
}

const ActionBtn = ({ to, label, icon: Icon, delay, isDark }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.9 }}
      transition={{ delay }}
    >
      <Link to={to} className="flex items-center gap-4 group">
        <div
          className={`
            px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all
            ${isDark 
              ? "bg-slate-900 text-white border border-slate-800" 
              : "bg-white text-slate-900 border border-slate-100"}
          `}
        >
          {label}
        </div>

        <div
          className={`
            w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all
            ${isDark
              ? "bg-amber-500 text-slate-950 group-hover:bg-amber-400"
              : "bg-slate-900 text-white group-hover:bg-amber-500"}
          `}
        >
          <Icon size={20} />
        </div>
      </Link>
    </motion.div>
  )
}

export default FloatingActions