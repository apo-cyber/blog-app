# blog/admin.py

from django.contrib import admin
from .models import BlogPost, Tag, Like


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """タグ管理画面の設定"""
    list_display = ['name', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    """ブログ記事管理画面の設定"""
    list_display = ['title', 'author', 'is_published', 'created_at', 'updated_at']
    list_filter = ['is_published', 'created_at', 'tags']
    search_fields = ['title', 'description', 'author__username']
    filter_horizontal = ['tags']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('基本情報', {
            'fields': ('title', 'author', 'description')
        }),
        ('画像とタグ', {
            'fields': ('image', 'tags')
        }),
        ('公開設定', {
            'fields': ('is_published', 'published_at')
        }),
        ('タイムスタンプ', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    """いいね管理画面の設定"""
    list_display = ['user', 'blog_post', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'blog_post__title']
    raw_id_fields = ['user', 'blog_post']
