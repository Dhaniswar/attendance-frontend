/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface SocketContextType {
  socket: WebSocket | null;
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
  const { token, user } = useSelector((state: RootState) => state.auth);

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (!token) return;

    // You can choose attendance OR notifications:
    const baseWsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

    // Example 1: Attendance consumer
    const wsUrl = `${baseWsUrl}/attendance/?token=${token}`;

    // Example 2 (if you want notifications instead):
    // const wsUrl = `${baseWsUrl}/notifications/${user?.id}/?token=${token}`;

    console.log("Connecting to:", wsUrl);

    const connect = () => {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setSocket(ws);
      };

      ws.onclose = (event) => {
        console.warn(" WebSocket disconnected", event.code);
        setIsConnected(false);
        setSocket(null);

        // Auto reconnect
        reconnectTimeout.current = window.setTimeout(() => {
          console.log("Reconnecting WebSocket...");
          connect();
        }, 2000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.close();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WS message:", data);

          // Example routing by type (matches your consumers)
          switch (data.type) {
            case "attendance_marked":
              console.log("Attendance marked:", data.data);
              break;

            case "student_registered":
              console.log("Student registered:", data.data);
              break;

            case "notification":
              console.log("Notification:", data.data);
              break;

            case "pong":
              console.log("Pong received:", data.timestamp);
              break;

            default:
              console.log("Unknown WS event:", data);
          }
        } catch (err) {
          console.error("Invalid WS message:", event.data);
        }
      };
    };

    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      socket?.close();
    };
  }, [token]);

  const sendEvent = (event: string, data: any) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected");
      return;
    }

    socket.send(
      JSON.stringify({
        type: event,
        ...data,
      })
    );
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, sendEvent }}>
      {children}
    </SocketContext.Provider>
  );
};
