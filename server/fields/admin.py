from django.contrib import admin

from fields.models import Field


class FieldAdmin(admin.ModelAdmin):
    list_display = ('name', 'acreage', 'group')
    list_filter = ['group']


admin.site.register(Field, FieldAdmin)
