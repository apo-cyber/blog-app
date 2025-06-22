// src/app/providers.tsx

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // データの再取得設定
            staleTime: 60 * 1000, // 1分間はキャッシュを使用
            refetchOnWindowFocus: false, // ウィンドウフォーカス時の再取得を無効化
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
