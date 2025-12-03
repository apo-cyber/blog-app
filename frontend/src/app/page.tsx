// src/app/page.tsx

"use client";

import { useState } from "react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useTags } from "@/hooks/useTags";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Button } from "@/components/ui/Button";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { Header } from "@/components/layout/Header";
import { SimpleFooter } from "@/components/layout/SimpleFooter";
import Image from "next/image";

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
    <div className="min-h-screen gradient-bg-subtle">
      {/* ヒーローセクション（ヘッダー含む） */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Hero background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />

        {/* ヘッダー */}
        <Header />

        {/* ヒーローコンテンツ */}
        <div className="relative h-full flex items-center px-4">
          <div className="w-1/2 flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
              Apo Blog
            </h1>
            <p className="text-2xl md:text-4xl font-bold text-white mb-3">
              日々の記録と発見
            </p>
            <p className="text-base md:text-lg font-medium text-white">
              Django & Next.js で作る個人ブログ
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
        {/* 検索・フィルター */}
        <div className="glass rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="記事を検索..."
                className="search-input"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-[#8b7eb8]" />
            </div>
            <Button type="submit">検索</Button>
          </form>

          <div className="flex flex-wrap gap-4 items-center">
            {/* タグフィルター */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-[#8b7eb8]" />
              <select
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value);
                  setPage(1);
                }}
                className="form-select"
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
              className="form-select"
            >
              <option value="-created_at">新しい順</option>
              <option value="created_at">古い順</option>
              <option value="-updated_at">更新順</option>
            </select>
          </div>
        </div>

        {/* 記事一覧 */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">エラーが発生しました</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
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
                <span className="flex items-center px-4 py-2 text-gray-700 glass rounded-full">
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
