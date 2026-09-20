import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";

import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LostAndFound from "./pages/LostAndFound";
import { useEffect } from "react";
import {  getCurrentuser } from "./servers/api";
import { useDispatch, useSelector } from "react-redux";
import AddItemForm from "./pages/AddItemForm";
import ItemDetailPage from "./pages/itemDetailPage";
import ClaimItemForm from "./pages/ClaimItemForm";
import ClaimRequestPages from "./pages/ClaimRequestPages";
import MyClaim from "./pages/MyClaim";
import FloatingActions from "./components/FloatingActions";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import MessagesPage from "./pages/MessagesPage";
import { useTheme } from "./context/ThemeContext";
import { io } from "socket.io-client";
import { serverUrl } from "./main";
import { setOnlineUsers, setSocketId } from "./redux/messageSlice";
import { setSocket as setSocketClient, clearSocket as clearSocketClient } from "./clients/socketClient";
// AI interview pages removed


const App = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector((state)=>state.user)
  const { isDark } = useTheme()
  console.log(userData);
  
  useEffect(() => {
    getCurrentuser(dispatch);
  }, [dispatch]);




  useEffect(() => {
    if (!userData?.id) return; // don't connect until we have a userId

    const socketio = io(serverUrl, {
      query: {
        userId: userData.id,
      },
    });

    socketio.on("connect", () => {
      console.log("Connected:", socketio.id);
    });

  // store actual socket in module-level client (not Redux)
  setSocketClient(socketio);
  // store serializable socket id in Redux
  dispatch(setSocketId(socketio.id));

    socketio.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
  socketio.disconnect(); // cleanup
  clearSocketClient();
  dispatch(setSocketId(null));
    };
  }, [userData?.id, dispatch]);

  return (
   
      <div className={`min-h-screen ${isDark ? "bg-linear-to-b from-slate-950 via-blue-950 to-slate-950" : "bg-linear-to-b from-white via-blue-50 to-white"} transition-colors duration-300`}>
        <Toaster position="top-center" reverseOrder={false} />

        <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* PUBLIC ROUTES */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* PROTECTED AUTH ROUTES (ONLY GUESTS) */}
        <Route
          path="/register"
          element={userData ? <Navigate to="/" /> : <SignUp />}
        />

        <Route
          path="/login"
          element={userData ? <Navigate to="/" /> : <Login />}
        />

        {/* PROTECTED APP ROUTES (ONLY LOGGED IN) */}
        <Route path="/lost-found" element={
          userData ? <LostAndFound /> : <Navigate to="/login" />
        } />
        <Route path="/lost-found/add" element={
          userData ? <AddItemForm /> : <Navigate to="/login" />
        } />
        <Route path="/item/:id" element={
          userData ? <ItemDetailPage /> : <Navigate to="/login" />
        } />
        <Route path="/claim-item/:id" element={
          userData ? <ClaimItemForm /> : <Navigate to="/login" />
        } />
        <Route path="/item/claim-request" element={
          userData ? <ClaimRequestPages /> : <Navigate to="/login" />
        } />
        <Route path="/item/myclaim" element={
          userData ? <MyClaim /> : <Navigate to="/login" />
        } />
        <Route path="/profile" element={
          userData ? <Profile /> : <Navigate to="/login" />
        } />
        <Route path="/messages" element={
          userData ? <MessagesPage /> : <Navigate to="/login" />
        } />
        
        {/* ADMIN ROUTE */}
        <Route path="/admin" element={
          userData?.email === "temp1@gmail.com" ? <AdminDashboard /> : <Navigate to="/" />
        } />
      </Routes>
 <FloatingActions />
        <Footer />
      </div>
   
  )
};

export default App;
