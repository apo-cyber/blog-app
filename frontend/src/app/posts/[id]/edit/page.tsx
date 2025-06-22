// src/app/posts/[id]/edit/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useBlogPost, useUpdateBlogPost } from "@/hooks/useBlogPosts";
import { BlogPostForm } from "@/components/blog/BlogPostForm";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { BlogPostInput } from "@/types";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.id);

  const { data: post, isLoading, error } = useBlogPost(postId);
  const updateMutation = useUpdateBlogPost();

  const handleSubmit = async (data: BlogPostInput) => {
    try {
      await updateMutation.mutateAsync({ id: postId, data });
      router.push(`/posts/${postId}`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 戻るボタン */}
        <Link
          href={`/posts/${postId}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          記事に戻る
        </Link>

        <Card>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              記事を編集
            </h1>

            <BlogPostForm
              post={post}
              onSubmit={handleSubmit}
              isSubmitting={updateMutation.isPending}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}
