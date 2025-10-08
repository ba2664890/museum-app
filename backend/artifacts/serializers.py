from rest_framework import serializers
from .models import (
    Period, Culture, Collection, Artifact, 
    ArtifactImage, AudioGuide, VideoContent, MuseumVisit
)


class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = ['id', 'name', 'start_year', 'end_year', 'description']


class CultureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Culture
        fields = ['id', 'name', 'description']


class CollectionSerializer(serializers.ModelSerializer):
    artifact_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Collection
        fields = ['id', 'name', 'description', 'curator', 'image', 'artifact_count', 'created_at']
    
    def get_artifact_count(self, obj):
        return obj.artifacts.filter(is_on_display=True).count()


class ArtifactImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtifactImage
        fields = ['id', 'image', 'caption', 'order']


class AudioGuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioGuide
        fields = ['id', 'language', 'audio_file', 'duration', 'narrator', 'transcript']


class VideoContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoContent
        fields = ['id', 'title', 'description', 'video_file', 'video_url', 
                 'duration', 'thumbnail', 'video_type', 'order']


class ArtifactListSerializer(serializers.ModelSerializer):
    collection_name = serializers.CharField(source='collection.name', read_only=True)
    period_name = serializers.CharField(source='period.name', read_only=True)
    culture_name = serializers.CharField(source='culture.name', read_only=True)
    qr_code = serializers.ImageField(read_only=True)
    
    class Meta:
        model = Artifact
        fields = [
            'id', 'inventory_number', 'qr_code','name', 'main_image', 'collection_name',
            'period_name', 'culture_name', 'is_featured', 'is_on_display' , 
        ]


class ArtifactDetailSerializer(serializers.ModelSerializer):
    collection = CollectionSerializer(read_only=True)
    period = PeriodSerializer(read_only=True)
    culture = CultureSerializer(read_only=True)
    additional_images = ArtifactImageSerializer(many=True, read_only=True)
    audio_guides = AudioGuideSerializer(many=True, read_only=True)
    videos = VideoContentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Artifact
        fields = [
            'id', 'inventory_number', 'name', 'description', 'historical_context',
            'technique', 'dimensions', 'weight', 'material', 'main_image',
            'collection', 'period', 'culture', 'additional_images', 'audio_guides',
            'videos', 'acquisition_date', 'acquisition_method', 'display_location',
            'is_featured', 'is_on_display', 'created_at', 'updated_at'
        ]


class ArtifactSearchSerializer(serializers.ModelSerializer):
    collection_name = serializers.CharField(source='collection.name', read_only=True)
    
    class Meta:
        model = Artifact
        fields = [
            'id', 'inventory_number', 'name', 'description', 'main_image',
            'collection_name', 'is_featured'
        ]


class FeaturedArtifactSerializer(serializers.ModelSerializer):
    collection_name = serializers.CharField(source='collection.name', read_only=True)
    
    class Meta:
        model = Artifact
        fields = [
            'id', 'name', 'description', 'main_image', 'collection_name'
        ]


class MuseumVisitSerializer(serializers.ModelSerializer):
    artifact_name = serializers.CharField(source='artifact.name', read_only=True)
    
    class Meta:
        model = MuseumVisit
        fields = ['id', 'session_id', 'artifact', 'artifact_name', 
                 'language', 'duration_seconds', 'visited_at']


class QRCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artifact
        fields = ['id', 'inventory_number', 'qr_code', 'name']