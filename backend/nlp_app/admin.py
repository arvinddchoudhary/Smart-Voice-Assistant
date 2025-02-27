from django.contrib import admin
from .models import CalendarEvent, Task, MeetingSummary

admin.site.register(CalendarEvent)
admin.site.register(Task)
admin.site.register(MeetingSummary)
