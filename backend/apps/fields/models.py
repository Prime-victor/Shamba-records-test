from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone


class Field(models.Model):
    class Stage(models.TextChoices):
        PLANTED = "Planted", "Planted"
        GROWING = "Growing", "Growing"
        READY = "Ready", "Ready"
        HARVESTED = "Harvested", "Harvested"

    name = models.CharField(max_length=150)
    crop_type = models.CharField(max_length=100)
    planting_date = models.DateField()
    stage = models.CharField(max_length=20, choices=Stage.choices, default=Stage.PLANTED)
    assigned_agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="assigned_fields",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={"role": "agent"},
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name

    @property
    def latest_update(self):
        return self.updates.order_by("-created_at").first()

    @property
    def status(self) -> str:
        if self.stage == self.Stage.HARVESTED:
            return "Completed"

        latest = self.latest_update
        now = timezone.now()
        if latest is None:
            if self.stage == self.Stage.PLANTED and self.planting_date <= (now.date() - timedelta(days=14)):
                return "At Risk"
            return "Active"

        if latest.created_at <= now - timedelta(days=7):
            return "At Risk"

        if self.stage == self.Stage.PLANTED and self.planting_date <= (now.date() - timedelta(days=14)):
            return "At Risk"

        return "Active"


class FieldUpdate(models.Model):
    field = models.ForeignKey(Field, related_name="updates", on_delete=models.CASCADE)
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="field_updates", on_delete=models.CASCADE)
    stage = models.CharField(max_length=20, choices=Field.Stage.choices)
    notes = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.field.name} - {self.stage}"
