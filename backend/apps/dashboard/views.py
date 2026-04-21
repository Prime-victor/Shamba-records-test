from django.db.models import Count
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.fields.models import Field
from apps.users.permissions import IsAdminUserRole


def summarize_fields(queryset):
    fields = list(queryset)
    status_counts = {"Active": 0, "At Risk": 0, "Completed": 0}
    for field in fields:
        status_counts[field.status] += 1

    stage_breakdown = dict(queryset.values("stage").annotate(total=Count("id")).values_list("stage", "total"))

    return {
        "total_fields": len(fields),
        "active_fields": status_counts["Active"],
        "at_risk_fields": status_counts["At Risk"],
        "completed_fields": status_counts["Completed"],
        "stage_breakdown": stage_breakdown,
        "recent_fields": [
            {
                "id": field.id,
                "name": field.name,
                "crop_type": field.crop_type,
                "stage": field.stage,
                "status": field.status,
                "assigned_agent": field.assigned_agent.name if field.assigned_agent else None,
            }
            for field in fields[:5]
        ],
    }


class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        queryset = Field.objects.select_related("assigned_agent").prefetch_related("updates").order_by("-updated_at")
        return Response(summarize_fields(queryset))


class AgentDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = Field.objects.filter(assigned_agent=request.user).select_related("assigned_agent").prefetch_related("updates").order_by("-updated_at")
        summary = summarize_fields(queryset)
        summary["assigned_fields"] = summary.pop("total_fields")
        summary["recent_updates"] = [
            {
                "field": update.field.name,
                "stage": update.stage,
                "created_at": update.created_at,
                "notes": update.notes,
            }
            for update in request.user.field_updates.select_related("field").order_by("-created_at")[:5]
        ]
        return Response(summary)
