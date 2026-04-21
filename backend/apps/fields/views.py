from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.users.permissions import IsAdminUserRole

from .models import Field, FieldUpdate
from .serializers import (
    AssignFieldSerializer,
    CreateFieldUpdateSerializer,
    FieldSerializer,
    FieldUpdateSerializer,
)


class FieldViewSet(viewsets.ModelViewSet):
    serializer_class = FieldSerializer

    def get_queryset(self):
        queryset = Field.objects.select_related("assigned_agent").prefetch_related("updates")
        if self.request.user.role == "agent":
            return queryset.filter(assigned_agent=self.request.user)
        return queryset

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "assign"]:
            return [permissions.IsAuthenticated(), IsAdminUserRole()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=["patch"], url_path="assign")
    def assign(self, request, pk=None):
        field = self.get_object()
        serializer = AssignFieldSerializer(field, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(FieldSerializer(field, context={"request": request}).data)

    @action(detail=True, methods=["post"], url_path="update")
    def update_field(self, request, pk=None):
        field = self.get_object()
        if request.user.role != "agent":
            return Response({"detail": "Only agents can create field updates."}, status=status.HTTP_403_FORBIDDEN)
        if field.assigned_agent_id != request.user.id:
            return Response({"detail": "You can only update assigned fields."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CreateFieldUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        update = serializer.save(field=field, agent=request.user)
        field.stage = update.stage
        field.save(update_fields=["stage", "updated_at"])
        return Response(FieldUpdateSerializer(update).data, status=status.HTTP_201_CREATED)


class FieldUpdatesListView(generics.ListAPIView):
    serializer_class = FieldUpdateSerializer

    def get_queryset(self):
        field = get_object_or_404(Field, pk=self.kwargs["pk"])
        if self.request.user.role == "agent" and field.assigned_agent_id != self.request.user.id:
            return FieldUpdate.objects.none()
        return FieldUpdate.objects.filter(field=field).select_related("agent", "field")
