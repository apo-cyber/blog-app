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
import {
  useBlogPost,
  useLikeBlogPost,
  useLikeStatus,
} from "@/hooks/useBlogPosts";
import { Loading } from "@/components/ui/Loading";
import { Header } from "@/components/layout/Header";
import { SimpleFooter } from "@/components/layout/SimpleFooter";
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
    <div className="min-h-screen gradient-bg-subtle">
      <Header />

      {/* ヒーローセクション */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src="/hero2.jpg"
          alt="Hero background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl text-white mb-6 max-w-4xl tracking-tight font-bold">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-white text-sm font-bold">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              <time dateTime={post.created_at}>
                {format(new Date(post.created_at), "yyyy年MM月dd日 HH:mm", {
                  locale: ja,
                })}
              </time>
            </div>
            {post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <TagIcon className="h-4 w-4" />
                {post.tags.map((tag) => tag.name).join(", ")}
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
        {/* 戻るボタン */}
        <Link
          href="/"
          prefetch={true}
          className="inline-flex items-center text-[#8b7eb8] hover:text-[#6b5e98] mb-6 transition-colors glass px-4 py-2 rounded-full"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          記事一覧に戻る
        </Link>

        <article className="glass rounded-2xl shadow-lg overflow-hidden">
          {/* 記事画像 */}
          {post.image && (
            <div className="w-full">
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
          )}

          <div className="p-8">
            {/* タグ */}
            {post.tags.length > 0 && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <TagIcon className="h-5 w-5 text-[#8b7eb8]" />
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/?tag=${tag.name}`}
                    className="bg-[#f0f0f8] text-[#6b6b8d] px-3 py-1 rounded-full text-sm hover:bg-[#e8e8f0] transition-colors tag-hover"
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
            <div className="flex items-center pt-6 border-t border-gray-200">
              {(() => {
                const likesCount = likeStatus?.likes_count ?? post.likes_count;
                const hasLikes = likesCount > 0;
                return (
                  <button
                    onClick={handleLike}
                    disabled={likeMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-red-50 transition-all group"
                  >
                    {hasLikes ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                    )}
                    <span
                      className={`font-medium ${
                        hasLikes
                          ? "text-red-500"
                          : "text-gray-500 group-hover:text-red-500"
                      } transition-colors`}
                    >
                      {likesCount}
                    </span>
                  </button>
                );
              })()}
            </div>
          </div>
        </article>
      </main>
      <SimpleFooter />
    </div>
  );
}
