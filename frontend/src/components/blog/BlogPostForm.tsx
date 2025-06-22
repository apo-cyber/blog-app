// src/components/blog/BlogPostForm.tsx

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  PhotoIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { useTags, useCreateTag } from "@/hooks/useTags";
import { BlogPost, BlogPostInput } from "@/types";
import { Markdown } from "@/components/ui/Markdown";

// バリデーションスキーマ
const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(200, "タイトルは200文字以内で入力してください"),
  description: z.string().min(1, "本文は必須です"),
  tag_ids: z.array(z.number()),
  is_published: z.boolean(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  post?: BlogPost;
  onSubmit: (data: BlogPostInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function BlogPostForm({
  post,
  onSubmit,
  isSubmitting = false,
}: BlogPostFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    post?.image || null
  );
  const [newTagName, setNewTagName] = useState("");
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const { data: tags = [], refetch: refetchTags } = useTags();
  const createTagMutation = useCreateTag();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || "",
      description: post?.description || "",
      tag_ids: post?.tags.map((tag) => tag.id) || [],
      is_published: post?.is_published ?? true,
    },
  });

  const selectedTagIds = watch("tag_ids");

  // 画像選択処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 画像削除処理
  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // タグ選択処理
  const handleTagToggle = (tagId: number) => {
    const currentTagIds = selectedTagIds || [];
    if (currentTagIds.includes(tagId)) {
      setValue(
        "tag_ids",
        currentTagIds.filter((id) => id !== tagId)
      );
    } else {
      setValue("tag_ids", [...currentTagIds, tagId]);
    }
  };

  // 新しいタグ作成処理
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const newTag = await createTagMutation.mutateAsync(newTagName.trim());
      await refetchTags();
      handleTagToggle(newTag.id);
      setNewTagName("");
      setShowNewTagInput(false);
    } catch (error) {
      // エラーはuseMutationで処理される
    }
  };

  // フォーム送信処理
  const handleFormSubmit = async (data: BlogPostFormData) => {
    await onSubmit({
      ...data,
      image: imageFile,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* タイトル */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title")}
          type="text"
          id="title"
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="記事のタイトルを入力"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* 本文 */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            本文 <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            {previewMode ? (
              <>
                <PencilIcon className="h-4 w-4" />
                編集
              </>
            ) : (
              <>
                <EyeIcon className="h-4 w-4" />
                プレビュー
              </>
            )}
          </button>
        </div>

        {previewMode ? (
          <div className="min-h-[250px] p-4 bg-white border border-gray-300 rounded-lg">
            <Markdown content={watch("description")} />
          </div>
        ) : (
          <textarea
            {...register("description")}
            id="description"
            rows={10}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            placeholder="記事の本文を入力（Markdown記法が使えます）"
          />
        )}
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* アイキャッチ画像 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          アイキャッチ画像
        </label>

        {imagePreview ? (
          <div className="relative">
            <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={imagePreview}
                alt="プレビュー"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleImageRemove}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        ) : (
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                クリックして画像を選択
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </div>
          </label>
        )}
      </div>

      {/* タグ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          タグ
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags?.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTagIds.includes(tag.id)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tag.name}
            </button>
          ))}

          {!showNewTagInput && (
            <button
              type="button"
              onClick={() => setShowNewTagInput(true)}
              className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              + 新しいタグ
            </button>
          )}
        </div>

        {showNewTagInput && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="新しいタグ名"
              className="flex-1 px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateTag();
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={handleCreateTag}
              disabled={!newTagName.trim() || createTagMutation.isPending}
            >
              追加
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setShowNewTagInput(false);
                setNewTagName("");
              }}
            >
              キャンセル
            </Button>
          </div>
        )}
      </div>

      {/* 公開設定 */}
      <div>
        <label className="flex items-center">
          <input
            {...register("is_published")}
            type="checkbox"
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            すぐに公開する
          </span>
        </label>
        <p className="mt-1 text-xs text-gray-500">
          チェックを外すと下書きとして保存され、自分だけが見ることができます
        </p>
      </div>

      {/* 送信ボタン */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? "送信中..." : post ? "更新する" : "投稿する"}
        </Button>
      </div>
    </form>
  );
}
