# blog/management/commands/create_sample_data.py

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from blog.models import BlogPost, Tag, Like
from django.utils import timezone
import random


class Command(BaseCommand):
    help = '開発用のサンプルデータを作成します'

    def handle(self, *args, **kwargs):
        # ユーザーの作成
        users = []
        for i in range(3):
            username = f'user{i+1}'
            email = f'user{i+1}@example.com'
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'first_name': f'ユーザー{i+1}',
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(f'ユーザー作成: {username}')
            users.append(user)

        # タグの作成
        tag_names = ['Python', 'Django', 'React', 'Next.js', 'JavaScript',
                     'Web開発', 'API', 'データベース', 'セキュリティ', 'デザイン']
        tags = []
        for tag_name in tag_names:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            if created:
                self.stdout.write(f'タグ作成: {tag_name}')
            tags.append(tag)

        # ブログ記事の作成
        titles = [
            'Django REST FrameworkでAPI開発入門',
            'Next.js 15の新機能まとめ',
            'Reactフックスの使い方完全ガイド',
            'Pythonでデータ分析を始めよう',
            'モダンなWeb開発環境の構築方法',
            'セキュアなAPIの設計パターン',
            'レスポンシブデザインの基本',
            'GitとGitHubの使い方',
            'DockerでDjango開発環境を構築',
            'TypeScriptの型システム入門'
        ]

        for i, title in enumerate(titles):
            # ランダムな著者を選択
            author = random.choice(users)

            # ブログ記事を作成
            blog_post, created = BlogPost.objects.get_or_create(
                title=title,
                defaults={
                    'author': author,
                    'description': f'''
# {title}

これは{title}についての記事です。

## はじめに
この記事では、{title.split()[0]}について詳しく解説していきます。

## 主な内容
- 基本的な概念の説明
- 実践的な使用例
- ベストプラクティス
- よくある質問と回答

## まとめ
{title}について理解を深めることができました。
ぜひ実際に試してみてください！
                    '''.strip(),
                    'is_published': True,
                    'published_at': timezone.now()
                }
            )

            if created:
                # ランダムにタグを追加（2〜4個）
                selected_tags = random.sample(tags, random.randint(2, 4))
                blog_post.tags.set(selected_tags)

                self.stdout.write(f'記事作成: {title}')

                # ランダムにいいねを追加
                likers = random.sample(users, random.randint(0, len(users)))
                for liker in likers:
                    Like.objects.get_or_create(
                        user=liker,
                        blog_post=blog_post
                    )

        self.stdout.write(self.style.SUCCESS('サンプルデータの作成が完了しました！'))
