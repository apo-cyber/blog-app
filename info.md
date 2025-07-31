Django のみのアプリと DRF+Next.js 15 のアプリを Vultr でデプロイする際の主な違いについて説明します。
アーキテクチャの違い
Django のみのアプリ（現在稼働中）:

モノリシック構成
Django がテンプレートレンダリングも含めて全て処理
Gunicorn + Nginx の構成

DRF + Next.js 15 のアプリ:

フロントエンド（Next.js）とバックエンド（DRF）が分離
API ベースの通信
それぞれ独立したサーバーが必要

デプロイ構成の違い

1. サーバー構成
   Django のみ:
   Nginx → Gunicorn → Django
   DRF + Next.js:
   Nginx → Next.js (フロントエンド、ポート 3000 など)
   → Gunicorn → DRF (バックエンド、ポート 8000 など)
2. 必要なプロセス
   Django のみ:

Gunicorn プロセス 1 つ

DRF + Next.js:

Gunicorn プロセス（DRF 用）
Next.js プロセス（PM2 や systemd で管理）

3.  Nginx 設定の違い
    Django のみ:
    nginxserver {
    location / {
    proxy_pass http://gunicorn_django;
    }
    location /static/ { # 静的ファイル配信
    }
    }
    DRF + Next.js:
    nginxserver { # フロントエンド
    location / {
    proxy_pass http://localhost:3000;
    }

        # API
        location /api/ {
            proxy_pass http://localhost:8000;
        }

        # Django静的ファイル
        location /static/ {
            # DRF静的ファイル
        }

    }

4.  環境変数・設定の違い
    DRF + Next.js 特有の設定:

CORS 設定（django-cors-headers）
Next.js 用環境変数（API_URL 等）
フロントエンドビルド設定

5. デプロイ手順の違い
   Django のみ:

コードプル
pip install
migrate
collectstatic
Gunicorn 再起動

DRF + Next.js:

コードプル
バックエンド: pip install → migrate → collectstatic
フロントエンド: npm install → npm run build
両方のサービス再起動

両立デプロイのための考慮点

1. ポート分離

既存 Django: 8001
新 DRF: 8002
Next.js: 3000

2. ドメイン/サブドメイン分離

既存: yourdomain.com
新アプリ: app.yourdomain.com または yourdomain.com/newapp

3. データベース分離

既存: 既存の PostgreSQL ユーザー・DB
新アプリ: 新しい PostgreSQL ユーザー・DB（既に作成済み）

4. 静的ファイル分離

異なるディレクトリに配置

🧠 なぜ MiB を使うのか？

Linux などの OS では、**正確なバイト数（2 進数ベース）**を扱うために MiB や GiB を使うことが一般的です。
• MB（メガバイト） → 10 進数（1000 単位）
• MiB（メビバイト）→ 2 進数（1024 単位）

項目
例え
メモリ
作業机（速くて便利）
Swap
書類棚（遅いけど助かる）
両方使う理由
メモリが狭いときの緊急対応

DB のパスワード：4FK13fr7xdMPJ0nt7RfMdtkWj91HJLeYmK9VaK/QWV4=

githab token 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

CREATE USER blog_app_user WITH PASSWORD '4FK13fr7xdMPJ0nt7RfMdtkWj91HJLeYmK9VaK/QWV4=';

django key 　 x0x^=9@sf6b@s9oi9(n25\*ueo3%r1t_gqz3+fs#4jkdddzgo+c

pip install -r requirements.txt
grep -n "DEBUG" config/settings.py
14:DEBUG = config('DEBUG', default=True, cast=bool)
135:if DEBUG:
154:if DEBUG:いらない
grep -n "SECRET_KEY" config/settings.py
11:SECRET_KEY = config('SECRET_KEY', default='django-insecure-your-secret-key-here')
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
apouser
apo@email.com
apocyber1129
python manage.py collectstatic --noinput

[sudo] password for apouser: apocyber1129

1. Gunicorn 用の systemd サービスファイルを作成
   bash# サービスファイルを作成
   sudo nano /etc/systemd/system/gunicorn-blog-app.service
   以下の内容を入力：
   ini[Unit]
   Description=gunicorn daemon for blog-app
   After=network.target

[Service]
User=apouser
Group=www-data
WorkingDirectory=/home/apouser/blog-app/backend
ExecStart=/home/apouser/blog-app/backend/venv/bin/gunicorn \
 --access-logfile - \
 --workers 3 \
 --bind unix:/run/gunicorn-blog-app.sock \
 config.wsgi:application

[Install]
WantedBy=multi-user.target 2. サービスを有効化して起動
bash# systemd をリロード
sudo systemctl daemon-reload

# サービスを有効化（自動起動）

sudo systemctl enable gunicorn-blog-app

# サービスを起動

sudo systemctl start gunicorn-blog-app

# 状態を確認

sudo systemctl status gunicorn-blog-app 3. ソケットファイルの確認
bash# ソケットファイルが作成されているか確認
ls -la /run/gunicorn-blog-app.sock
