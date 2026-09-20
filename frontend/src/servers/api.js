import axios from "axios"
import { setUserData } from "../redux/userSlice";
import { setItems } from "../redux/itemSlice";
import { setClaims, setMyClaims } from "../redux/claimSlice";


// Declare API URL BEFORE axios uses it (prevents TDZ issues in production bundles)
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://campussync-e49n.onrender.com")
).replace(/\/$/, "");

const serverUrl = API_BASE_URL;

// Configure axios defaults safely for cross-origin cookies
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;
// NOTE: Don't set Content-Type here - let browser auto-set it for FormData uploads

// Attach Authorization header from localStorage token as a fallback when cookies are not available
axios.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore (e.g., localStorage not available in some environments)
  }
  return config;
});


export const getCurrentuser =async(dispatch)=>{
    try {
    const res =await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true});
    // normalize id -> _id for frontend compatibility
    const user = res.data.user ? { ...res.data.user, profileImage: res.data.user.profileImage || "" } : null
    dispatch(setUserData(user))
        
    } catch (error) {
        dispatch(setUserData(null))
        console.log(error);
    }
}


export const updateProfile = async (dispatch, payload) => {
  try {
    const isFormData = typeof FormData !== "undefined" && payload instanceof FormData
    const config = { 
      withCredentials: true,
      headers: {}
    }
    
    // For FormData, DON'T set Content-Type - browser will auto-set with boundary
    // For JSON, explicitly set Content-Type
    if (!isFormData) {
      config.headers['Content-Type'] = 'application/json'
    }
    
    const res = await axios.put(`${serverUrl}/api/user/profile`, payload, config)
    const user = res.data.user ? { ...res.data.user, profileImage: res.data.user.profileImage || "" } : null
    dispatch(setUserData(user));
    return res.data;
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      error: true,
      message: error.response?.data?.message || "Update failed",
    };
  }
};

export const deleteProfileImage = async (url) => {
  try {
    // Backend does not provide a dedicated delete-image route. Use profile update
    const res = await axios.put(`${serverUrl}/api/user/profile`, { profileImage: "" }, { withCredentials: true })
    const user = res.data.user ? { ...res.data.user, profileImage: res.data.user.profileImage || "" } : null
    return { user }
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Delete failed' }
  }
}


export const fetchItems = async (dispatch) => {
  try {
    const res = await axios.get(`${serverUrl}/api/item/getAll`, {
      withCredentials: true,
    })
    const rawItems = res.data.items || []
    const items = rawItems.map(item => {
      let parsedImages = []
      if (typeof item.images === 'string') {
        try {
          parsedImages = JSON.parse(item.images)
        } catch (e) {
          console.error("Failed to parse images for item", item.id, e)
          parsedImages = []
        }
      } else {
        parsedImages = item.images || []
      }
      return { ...item, images: parsedImages }
    })
    dispatch(setItems(items))
  } catch (err) {
    console.error("Fetch items failed", err)
  }
}

export const deleteItem = async (id) => {
  try {
    const res = await axios.delete(`${serverUrl}/api/item/${id}`, { withCredentials: true })
    return res.data
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Delete failed' }
  }
}

export const updateItem = async (id, payload) => {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
    const config = { withCredentials: true }
    if (!isFormData) config.headers = { 'Content-Type': 'application/json' }
    const res = await axios.put(`${serverUrl}/api/item/${id}`, payload, config)
    
    let item = res.data.item
    if (item) {
      let parsedImages = []
      if (typeof item.images === 'string') {
        try {
          parsedImages = JSON.parse(item.images)
        } catch (e) {
          parsedImages = []
        }
      } else {
        parsedImages = item.images || []
      }
      item = { ...item, images: parsedImages }
    }
    
    return { ...res.data, item }
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Update failed' }
  }
}

export const createItem = async (payload) => {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
    const config = { withCredentials: true }
    if (!isFormData) config.headers = { 'Content-Type': 'application/json' }
    
    const res = await axios.post(`${serverUrl}/api/item/add`, payload, config)
    
    let item = res.data.item
    if (item) {
      let parsedImages = []
      if (typeof item.images === 'string') {
        try {
          parsedImages = JSON.parse(item.images)
        } catch (e) {
          parsedImages = []
        }
      } else {
        parsedImages = item.images || []
      }
      item = { ...item, images: parsedImages }
    }
    
    return { ...res.data, item }
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Create failed' }
  }
}

export const fetchClaimRequests = async (dispatch) => {
  try {
    const res = await axios.get(`${serverUrl}/api/item/claimed-request`, {
      withCredentials: true,
    })
    const rawClaims = res.data?.claims || []
    const claims = rawClaims.map(claim => {
      let parsedImages = []
      const item = claim.item || {}
      if (typeof item.images === 'string') {
        try {
          parsedImages = JSON.parse(item.images)
        } catch (e) {
          console.error("Failed to parse images for claim item", item.id, e)
          parsedImages = []
        }
      } else {
        parsedImages = item.images || []
      }
      return { ...claim, item: { ...item, images: parsedImages } }
    })
    dispatch(setClaims(claims))
  } catch (err) {
    console.error("Fetch claim requests failed", err)
  }
}

export const fetchMyClaims = async (dispatch) => {
  try {
    const res = await axios.get(`${serverUrl}/api/item/claim/my`, {
      withCredentials: true,
    })
    const rawClaims = res.data?.claims || []
    const claims = rawClaims.map(claim => {
      let parsedImages = []
      const item = claim.item || {}
      if (typeof item.images === 'string') {
        try {
          parsedImages = JSON.parse(item.images)
        } catch (e) {
          console.error("Failed to parse images for my claim item", item.id, e)
          parsedImages = []
        }
      } else {
        parsedImages = item.images || []
      }
      return { ...claim, item: { ...item, images: parsedImages } }
    })
    dispatch(setMyClaims(claims))
  } catch (err) {
    console.error("Fetch my claims failed", err)
  }
}

export const resolveItem = async (dispatch, id) => {
  try {
    const res = await axios.patch(`${serverUrl}/api/item/${id}/resolve`, {}, { withCredentials: true });
    // Refresh items to reflect the change
    await fetchItems(dispatch);
    return res.data;
  } catch (error) {
    return { error: true, message: error.response?.data?.message || "Failed to resolve item" };
  }
};

export const submitClaim = async (itemId, payload) => {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
    const config = { withCredentials: true }
    if (!isFormData) config.headers = { 'Content-Type': 'application/json' }
    
    const res = await axios.post(`${serverUrl}/api/item/claim/${itemId}`, payload, config)
    return res.data
  } catch (error) {
    console.error('Submit claim error:', error)
    return { error: true, message: error.response?.data?.message || 'Submission failed' }
  }
}
// marketplace endpoints removed from backend; omit fetchMarketplaceItems

export const fetchMessages = async (receiverId, dispatch) => {
  try {
    if (!receiverId) {
      return []
    }

    const res = await axios.get(`${serverUrl}/api/message/get/${receiverId}`, {
      withCredentials: true,
    })

    const messages = res?.data?.messages || []

    if (dispatch) {
      const { setMessages } = await import("../redux/messageSlice")
      dispatch(setMessages(messages))
    }

    return messages
  } catch (error) {
    console.error("Fetch messages failed", error)
    if (dispatch) {
      const { setMessages } = await import("../redux/messageSlice")
      dispatch(setMessages([]))
    }
    return []
  }
}

export const fetchConversationUsers = async (dispatch) => {
  try {
    // Fetch conversations and all users, then map conversations to their other participant
    const [convoRes, usersRes, meRes] = await Promise.all([
      axios.get(`${serverUrl}/api/message/conversations`, { withCredentials: true }),
      axios.get(`${serverUrl}/api/message/allusers`, { withCredentials: true }),
      axios.get(`${serverUrl}/api/user/current`, { withCredentials: true }),
    ])

    const conversations = convoRes?.data?.conversations || []
  const users = (usersRes?.data?.users || []).map(u => ({ ...u, profileImage: u.profileImage || "" }))
  const me = meRes?.data?.user || null

    const conversationUsers = conversations.map(c => {
      const parts = c.participants || []
      const otherId = parts.find(p => p !== (me?.id))
      const found = users.find(u => u.id === otherId)
      return found || { id: otherId, name: "Unknown" }
    })

    if (dispatch) {
      const { setConversationUsers } = await import("../redux/messageSlice")
      dispatch(setConversationUsers(conversationUsers))
    }

    return conversationUsers
  } catch (error) {
    console.error("Fetch conversations failed", error)
    if (dispatch) {
      const { setConversationUsers } = await import("../redux/messageSlice")
      dispatch(setConversationUsers([]))
    }
    return []
  }
}

export const fetchAllUsers = async (dispatch) => {
  try {
    const res = await axios.get(`${serverUrl}/api/message/allusers`, {
      withCredentials: true,
    })

    const users = res?.data?.users || []

    if (dispatch) {
      const { setAllUsers } = await import("../redux/messageSlice")
      dispatch(setAllUsers(users))
    }

    return users
  } catch (error) {
    console.error("Fetch all users failed", error)
    if (dispatch) {
      const { setAllUsers } = await import("../redux/messageSlice")
      dispatch(setAllUsers([]))
    }
    return []
  }
}

// Backward compatible alias (typo-safe)
export const fatchMessage = fetchMessages