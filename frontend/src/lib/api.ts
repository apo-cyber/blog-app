// src/lib/api.ts

import axios from "axios";

// APIのベースURL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// axiosのインスタンスを作成
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cookie認証のために必要
});

// リクエストインターセプター
api.interceptors.request.use(
  (config) => {
    // CSRFトークンの取得（Djangoのcsrfトークンを使用）
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（エラーハンドリング）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 認証エラーの場合の処理
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Cookieを取得するヘルパー関数
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}
