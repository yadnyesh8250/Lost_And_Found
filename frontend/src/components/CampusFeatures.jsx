import React from "react"
import { motion } from "framer-motion"
import { Shield, Search, CheckCircle, Package, ArrowRight, ClipboardCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

const steps = [
  {
    title: "Report Registry",
    desc: "Log details of lost or found belongings in our secure system. Add photos for instant identification.",
    icon: Search,
    color: "amber"
  },
  {
    title: "Verify Identity",
    desc: "Our verification engine ensures the rightful owner is reclaimed. Security first, always.",
    icon: Shield,
    color: "amber"
  },
  {
    title: "Success Recovery",
    desc: "Once verified, we facilitate a safe exchange through our campus recovery points.",
    icon: CheckCircle,
    color: "emerald"
  }
]

const CampusFeatures = () => {
  const { isDark } = useTheme()
  
  return (
    <section className={`py-32 px-6 relative overflow-hidden ${isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
      
      {/* BACKGROUND ACCENTS */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-amber-600/5 blur-[120px] rounded-full -translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.p
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="text-amber-500 font-bold uppercase tracking-[0.4em] text-xs mb-4"
          >
            How it works
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">The Recovery <span className="italic bg-linear-to-r from-amber-500 to-emerald-500 bg-clip-text text-transparent">Protocol</span></h2>
          <p className={`max-w-2xl mx-auto text-lg ${isDark ? "text-slate-400" : "text-slate-600"}`}>
             CampusSync is a high-availability registry designed to reunite students with their belongings. 
             Follow our three-stage protocol for successful recovery.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -10 }}
              className={`relative p-8 rounded-[2.5rem] border backdrop-blur-3xl transition-all duration-500 group overflow-hidden ${
                isDark 
                  ? "bg-slate-900/40 border-slate-800 hover:border-amber-500/30" 
                  : "bg-slate-50 border-slate-200 hover:shadow-2xl hover:shadow-amber-500/10"
              }`}
            >
              <div className="flex items-start justify-between mb-8">
                 <div className={`w-14 h-14 rounded-2xl bg-linear-to-br from-${s.color}-500 to-${s.color}-700 flex items-center justify-center text-white shadow-2xl shadow-${s.color}-500/20`}>
                    <s.icon size={24} />
                 </div>
                 <span className={`text-4xl font-black opacity-10 group-hover:opacity-100 transition-opacity ${isDark ? "text-slate-700 group-hover:text-amber-500/30" : "text-slate-200"}`}>0{i + 1}</span>
              </div>

              <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
              <p className={`leading-relaxed mb-10 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {s.desc}
              </p>

              <div className={`p-1.5 inline-block rounded-full bg-linear-to-r from-${s.color}-500/20 to-transparent transition-all group-hover:translate-x-2`}>
                 <ArrowRight size={20} className={`text-${s.color}-500`} />
              </div>

              {/* SIGNAL LINE */}
              <div className={`absolute bottom-0 left-0 h-1 bg-linear-to-r from-${s.color}-500 to-transparent w-0 group-hover:w-full transition-all duration-500`} />
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
           <Link
             to="/lost-found"
             className="inline-flex items-center gap-4 bg-linear-to-r from-amber-500 to-amber-600 px-12 py-5 rounded-[2rem] text-white font-black shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all"
           >
             <ClipboardCheck />
             LOG YOUR FIRST REPORT
           </Link>
        </div>
      </div>
    </section>
  )
}

export default CampusFeatures
