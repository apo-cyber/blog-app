# blog/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.views.generic import RedirectView
from . import views

# DRFのルーターを使用してURLを自動生成
router = DefaultRouter()
router.register(r'posts', views.BlogPostViewSet, basename='blogpost')
router.register(r'tags', views.TagViewSet, basename='tag')

app_name = 'blog'

urlpatterns = [
    path('', include(router.urls)),
    path('auth/signup/', views.signup_view, name='signup'),  # 追加
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/user/', views.current_user_view, name='current_user'),
    # コメント関連のURL
    path(
        'posts/<int:post_id>/comments/',
        views.CommentListCreateView.as_view(),
        name='comment-list-create'
    ),
    path(
        'comments/<int:pk>/',
        views.CommentDetailView.as_view(),
        name='comment-detail'
    ),
    path(
        'posts/<int:post_id>/comments/count/',
        views.comment_count,
        name='comment-count'
    ),
    path(
        'comments/<int:comment_id>/reply/',
        views.create_reply,
        name='create-reply'
    ),
]
