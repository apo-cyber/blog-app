# blog/admin.py

from django.contrib import admin
from django.contrib.auth.models import User, Group
from .models import BlogPost, Tag

# 認証と認可セクションを非表示
admin.site.unregister(User)
admin.site.unregister(Group)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """タグ管理画面の設定"""

    list_display = ["name", "created_at"]
    search_fields = ["name"]
    ordering = ["name"]


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    """ブログ記事管理画面の設定"""

    list_display = ["title", "is_published", "created_at", "updated_at"]
    list_filter = ["is_published", "created_at", "tags"]
    search_fields = ["title", "description"]
    filter_horizontal = ["tags"]
    date_hierarchy = "created_at"
    readonly_fields = ["created_at", "updated_at"]

    fieldsets = (
        ("基本情報", {"fields": ("title", "description")}),
        ("画像", {"fields": ("image",)}),
        ("タグ", {"fields": ("tags",)}),
        ("公開設定", {"fields": ("is_published", "published_at")}),
        ("タイムスタンプ", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )

    def save_model(self, request, obj, form, change):
        """保存時に著者を自動設定"""
        if not change:  # 新規作成時のみ
            obj.author = request.user
        super().save_model(request, obj, form, change)
