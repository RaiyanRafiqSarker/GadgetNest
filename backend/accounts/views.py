from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, RegisterSerializer


class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

        if serializer.is_valid():

            user = serializer.save()

            return Response(
                {
                    "message": "Account created successfully.",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data
        )

        if serializer.is_valid():

            user = serializer.validated_data["user"]

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Login successful.",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                    "access": str(
                        refresh.access_token
                    ),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user
        profile = user.profile

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": profile.first_name,
                "last_name": profile.last_name,
                "phone_number": profile.phone_number,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request):

        user = request.user
        profile = user.profile

        first_name = request.data.get(
            "first_name",
            profile.first_name
        )

        last_name = request.data.get(
            "last_name",
            profile.last_name
        )

        profile.first_name = first_name
        profile.last_name = last_name

        profile.save(
            update_fields=[
                "first_name",
                "last_name",
            ]
        )

        return Response(
            {
                "message": "Profile updated successfully.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": profile.first_name,
                    "last_name": profile.last_name,
                    "phone_number": profile.phone_number,
                },
            },
            status=status.HTTP_200_OK,
        )