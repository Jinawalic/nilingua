"use client";

import { useMemo, useState } from 'react';

type RecentRegisteredUser = {
  id: number;
  name: string;
  email: string;
  dateRegistered: string;
};

type RecentRegisteredTableProps = {
  users: RecentRegisteredUser[];
  pageSize?: number;
};

export default function RecentRegisteredTable({ users, pageSize = 5 }: RecentRegisteredTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));

  const currentUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [page, pageSize, users]);

  const startIndex = users.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, users.length);

  function goToPage(nextPage: number) {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  }

  return (
    <article className="rounded-xl border border-outline-variant bg-white p-5 shadow-[0_12px_30px_rgba(38,65,145,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[22px] font-semibold tracking-[-0.03em] text-on-surface">Recent Registered</p>
          <p className="mt-1 text-sm text-on-surface-variant">Latest users who created an account on Nilingua.</p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-outline-variant/70">
        <table className="w-full border-collapse">
          <thead className="bg-surface">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-on-surface-variant">
                  No registered users yet.
                </td>
              </tr>
            ) : (
              currentUsers.map((user, index) => {
                const initials = user.name
                  .split(' ')
                  .map((part) => part.trim().charAt(0))
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <tr key={user.id} className="border-t border-outline-variant/50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-sm font-semibold text-primary">
                          {initials || 'N'}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-on-surface">{user.name}</p>
                          <p className="text-xs text-on-surface-variant">#{startIndex + index}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="truncate text-sm text-on-surface-variant">{user.email}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-on-surface-variant">
          Showing {users.length === 0 ? 0 : startIndex}-{endIndex} of {users.length}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="rounded-xl border border-outline-variant bg-white px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <div className="rounded-xl bg-surface px-4 py-2 text-sm font-medium text-on-surface">
            Page {page} of {totalPages}
          </div>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="rounded-xl border border-outline-variant bg-white px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </article>
  );
}
