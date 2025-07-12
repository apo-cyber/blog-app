// src/components/blog/CommentItem.tsx

"use client";

import { useState } from "react";
import { Comment } from "@/types";
import { updateComment, deleteComment, createReply } from "@/lib/api-functions";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

interface CommentItemProps {
  comment: Comment;
  onUpdate: (updatedComment: Comment) => void;
  onDelete: (commentId: number) => void;
  onReply?: (parentCommentId: number, newReply: Comment) => void;
  isReply?: boolean;
}

export default function CommentItem({
  comment,
  onUpdate,
  onDelete,
  onReply,
  isReply = false,
}: CommentItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isAuthor = user?.id === comment.author.id;

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    setIsLoading(true);
    try {
      const updatedComment = await updateComment(comment.id, {
        content: editContent.trim(),
      });
      onUpdate(updatedComment);
      setIsEditing(false);
    } catch (error) {
      console.error("コメント更新エラー:", error);
      alert("コメントの更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("コメントを削除しますか？")) return;

    setIsLoading(true);
    try {
      await deleteComment(comment.id);
      onDelete(comment.id);
    } catch (error) {
      console.error("コメント削除エラー:", error);
      alert("コメントの削除に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !onReply) return;

    setIsLoading(true);
    try {
      const newReply = await createReply(comment.id, {
        content: replyContent.trim(),
      });
      onReply(comment.id, newReply);
      setReplyContent("");
      setIsReplying(false);
    } catch (error) {
      console.error("返信投稿エラー:", error);
      alert("返信の投稿に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex space-x-2 sm:space-x-3 p-3 sm:p-4 ${
        isReply
          ? "ml-4 sm:ml-8 border-l-2 border-gray-200"
          : "border-b border-gray-100"
      } hover:bg-gray-50`}
    >
      {/* アバター */}
      <div className="flex-shrink-0">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
          {comment.author.username.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* コメント内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <h4 className="font-medium text-gray-900 text-sm">
              {comment.author.username}
            </h4>
            <span className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleString("ja-JP")}
            </span>
            {comment.is_reply && (
              <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded mt-1 sm:mt-0 self-start">
                返信
              </span>
            )}
          </div>

          {/* 操作ボタン */}
          {isAuthor && (
            <div className="flex space-x-1 ml-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                    className="text-xs px-2 py-1"
                  >
                    編集
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="text-xs px-2 py-1"
                  >
                    削除
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleEdit}
                    disabled={isLoading || !editContent.trim()}
                    className="text-xs px-2 py-1"
                  >
                    保存
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="text-xs px-2 py-1"
                  >
                    キャンセル
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* コメント本文 */}
        <div className="mt-2">
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={3}
              maxLength={1000}
              disabled={isLoading}
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
              {comment.content}
            </p>
          )}
        </div>

        {/* 返信ボタン（親コメントのみ） */}
        {!isReply && user && !isEditing && (
          <div className="mt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs px-3 py-1"
            >
              返信
            </Button>
          </div>
        )}

        {/* 返信フォーム */}
        {isReplying && (
          <div className="mt-3 pl-2 sm:pl-4 border-l-2 border-gray-200">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="返信を入力してください..."
              className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={2}
              maxLength={1000}
              disabled={isLoading}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent("");
                }}
                className="text-xs px-3 py-1"
              >
                キャンセル
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleReply}
                disabled={isLoading || !replyContent.trim()}
                className="text-xs px-3 py-1"
              >
                返信する
              </Button>
            </div>
          </div>
        )}

        {/* 返信一覧 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onUpdate={onUpdate}
                onDelete={onDelete}
                isReply={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
