import React from "react"
import { Link } from "react-router-dom"
import { 
  Mail as MailIcon, 
  MapPin as MapIcon, 
  Phone as PhoneIcon, 
  Instagram, 
  Twitter, 
  Linkedin, 
  ShieldCheck 
} from "lucide-react";
import logo from "../assets/logo.png"
import { useTheme } from "../context/ThemeContext"

const Footer = () => {
  const { isDark } = useTheme()

  return (
    <footer
      className={`relative py-12 px-6 border-t ${
        isDark ? "bg-slate-950 border-slate-900 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* BRAND */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="CampusSync" className="w-10 h-10" />
              <span className={`text-xl font-black tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}>
                Campus<span className="text-amber-500 italic">Sync</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 font-medium">
              The official university registry for belongings. Faster recovery, 
              verified exchanges, and a safer campus for everyone.
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border w-fit border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={12} />
              Registry Secured
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              Platform
            </h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">Home Portal</Link></li>
              <li><Link to="/lost-found" className="hover:text-amber-500 transition-colors">Registry Search</Link></li>
              <li><Link to="/lost-found/add" className="hover:text-amber-500 transition-colors">File Report</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              Support
            </h4>
            <ul className="space-y-4 text-sm font-bold">
              <li className="flex items-center gap-3">
                 <MailIcon size={14} className="text-amber-500" />
                 support@campussync.io
              </li>
              <li className="flex items-center gap-3">
                 <MapIcon size={14} className="text-amber-500" />
                 Campus Admin Block
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
               Updates
            </h4>
            <p className="text-xs mb-4 mb- font-medium">Get notified of found items matching your profile.</p>
            <div className={`p-1.5 rounded-2xl border flex gap-2 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
               <input type="email" placeholder="Email Address" className="bg-transparent border-none outline-none text-xs flex-1 px-2" />
               <button className="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase">Join</button>
            </div>
          </div>
        </div>

        <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-black uppercase tracking-widest ${isDark ? "border-slate-900" : "border-slate-200"}`}>
           <p>© {new Date().getFullYear()} CampusSync REGISTRY. All Rights Reserved.</p>
           <div className="flex gap-8">
             <Link to="/about" className="hover:text-amber-500">About</Link>
             <Link to="/terms" className="hover:text-amber-500">Security Terms</Link>
             <Link to="/contact" className="hover:text-amber-500">Registry Admin</Link>
           </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer