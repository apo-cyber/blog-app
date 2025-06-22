// src/app/page.tsx

"use client";

import { useState } from "react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useTags } from "@/hooks/useTags";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Loading } from "@/components/ui/Loading";
import { Button } from "@/components/ui/Button";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { Header } from "@/components/layout/Header";
import { SimpleFooter } from "@/components/layout/SimpleFooter";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);

  const {
    data: postsData,
    isLoading,
    error,
  } = useBlogPosts({
    page,
    search,
    tag: selectedTag,
    ordering,
  });

  const { data: tags = [] } = useTags();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="記事を検索..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button type="submit">検索</Button>
          </form>

          <div className="flex flex-wrap gap-4 items-center">
            {/* タグフィルター */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value);
                  setPage(1);
                }}
                className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">すべてのタグ</option>
                {tags?.map((tag) => (
                  <option key={tag.id} value={tag.name}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ソート */}
            <select
              value={ordering}
              onChange={(e) => {
                setOrdering(e.target.value);
                setPage(1);
              }}
              className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="-created_at">新しい順</option>
              <option value="created_at">古い順</option>
              <option value="-updated_at">更新順</option>
            </select>
          </div>
        </div>

        {/* 記事一覧 */}
        {isLoading ? (
          <Loading />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">エラーが発生しました</p>
          </div>
        ) : postsData?.results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">記事が見つかりませんでした</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postsData?.results.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {/* ページネーション */}
            {postsData && (postsData.next || postsData.previous) && (
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  variant="secondary"
                  disabled={!postsData.previous}
                  onClick={() => setPage(page - 1)}
                >
                  前のページ
                </Button>
                <span className="flex items-center px-4 py-2 text-gray-700">
                  ページ {page}
                </span>
                <Button
                  variant="secondary"
                  disabled={!postsData.next}
                  onClick={() => setPage(page + 1)}
                >
                  次のページ
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <SimpleFooter />
    </div>
  );
}
