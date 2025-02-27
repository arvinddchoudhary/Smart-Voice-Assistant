from django.urls import path
from .views import process_text, homepage, process_voice

urlpatterns = [
    path("", homepage, name="homepage"),  
    path("process/", process_text, name="process_text"),
    path("voice-process/", process_voice, name="process_voice"),
]