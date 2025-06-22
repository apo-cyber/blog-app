// src/app/posts/new/page.tsx

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useCreateBlogPost } from "@/hooks/useBlogPosts";
import { BlogPostForm } from "@/components/blog/BlogPostForm";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { BlogPostInput } from "@/types";

export default function NewPostPage() {
  const router = useRouter();
  const createMutation = useCreateBlogPost();

  const handleSubmit = async (data: BlogPostInput) => {
    try {
      const newPost = await createMutation.mutateAsync(data);
      router.push(`/posts/${newPost.id}`);
    } catch (error) {
      // エラーはuseMutationで処理される
    }
  };

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

        <Card>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              新しい記事を投稿
            </h1>

            <BlogPostForm
              onSubmit={handleSubmit}
              isSubmitting={createMutation.isPending}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}
