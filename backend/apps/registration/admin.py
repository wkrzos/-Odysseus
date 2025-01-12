from django.contrib import admin
from .models import ClientData

@admin.register(ClientData)
class ClientDataAdmin(admin.ModelAdmin):
    list_display = ('name', 'surname', 'pesel', 'phone_number', 'email_address')
