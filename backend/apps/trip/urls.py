from rest_framework.routers import DefaultRouter
from django.urls import path,include
from .views import TripStageListView, TripStageReportView,TripWarningByCountryView,TripViewSet

router = DefaultRouter()
router.register('trip',TripViewSet,basename='trip')

urlpatterns = [
    path('trip-stages/', TripStageListView.as_view(), name='trip-stages'),
    path('trip-stages/report/', TripStageReportView.as_view(), name='trip-stage-report'),
    path('trip-warning/<int:country_id>/',TripWarningByCountryView.as_view(),name='trip-warning-by-country'),
    path('',include(router.urls))
]
