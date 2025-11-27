# blog/admin.py

from django.contrib import admin
from .models import BlogPost, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """タグ管理画面の設定"""
    list_display = ['name', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    """ブログ記事管理画面の設定"""
    list_display = ['title', 'is_published', 'created_at', 'updated_at']
    list_filter = ['is_published', 'created_at', 'tags']
    search_fields = ['title', 'description']
    filter_horizontal = ['tags']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('基本情報', {
            'fields': ('title', 'author', 'description')
        }),
        ('画像', {
            'fields': ('image', 'image2'),
            'description': '画像は2枚まで設定できます'
        }),
        ('タグ', {
            'fields': ('tags',)
        }),
        ('公開設定', {
            'fields': ('is_published', 'published_at')
        }),
        ('タイムスタンプ', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
