import React, { useEffect, useRef, useState } from "react"
import { Edit, Mail, Phone, User, Camera, Trash2, Package } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import {
  updateProfile,
  deleteProfileImage,
  fetchItems,
  fetchMyClaims,
} from "../servers/api"
import { useTheme } from "../context/ThemeContext"

const Profile = () => {
  const { isDark } = useTheme()
  const { userData } = useSelector((state) => state.user)
  const { itemData } = useSelector((state) => state.item)
  const { myClaimData } = useSelector((state) => state.claim)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileFile, setProfileFile] = useState(null)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  })

  /* ---------- THEME ---------- */
  const pageBg = isDark
    ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white"
    : "bg-gradient-to-br from-white via-blue-50 to-white text-slate-900"

  const cardBg = isDark
    ? "bg-white/5 border-blue-500/20"
    : "bg-white border-slate-200 shadow-lg"

  const labelText = isDark ? "text-blue-300/60" : "text-slate-500"
  const valueText = isDark ? "text-blue-100" : "text-slate-800"
  const inputBg = isDark
    ? "bg-slate-900/40 border-blue-500/20 text-blue-100"
    : "bg-white border-slate-300 text-slate-900"

  const statCard = isDark
    ? "bg-slate-900/40 border-blue-500/20"
    : "bg-slate-50 border-slate-200"

  /* LOAD USER */
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData?.name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        profileImage: userData?.profileImage || "",
      })

      if (!itemData || itemData.length === 0) fetchItems(dispatch)
    }
  }, [userData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Select image file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB")
      return
    }

    setProfileFile(file)

    // Create preview using URL.createObjectURL
    try {
      const objectUrl = URL.createObjectURL(file)
      setFormData((p) => ({ ...p, profileImage: objectUrl }))

      // Cleanup function to revoke URL when component unmounts or new file is selected
      return () => URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error("Error creating preview:", error)
      toast.error("Failed to create image preview")
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    let payload
    if (profileFile) {
      payload = new FormData()
      payload.append("name", formData.name)
      payload.append("phone", formData.phone)
      payload.append("profileImage", profileFile)
    } else {
      payload = { name: formData.name, phone: formData.phone }
    }

    const res = await updateProfile(dispatch, payload)

    if (res?.error) toast.error(res.message)
    else {
      toast.success("Profile updated")
      setIsEditing(false)
    }

    setIsSaving(false)
  }

  return (
    <div className={`min-h-screen p-6 ${pageBg}`}>
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="w-7 h-7 text-blue-500" />
            My Profile
          </h1>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-600 hover:bg-blue-500/30"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg border border-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* CARD */}
        <div className={`rounded-2xl border p-6 space-y-6 ${cardBg}`}>
          {/* AVATAR */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative w-28 h-28 cursor-pointer"
              onClick={() => isEditing && fileInputRef.current?.click()}
            >
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="profile"
                  className="w-28 h-28 rounded-full object-cover border-2 border-blue-400"
                />
              ) : (
                <div className="w-28 h-28 rounded-full border-2 border-blue-400 bg-blue-500/20 flex items-center justify-center text-3xl font-bold">
                  {(formData.name || "U")[0]}
                </div>
              )}

              {isEditing && (
                <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border border-blue-400">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {isEditing && formData.profileImage && (
              <button
                onClick={async () => {
                  if (profileFile) {
                    setProfileFile(null)
                    setFormData((p) => ({ ...p, profileImage: "" }))
                    return
                  }

                  const url = formData.profileImage || ""
                  if (url.startsWith("http")) {
                    const res = await deleteProfileImage(url)
                    if (res?.error) toast.error(res.message)
                    else toast.success("Image removed")
                  }
                  setFormData((p) => ({ ...p, profileImage: "" }))
                }}
                className="text-xs text-red-500 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Remove photo
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* FIELDS */}
          <FieldRow
            icon={<User className="w-4 h-4" />}
            label="Name"
            value={formData.name}
            name="name"
            isEditing={isEditing}
            onChange={handleChange}
            labelText={labelText}
            valueText={valueText}
            inputBg={inputBg}
          />

          <FieldRow
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            value={formData.email}
            labelText={labelText}
            valueText={valueText}
          />

          <FieldRow
            icon={<Phone className="w-4 h-4" />}
            label="Phone"
            value={formData.phone}
            name="phone"
            isEditing={isEditing}
            onChange={handleChange}
            labelText={labelText}
            valueText={valueText}
            inputBg={inputBg}
          />

          {/* STATS */}
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <StatCard
              title="Total Items Posted"
              count={
                itemData?.filter(
                  (it) => it.postedByUser?.id === userData?.id
                ).length || 0
              }
              onClick={() => navigate("/lost-found")}
              statCard={statCard}
            />
            
            <StatCard
              title="Items Returned to Owners"
              count={
                itemData?.filter(
                  (it) => it.postedByUser?.id === userData?.id && it.status === "claimed"
                ).length || 0
              }
              onClick={() => navigate("/item/claim-request")}
              statCard={statCard}
            />

            <StatCard
              title="Items You Recovered"
              count={
                myClaimData?.filter(
                  (c) => c.status === "approved"
                ).length || 0
              }
              onClick={() => navigate("/item/myclaim")}
              statCard={statCard}
            />
          </div>

          {/* MY MANAGED ITEMS */}
          <div className="pt-8 border-t border-blue-500/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
               <Package className="w-5 h-5 text-blue-500" />
               Manage My Posts
            </h2>
            <div className="space-y-3">
              {itemData?.filter(it => it.postedByUser?.id === userData?.id).length > 0 ? (
                itemData?.filter(it => it.postedByUser?.id === userData?.id).map(it => (
                  <div key={it.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${statCard} hover:border-blue-500/30`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                        {it.images?.[0] ? (
                          <img src={it.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 opacity-20" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm truncate max-w-[150px]">{it.title}</p>
                        <p className={`text-[10px] uppercase tracking-widest font-black ${
                          it.status === "active" ? "text-emerald-500" : "text-slate-500"
                        }`}>
                          {it.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => navigate(`/item/${it.id}`)}
                         className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                       >
                         <Edit className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-500 text-sm border-2 border-dashed rounded-xl border-slate-800/20">
                   You haven't posted any items yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

/* FIELD */
const FieldRow = ({
  icon,
  label,
  value,
  name,
  isEditing,
  onChange,
  labelText,
  valueText,
  inputBg,
}) => (
  <div className="flex items-center gap-3">
    <div className="text-blue-500">{icon}</div>
    <div className="flex-1">
      <p className={`text-xs mb-1 ${labelText}`}>{label}</p>
      {isEditing && name ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full border rounded-lg px-3 py-2 ${inputBg}`}
        />
      ) : (
        <p className={`text-sm ${valueText}`}>{value || "N/A"}</p>
      )}
    </div>
  </div>
)

/* STAT */
const StatCard = ({ title, count, onClick, statCard }) => (
  <div className={`p-3 rounded-lg border ${statCard}`}>
    <p className="text-xs text-slate-500">{title}</p>
    <div className="flex items-center justify-between mt-2">
      <div className="text-2xl font-semibold">{count}</div>
      <button
        onClick={onClick}
        className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm"
      >
        View
      </button>
    </div>
  </div>
)