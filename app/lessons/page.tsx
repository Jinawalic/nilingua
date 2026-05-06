/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TopBar, BottomBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

export default function LessonsPage() {
  const router = useRouter();

  const courses = [
    { name: 'Introduction', level: 'Lesson 1', status: 'completed', icon: 'waving_hand' },
    { name: 'Basic Greetings', level: 'Lesson 2', status: 'completed', icon: 'forum' },
    { name: 'Family Members', level: 'Lesson 3', status: 'active', icon: 'group' },
    { name: 'Numbers 1-10', level: 'Lesson 4', status: 'locked', icon: '123' },
    { name: 'Common Phrases', level: 'Lesson 5', status: 'locked', icon: 'chat' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar title="Yoruba Course" />

      <main className="mt-20 pb-32 px-6 max-w-[480px] mx-auto w-full flex flex-col gap-8">
        <div className="bg-primary-container/20 rounded-3xl p-8 border-2 border-primary border-dashed flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white text-4xl shadow-lg rotate-3">
            🇳🇬
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Unit 1: The Basics</h1>
            <p className="text-on-surface-variant">Master greetings and basic introductions.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {courses.map((course, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={`w-full max-w-[320px] p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${course.status === 'locked'
                    ? 'bg-surface-variant border-outline-variant opacity-60'
                    : course.status === 'active'
                      ? 'bg-white border-primary shadow-[0_4px_0_0_#006e2f] scale-105 z-10'
                      : 'bg-white border-outline-variant shadow-[0_4px_0_0_#dce5d9]'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${course.status === 'active' ? 'bg-primary text-white' : 'bg-surface-variant text-outline'
                    }`}>
                    <span className="material-symbols-outlined">{course.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface">{course.name}</h3>
                    <p className="text-xs text-outline font-bold uppercase tracking-widest">{course.level}</p>
                  </div>
                </div>
                {course.status === 'locked' && (
                  <span className="material-symbols-outlined text-outline">lock</span>
                )}
                {course.status === 'completed' && (
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                )}
              </div>
              {i < courses.length - 1 && (
                <div className="w-1 h-8 bg-outline-variant rounded-full my-1 opacity-40"></div>
              )}
            </div>
          ))}
        </div>

        {/* <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pointer-events-none">

          <Link 
            href="/quiz"
            className="tactile-button-primary w-full py-4 shadow-lg flex items-center justify-center gap-2 group text-base pointer-events-auto"
          >
            Start Learning
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
          </Link>
        </div> */}
      </main>

      <BottomBar />
    </div>
  );
}
