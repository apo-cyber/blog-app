# blog/views.py

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import BlogPost, Tag, Like
from .serializers import (
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    TagSerializer,
)


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """タグの読み取り専用ビューセット"""

    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
    pagination_class = None


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """ブログ記事の読み取り専用ビューセット"""

    queryset = BlogPost.objects.filter(is_published=True)
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """クエリセットを取得（フィルタリング機能付き）"""
        from django.db.models import Count

        queryset = BlogPost.objects.filter(is_published=True).prefetch_related(
            'tags'
        ).annotate(
            likes_count_cached=Count('likes')
        )

        # タグでフィルタリング
        tag = self.request.query_params.get("tag", None)
        if tag:
            queryset = queryset.filter(tags__name=tag)

        return queryset.distinct()

    def get_serializer_class(self):
        """アクションに応じて適切なシリアライザーを選択"""
        if self.action == "list":
            return BlogPostListSerializer
        return BlogPostDetailSerializer

    def get_serializer_context(self):
        """シリアライザーにセッションキーを渡す"""
        context = super().get_serializer_context()
        context["session_key"] = self._get_or_create_session_key()
        return context

    def _get_or_create_session_key(self):
        """セッションキーを取得または作成"""
        if not self.request.session.session_key:
            self.request.session.create()
        return self.request.session.session_key

    @action(detail=True, methods=["post", "delete"], permission_classes=[AllowAny])
    def like(self, request, pk=None):
        """
        いいね機能（匿名ユーザー対応）
        POST: いいねを追加
        DELETE: いいねを削除
        """
        blog_post = self.get_object()
        session_key = self._get_or_create_session_key()

        if request.method == "POST":
            # いいねを追加
            like, created = Like.objects.get_or_create(
                session_key=session_key, blog_post=blog_post
            )
            if created:
                return Response(
                    {
                        "detail": "いいねしました",
                        "likes_count": blog_post.get_likes_count(),
                        "is_liked": True,
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "detail": "すでにいいねしています",
                        "likes_count": blog_post.get_likes_count(),
                        "is_liked": True,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        elif request.method == "DELETE":
            # いいねを削除
            try:
                like = Like.objects.get(session_key=session_key, blog_post=blog_post)
                like.delete()
                return Response(
                    {
                        "detail": "いいねを解除しました",
                        "likes_count": blog_post.get_likes_count(),
                        "is_liked": False,
                    },
                    status=status.HTTP_200_OK,
                )
            except Like.DoesNotExist:
                return Response(
                    {
                        "detail": "いいねしていません",
                        "likes_count": blog_post.get_likes_count(),
                        "is_liked": False,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

    @action(detail=True, methods=["get"], permission_classes=[AllowAny])
    def like_status(self, request, pk=None):
        """現在のセッションがいいねしているかを確認"""
        blog_post = self.get_object()
        session_key = self._get_or_create_session_key()
        is_liked = Like.objects.filter(
            session_key=session_key, blog_post=blog_post
        ).exists()
        return Response(
            {
                "is_liked": is_liked,
                "likes_count": blog_post.get_likes_count(),
            }
        )
