// src/components/blog/BlogPostCard.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { HeartIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { BlogPost } from "@/types";
import { Card } from "@/components/ui/Card";
import { useLikeBlogPost } from "@/hooks/useBlogPosts";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const likeMutation = useLikeBlogPost();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // Linkのクリックを防ぐ
    likeMutation.mutate({ id: post.id, isLiked: post.is_liked });
  };

  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* 画像 */}
        {post.image && (
          <div className="relative h-48 w-full">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-4 flex flex-col flex-grow">
          {/* 下書きバッジ */}
          {!post.is_published && (
            <div className="mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                下書き
              </span>
            </div>
          )}

          {/* タイトル */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h2>

          {/* 説明（Markdownをプレーンテキストに変換） */}
          <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
            {post.description.replace(/[#*`_~\[\]()]/g, "").substring(0, 150)}
            ...
          </p>

          {/* タグ */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <TagIcon className="h-4 w-4 text-gray-400" />
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* メタ情報 */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              {/* 著者 */}
              <span>{post.author.username}</span>

              {/* 投稿日時 */}
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <time dateTime={post.created_at}>
                  {format(new Date(post.created_at), "yyyy年MM月dd日", {
                    locale: ja,
                  })}
                </time>
              </div>
            </div>

            {/* いいね */}
            <button
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              {post.likes_count > 0 ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-500 hover:text-red-500" />
              )}
              <span
                className={
                  post.likes_count > 0 ? "text-red-500" : "text-gray-500"
                }
              >
                {post.likes_count}
              </span>
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
