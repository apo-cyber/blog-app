"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "ホーム", icon: HomeIcon },
    { href: "/about", label: "アバウト", icon: InformationCircleIcon },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-black text-white flex-shrink-0 hover:opacity-90 transition-opacity [text-shadow:_2px_2px_8px_rgb(0_0_0_/_90%),_0_0_20px_rgb(0_0_0_/_50%)]"
          >
            <img src="/apo.png" alt="Apo logo" className="w-16 h-10 rounded" />
            <span className="font-poppins tracking-wide">apo-blog</span>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-full text-base font-bold transition-all duration-300 [text-shadow:_2px_2px_8px_rgb(0_0_0_/_90%),_0_0_20px_rgb(0_0_0_/_50%)] ${
                    isActive
                      ? "bg-white/20 text-white backdrop-blur"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-1.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* モバイルメニューボタン */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center glass-dark rounded-full px-3 py-1.5 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            aria-label="メニューを開く"
          >
            <span className="text-xs font-medium mr-1">MENU</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* モバイルメニュー */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 pb-3 pt-3 fade-in">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-bold transition-all [text-shadow:_2px_2px_8px_rgb(0_0_0_/_90%),_0_0_20px_rgb(0_0_0_/_50%)] ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="break-normal">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
