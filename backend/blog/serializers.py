# blog/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import BlogPost, Tag, Like


class UserSerializer(serializers.ModelSerializer):
    """ユーザー情報のシリアライザー"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserCreateSerializer(serializers.ModelSerializer):
    """ユーザー登録用のシリアライザー"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "パスワードが一致しません"})

        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "このユーザー名は既に使用されています"})

        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "このメールアドレスは既に使用されています"})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class TagSerializer(serializers.ModelSerializer):
    """タグのシリアライザー"""
    class Meta:
        model = Tag
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['created_at']


class BlogPostListSerializer(serializers.ModelSerializer):
    """ブログ記事一覧用のシリアライザー（軽量版）"""
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'description', 'image',
            'author', 'tags', 'likes_count', 'is_liked',
            'created_at', 'updated_at', 'is_published'
        ]

    def get_likes_count(self, obj):
        """いいねの数を取得"""
        return obj.likes.count()

    def get_is_liked(self, obj):
        """現在のユーザーがいいねしているかどうかを判定"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """ブログ記事詳細用のシリアライザー（フル機能版）"""
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        write_only=True,
        source='tags'
    )
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'description', 'image',
            'author', 'tags', 'tag_ids', 'likes_count', 'is_liked',
            'created_at', 'updated_at', 'is_published', 'published_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'published_at']

    def get_likes_count(self, obj):
        """いいねの数を取得"""
        return obj.likes.count()

    def get_is_liked(self, obj):
        """現在のユーザーがいいねしているかどうかを判定"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def create(self, validated_data):
        """新規ブログ記事の作成"""
        # タグの情報を一時的に取り出す
        tags_data = validated_data.pop('tags', [])

        # ブログ記事を作成
        blog_post = BlogPost.objects.create(**validated_data)

        # タグを設定
        blog_post.tags.set(tags_data)

        return blog_post

    def update(self, instance, validated_data):
        """ブログ記事の更新"""
        # タグの情報を一時的に取り出す
        tags_data = validated_data.pop('tags', None)

        # 記事の基本情報を更新
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # タグが指定されていれば更新
        if tags_data is not None:
            instance.tags.set(tags_data)

        return instance


class LikeSerializer(serializers.ModelSerializer):
    """いいねのシリアライザー"""
    user = UserSerializer(read_only=True)
    blog_post_title = serializers.CharField(source='blog_post.title', read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'user', 'blog_post', 'blog_post_title', 'created_at']
        read_only_fields = ['created_at']
