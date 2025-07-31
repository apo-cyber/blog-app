# blog/models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import MinLengthValidator


class Tag(models.Model):
    """タグモデル：ブログ記事を分類するためのタグ"""

    name = models.CharField(max_length=50, unique=True, verbose_name="タグ名")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="作成日時")

    class Meta:
        verbose_name = "タグ"
        verbose_name_plural = "タグ"
        ordering = ["name"]

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    """ブログ記事モデル：メインとなるブログ投稿"""

    # 著者（Djangoの標準Userモデルを使用）
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,  # ユーザーが削除されたら記事も削除
        related_name="blog_posts",
        verbose_name="著者",
    )

    # 記事の基本情報
    title = models.CharField(max_length=200, verbose_name="タイトル")
    description = models.TextField(verbose_name="説明・本文")

    # 画像（画像は'blog_images/'フォルダに保存される）
    image = models.ImageField(
        upload_to="blog_images/", blank=True, null=True, verbose_name="画像"
    )

    # タグ（多対多の関係：1つの記事に複数のタグ、1つのタグは複数の記事に使える）
    tags = models.ManyToManyField(
        Tag, related_name="blog_posts", blank=True, verbose_name="タグ"
    )

    # タイムスタンプ
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="作成日時")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日時")

    # 公開設定（下書き機能のため）
    is_published = models.BooleanField(default=True, verbose_name="公開設定")
    published_at = models.DateTimeField(blank=True, null=True, verbose_name="公開日時")

    class Meta:
        verbose_name = "ブログ記事"
        verbose_name_plural = "ブログ記事"
        ordering = ["-created_at"]  # 新しい記事から順に表示

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        """保存時の処理：公開設定がTrueで公開日時が未設定なら現在時刻を設定"""
        if self.is_published and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def get_likes_count(self):
        """いいねの数を取得するメソッド"""
        return self.likes.count()


class Like(models.Model):
    """いいねモデル：ユーザーが記事にいいねする機能"""

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="likes", verbose_name="ユーザー"
    )
    blog_post = models.ForeignKey(
        BlogPost,
        on_delete=models.CASCADE,
        related_name="likes",
        verbose_name="ブログ記事",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="いいね日時")

    class Meta:
        verbose_name = "いいね"
        verbose_name_plural = "いいね"
        # 同じユーザーが同じ記事に複数回いいねできないようにする
        unique_together = ("user", "blog_post")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} が {self.blog_post.title} にいいね"


class Comment(models.Model):
    """コメントモデル：ブログ記事に対するコメントと返信機能"""

    blog_post = models.ForeignKey(
        BlogPost,
        on_delete=models.CASCADE,
        related_name="comments",
        verbose_name="ブログ記事",
    )
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comments", verbose_name="投稿者"
    )
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="replies",
        verbose_name="親コメント",
    )
    content = models.TextField(
        validators=[MinLengthValidator(1)],
        verbose_name="コメント内容",
        help_text="コメント内容を入力してください",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="作成日時")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日時")
    is_active = models.BooleanField(default=True, verbose_name="有効フラグ")

    class Meta:
        verbose_name = "コメント"
        verbose_name_plural = "コメント"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["blog_post", "-created_at"]),
            models.Index(fields=["parent", "-created_at"]),
        ]

    def __str__(self):
        if self.parent:
            return f"{self.author.username} が {self.parent.author.username} に返信: {self.content[:50]}..."
        return f"{self.author.username}: {self.content[:50]}..."

    @property
    def is_reply(self):
        """返信かどうかを判定"""
        return self.parent is not None

    @property
    def reply_count(self):
        """返信数を取得"""
        return self.replies.filter(is_active=True).count()

    def get_thread(self):
        """スレッド全体を取得（親コメント + すべての返信）"""
        if self.parent:
            return self.parent.get_thread()
        return self

    def get_all_replies(self):
        """すべての返信を階層的に取得"""
        return (
            self.replies.filter(is_active=True)
            .select_related("author")
            .order_by("created_at")
        )
