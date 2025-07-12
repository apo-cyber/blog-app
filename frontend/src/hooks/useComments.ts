// src/hooks/useComments.ts

"use client";

import { useState, useEffect } from "react";
import { Comment } from "@/types";
import { getComments } from "@/lib/api-functions";

export const useComments = (postId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    if (!postId) return;

    try {
      setIsLoading(true);
      setError(null);
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
    } catch (err) {
      console.error("コメント取得エラー:", err);
      setError("コメントの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const addComment = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const addReply = (parentCommentId: number, newReply: Comment) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
            reply_count: comment.reply_count + 1,
          };
        }
        return comment;
      })
    );
  };

  const updateComment = (updatedComment: Comment) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === updatedComment.id) {
          return updatedComment;
        }
        // 返信の場合
        if (comment.replies.some((reply) => reply.id === updatedComment.id)) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === updatedComment.id ? updatedComment : reply
            ),
          };
        }
        return comment;
      })
    );
  };

  const deleteComment = (commentId: number) => {
    setComments((prev) =>
      prev.filter((comment) => {
        if (comment.id === commentId) {
          return false;
        }
        // 返信の場合
        if (comment.replies.some((reply) => reply.id === commentId)) {
          comment.replies = comment.replies.filter(
            (reply) => reply.id !== commentId
          );
          comment.reply_count = Math.max(0, comment.reply_count - 1);
        }
        return true;
      })
    );
  };

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    addReply,
    updateComment,
    deleteComment,
  };
};
