// src/components/layout/Header.tsx

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  PlusIcon,
  HomeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
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
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Apo-Blog</h1>
          </Link>

          <nav className="flex items-center space-x-4">
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
        </div>
      </div>
    </header>
  );
}
