// src/components/blog/CommentForm.tsx

"use client";

import { useState } from "react";
import { Comment } from "@/types";
import { createComment } from "@/lib/api-functions";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

interface CommentFormProps {
  postId: number;
  onCommentAdded: (comment: Comment) => void;
}

export default function CommentForm({
  postId,
  onCommentAdded,
}: CommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("コメントを入力してください");
      return;
    }

    if (!user) {
      setError("ログインしてください");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const newComment = await createComment(postId, {
        content: content.trim(),
      });

      onCommentAdded(newComment);
      setContent("");
    } catch (error) {
      console.error("コメント投稿エラー:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as any;

        if (axiosError.response?.status === 404) {
          setError("投稿が見つかりません。ページを更新してください。");
        } else if (axiosError.response?.data?.detail) {
          setError(axiosError.response.data.detail);
        } else {
          setError("コメントの投稿に失敗しました");
        }
      } else {
        setError("コメントの投稿に失敗しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600">
          コメントするには
          <a
            href="/auth/login"
            className="text-blue-600 hover:text-blue-800 ml-1"
          >
            ログイン
          </a>
          してください
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-2 sm:space-x-3">
        {/* ユーザーアバター */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* コメント入力エリア */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError("");
            }}
            placeholder="コメントを入力してください..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            rows={3}
            maxLength={1000}
            disabled={isLoading}
          />

          {/* 文字数カウントと投稿ボタン */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center mt-2 space-y-2 space-y-reverse sm:space-y-0">
            <span className="text-sm text-gray-500">{content.length}/1000</span>

            <Button
              type="submit"
              disabled={isLoading || !content.trim()}
              variant="primary"
              className="w-full sm:w-auto"
            >
              {isLoading ? "投稿中..." : "コメントする"}
            </Button>
          </div>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
          {error}
        </div>
      )}
    </form>
  );
}
