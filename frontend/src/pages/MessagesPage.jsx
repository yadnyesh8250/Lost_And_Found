import React, { useEffect } from "react";
import MessageSideBar from "../components/MessageSideBar";
import ChatMessages from "../components/ChatMessages";
import { useTheme } from "../context/ThemeContext";
import { useSelector } from "react-redux";
import { MessageSquare } from "lucide-react";

const MessagesPage = () => {
  const { isDark } = useTheme();
  const { selectedUser } = useSelector((state) => state.message);

  // Scroll to top when page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen pt-24 pb-8 px-4 flex justify-center ${isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className="w-full max-w-[1400px] flex gap-4 h-[750px] lg:h-[85vh]">
        
        {/* SIDEBAR ZONE - Hides on Mobile if a chat is selected */}
        <div className={`w-full lg:w-80 flex-shrink-0 ${selectedUser ? "hidden lg:flex" : "flex"}`}>
          <MessageSideBar />
        </div>

        {/* CHAT ZONE - Hides on Mobile if NO chat is selected */}
        <div className={`flex-1 ${!selectedUser ? "hidden lg:flex lg:flex-col lg:items-center lg:justify-center" : "flex"}`}>
          {selectedUser ? (
            <ChatMessages />
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full opacity-60">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-500"}`}>
                <MessageSquare size={48} />
              </div>
              <h2 className="text-2xl font-black tracking-widest uppercase mb-2">Claim Discussions</h2>
              <p className="text-sm font-medium w-3/4 text-center">Select a conversation from the sidebar to coordinate with claimants and owners securely.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MessagesPage;
