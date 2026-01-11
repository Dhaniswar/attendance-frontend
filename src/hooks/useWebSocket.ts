/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback } from 'react';
import { useSocket } from '@/context/SocketContext';
import { WEBSOCKET_EVENTS } from '@/utils/constants';

export const useWebSocket = () => {
  const { socket, isConnected, sendEvent } = useSocket();

  const subscribe = useCallback(
    (event: string, callback: (data: any) => void) => {
      if (!socket) return () => {};

      socket.on(event, callback);
      return () => {
        socket.off(event, callback);
      };
    },
    [socket]
  );

  const unsubscribe = useCallback(
    (event: string, callback?: (data: any) => void) => {
      if (!socket) return;
      
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    },
    [socket]
  );

  const sendAttendanceMarked = useCallback(
    (data: any) => {
      sendEvent(WEBSOCKET_EVENTS.ATTENDANCE_MARKED, data);
    },
    [sendEvent]
  );

  const sendStudentRegistered = useCallback(
    (data: any) => {
      sendEvent(WEBSOCKET_EVENTS.STUDENT_REGISTERED, data);
    },
    [sendEvent]
  );

  const sendSystemAlert = useCallback(
    (message: string, type: 'info' | 'warning' | 'error' | 'success') => {
      sendEvent(WEBSOCKET_EVENTS.SYSTEM_ALERT, { message, type, timestamp: new Date().toISOString() });
    },
    [sendEvent]
  );

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log('Connected to WebSocket server');
    };

    const handleDisconnect = () => {
      console.log('Disconnected from WebSocket server');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  return {
    socket,
    isConnected,
    subscribe,
    unsubscribe,
    sendAttendanceMarked,
    sendStudentRegistered,
    sendSystemAlert,
    sendEvent,
  };
};