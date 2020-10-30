from . import views
from django.urls import path

urlpatterns = [
    path('', views.index, name="index"),
    path('note/<str:note_id>', views.note, name="note")
]