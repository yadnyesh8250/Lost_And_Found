import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UserCheck, ShieldCheck, Zap } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const JoinCTA = () => {
  const { isDark } = useTheme();

  return (
    <section
      className={`relative py-32 px-6 overflow-hidden ${
        isDark ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      {/* GROUNDED BACKGROUND */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`p-8 sm:p-16 rounded-[3rem] border backdrop-blur-xl flex flex-col lg:flex-row items-center gap-12 ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-2xl shadow-slate-200/50"
        }`}>
          
          <div className="flex-1 text-center lg:text-left">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
            >
              <UserCheck size={14} />
              <span>Official Registry Admission</span>
            </motion.div>
            
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[1.1] ${isDark ? "text-white" : "text-slate-900"}`}>
              Join the official <br />
              <span className="bg-linear-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent italic">Campus Registry.</span>
            </h2>
            
            <p className={`text-lg mb-10 max-w-xl font-medium leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Connect your university account to file official reports, 
              verify your recovery requests, and secure your belongings 
              through our official campus network.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
               <FeatureCheck icon={<ShieldCheck size={16} />} text="Identity Verification" isDark={isDark} />
               <FeatureCheck icon={<Zap size={16} />} text="Instant Recovery" isDark={isDark} />
            </div>
          </div>

          <div className="lg:w-auto w-full">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full lg:w-auto px-12 py-6 rounded-[2rem] bg-linear-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-lg shadow-2xl shadow-amber-500/30 overflow-hidden"
              >
                START REGISTRATION
              </motion.button>
            </Link>
            <p className={`mt-4 text-center text-xs font-bold uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-400"}`}>
               NO PAYMENT REQUIRED. CAMPUS ID VALIDATION ONLY.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCheck = ({ icon, text, isDark }) => (
  <div className="flex items-center gap-2">
     <div className={`p-1 rounded-lg ${isDark ? "bg-slate-800 text-amber-500" : "bg-slate-100 text-amber-600"}`}>
       {icon}
     </div>
     <span className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-slate-300" : "text-slate-700"}`}>
       {text}
     </span>
  </div>
)

export default JoinCTA;