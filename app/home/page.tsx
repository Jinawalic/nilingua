/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TopBar, BottomBar } from '@/components/Navigation';
import { CurrentCourseState, loadCurrentCourse } from '@/lib/current-course';
import { UserProgressState, loadUserProgress } from '@/lib/user-progress';

export default function HomePage() {
  const [currentCourse, setCurrentCourse] = useState<CurrentCourseState | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgressState | null>(null);
  const [languages, setLanguages] = useState<any[]>([]);
  const [userName, setUserName] = useState('Explorer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentCourse(loadCurrentCourse());
    const progress = loadUserProgress();
    setUserProgress(progress);

    async function loadCatalog() {
      try {
        const res = await fetch('/api/admin/catalog');
        const data = await res.json();
        if (Array.isArray(data.languages)) {
          setLanguages(data.languages);
        }
      } catch (err) {
        console.error('Failed to load catalog:', err);
      }
    }

    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUserName(data.name || 'Explorer');
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    }

    loadCatalog();
    loadUser();
  }, []);

  const otherLanguages = languages.filter(lang => lang.id !== currentCourse?.language);

  // Dynamic Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <TopBar streak={userProgress?.streak ?? 0} />
        <main className="mt-20 pb-32 px-5 max-w-[480px] mx-auto space-y-8 w-full">
          <div className="space-y-1">
            <div className="h-8 bg-surface-container-low rounded-lg animate-pulse w-64" />
            <div className="h-4 bg-surface-container-low rounded-lg animate-pulse w-48" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-12 w-12 bg-surface-container-low rounded-full mx-auto mb-4" />
              <div className="h-6 bg-surface-container-low rounded-lg w-16 mx-auto mb-2" />
              <div className="h-3 bg-surface-container-low rounded-lg w-20 mx-auto" />
            </div>
            <div className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-surface-container-low rounded-lg w-full mb-4" />
              <div className="h-6 bg-surface-container-low rounded-lg w-16 mb-2" />
              <div className="h-3 bg-surface-container-low rounded-lg w-full" />
            </div>
          </div>
        </main>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar streak={userProgress?.streak ?? 0} />

      <main className="mt-20 pb-32 px-5 max-w-[480px] mx-auto space-y-3 w-full">
        <section className="space-y-1">
          <h2 className="text-xl font-bold text-on-surface">{getGreeting()}, {userName}</h2>
          <p className="text-on-surface-variant font-medium text-sm">Ready for your daily Nigerian language fix?</p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 tactile-card flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-on-surface">{userProgress?.streak ?? 0}</span>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none mt-1">Day Streak</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 tactile-card space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-primary">bolt</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Level {userProgress?.level ?? 1}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-on-surface">{userProgress?.xp ?? 0}</span>
                <span className="text-[10px] font-bold text-on-surface-variant">/ {userProgress?.xpGoal ?? 100} XP</span>
              </div>
              <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-primary relative"
                  style={{ width: `${Math.min(100, Math.round(((userProgress?.xp ?? 0) / (userProgress?.xpGoal ?? 100)) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {currentCourse && (
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-on-surface">Current Course</h3>
            <div className="relative overflow-hidden bg-primary-container/10 border-1 border-primary rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-xl font-bold ">
                    {currentCourse.displayLanguage.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">{currentCourse.displayLanguage}</h4>
                    <p className="text-on-primary-container font-medium">{currentCourse.displayLevel} · {currentCourse.lessonTitle}</p>
                  </div>
                </div>
                <div className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  {currentCourse.progressPercent}%
                </div>
              </div>
              <Link
                href={currentCourse.resumeUrl}
                className="text-sm tactile-button-primary w-full py-2 flex items-center justify-center gap-2 text-center"
              >
                Continue Learning
                <span className="text-sm material-symbols-outlined">play_circle</span>
              </Link>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm   font-bold text-on-surface">Other Languages</h3>
            <button className="text-primary text-[10px] font-bold tracking-widest uppercase">View All</button>
          </div>
          <div className="space-y-2">
            {otherLanguages.map((topic, i) => {
              const colors = ['text-secondary', 'text-tertiary', 'text-primary'];
              return (
                <Link
                  key={i}
                  href={`/languages/${topic.id}`}
                  className="bg-white border-1 border-outline-variant rounded-xl p-4 flex items-center justify-between tactile-card hover:shadow-lg hover:border-primary transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center">
                      <span className={`material-symbols-outlined ${colors[i % colors.length]}`}>language</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-on-surface text-sm">{topic.label}</h5>
                      <p className="text-xs text-on-surface-variant">{topic.description || `Language of the ${topic.label} people`}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="bg-secondary/5 rounded-xl p-4 border-1 border-dashed border-secondary/30 relative overflow-hidden">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-secondary text-3xl">lightbulb</span>
            <div className="space-y-2">
              <h6 className="text-sm font-bold text-secondary capitalize tracking-widest">Proverb of the Day</h6>
              <p className="text-on-surface italic font-medium leading-relaxed">
                "Ọmọ tí a kò kọ́, ni yóò gbé ilé tí a kọ́ tà."
              </p>
              <p className="text-xs text-outline leading-tight">
                The child we do not teach will sell the house we build.
              </p>
            </div>
          </div>
        </section>
      </main>

      <BottomBar />
    </div>
  );
}
