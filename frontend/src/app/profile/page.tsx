// src/app/profile/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMyPosts, useLikedPosts } from "@/hooks/useBlogPosts";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Header } from "@/components/layout/Header";
import { Loading } from "@/components/ui/Loading";
import {
  UserCircleIcon,
  DocumentTextIcon,
  HeartIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "my-posts" | "liked-posts" | "drafts"
  >("my-posts");

  const { data: myPosts, isLoading: isLoadingMyPosts } = useMyPosts();
  const { data: likedPosts, isLoading: isLoadingLikedPosts } = useLikedPosts();

  // 認証チェック
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Loading />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const tabs = [
    {
      id: "my-posts" as const,
      label: "自分の投稿",
      icon: DocumentTextIcon,
      count: myPosts?.filter((post) => post.is_published).length || 0,
    },
    {
      id: "drafts" as const,
      label: "下書き",
      icon: DocumentDuplicateIcon,
      count: myPosts?.filter((post) => !post.is_published).length || 0,
    },
    {
      id: "liked-posts" as const,
      label: "いいねした記事",
      icon: HeartIcon,
      count: likedPosts?.length || 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* プロフィール情報 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center">
            <UserCircleIcon className="h-16 w-16 text-gray-400" />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.username}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* タブ */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                    <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* コンテンツ */}
        {activeTab === "my-posts" && (
          <div>
            {isLoadingMyPosts ? (
              <Loading />
            ) : myPosts?.filter((post) => post.is_published).length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">
                  まだ公開された投稿がありません
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPosts
                  ?.filter((post) => post.is_published)
                  .map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "drafts" && (
          <div>
            {isLoadingMyPosts ? (
              <Loading />
            ) : myPosts?.filter((post) => !post.is_published).length === 0 ? (
              <div className="text-center py-12">
                <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">下書きはありません</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPosts
                  ?.filter((post) => !post.is_published)
                  .map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "liked-posts" && (
          <div>
            {isLoadingLikedPosts ? (
              <Loading />
            ) : likedPosts?.length === 0 ? (
              <div className="text-center py-12">
                <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">
                  まだいいねした記事がありません
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedPosts?.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
