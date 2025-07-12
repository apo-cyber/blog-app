"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  HeartIcon,
  ClockIcon,
  TagIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import {
  useBlogPost,
  useLikeBlogPost,
  useDeleteBlogPost,
  useTogglePublishBlogPost,
} from "@/hooks/useBlogPosts";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/Loading";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { Markdown } from "@/components/ui/Markdown";
import toast from "react-hot-toast";
import { useState } from "react";
import { ImageModal } from "@/components/ui/ImageModal";
import CommentSection from "@/components/blog/CommentSection";

export default function BlogPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth(); // フックは必ず最初に呼び出す
  const postId = Number(params.id);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const { data: post, isLoading, error } = useBlogPost(postId);
  const likeMutation = useLikeBlogPost();
  const deleteMutation = useDeleteBlogPost();
  const togglePublishMutation = useTogglePublishBlogPost();

  const handleLike = () => {
    if (post) {
      likeMutation.mutate({ id: post.id, isLiked: post.is_liked });
    }
  };

  const handleTogglePublish = async () => {
    if (!post) return;

    try {
      await togglePublishMutation.mutateAsync({
        id: post.id,
        isPublished: !post.is_published,
      });
    } catch (error) {
      // エラーはuseMutationで処理される
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

  const handleDelete = async () => {
    if (!post) return;

    if (window.confirm("この記事を削除してもよろしいですか？")) {
      try {
        await deleteMutation.mutateAsync(post.id);
        router.push("/");
      } catch (error) {
        // エラーはuseMutationで処理される
      }
    }
  };

  // 認証チェック
  const isAuthor = user && post && user.username === post.author.username;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 戻るボタン */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          記事一覧に戻る
        </Link>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* アイキャッチ画像 */}
          {post.image && (
            <div
              className="relative h-96 w-full cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          )}

          <div className="p-8">
            {/* 下書きバッジ */}
            {!post.is_published && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <svg
                    className="mr-1.5 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  この記事は下書きです
                </span>
              </div>
            )}

            {/* タイトル */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* メタ情報 */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              {/* 著者 */}
              <span className="font-medium">{post.author.username}</span>

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

            {/* アクションボタン */}
            <div className="flex items-center justify-between pt-6 border-t">
              {/* いいねボタン */}
              <button
                onClick={handleLike}
                disabled={likeMutation.isPending}
                className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
              >
                {post.is_liked ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
                <span className="font-medium">{post.likes_count}</span>
              </button>

              {/* 編集・削除ボタン（著者のみ表示） */}
              {isAuthor && (
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* 公開/下書きボタン */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleTogglePublish}
                    disabled={togglePublishMutation.isPending}
                  >
                    {post.is_published ? (
                      <>
                        <EyeSlashIcon className="h-4 w-4 mr-1" />
                        下書きに戻す
                      </>
                    ) : (
                      <>
                        <EyeIcon className="h-4 w-4 mr-1" />
                        公開する
                      </>
                    )}
                  </Button>

                  <Link href={`/posts/${post.id}/edit`}>
                    <Button variant="secondary" size="sm">
                      <PencilIcon className="h-4 w-4 mr-1" />
                      編集
                    </Button>
                  </Link>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    削除
                  </Button>
                </div>
              )}
            </div>
          </div>
        </article>
        {post.image && (
          <ImageModal
            src={post.image}
            alt="アイキャッチ画像"
            caption={post.title}
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
          />
        )}
        <section className="bg-white rounded-lg shadow-md p-6 mt-8">
          <CommentSection postId={postId} />
        </section>
      </main>
    </div>
  );
}
