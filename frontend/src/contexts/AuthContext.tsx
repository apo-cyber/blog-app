// src/contexts/AuthContext.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/lib/api";
import { signup as signupApi } from "@/lib/api-functions";
import { User } from "@/types";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  password2: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // 初期化時に現在のユーザー情報を取得
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/user/");
      setUser(response.data);
    } catch (error) {
      // 未認証の場合はエラーになるが、それは正常
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/login/", { username, password });
      setUser(response.data.user);
      // キャッシュをクリア
      queryClient.clear();
      toast.success("ログインしました");
      // 即座にページをリロード
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "ログインに失敗しました");
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const response = await signupApi(data);
      setUser(response.user);
      toast.success("アカウントを作成しました");
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData) {
        // フィールドごとのエラーメッセージを表示
        Object.entries(errorData).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => toast.error(`${field}: ${message}`));
          } else {
            toast.error(`${field}: ${messages}`);
          }
        });
      } else {
        toast.error("アカウントの作成に失敗しました");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout/");
      setUser(null);
      // キャッシュをクリアしてから即座にリロード
      queryClient.clear();
      toast.success("ログアウトしました");
      // 即座にページをリロード
      window.location.href = "/";
    } catch (error) {
      toast.error("ログアウトに失敗しました");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
