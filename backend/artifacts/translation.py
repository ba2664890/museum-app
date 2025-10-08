from modeltranslation.translator import translator, TranslationOptions
from .models import (
    Period, Culture, Collection, Artifact, 
    ArtifactImage, AudioGuide, VideoContent
)


class PeriodTranslationOptions(TranslationOptions):
    fields = ('name', 'description')


class CultureTranslationOptions(TranslationOptions):
    fields = ('name', 'description')


class CollectionTranslationOptions(TranslationOptions):
    fields = ('name', 'description', 'curator')


class ArtifactTranslationOptions(TranslationOptions):
    fields = (
        'name', 'description', 'historical_context', 
        'technique', 'material', 'acquisition_method'
    )


class ArtifactImageTranslationOptions(TranslationOptions):
    fields = ('caption',)


class AudioGuideTranslationOptions(TranslationOptions):
    fields = ('narrator', 'transcript')


class VideoContentTranslationOptions(TranslationOptions):
    fields = ('title', 'description')


translator.register(Period, PeriodTranslationOptions)
translator.register(Culture, CultureTranslationOptions)
translator.register(Collection, CollectionTranslationOptions)
translator.register(Artifact, ArtifactTranslationOptions)
translator.register(ArtifactImage, ArtifactImageTranslationOptions)
translator.register(AudioGuide, AudioGuideTranslationOptions)
translator.register(VideoContent, VideoContentTranslationOptions)