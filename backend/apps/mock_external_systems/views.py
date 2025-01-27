# sms_system/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mock_sms_client import send_sms
class SendSMSView(APIView):
    """
    POST /send-sms/
    {
      "message": "Hello from the consulate!",
      "country": "Poland"
    }
    """
    def post(self, request):
        data = request.data
        message = data.get("message")
        country = data.get("country")
        # Basic validation
        if not message or len(message) > 160:
            return Response(
                {"error": "Invalid message. Must be 1-160 characters."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not country:
            return Response(
                {"error": "Country is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # "Mock" sending SMS
        success = send_sms(country, message)
        if success:
            return Response(
                {"message": "SMS sent successfully."},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Failed to send SMS."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )