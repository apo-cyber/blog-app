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
import { useLikeBlogPost, useLikeStatus } from "@/hooks/useBlogPosts";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const likeMutation = useLikeBlogPost();
  const { data: likeStatus } = useLikeStatus(post.id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // Linkのクリックを防ぐ
    if (likeStatus) {
      likeMutation.mutate({ id: post.id, isLiked: likeStatus.is_liked });
    }
  };

  const likesCount = likeStatus?.likes_count ?? post.likes_count;
  const hasLikes = likesCount > 0; // 1以上なら赤くする

  return (
    <Link href={`/posts/${post.id}`} className="block">
      <Card className="cursor-pointer h-full flex flex-col">
        {/* 画像 */}
        {post.image && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        )}

        <div className="p-5 flex flex-col flex-grow">
          {/* 下書きバッジ */}
          {!post.is_published && (
            <div className="mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                下書き
              </span>
            </div>
          )}

          {/* タイトル */}
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
            {post.title}
          </h2>

          {/* 説明（Markdownをプレーンテキストに変換） */}
          <p className="text-gray-600 mb-4 line-clamp-3 flex-grow leading-relaxed">
            {post.description.replace(/[#*`_~\[\]()]/g, "").substring(0, 150)}
            ...
          </p>

          {/* タグ */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <TagIcon className="h-4 w-4 text-[#8b7eb8]" />
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs bg-[#f0f0f8] text-[#6b6b8d] px-3 py-1 rounded-full tag-hover cursor-pointer"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* メタ情報 */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4 text-gray-400" />
              <time dateTime={post.created_at} className="text-gray-500">
                {format(new Date(post.created_at), "yyyy年MM月dd日", {
                  locale: ja,
                })}
              </time>
            </div>

            {/* いいね */}
            <button
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-red-50 transition-all duration-300 group"
            >
              {hasLikes ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              )}
              <span
                className={`font-medium ${
                  hasLikes ? "text-red-500" : "text-gray-500 group-hover:text-red-500"
                } transition-colors`}
              >
                {likesCount}
              </span>
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
