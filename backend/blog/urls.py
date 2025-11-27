# blog/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# DRFのルーターを使用してURLを自動生成
router = DefaultRouter()
router.register(r'posts', views.BlogPostViewSet, basename='blogpost')
router.register(r'tags', views.TagViewSet, basename='tag')

app_name = 'blog'

urlpatterns = [
    path('', include(router.urls)),
]
