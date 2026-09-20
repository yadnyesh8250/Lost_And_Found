let socket = null;

export const setSocket = (s) => {
  socket = s;
};

export const getSocket = () => socket;

export const clearSocket = () => {
  if (socket) {
    try { socket.disconnect(); } catch (e) {}
  }
  socket = null;
};

export default { setSocket, getSocket, clearSocket };
