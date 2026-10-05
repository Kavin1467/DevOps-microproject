import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationItem, OrderStatus } from '../types/ecommerce.ts';
import { api } from '../services/api.ts';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  sendPush: (title: string, body: string, options?: { type?: NotificationItem['type']; orderNumber?: string; status?: OrderStatus }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  activeToast: NotificationItem | null;
  dismissToast: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Web Audio sound synthesizer for realistic push chime
function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Oscillator 1 (pleasant chord base)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.5);
  } catch (e) {
    // Audio context may be restricted before interaction
  }
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);

  const isSupported = typeof window !== 'undefined' && 'Notification' in window;

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }

    // Load initial notifications
    api.getNotifications().then(res => {
      if (res && res.notifications) {
        setNotifications(res.notifications);
      }
    });
  }, [isSupported]);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied';
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === 'granted') {
        sendPush('Push Notifications Active! 🔔', 'You will now receive instant live order tracking updates right on your desktop.');
      }
      return perm;
    } catch {
      return 'denied';
    }
  };

  const sendPush = useCallback((
    title: string,
    body: string,
    options?: { type?: NotificationItem['type']; orderNumber?: string; status?: OrderStatus }
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      body,
      type: options?.type || 'system',
      orderNumber: options?.orderNumber,
      status: options?.status,
      read: false,
      timestamp: new Date().toISOString()
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);
    playNotificationChime();

    // Trigger Native Browser Web Notification if permission granted
    if (isSupported && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=128&auto=format&fit=crop&q=80',
          badge: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=96&auto=format&fit=crop&q=80',
          tag: options?.orderNumber || 'auracommerce-notif'
        });
      } catch (e) {
        console.warn('Native notification spawn failed', e);
      }
    }

    // Auto dismiss in-app toast after 6 seconds
    setTimeout(() => {
      setActiveToast(current => (current?.id === newNotif.id ? null : current));
    }, 6000);
  }, [isSupported]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    api.sendNotification({ id, read: true });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      permission,
      isSupported,
      requestPermission,
      sendPush,
      markAsRead,
      markAllAsRead,
      clearAll,
      activeToast,
      dismissToast
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
