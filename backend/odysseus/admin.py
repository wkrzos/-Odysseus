from django.contrib import admin
from .models import Address, Country, Trip, TripStage, StayOrganizer, ClientData

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('street', 'building_number', 'locality')

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('id', 'client_data')

@admin.register(StayOrganizer)
class StayOrganizerAdmin(admin.ModelAdmin):
    list_display = ('name', 'type')

@admin.register(TripStage)
class TripStageAdmin(admin.ModelAdmin):
    list_display = ('arrival_date', 'departure_date', 'trip', 'country')
    list_filter = ('country', 'trip')
    search_fields = ('trip__id', 'country__name')

@admin.register(ClientData)
class ClientDataAdmin(admin.ModelAdmin):
    list_display = ('name', 'surname', 'pesel', 'phone_number', 'email_address')
