from django.db import models

class CalendarEvent(models.Model):
    date = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return f"Event on {self.date}: {self.description[:30]}"

class Task(models.Model):
    description = models.TextField()

    def __str__(self):
        return self.description[:30]

class MeetingSummary(models.Model):
    summary_text = models.TextField()

    def __str__(self):
        return self.summary_text[:50]
