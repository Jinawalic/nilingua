/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TopBarProps {
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
  onLogin?: () => void;
  streak?: number;
  homeLink?: boolean;
}

export function TopBar({ onBack, showBack, title = 'Nilingua', onLogin, streak, homeLink }: TopBarProps) {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-white border-b-2 border-outline-variant shadow-sm flex items-center justify-between px-4 h-16">


      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant active:translate-y-[2px] transition-all text-outline"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}
        <h1 className="text-xl font-bold text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {streak !== undefined && (
          <div className="flex items-center gap-1">
            <img src="/images/welcome-img.png" alt="" className='w-8 h-8 rounded-full' />
          </div>
        )}
        {onLogin && (
          <Link
            href="/login"
            className="text-outline font-lexend font-bold text-sm hover:bg-surface-variant px-3 py-1 rounded-lg transition-all"
          >
            Login
          </Link>
        )}
        {homeLink && (
          <Link
            href="/home"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant active:translate-y-[2px] transition-all text-outline"
            aria-label="Home"
          >
            <span className="material-symbols-outlined">home</span>
          </Link>
        )}
      </div>
    </header>

  );
}


export function BottomBar() {
  const pathname = usePathname();

  const tabs = [
    { href: '/home', icon: 'home', label: 'Home' },
    { href: '/lessons', icon: 'school', label: 'Lessons' },
    { href: '/profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-white border-t-2 border-outline-variant rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex justify-around items-center pb-safe pt-2 px-2">


      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center px-6 py-2 rounded-xl transition-all duration-150 active:scale-95 border-b-4 ${isActive
              ? 'text-primary bg-primary/5 border-primary'
              : 'text-outline border-transparent hover:text-primary'
              }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {tab.icon}
            </span>
            <span className="text-[12px] font-medium font-lexend">{tab.label}</span>
          </Link>
        );
      })}
    </nav>

  );
}

