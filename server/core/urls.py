from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from api import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r'fields', views.FieldViewSet, basename='field')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # Include router URLs for DRF viewsets
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/current-user/', views.CurrentUserView.as_view()),
    path('api/csv-upload/', views.UploadCSVView.as_view(), name='csv-upload'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Field Tracker Admin"
admin.site.site_title = "Field Tracker Admin"
admin.site.index_title = "Field Tracker Administration"
