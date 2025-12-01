# blog/serializers.py

from rest_framework import serializers
from .models import BlogPost, Tag


class TagSerializer(serializers.ModelSerializer):
    """タグのシリアライザー"""
    class Meta:
        model = Tag
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['created_at']


class BlogPostListSerializer(serializers.ModelSerializer):
    """ブログ記事一覧用のシリアライザー"""
    tags = TagSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'description', 'image',
            'tags', 'likes_count',
            'created_at', 'updated_at', 'is_published'
        ]

    def get_likes_count(self, obj):
        """いいねの数を取得"""
        return obj.likes.count()


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """ブログ記事詳細用のシリアライザー"""
    tags = TagSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'description', 'image',
            'tags', 'likes_count',
            'created_at', 'updated_at', 'is_published', 'published_at'
        ]

    def get_likes_count(self, obj):
        """いいねの数を取得"""
        return obj.likes.count()
