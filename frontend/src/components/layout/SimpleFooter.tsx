// src/components/layout/SimpleFooter.tsx

export function SimpleFooter() {
  return (
    <footer className="mt-auto">
      {/* 3D風の区切り線 */}
      <div className="h-[3px] bg-gradient-to-b from-gray-300 via-gray-100 to-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center gap-3">
          {/* 猫（上段） */}
          <div className="bg-white/90 rounded-xl p-1.5 shadow-md">
            <img src="/cat.gif" alt="Dancing cat" className="w-12 h-auto" />
          </div>
          {/* テキスト（下段） */}
          <p className="text-gray-600 text-sm">
            © 2025-{new Date().getFullYear()} Apo_Blog ❤️ Django & Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
