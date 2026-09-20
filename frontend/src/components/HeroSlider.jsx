import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Search, PlusCircle, Shield, ArrowRight } from "lucide-react"

import image1 from "../assets/LostAndFound.jpg"

const Hero = () => {
  const navigate = useNavigate()

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      
      {/* BACKGROUND ACCENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-amber-500/5 blur-[120px] rounded-full" />
      </div>

      {/* BACKGROUND IMAGE WITH SIGNAL TREATMENT */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.05, filter: "brightness(0.35)" }}
          animate={{ scale: 1, filter: "brightness(0.4)" }}
          transition={{ duration: 3 }}
          src={image1}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/20 via-slate-950/60 to-slate-950" />
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="max-w-3xl"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="h-0.5 w-12 bg-amber-500 rounded-full" />
            <span className="text-amber-500 font-black tracking-[0.3em] uppercase text-xs">Official Registry</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
            Lost it? <br />
            <span className="bg-linear-to-r from-amber-500 to-emerald-500 bg-clip-text text-transparent italic">Found it.</span>
          </h1>

          <p className="text-slate-400 text-xl md:text-2xl mb-12 max-w-xl leading-relaxed font-medium">
            The official university recovery network. Seamlessly report, track, and reclaim your belongings through a secure campus-wide registry.
          </p>

          <div className="flex flex-wrap gap-6">
            <button
              onClick={() => navigate("/lost-found")}
              className="flex items-center gap-3 bg-white text-slate-950 px-10 py-5 rounded-2xl font-black shadow-2xl hover:bg-amber-500 hover:text-white transition-all duration-300"
            >
              <Search size={20} />
              OPEN REGISTRY
            </button>
            <button
              onClick={() => navigate("/lost-found/add")}
              className="flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-10 py-5 rounded-2xl font-black hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300 group"
            >
              <PlusCircle size={20} className="text-emerald-500" />
              REPORT FOUND
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* SYSTEM STATS - MINI */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1 }}
           className="absolute bottom-12 left-6 flex gap-12"
        >
           <StatItem label="Active Reports" value="124" />
           <StatItem label="Recovered" value="89%" />
           <StatItem label="Response Time" value="< 2h" />
        </motion.div>
      </div>
    </div>
  )
}

const StatItem = ({ label, value }) => (
  <div className="flex flex-col">
     <span className="text-[10px] font-black tracking-widest text-slate-600 uppercase mb-1">{label}</span>
     <span className="text-xl font-bold text-white tabular-nums">{value}</span>
  </div>
)

export default Hero
