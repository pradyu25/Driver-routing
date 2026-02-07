
from django.urls import path
from .views import TripPlanView, TripDetailView

urlpatterns = [
    path('plan/', TripPlanView.as_view(), name='trip-plan'),
    path('search/', LocationSearchView.as_view(), name='location-search'),
    path('<int:pk>/', TripDetailView.as_view(), name='trip-detail'),
]
