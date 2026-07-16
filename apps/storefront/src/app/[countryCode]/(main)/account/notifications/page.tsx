"use client";

import React, { useState } from "react";
import { 
  IconBell, 
  IconShoppingBag, 
  IconShield, 
  IconUser, 
  IconCheck, 
  IconTrash, 
  IconChecks 
} from "@tabler/icons-react";
import { mockNotifications, MockNotification } from "@/data/account.data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<MockNotification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: !n.read } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <IconShoppingBag size={18} />;
      case "promo":
        return <IconBell size={18} />;
      case "security":
        return <IconShield size={18} />;
      default:
        return <IconUser size={18} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/50";
      case "promo":
        return "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50";
      case "security":
        return "bg-red-50 dark:bg-red-950/30 text-sale dark:text-red-400 border-red-100 dark:border-red-900/50";
      default:
        return "bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border-gray-100 dark:border-gray-800";
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="pb-4 border-b border-hairline-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display uppercase tracking-wider text-ink dark:text-canvas">
            Notifications
          </h1>
          <p className="text-xs text-mute mt-1 font-sans">
            Stay updated with your orders, promos, and account activities.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            type="button"
            className="rounded-full bg-ink hover:bg-charcoal text-canvas dark:bg-canvas dark:text-ink dark:hover:bg-canvas/90 px-4 py-2 h-10 text-xs font-semibold uppercase tracking-wider border-none cursor-pointer font-sans flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <IconChecks size={15} />
            <span>Mark all read</span>
          </Button>
        )}
      </div>

      {/* Tabs Filter Selector */}
      <div className="flex border-b border-hairline-soft/80">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer font-sans",
            filter === "all"
              ? "border-ink dark:border-canvas text-ink dark:text-canvas"
              : "border-transparent text-mute hover:text-ink dark:hover:text-canvas"
          )}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={cn(
            "px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer font-sans",
            filter === "unread"
              ? "border-ink dark:border-canvas text-ink dark:text-canvas"
              : "border-transparent text-mute hover:text-ink dark:hover:text-canvas"
          )}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications Cards Grid */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl p-4 flex gap-4 transition-all relative",
                !notif.read && "bg-cloud/5 dark:bg-zinc-900/10 border-hairline-soft/90"
              )}
            >
              
              {/* Type Icon indicator */}
              <div className={cn(
                "w-9 h-9 rounded-full border flex items-center justify-center shrink-0",
                getTypeColor(notif.type)
              )}>
                {getIcon(notif.type)}
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h4 className={cn(
                    "text-xs font-bold text-ink dark:text-canvas font-sans",
                    !notif.read && "font-extrabold"
                  )}>
                    {notif.title}
                  </h4>
                  {!notif.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sale shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-mute dark:text-zinc-400 mt-1 font-sans leading-relaxed">
                  {notif.message}
                </p>
                <span className="block text-[9px] text-mute/70 dark:text-zinc-500 mt-2 font-sans">
                  {notif.date}
                </span>
              </div>

              {/* Individual Actions Overlay */}
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <button
                  onClick={() => toggleRead(notif.id)}
                  title={notif.read ? "Mark as unread" : "Mark as read"}
                  className={cn(
                    "p-1.5 rounded-full border border-hairline-soft/80 hover:bg-cloud/50 dark:hover:bg-zinc-900 text-mute hover:text-ink dark:hover:text-canvas transition-colors cursor-pointer",
                    !notif.read && "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                  )}
                >
                  <IconCheck size={14} className={cn(!notif.read && "stroke-[3]")} />
                </button>
                <button
                  onClick={() => deleteNotification(notif.id)}
                  title="Delete notification"
                  className="p-1.5 rounded-full border border-hairline-soft/80 hover:bg-red-50 dark:hover:bg-red-950/20 text-mute hover:text-sale dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  <IconTrash size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty Fallback Block */
        <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-cloud dark:bg-zinc-900 text-mute flex items-center justify-center mx-auto">
            <IconBell size={20} className="opacity-60" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink dark:text-canvas font-sans">No notifications found</h3>
            <p className="text-xs text-mute dark:text-zinc-400 font-sans max-w-xs mx-auto leading-relaxed">
              {filter === "unread" 
                ? "You have caught up with all updates. No unread messages here." 
                : "You don't have any notifications at the moment."}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
