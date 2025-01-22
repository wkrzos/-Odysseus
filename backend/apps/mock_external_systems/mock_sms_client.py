# sms_system/mock_sms_client.py
def send_sms(country_name: str, message: str) -> bool:
    """
    A mock SMS sending function. 
    Returns True if "sent" successfully, False if not.
    """
    # For demonstration, just print or do something trivial:
    print(f"[MOCK] Sending SMS to {country_name}. Message: '{message}'")
    # We can always return True to simulate success.
    return True