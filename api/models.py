from django.db import models
from users.models import User

class CropCategory(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Farm(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='farms/', null=True, blank=True)
    owner = models.ForeignKey(User,on_delete=models.CASCADE)
    address = models.TextField(null=False   , blank=False)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Crop(models.Model):
    name = models.CharField(max_length=255,null=False,blank=False)
    category = models.ForeignKey(CropCategory,on_delete=models.CASCADE,null=False,blank=False)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='crops/', null=True, blank=True)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name="crops")
    stock = models.IntegerField(null=False,blank=False)
    predicted_yield = models.FloatField(null=True,blank=True)
    price = models.FloatField(null=True,blank=True)
    
    class Meta:
        ordering = ['name']
    
    @property
    def in_stock(self):
        return self.stock > 0

    def __str__(self):
        return f"{self.name} from farm {self.farm.name} of {self.farm.owner.get_full_name()}"


class Item(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='items/', null=True, blank=True)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name="items")
    stock = models.IntegerField(null=False, blank=False)
    price = models.FloatField(null=True, blank=True)
    is_new = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    @property
    def in_stock(self):
        return self.stock > 0

    def __str__(self):
        return f"{self.name} from farm {self.farm.name} of {self.farm.owner.get_full_name()}"


class Machinery(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    producer = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='machines/', null=True, blank=True)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name="machines")
    stock = models.IntegerField(null=False, blank=False)
    price = models.FloatField(null=True, blank=True)
    is_new = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    @property
    def in_stock(self):
        return self.stock > 0

    def __str__(self):
        return f"{self.name} from farm {self.farm.name} of {self.farm.owner.get_full_name()}"

