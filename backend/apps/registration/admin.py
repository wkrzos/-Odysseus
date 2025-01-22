from django.contrib import admin
from .models import ClientData, Trip, TripStage, StayOrganizer

@admin.register(ClientData)
class ClientDataAdmin(admin.ModelAdmin):
    list_display = ('name', 'surname', 'pesel', 'phone_number', 'email_address')

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('id', 'client_data')

@admin.register(TripStage)
class TripStageAdmin(admin.ModelAdmin):
    list_display = ('arrival_date', 'departure_date', 'trip', 'country')
    list_filter = ('country', 'trip')
    search_fields = ('trip__id', 'country__name')

@admin.register(StayOrganizer)
class StayOrganizerAdmin(admin.ModelAdmin):
    list_display = ('name', 'type')
