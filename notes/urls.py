from . import views
from django.urls import path

urlpatterns = [
    path('', views.index, name="index"),
    path('note/<str:note_id>', views.note, name="note"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create", views.create, name="create")
]