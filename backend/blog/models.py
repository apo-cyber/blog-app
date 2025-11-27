# blog/models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.files.base import ContentFile
from PIL import Image
import pillow_heif
import io
import os


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
        on_delete=models.CASCADE,
        related_name="blog_posts",
        verbose_name="著者",
    )

    # 記事の基本情報
    title = models.CharField(max_length=200, verbose_name="タイトル")
    description = models.TextField(verbose_name="説明・本文")

    # 画像
    image = models.ImageField(
        upload_to="blog_images/", blank=True, null=True, verbose_name="画像1"
    )
    image2 = models.ImageField(
        upload_to="blog_images/", blank=True, null=True, verbose_name="画像2"
    )

    # タグ
    tags = models.ManyToManyField(
        Tag, related_name="blog_posts", blank=True, verbose_name="タグ"
    )

    # タイムスタンプ
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="作成日時")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日時")

    # 公開設定
    is_published = models.BooleanField(default=True, verbose_name="公開設定")
    published_at = models.DateTimeField(blank=True, null=True, verbose_name="公開日時")

    class Meta:
        verbose_name = "ブログ記事"
        verbose_name_plural = "ブログ記事"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    def _optimize_image(self, image_field, max_width=1200):
        """画像を最適化（HEIC変換 + リサイズ + 圧縮）"""
        if not image_field:
            return None

        filename = image_field.name.lower()
        is_heic = filename.endswith(('.heic', '.heif'))

        try:
            if is_heic:
                heif_file = pillow_heif.read_heif(image_field)
                pil_image = Image.frombytes(
                    heif_file.mode,
                    heif_file.size,
                    heif_file.data,
                    "raw",
                )
            else:
                pil_image = Image.open(image_field)

            if pil_image.mode in ('RGBA', 'P'):
                pil_image = pil_image.convert('RGB')

            if pil_image.width > max_width:
                ratio = max_width / pil_image.width
                new_height = int(pil_image.height * ratio)
                pil_image = pil_image.resize((max_width, new_height), Image.Resampling.LANCZOS)

            output = io.BytesIO()
            pil_image.save(output, format='JPEG', quality=85, optimize=True)
            output.seek(0)

            new_filename = os.path.splitext(os.path.basename(image_field.name))[0] + '.jpg'
            return ContentFile(output.read(), name=new_filename)
        except Exception as e:
            print(f"画像最適化エラー: {e}")
            return None

    def save(self, *args, **kwargs):
        """保存時の処理：画像最適化と公開日時設定"""
        if self.pk is None:
            if self.image:
                optimized = self._optimize_image(self.image)
                if optimized:
                    self.image = optimized

            if self.image2:
                optimized2 = self._optimize_image(self.image2)
                if optimized2:
                    self.image2 = optimized2

        if self.is_published and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def get_likes_count(self):
        """いいねの数を取得"""
        return self.likes.count()


class Like(models.Model):
    """いいねモデル：匿名ユーザー対応（セッションIDで管理）"""

    blog_post = models.ForeignKey(
        BlogPost,
        on_delete=models.CASCADE,
        related_name="likes",
        verbose_name="ブログ記事",
    )
    session_key = models.CharField(max_length=40, verbose_name="セッションキー")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="いいね日時")

    class Meta:
        verbose_name = "いいね"
        verbose_name_plural = "いいね"
        unique_together = ("session_key", "blog_post")
        ordering = ["-created_at"]

    def __str__(self):
        return f"セッション {self.session_key[:8]}... が {self.blog_post.title} にいいね"
