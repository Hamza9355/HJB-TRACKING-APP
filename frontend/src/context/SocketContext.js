import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext({
  socket: null,
  isConnected: false,
  joinSession: () => {}
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('🔌 Connecté au serveur Socket.IO');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Déconnecté du serveur Socket.IO');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket.IO:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinSession = (sessionId) => {
    if (socket && sessionId) {
      socket.emit('join-session', sessionId);
    }
  };

  const value = {
    socket,
    isConnected,
    joinSession,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
