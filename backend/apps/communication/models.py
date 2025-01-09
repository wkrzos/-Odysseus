from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.common.models import BaseModel
from apps.consulate.models import ConsulateEmployee

class MessageStatus(models.TextChoices):
    SENT = 'sent', _('Sent')
    NOT_SENT = 'notSent', _('Not Sent')

class Message(BaseModel):
    content = models.TextField()
    date = models.DateField(auto_now_add=True)
    recipients = models.ManyToManyField('Recipient', related_name='messages')
    author = models.ForeignKey(
        ConsulateEmployee,
        on_delete=models.CASCADE,
        related_name='messages'
    )

class Recipient(BaseModel):
    status = models.CharField(
        max_length=10,
        choices=MessageStatus.choices,
        default=MessageStatus.NOT_SENT
    )
    phone_number = models.CharField(max_length=20)
