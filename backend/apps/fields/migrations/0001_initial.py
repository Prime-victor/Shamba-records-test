import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Field",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=150)),
                ("crop_type", models.CharField(max_length=100)),
                ("planting_date", models.DateField()),
                ("stage", models.CharField(choices=[("Planted", "Planted"), ("Growing", "Growing"), ("Ready", "Ready"), ("Harvested", "Harvested")], default="Planted", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("assigned_agent", models.ForeignKey(blank=True, limit_choices_to={"role": "agent"}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="assigned_fields", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="FieldUpdate",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("stage", models.CharField(choices=[("Planted", "Planted"), ("Growing", "Growing"), ("Ready", "Ready"), ("Harvested", "Harvested")], max_length=20)),
                ("notes", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("agent", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="field_updates", to=settings.AUTH_USER_MODEL)),
                ("field", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="updates", to="fields.field")),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
