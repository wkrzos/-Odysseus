from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientDataViewSet, TripStageListView, TripStageReportView,TripWarningByCountryView,TripCreateView

router = DefaultRouter()
router.register(r'clientdata', ClientDataViewSet, basename='clientdata')

urlpatterns = [
    path('',include(router.urls)),
    path('trip-stages/', TripStageListView.as_view(), name='trip-stages'),
    path('trip-stages/report/', TripStageReportView.as_view(), name='trip-stage-report'),
    path('trip/trip-warning/<int:country_id>/',TripWarningByCountryView.as_view(),name='trip-warning-by-country'),
    path('trip/create/',TripCreateView.as_view(),name='create'),
]