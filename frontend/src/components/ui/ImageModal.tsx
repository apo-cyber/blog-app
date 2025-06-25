// src/components/ui/ImageModal.tsx

"use client";

import { useEffect } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  caption?: string; // ← これが追加したい行
}

export function ImageModal({
  src,
  alt,
  isOpen,
  onClose,
  caption,
}: ImageModalProps) {
  // ESCキーで閉じる
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // スクロールを無効化
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center pt-6 transition-opacity duration-300 ease-in-out  ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* 背景のオーバーレイ */}
      <div className="absolute inset-0 bg-gray-50 bg-opacity-70" />

      {/* モーダルコンテンツ */}
      <div className="relative z-10 max-w-7xl max-h-[90vh] mx-4">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 text-white hover:text-gray-300 transition-colors"
          aria-label="閉じる"
        >
          <XMarkIcon className="h-8 w-8" />
        </button>

        {/* 画像 */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <Image
            src={src}
            alt={alt}
            width={1920}
            height={1080}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
            priority
          />
        </div>

        {/* 画像の説明（タイトルラベル付き） */}
        {caption && (
          <div className="text-black text-center mt-4 text-sm">
            <p>{caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}
