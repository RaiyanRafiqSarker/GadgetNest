from django.test import TestCase

from .serializers import RegisterSerializer


class RegisterSerializerPasswordValidationTests(TestCase):
    def test_password_requires_length_and_case_and_number(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "phone_number": "+8801700000000",
            "password": "pass123",
            "retype_password": "pass123",
        }

        serializer = RegisterSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)
        self.assertTrue(
            any(
                "at least 9 characters" in message.lower()
                or "uppercase" in message.lower()
                or "lowercase" in message.lower()
                or "number" in message.lower()
                for message in serializer.errors["password"]
            )
        )
