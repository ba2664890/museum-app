from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PeriodViewSet, CultureViewSet, CollectionViewSet,
    ArtifactViewSet, AudioGuideViewSet, VideoContentViewSet,
    QRScannerViewSet, MuseumStatsViewSet
)

router = DefaultRouter()
router.register(r'periods', PeriodViewSet, basename='period')
router.register(r'cultures', CultureViewSet, basename='culture')
router.register(r'collections', CollectionViewSet, basename='collection')
router.register(r'artifacts', ArtifactViewSet, basename='artifact')
router.register(r'audio-guides', AudioGuideViewSet, basename='audio-guide')
router.register(r'videos', VideoContentViewSet, basename='video')

urlpatterns = [
    path('', include(router.urls)),
    path('qr-scan/', QRScannerViewSet.as_view({'post': 'scan'}), name='qr-scan'),
    path('stats/dashboard/', MuseumStatsViewSet.as_view({'get': 'dashboard'}), name='stats-dashboard'),
]