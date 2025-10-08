from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from .models import (
    Period, Culture, Collection, Artifact, 
    ArtifactImage, AudioGuide, VideoContent, MuseumVisit
)


@admin.register(Period)
class PeriodAdmin(admin.ModelAdmin):
    list_display = ['name_fr', 'start_year', 'end_year']
    search_fields = ['name_fr', 'name_en', 'name_wo']
    list_filter = ['start_year', 'end_year']


@admin.register(Culture)
class CultureAdmin(admin.ModelAdmin):
    list_display = ['name_fr']
    search_fields = ['name_fr', 'name_en', 'name_wo']


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ['name_fr', 'curator_fr', 'artifact_count', 'created_at']
    search_fields = ['name_fr', 'name_en', 'name_wo', 'curator_fr']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    def artifact_count(self, obj):
        return obj.artifacts.count()
    artifact_count.short_description = _("Nombre d'œuvres")


class ArtifactImageInline(admin.TabularInline):
    model = ArtifactImage
    extra = 1
    fields = ['image', 'caption_fr', 'order']


class AudioGuideInline(admin.TabularInline):
    model = AudioGuide
    extra = 1
    fields = ['language', 'audio_file', 'duration', 'narrator_fr']


class VideoContentInline(admin.TabularInline):
    model = VideoContent
    extra = 1
    fields = ['title_fr', 'video_type', 'video_file', 'video_url', 'order', 'is_published']


@admin.register(Artifact)
class ArtifactAdmin(admin.ModelAdmin):
    list_display = [
        'inventory_number', 'name_fr', 'collection', 'period', 
        'is_featured', 'is_on_display', 'main_image_preview'
    ]
    list_filter = [
        'is_featured', 'is_on_display', 'collection', 'period', 
        'culture', 'created_at'
    ]
    search_fields = [
        'inventory_number', 'name_fr', 'name_en', 'name_wo',
        'description_fr', 'description_en', 'description_wo'
    ]
    readonly_fields = ['id', 'qr_code_preview', 'created_at', 'updated_at']
    
    fieldsets = (
        (_("Informations principales"), {
            'fields': ('inventory_number', 'id', 'name_fr', 'name_en', 'name_wo')
        }),
        (_("Descriptions"), {
            'fields': (
                'description_fr', 'description_en', 'description_wo',
                'historical_context_fr', 'historical_context_en', 'historical_context_wo'
            )
        }),
        (_("Caractéristiques techniques"), {
            'fields': (
                'technique_fr', 'technique_en', 'technique_wo',
                'material_fr', 'material_en', 'material_wo',
                'dimensions', 'weight'
            )
        }),
        (_("Relations"), {
            'fields': ('collection', 'period', 'culture')
        }),
        (_("Médias"), {
            'fields': ('main_image', 'qr_code_preview')
        }),
        (_("Informations d'exposition"), {
            'fields': (
                'is_featured', 'is_on_display', 'display_location',
                'acquisition_date', 'acquisition_method_fr', 
                'acquisition_method_en', 'acquisition_method_wo'
            )
        }),
        (_("Métadonnées"), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    inlines = [ArtifactImageInline, AudioGuideInline, VideoContentInline]
    
    def main_image_preview(self, obj):
        if obj.main_image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover;" />',
                obj.main_image.url
            )
        return _("Pas d'image")
    main_image_preview.short_description = _("Aperçu")
    
    def qr_code_preview(self, obj):
        if obj.qr_code:
            return format_html(
                '<img src="{}" style="width: 200px; height: 200px;" /><br>'
                '<a href="{}" target="_blank">{}</a>',
                obj.qr_code.url,
                obj.qr_code.url,
                _("Télécharger")
            )
        return _("Pas de code QR")
    qr_code_preview.short_description = _("Code QR")


@admin.register(ArtifactImage)
class ArtifactImageAdmin(admin.ModelAdmin):
    list_display = ['artifact', 'caption_fr', 'order']
    list_filter = ['artifact__collection']
    search_fields = ['artifact__name_fr', 'caption_fr']


@admin.register(AudioGuide)
class AudioGuideAdmin(admin.ModelAdmin):
    list_display = ['artifact', 'language', 'duration', 'narrator_fr']
    list_filter = ['language', 'artifact__collection']
    search_fields = ['artifact__name_fr', 'narrator_fr']


@admin.register(VideoContent)
class VideoContentAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'artifact', 'video_type', 'duration', 'is_published']
    list_filter = ['video_type', 'is_published', 'artifact__collection']
    search_fields = ['title_fr', 'title_en', 'title_wo']


@admin.register(MuseumVisit)
class MuseumVisitAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'artifact', 'language', 'duration_seconds', 'visited_at']
    list_filter = ['language', 'visited_at']
    search_fields = ['session_id', 'artifact__name_fr']
    readonly_fields = ['visited_at']
    date_hierarchy = 'visited_at'