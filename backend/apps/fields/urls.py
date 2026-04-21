from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import FieldUpdatesListView, FieldViewSet


router = DefaultRouter()
router.register("fields", FieldViewSet, basename="field")

urlpatterns = [
    path("", include(router.urls)),
    path("fields/<int:pk>/updates/", FieldUpdatesListView.as_view(), name="field-updates"),
]
