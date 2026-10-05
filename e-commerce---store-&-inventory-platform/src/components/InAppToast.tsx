import React from 'react';
import { X, Package, ExternalLink, Bell } from 'lucide-react';
import { useNotification } from '../context/NotificationContext.tsx';

interface InAppToastProps {
  onSelectOrder?: (orderNumber: string) => void;
}

export const InAppToast: React.FC<InAppToastProps> = ({ onSelectOrder }) => {
  const { activeToast, dismissToast } = useNotification();

  if (!activeToast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div 
        onClick={() => {
          if (activeToast.orderNumber && onSelectOrder) {
            onSelectOrder(activeToast.orderNumber);
          }
          dismissToast();
        }}
        className="p-4 rounded-2xl bg-neutral-900 border-2 border-amber-400 shadow-2xl shadow-amber-400/20 text-xs cursor-pointer hover:bg-neutral-850 transition"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 fill-neutral-950" />
            </div>
            <span>{activeToast.title}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissToast();
            }}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-2 text-neutral-300 text-xs leading-relaxed">
          {activeToast.body}
        </p>

        {activeToast.orderNumber && (
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-amber-400 border-t border-neutral-800 pt-2">
            <span>Order #{activeToast.orderNumber}</span>
            <span className="flex items-center gap-1 font-sans text-xs underline font-semibold">
              Track Package <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
