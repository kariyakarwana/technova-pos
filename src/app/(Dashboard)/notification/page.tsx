"use client";

import React, { useState } from 'react';
import { ChevronDown, AlertTriangle, ShoppingBag, RefreshCw, UserPlus, CreditCard } from 'lucide-react';


export interface NotificationData {
  id: string | number;
  category: 'alert' | 'order' | 'update' | 'employee' | 'billing'; 
  tag: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

interface NotificationsPageProps {
  notifications: NotificationData[]; 
}

export default function NotificationsPage({ notifications = [] }: NotificationsPageProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'alert':
        return { icon: <AlertTriangle size={18} className="text-red-600" />, bg: 'bg-red-100', tagBg: 'bg-blue-100 text-blue-700' };
      case 'order':
        return { icon: <ShoppingBag size={18} className="text-blue-500" />, bg: 'bg-blue-100', tagBg: 'bg-blue-100 text-blue-700' };
      case 'update':
        return { icon: <RefreshCw size={18} className="text-blue-500" />, bg: 'bg-blue-100', tagBg: 'bg-blue-100 text-blue-700' };
      case 'employee':
        return { icon: <UserPlus size={18} className="text-teal-600" />, bg: 'bg-teal-100', tagBg: 'bg-teal-100 text-teal-700' };
      case 'billing':
        return { icon: <CreditCard size={18} className="text-teal-600" />, bg: 'bg-teal-100', tagBg: 'bg-teal-100 text-teal-700' };
      default:
        return { icon: null, bg: 'bg-gray-100', tagBg: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        
        {/* --- Header Section --- */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-1 text-gray-900">Notifications</h1>
            <p className="text-gray-500 text-sm">Manage Your System Alerts, Messages and Updates</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-teal-600 border border-teal-500 rounded-md hover:bg-teal-50 transition-colors">
            Mark all as read
          </button>
        </div>

        {/* --- Filter & Controls Section --- */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-medium text-gray-600">Filter By:</span>
          
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
              activeFilter === 'all' 
                ? 'bg-[#0f8b8d] text-white' // Active state (Teal)
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All ()
          </button>
          
          <button 
            onClick={() => setActiveFilter('unread')}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
              activeFilter === 'unread' 
                ? 'bg-[#0f8b8d] text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Unread ()
          </button>

          <button className="px-4 py-1.5 rounded-md text-sm bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 flex items-center gap-2 ml-2">
            All Categories
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>

        {/* --- Notifications List Area --- */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No notifications available.
            </div>
          ) : (
            notifications.map((notification) => {
              const styles = getCategoryStyles(notification.category);
              
              return (
                <div 
                  key={notification.id} 
                  className={`relative flex items-start gap-4 p-5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-[#f8fbfb]' : 'bg-white'
                  }`}
                >
                  {/* Unread Left Border Indicator */}
                  {!notification.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0f8b8d]"></div>
                  )}

                  {/* Icon Box */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${styles.bg}`}>
                    {styles.icon}
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Tag/Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${styles.tagBg}`}>
                          {notification.tag}
                        </span>
                        
                        {/* Title */}
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-medium text-gray-900 truncate">
                            {notification.title}
                          </h3>
                          {/* Unread Dot */}
                          {!notification.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#0f8b8d]"></span>
                          )}
                        </div>
                      </div>

                      {/* Time */}
                      <span className="text-xs text-teal-600/80 whitespace-nowrap ml-4">
                        {notification.time}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#2c7a7b] mt-1">
                      {notification.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}