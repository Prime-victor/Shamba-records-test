from datetime import date, timedelta

from django.core.management.base import BaseCommand

from apps.fields.models import Field, FieldUpdate
from apps.users.models import User


class Command(BaseCommand):
    help = "Seeds demo data for SmartSeason"

    def handle(self, *args, **options):
        admin, _ = User.objects.get_or_create(
            email="admin@smartseason.io",
            defaults={"name": "Grace Wanjiku", "role": "admin", "is_staff": True},
        )
        admin.set_password("Admin123!")
        admin.save()

        agent_one, _ = User.objects.get_or_create(
            email="agent.a@smartseason.io",
            defaults={"name": "Daniel Kiptoo", "role": "agent"},
        )
        agent_one.set_password("Agent123!")
        agent_one.save()

        agent_two, _ = User.objects.get_or_create(
            email="agent.b@smartseason.io",
            defaults={"name": "Amina Njeri", "role": "agent"},
        )
        agent_two.set_password("Agent123!")
        agent_two.save()

        field_entries = [
            {
                "name": "North Plot A",
                "crop_type": "Maize",
                "planting_date": date.today() - timedelta(days=21),
                "stage": "Growing",
                "assigned_agent": agent_one,
                "updates": [("Growing", "Healthy emergence and even spacing.", 2)],
            },
            {
                "name": "River Edge B",
                "crop_type": "Beans",
                "planting_date": date.today() - timedelta(days=18),
                "stage": "Planted",
                "assigned_agent": agent_two,
                "updates": [("Planted", "Delayed germination after a dry spell.", 9)],
            },
            {
                "name": "Highland C",
                "crop_type": "Tomatoes",
                "planting_date": date.today() - timedelta(days=45),
                "stage": "Harvested",
                "assigned_agent": agent_one,
                "updates": [("Ready", "Fruits uniform and harvest prep complete.", 8), ("Harvested", "First harvest completed successfully.", 1)],
            },
        ]

        for entry in field_entries:
            field, _ = Field.objects.get_or_create(
                name=entry["name"],
                defaults={
                    "crop_type": entry["crop_type"],
                    "planting_date": entry["planting_date"],
                    "stage": entry["stage"],
                    "assigned_agent": entry["assigned_agent"],
                },
            )
            field.crop_type = entry["crop_type"]
            field.planting_date = entry["planting_date"]
            field.stage = entry["stage"]
            field.assigned_agent = entry["assigned_agent"]
            field.save()

            for stage, notes, days_ago in entry["updates"]:
                update, _ = FieldUpdate.objects.get_or_create(
                    field=field,
                    stage=stage,
                    notes=notes,
                    defaults={"agent": entry["assigned_agent"]},
                )
                update.agent = entry["assigned_agent"]
                update.created_at = field.updated_at - timedelta(days=days_ago)
                update.save()

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully."))
