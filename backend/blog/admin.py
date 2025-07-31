# blog/admin.py

from django.contrib import admin
from .models import BlogPost, Tag, Like,Comment


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

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'author',
        'post_title',
        'parent_comment',
        'content_preview',
        'reply_count',
        'created_at',
        'is_active'
    ]
    list_filter = ['is_active', 'created_at', 'blog_post', 'parent']
    search_fields = ['content', 'author__username', 'blog_post__title']
    readonly_fields = ['created_at', 'updated_at', 'reply_count']
    list_per_page = 25

    def post_title(self, obj):
        return obj.blog_post.title
    post_title.short_description = '投稿タイトル'

    def parent_comment(self, obj):
        if obj.parent:
            return f"返信: {obj.parent.author.username}"
        return "親コメント"
    parent_comment.short_description = 'コメント種別'

    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'コメント内容'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'author', 'blog_post', 'parent', 'parent__author'
        )
