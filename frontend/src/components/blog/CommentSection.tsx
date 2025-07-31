// src/components/blog/CommentSection.tsx

"use client";

import { useComments } from "@/hooks/useComments";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { Button } from "@/components/ui/Button";

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    addReply,
    updateComment,
    deleteComment,
  } = useComments(postId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">コメントを読み込み中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 mb-2">{error}</p>
          <Button variant="secondary" size="sm" onClick={fetchComments}>
            再試行
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      {/* コメントセクションヘッダー */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          コメント (
          {comments.length > 0
            ? comments.reduce(
                (total, comment) => total + 1 + comment.reply_count,
                0
              )
            : 0}
          )
        </h3>
      </div>

      {/* コメント投稿フォーム */}
      <CommentForm postId={postId} onCommentAdded={addComment} />

      {/* コメント一覧 */}
      <div className="space-y-0">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>まだコメントがありません</p>
            <p className="text-sm mt-1">最初のコメントを投稿してみましょう！</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onUpdate={updateComment}
                onDelete={deleteComment}
                onReply={addReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
