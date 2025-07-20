from rest_framework import serializers
from .models import User


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True,required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = [
            'email',
            'first_name',
            'last_name',
            'is_business_owner',
            'password',
            'password2',
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError('Passwords don\'t match')
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_business_owner=validated_data['is_business_owner'],
        )
        return user


