"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  HeartIcon,
  ClockIcon,
  TagIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useBlogPost, useLikeBlogPost, useLikeStatus } from "@/hooks/useBlogPosts";
import { Loading } from "@/components/ui/Loading";
import { Header } from "@/components/layout/Header";
import { Markdown } from "@/components/ui/Markdown";

export default function BlogPostDetailPage() {
  const params = useParams();
  const postId = Number(params.id);

  const { data: post, isLoading, error } = useBlogPost(postId);
  const { data: likeStatus } = useLikeStatus(postId);
  const likeMutation = useLikeBlogPost();

  const handleLike = () => {
    if (likeStatus) {
      likeMutation.mutate({ id: postId, isLiked: likeStatus.is_liked });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Loading />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-center text-red-600">記事が見つかりませんでした</p>
          <div className="text-center mt-4">
            <Link href="/" className="text-blue-600 hover:underline">
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 戻るボタン */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          記事一覧に戻る
        </Link>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 画像エリア - 全幅表示 */}
          {post.image && (
            <div className="w-full">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
                unoptimized
              />
            </div>
          )}

          <div className="p-8">
            {/* タイトル */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* メタ情報 */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              {/* 投稿日時 */}
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <time dateTime={post.created_at}>
                  {format(new Date(post.created_at), "yyyy年MM月dd日 HH:mm", {
                    locale: ja,
                  })}
                </time>
              </div>

              {/* 更新日時（投稿日時と異なる場合のみ表示） */}
              {post.created_at !== post.updated_at && (
                <span className="text-sm">
                  (更新:{" "}
                  {format(new Date(post.updated_at), "yyyy年MM月dd日", {
                    locale: ja,
                  })}
                  )
                </span>
              )}
            </div>

            {/* タグ */}
            {post.tags.length > 0 && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <TagIcon className="h-5 w-5 text-gray-400" />
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/?tag=${tag.name}`}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* 本文 */}
            <div className="mb-8">
              <Markdown content={post.description} />
            </div>

            {/* いいねボタン */}
            <div className="flex items-center pt-6 border-t">
              <button
                onClick={handleLike}
                disabled={likeMutation.isPending}
                className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
              >
                {likeStatus?.is_liked ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
                <span className="font-medium">
                  {likeStatus?.likes_count ?? post.likes_count}
                </span>
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
