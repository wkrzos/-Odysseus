from django.urls import path
from .views import TripStageListView, TripStageReportView

urlpatterns = [
    path('trip-stages/', TripStageListView.as_view(), name='trip-stages'),
    path('trip-stages/report/', TripStageReportView.as_view(), name='trip-stage-report'),
]
