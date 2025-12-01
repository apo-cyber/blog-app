// src/components/layout/SimpleFooter.tsx

export function SimpleFooter() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <img src="/cat.gif" alt="Dancing cat" className="w-32 h-auto" />
          <p className="text-gray-600 text-sm">
            <span className="hidden sm:inline">
              © 2025-{new Date().getFullYear()} Apo_Blog. Made with ❤️ using
              Django & Next.js
            </span>
            <span className="sm:hidden">
              © 2025-{new Date().getFullYear()} Apo_Blog ❤️ using Django &
              Next.js
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
