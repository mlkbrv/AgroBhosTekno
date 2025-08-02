from rest_framework import serializers
from .models import Location

class LocationSerializer(serializers.ModelSerializer):
    farm = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = [
            'farm',
            'lon',
            'lat'
        ]

    def get_farm(self, obj):
        return {
            'name' : obj.farm.name,
            'description' : obj.farm.description,
            'address' : obj.farm.address,
            'image' : obj.farm.image,
        }