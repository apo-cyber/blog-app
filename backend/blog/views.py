# blog/views.py

from rest_framework import viewsets, status, filters, generics, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAuthenticatedOrReadOnly,
    IsAuthenticated,
    AllowAny,
)
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django.contrib.auth import authenticate, login, logout
from .models import BlogPost, Tag, Like, Comment
from .serializers import (
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    TagSerializer,
    LikeSerializer,
    UserSerializer,
    UserCreateSerializer,
    CommentSerializer,
    CommentCreateSerializer,
    CommentUpdateSerializer,
)
from PIL import Image
import os


@api_view(["POST"])
@permission_classes([AllowAny])
def signup_view(request):
    """サインアップ（ユーザー登録）API"""
    serializer = UserCreateSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        # 登録後、自動的にログイン
        login(request, user)
        return Response(
            {"user": UserSerializer(user).data, "detail": "アカウントを作成しました"},
            status=status.HTTP_201_CREATED,
        )
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    """ログインAPI"""
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"detail": "ユーザー名とパスワードを入力してください"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return Response(
            {"user": UserSerializer(user).data, "detail": "ログインに成功しました"}
        )
    else:
        return Response(
            {"detail": "ユーザー名またはパスワードが正しくありません"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def logout_view(request):
    """ログアウトAPI"""
    logout(request)
    return Response({"detail": "ログアウトしました"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """現在のユーザー情報を取得"""
    return Response(UserSerializer(request.user).data)


class TagViewSet(viewsets.ModelViewSet):
    """タグのCRUD操作を行うビューセット"""

    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
    pagination_class = None


class BlogPostViewSet(viewsets.ModelViewSet):
    """ブログ記事のCRUD操作といいね機能を提供するビューセット"""

    queryset = BlogPost.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "author__username"]
    ordering_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """クエリセットを取得（フィルタリング機能付き）"""
        queryset = super().get_queryset()

        # タグでフィルタリング
        tag = self.request.query_params.get("tag", None)
        if tag:
            queryset = queryset.filter(tags__name=tag)

        # 著者でフィルタリング
        author = self.request.query_params.get("author", None)
        if author:
            queryset = queryset.filter(author__username=author)

        # 公開状態でフィルタリング
        if not self.request.user.is_authenticated:
            # 未認証ユーザーは公開記事のみ
            queryset = queryset.filter(is_published=True)
        else:
            # 認証済みユーザーは、公開記事と自分の下書きのみ
            from django.db.models import Q

            queryset = queryset.filter(
                Q(is_published=True) | Q(author=self.request.user, is_published=False)
            )

            # is_publishedパラメータが指定されている場合の追加フィルタ
            is_published = self.request.query_params.get("is_published", None)
            if is_published is not None:
                if is_published.lower() == "true":
                    queryset = queryset.filter(is_published=True)
                else:
                    # 下書きのみ表示（自分のもののみ）
                    queryset = queryset.filter(
                        author=self.request.user, is_published=False
                    )

        print(f"User: {self.request.user}, Final queryset count: {queryset.count()}")
        return queryset.distinct()

    def get_serializer_class(self):
        """アクションに応じて適切なシリアライザーを選択"""
        if self.action == "list":
            return BlogPostListSerializer
        return BlogPostDetailSerializer

    def perform_create(self, serializer):
        """記事作成時に著者を自動設定"""
        serializer.save(author=self.request.user)

    @action(
        detail=True, methods=["post", "delete"], permission_classes=[IsAuthenticated]
    )
    def like(self, request, pk=None):
        """いいね機能"""
        blog_post = self.get_object()
        user = request.user

        if request.method == "POST":
            # いいねを追加
            like, created = Like.objects.get_or_create(user=user, blog_post=blog_post)
            if created:
                return Response(
                    {
                        "detail": "いいねしました",
                        "likes_count": blog_post.get_likes_count(),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"detail": "すでにいいねしています"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        elif request.method == "DELETE":
            # いいねを削除
            try:
                like = Like.objects.get(user=user, blog_post=blog_post)
                like.delete()
                return Response(
                    {
                        "detail": "いいねを解除しました",
                        "likes_count": blog_post.get_likes_count(),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            except Like.DoesNotExist:
                return Response(
                    {"detail": "いいねしていません"}, status=status.HTTP_400_BAD_REQUEST
                )

    @action(detail=False, methods=["get"])
    def my_posts(self, request):
        """自分の投稿した記事一覧を取得"""
        if not request.user.is_authenticated:
            return Response(
                {"detail": "ログインが必要です"}, status=status.HTTP_401_UNAUTHORIZED
            )

        queryset = self.get_queryset().filter(author=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def liked_posts(self, request):
        """自分がいいねした記事一覧を取得"""
        if not request.user.is_authenticated:
            return Response(
                {"detail": "ログインが必要です"}, status=status.HTTP_401_UNAUTHORIZED
            )

        queryset = self.get_queryset().filter(likes__user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(
        detail=True, methods=["post", "delete"], permission_classes=[IsAuthenticated]
    )
    def like(self, request, pk=None):
        """
        いいね機能
        POST: いいねを追加
        DELETE: いいねを削除
        """
        blog_post = self.get_object()
        user = request.user

        if request.method == "POST":
            # いいねを追加
            like, created = Like.objects.get_or_create(user=user, blog_post=blog_post)
            if created:
                return Response(
                    {
                        "detail": "いいねしました",
                        "likes_count": blog_post.get_likes_count(),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"detail": "すでにいいねしています"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        elif request.method == "DELETE":
            # いいねを削除
            try:
                like = Like.objects.get(user=user, blog_post=blog_post)
                like.delete()
                return Response(
                    {
                        "detail": "いいねを解除しました",
                        "likes_count": blog_post.get_likes_count(),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            except Like.DoesNotExist:
                return Response(
                    {"detail": "いいねしていません"}, status=status.HTTP_400_BAD_REQUEST
                )


class CommentListCreateView(generics.ListCreateAPIView):
    """投稿に対するコメント一覧取得・作成"""

    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]  # 一時的に認証なしに変更

    def get_queryset(self):
        post_id = self.kwargs.get("post_id")
        blog_post = get_object_or_404(BlogPost, id=post_id)

        # 親コメントのみを取得（返信は各コメントのrepliesで取得）
        return (
            Comment.objects.filter(
                blog_post=blog_post,
                parent__isnull=True,  # 親コメントのみ
                is_active=True,
            )
            .select_related("author")
            .prefetch_related("replies__author")  # 返信も同時に取得
            .order_by("-created_at")
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CommentCreateSerializer
        return CommentSerializer

    def create(self, request, *args, **kwargs):
        post_id = self.kwargs.get("post_id")
        blog_post = get_object_or_404(BlogPost, id=post_id)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 認証されたユーザーまたはテスト用のデフォルトユーザーを使用
        if request.user.is_authenticated:
            author = request.user
        else:
            # 一時的にデフォルトユーザーを使用（テスト用）
            from django.contrib.auth.models import User

            author = User.objects.first()
            if not author:
                return Response(
                    {"detail": "ユーザーが見つかりません。"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # コメントを作成
        comment = serializer.save(blog_post=blog_post, author=author)

        # レスポンス用のシリアライザーで返す
        response_serializer = CommentSerializer(comment)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """コメント詳細取得・更新・削除"""

    queryset = Comment.objects.filter(is_active=True)
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return CommentUpdateSerializer
        return CommentSerializer

    def get_permissions(self):
        """コメントの作成者のみ編集・削除可能"""
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated(), IsCommentAuthor()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def perform_destroy(self, instance):
        """実際の削除ではなく、is_activeをFalseに設定"""
        instance.is_active = False
        instance.save()

        # 返信も非アクティブにする
        instance.replies.update(is_active=False)


class IsCommentAuthor(permissions.BasePermission):
    """コメント作成者のみ編集・削除可能"""

    def has_object_permission(self, request, view, obj):
        return obj.author == request.user


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def comment_count(request, post_id):
    """投稿のコメント数を取得（返信も含む）"""
    blog_post = get_object_or_404(BlogPost, id=post_id)
    count = Comment.objects.filter(blog_post=blog_post, is_active=True).count()
    return Response({"count": count})


@api_view(["POST"])
@permission_classes([permissions.AllowAny])  # 一時的に認証なしに変更
def create_reply(request, comment_id):
    """特定のコメントに返信を作成"""
    parent_comment = get_object_or_404(Comment, id=comment_id, is_active=True)

    # 返信の返信を防ぐ
    if parent_comment.parent is not None:
        return Response(
            {"detail": "返信に対してさらに返信することはできません。"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = CommentCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 認証されたユーザーまたはテスト用のデフォルトユーザーを使用
    if request.user.is_authenticated:
        author = request.user
    else:
        # 一時的にデフォルトユーザーを使用（テスト用）
        from django.contrib.auth.models import User

        author = User.objects.first()
        if not author:
            return Response(
                {"detail": "ユーザーが見つかりません。"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # 返信を作成
    reply = serializer.save(
        blog_post=parent_comment.blog_post, parent=parent_comment, author=author
    )

    response_serializer = CommentSerializer(reply)
    return Response(response_serializer.data, status=status.HTTP_201_CREATED)


def process_uploaded_image(image_file):
    """アップロードされた画像を処理"""
    if image_file.name.lower().endswith((".heic", ".heif")):
        # HEICをJPEGに変換
        img = Image.open(image_file)
        # ファイル名変更
        new_name = os.path.splitext(image_file.name)[0] + ".jpg"
        # JPEGとして保存
        return img, new_name
    return None, image_file.name
