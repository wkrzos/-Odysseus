from django.contrib import admin
from .models import Address, Country

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('street', 'building_number', 'locality')

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
