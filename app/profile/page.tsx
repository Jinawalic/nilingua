/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { TopBar, BottomBar } from '@/components/Navigation';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar title="Profile" />
      
      <main className="mt-15 pb-32 px-6 max-w-[480px] mx-auto w-full space-y-3">
        <div className="flex flex-col items-center gap-4 py-3">
          <div className="flex gap-3 items-center">
            <div className="w-20 h-20 rounded-full border-2 border-gray-300 overflow-hidden relative group">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="material-symbols-outlined text-white">edit</span>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-on-surface">John Doe</h1>
            <p className="text-on-surface-variant font-medium">Joined May 2026</p>
          </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border-1 border-outline-variant tactile-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">star</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none">Total XP</p>
              <p className="text-lg font-bold text-on-surface">12,450</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border-1 border-outline-variant tactile-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none">Streak</p>
              <p className="text-lg font-bold text-on-surface">5 Days</p>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-xl border-1 border-outline-variant overflow-hidden">
          {[
            { label: 'Edit Profile', icon: 'person_edit' },
            { label: 'Language Settings', icon: 'language' },
            { label: 'Notifications', icon: 'notifications' },
            { label: 'Help & Support', icon: 'help_center' },
            { label: 'Logout', icon: 'logout', color: 'text-error' },
          ].map((item, i) => (
            <button 
              key={i} 
              className={`w-full px-6 py-4 flex items-center justify-between hover:bg-surface-variant transition-colors ${
                i !== 4 ? 'border-b border-outline-variant/30' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`material-symbols-outlined ${item.color || 'text-outline'}`}>{item.icon}</span>
                <span className={`font-bold ${item.color || 'text-on-surface'}`}>{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
            </button>
          ))}
        </section>
      </main>

      <BottomBar />
    </div>
  );
}
