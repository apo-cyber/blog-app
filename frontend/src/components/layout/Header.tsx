"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  PlusIcon,
  HomeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    setMobileMenuOpen(false);
  };

  const navItems = [
    { href: "/", label: "ホーム", icon: HomeIcon, requireAuth: false },
    {
      href: "/posts/new",
      label: "新規投稿",
      icon: PlusIcon,
      requireAuth: true,
    },
    {
      href: "/profile",
      label: "プロフィール",
      icon: UserIcon,
      requireAuth: true,
    },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-gray-900 flex-shrink-0"
          >
            <img src="/apo.png" alt="Apo logo" className="w-16 h-10" />
            apo-blog
          </Link>

          {/* デスクトップナビゲーション - 768px以上で表示 */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              if (item.requireAuth && !user) return null;

              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-1.5" />
                  {item.label}
                </Link>
              );
            })}

            {user ? (
              <>
                <span className="text-sm text-gray-600 px-2">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1.5" />
                  ログアウト
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1.5" />
                ログイン
              </Link>
            )}
          </nav>

          {/* モバイルメニューボタン - 768px未満で表示 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center border border-gray-300 rounded-md px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="メニューを開く"
          >
            <span className="text-xs font-medium mr-1">MENU</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* モバイルメニュー */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pb-3 pt-3">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                if (item.requireAuth && !user) return null;

                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="break-normal">{item.label}</span>
                  </Link>
                );
              })}

              {user ? (
                <>
                  <div className="flex items-center px-3 py-3 text-base text-gray-600 border-t border-gray-200">
                    <UserIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="truncate max-w-[200px]">
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors text-left"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="break-normal">ログアウト</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border-t border-gray-200"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="break-normal">ログイン</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
