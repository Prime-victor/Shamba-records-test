from django.urls import path

from .views import AgentListView, LoginView, MeView, RegisterView


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
    path("agents/", AgentListView.as_view(), name="agents-list"),
]
