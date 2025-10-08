from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.db import models
from django.utils.translation import get_language
from django.db.models import Count
from .models import (
    Period, Culture, Collection, Artifact, 
    ArtifactImage, AudioGuide, VideoContent, MuseumVisit
)
from .serializers import (
    PeriodSerializer, CultureSerializer, CollectionSerializer,
    ArtifactListSerializer, ArtifactDetailSerializer, ArtifactSearchSerializer,
    FeaturedArtifactSerializer, AudioGuideSerializer, VideoContentSerializer,
    MuseumVisitSerializer, QRCodeSerializer
)



class PeriodViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Period.objects.all()
    serializer_class = PeriodSerializer
    permission_classes = [AllowAny]


class CultureViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Culture.objects.all()
    serializer_class = CultureSerializer
    permission_classes = [AllowAny]


class CollectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name_fr', 'name_en', 'name_wo']


class ArtifactViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Artifact.objects.filter(is_on_display=True)
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['collection', 'period', 'culture', 'is_featured']
    search_fields = [
        'name_fr', 'name_en', 'name_wo',
        'description_fr', 'description_en', 'description_wo',
        'inventory_number'
    ]
    ordering_fields = ['created_at', 'name_fr', 'name_en', 'name_wo']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ArtifactListSerializer
        elif self.action == 'search':
            return ArtifactSearchSerializer
        elif self.action == 'featured':
            return FeaturedArtifactSerializer
        return ArtifactDetailSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by language preference
        language = self.request.query_params.get('lang', get_language())
        if language in ['fr', 'en', 'wo']:
            # This would need proper implementation with modeltranslation
            pass
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced search endpoint"""
        query = request.query_params.get('q', '')
        period = request.query_params.get('period')
        culture = request.query_params.get('culture')
        collection = request.query_params.get('collection')
        
        artifacts = self.get_queryset()
        
        if query:
            artifacts = artifacts.filter(
                Q(name_fr__icontains=query) |
                Q(name_en__icontains=query) |
                Q(name_wo__icontains=query) |
                Q(description_fr__icontains=query) |
                Q(description_en__icontains=query) |
                Q(description_wo__icontains=query) |
                Q(inventory_number__icontains=query)
            )
        
        if period:
            artifacts = artifacts.filter(period_id=period)
        if culture:
            artifacts = artifacts.filter(culture_id=culture)
        if collection:
            artifacts = artifacts.filter(collection_id=collection)
        
        page = self.paginate_queryset(artifacts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(artifacts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured artifacts"""
        featured = self.get_queryset().filter(is_featured=True)[:10]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def track_visit(self, request, pk=None):
        """Track artifact visit"""
        artifact = self.get_object()
        session_id = request.data.get('session_id')
        language = request.data.get('language', 'fr')
        duration = request.data.get('duration_seconds', 0)
        
        if not session_id:
            return Response(
                {'error': 'session_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        visit = MuseumVisit.objects.create(
            session_id=session_id,
            artifact=artifact,
            language=language,
            duration_seconds=duration
        )
        
        serializer = MuseumVisitSerializer(visit)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AudioGuideViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AudioGuide.objects.all()
    serializer_class = AudioGuideSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['artifact', 'language']


class VideoContentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VideoContent.objects.filter(is_published=True)
    serializer_class = VideoContentSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['artifact', 'video_type']


class QRScannerViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    

    @action(detail=False, methods=['get','post'])
    def scan(self, request):
        """Handle QR code scanning"""
        qr_data = request.data.get('qr_data')
        
        if not qr_data:
            return Response(
                {'error': 'QR code data is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Try to extract artifact ID from QR data
        # This depends on how the QR code was generated
        try:
            # Assuming QR contains URL like https://museum-app.com/artifact/{id}
            if '/artifact/' in qr_data:
                artifact_id = qr_data.split('/artifact/')[-1].split('/')[0]
                artifact = Artifact.objects.get(id=artifact_id, is_on_display=True)
                serializer = ArtifactDetailSerializer(artifact)
                return Response(serializer.data)
            else:
                # Try direct ID match
                artifact = Artifact.objects.get(id=qr_data, is_on_display=True)
                serializer = ArtifactDetailSerializer(artifact)
                return Response(serializer.data)
        except Artifact.DoesNotExist:
            return Response(
                {'error': 'Artifact not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Invalid QR code: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class MuseumStatsViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get museum statistics for dashboard"""
        total_artifacts = Artifact.objects.filter(is_on_display=True).count()
        total_collections = Collection.objects.count()
        featured_artifacts = Artifact.objects.filter(is_on_display=True, is_featured=True).count()
        total_visits = MuseumVisit.objects.count()
        
        # Most visited artifacts
        most_visited = Artifact.objects.filter(
            is_on_display=True
        ).annotate(
            visit_count=models.Count('visits')
        ).order_by('-visit_count')[:5]
        
        # Recent visits
        recent_visits = MuseumVisit.objects.order_by('-visited_at')[:10]
        
        return Response({
            'stats': {
                'total_artifacts': total_artifacts,
                'total_collections': total_collections,
                'featured_artifacts': featured_artifacts,
                'total_visits': total_visits
            },
            'most_visited': [
                {
                    'id': artifact.id,
                    'name': artifact.name,
                    'visit_count': artifact.visit_count
                } for artifact in most_visited
            ],
            'recent_visits': MuseumVisitSerializer(recent_visits, many=True).data
        })