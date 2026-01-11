/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { WEBSOCKET_EVENTS } from '@/utils/constants';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendEvent: (event: string, data: any) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) return;

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
    const newSocket = io(wsUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Listen for events
    newSocket.on(WEBSOCKET_EVENTS.ATTENDANCE_MARKED, (data) => {
      console.log('Attendance marked:', data);
      // You can dispatch Redux action or show notification here
    });

    newSocket.on(WEBSOCKET_EVENTS.STUDENT_REGISTERED, (data) => {
      console.log('Student registered:', data);
    });

    newSocket.on(WEBSOCKET_EVENTS.SYSTEM_ALERT, (data) => {
      console.log('System alert:', data);
    });

    newSocket.on(WEBSOCKET_EVENTS.REAL_TIME_UPDATE, (data) => {
      console.log('Real-time update:', data);
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);

  const sendEvent = (event: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected');
    }
  };

  const value = {
    socket,
    isConnected,
    sendEvent,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};