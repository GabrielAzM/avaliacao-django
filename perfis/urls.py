from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/perfis/', views.api_perfis, name='api_perfis'),
    path('api/perfis/criar/', views.api_criar_perfil, name='api_criar_perfil'),
    path('api/perfis/<int:perfil_id>/', views.api_perfil_detail, name='api_perfil_detail'),
    path('api/perfil/', views.api_perfil, name='api_perfil'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/logout/', views.api_logout, name='api_logout'),
]
