from rest_framework import serializers

from apps.users.models import User
from apps.users.serializers import UserSerializer

from .models import Field, FieldUpdate


class FieldUpdateSerializer(serializers.ModelSerializer):
    agent = UserSerializer(read_only=True)

    class Meta:
        model = FieldUpdate
        fields = ["id", "field", "agent", "stage", "notes", "created_at"]
        read_only_fields = ["id", "field", "agent", "created_at"]


class CreateFieldUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldUpdate
        fields = ["stage", "notes"]


class FieldSerializer(serializers.ModelSerializer):
    assigned_agent = UserSerializer(read_only=True)
    assigned_agent_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="agent"),
        source="assigned_agent",
        write_only=True,
        required=False,
        allow_null=True,
    )
    status = serializers.CharField(read_only=True)
    latest_update = FieldUpdateSerializer(read_only=True)

    class Meta:
        model = Field
        fields = [
            "id",
            "name",
            "crop_type",
            "planting_date",
            "stage",
            "assigned_agent",
            "assigned_agent_id",
            "status",
            "latest_update",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "status", "latest_update", "created_at", "updated_at"]


class AssignFieldSerializer(serializers.ModelSerializer):
    assigned_agent_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="agent"),
        source="assigned_agent",
        allow_null=True,
    )

    class Meta:
        model = Field
        fields = ["assigned_agent_id"]
