import React from 'react';
import { 
  X, 
  Bell, 
  BellRing, 
  CheckCheck, 
  Trash2, 
  Package, 
  AlertTriangle, 
  Sparkles, 
  ExternalLink,
  Volume2
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext.tsx';
import { Order } from '../types/ecommerce.ts';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder?: (orderNumber: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onSelectOrder
}) => {
  const {
    notifications,
    unreadCount,
    permission,
    requestPermission,
    sendPush,
    markAsRead,
    markAllAsRead,
    clearAll
  } = useNotification();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/80 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-white text-base">
                Notification Center ({unreadCount} new)
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Web Push Permission Banner */}
          {permission !== 'granted' && (
            <div className="p-4 bg-amber-400/10 border-b border-amber-400/20 text-xs text-amber-200 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white">Enable Browser Push Alerts</div>
                <div className="text-[11px] text-amber-300/80">Get live status updates when orders ship.</div>
              </div>
              <button
                onClick={requestPermission}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs shrink-0 shadow-md"
              >
                Allow Push
              </button>
            </div>
          )}

          {/* Action Bar */}
          <div className="px-5 py-2.5 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between text-xs">
            <button
              onClick={() => sendPush('Test Web Push Notification 📦', 'This is a live test push dispatch from AuraCommerce engine!')}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Send Sample Push</span>
            </button>

            <div className="flex items-center gap-3 text-neutral-400">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="hover:text-white transition flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="hover:text-rose-400 transition"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2 text-neutral-500">
                <BellRing className="w-8 h-8 text-neutral-600 mb-1" />
                <div className="font-bold text-white text-sm">No notifications yet</div>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Order updates, dispatch tracking, and inventory restock notifications will appear here.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markAsRead(n.id);
                    if (n.orderNumber && onSelectOrder) {
                      onSelectOrder(n.orderNumber);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-xs transition cursor-pointer ${
                    n.read 
                      ? 'bg-neutral-950/60 border-neutral-800/80 opacity-70' 
                      : 'bg-neutral-900 border-amber-400/30 shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      {n.type === 'order_status' ? (
                        <Package className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ) : n.type === 'inventory_alert' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span>{n.title}</span>
                    </div>

                    <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-neutral-300 text-[11px] mt-1.5 leading-relaxed">
                    {n.body}
                  </p>

                  {n.orderNumber && (
                    <div className="mt-2 text-[10px] font-mono text-amber-400 flex items-center gap-1">
                      <span>Click to view order {n.orderNumber}</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
