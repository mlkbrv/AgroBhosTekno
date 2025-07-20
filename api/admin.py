from django.contrib import admin
from .models import *
from users.models import *

admin.site.register(CropCategory)
admin.site.register(Farm)
admin.site.register(Crop)
admin.site.register(Machinery)
admin.site.register(Item)

