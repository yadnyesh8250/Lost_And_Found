import React, { useState, useRef } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import axios from "axios"
import { serverUrl } from "../main"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"
import { useTheme } from "../context/ThemeContext"

const SignUp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const phoneInputRef = useRef(null)

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  const [errors, setErrors] = useState({})

  /* ---------- THEME ---------- */
  const pageBg = isDark
    ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"
    : "bg-gradient-to-br from-white via-blue-50 to-white"

  const cardBg = isDark
    ? "bg-white/5 border-blue-500/30 text-white"
    : "bg-white border-slate-200 text-slate-900 shadow-xl"

  const inputBg = isDark
    ? "bg-slate-900/60 border-blue-500/30 text-white placeholder:text-blue-200/40"
    : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"

  const labelText = isDark ? "text-white" : "text-slate-700"
  const subText = isDark ? "text-gray-300" : "text-slate-500"

  /* ---------- INPUT ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  /* ---------- NORMAL SIGNUP ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/register`,
        formData,
        { withCredentials: true }
      )
      // Save token (returned by server) to localStorage for Authorization header fallback
      if (res.data?.token) localStorage.setItem("token", res.data.token)
      dispatch(setUserData(res.data.user))
      toast.success("Account created successfully 🎉")
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  /* Google signup removed (Firebase not used) */

  /* ---------- ANIMATION ---------- */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 sm:py-10 ${pageBg}`}>
      <div className="w-full max-w-md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`backdrop-blur-xl rounded-2xl p-6 sm:p-8 border ${cardBg}`}
        >
          {/* HEADER */}
          <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-white text-lg sm:text-xl font-bold">CS</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Join Campus Sync
            </h1>
            <p className={`text-sm ${subText}`}>
              Connect with your campus community
            </p>
          </motion.div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <motion.div variants={itemVariants}>
              <label className={`text-sm font-semibold mb-2 block ${labelText}`}>
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${inputBg}`}
                placeholder="John Doe"
              />
            </motion.div>

            {/* PHONE */}
            <motion.div variants={itemVariants}>
              <label className={`text-sm font-semibold mb-2 block ${labelText}`}>
                Phone Number
              </label>
              <input
                ref={phoneInputRef}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.phone ? "border-red-500" : inputBg
                }`}
                placeholder="+91XXXXXXXXXX"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone}
                </p>
              )}
            </motion.div>

            {/* EMAIL */}
            <motion.div variants={itemVariants}>
              <label className={`text-sm font-semibold mb-2 block ${labelText}`}>
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${inputBg}`}
                placeholder="you@email.com"
              />
            </motion.div>

            {/* PASSWORD */}
            <motion.div variants={itemVariants}>
              <label className={`text-sm font-semibold mb-2 block ${labelText}`}>
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border pr-12 ${inputBg}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-white/60" : "text-slate-500"
                  }`}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            {/* BUTTON */}
            <motion.button
              variants={itemVariants}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-xl mt-4"
            >
              {loading ? "Creating..." : "Create Account"}
            </motion.button>
          </form>

          {/* Google signup removed */}

          {/* LOGIN */}
          <motion.p
            variants={itemVariants}
            className={`text-center text-sm mt-6 ${subText}`}
          >
            Already a member?{" "}
            <Link to="/login" className="text-blue-500 font-semibold">
              Login
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUp