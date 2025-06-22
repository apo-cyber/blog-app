// src/app/signup/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UserPlusIcon } from "@heroicons/react/24/outline";

// バリデーションスキーマ
const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "ユーザー名は3文字以上で入力してください")
      .max(150, "ユーザー名は150文字以内で入力してください")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "ユーザー名は英数字とアンダースコアのみ使用できます"
      ),
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        "パスワードは英数字を含む必要があります"
      ),
    password2: z.string(),
  })
  .refine((data) => data.password === data.password2, {
    message: "パスワードが一致しません",
    path: ["password2"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      await signup(data);
      router.push("/");
    } catch (err) {
      // エラーは AuthContext で処理される
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900">Blog App</h1>
          </Link>
          <p className="mt-2 text-gray-600">新しいアカウントを作成</p>
        </div>

        <Card>
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* ユーザー名 */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ユーザー名 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("username")}
                  type="text"
                  id="username"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ユーザー名を入力"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  英数字とアンダースコアのみ使用可能
                </p>
              </div>

              {/* メールアドレス */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* パスワード */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  パスワード <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="パスワードを入力"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  8文字以上、英数字を含む
                </p>
              </div>

              {/* パスワード確認 */}
              <div>
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  パスワード（確認） <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("password2")}
                  type="password"
                  id="password2"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="パスワードを再入力"
                />
                {errors.password2 && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password2.message}
                  </p>
                )}
              </div>

              <Button type="submit" fullWidth disabled={isLoading}>
                <UserPlusIcon className="h-5 w-5 mr-2" />
                {isLoading ? "アカウント作成中..." : "アカウントを作成"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                すでにアカウントをお持ちですか？{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  ログイン
                </Link>
              </p>
            </div>
          </div>
        </Card>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link href="/" className="text-blue-600 hover:underline">
            ホームに戻る
          </Link>
        </p>
      </div>
    </div>
  );
}
