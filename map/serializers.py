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
        try:
            # Получаем полный URL для изображения
            image_url = None
            if obj.farm.image:
                request = self.context.get('request')
                if request:
                    image_url = request.build_absolute_uri(obj.farm.image.url)
                else:
                    # Если нет request, используем базовый URL
                    image_url = f"http://192.168.1.70:8000{obj.farm.image.url}"
            
            return {
                'name': obj.farm.name,
                'description': obj.farm.description,
                'address': obj.farm.address,
                'image': image_url,
            }
        except Exception as e:
            print(f"Ошибка сериализации фермы: {e}")
            return {
                'name': 'Неизвестная ферма',
                'description': 'Описание недоступно',
                'address': 'Адрес недоступен',
                'image': None,
            }