import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

type NotificationType = {
  id: string;
  type: 'new_user' | 'new_package' | 'status_update';
  message: string;
  read: boolean;
  timestamp: Date;
  link?: string;
};

type WebSocketContextType = {
  notifications: NotificationType[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  // Remove unused socket state since we don't need to store it
  const [, setSocket] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // In development, use wss://your-production-url.com for production
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/notifications/`;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      // Send authentication if needed (assuming user has an id or email for identification)
      if (user?.id || user?.email) {
        ws.send(JSON.stringify({ 
          type: 'auth', 
          userId: user.id || user.email 
        }));
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification') {
        const newNotification: NotificationType = {
          id: Date.now().toString(),
          type: data.notification_type,
          message: data.message,
          read: false,
          timestamp: new Date(),
          link: data.link,
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      // Attempt to reconnect
      const timeout = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
      setTimeout(() => setReconnectAttempt(prev => prev + 1), timeout);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [user, reconnectAttempt]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({
        ...notif,
        read: true,
      }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <WebSocketContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
