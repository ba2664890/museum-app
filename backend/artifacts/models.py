from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import FileExtensionValidator
import uuid
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image


class Period(models.Model):
    """Historical periods for artifacts"""
    name = models.CharField(max_length=100)
    start_year = models.IntegerField(null=True, blank=True)
    end_year = models.IntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name = _("Période historique")
        verbose_name_plural = _("Périodes historiques")
        ordering = ['start_year']
    
    def __str__(self):
        return self.name_fr


class Culture(models.Model):
    """Cultural groups/regions"""
    name = models.CharField(max_length=100, verbose_name=_("Nom"))
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name = _("Culture")
        verbose_name_plural = _("Cultures")
        ordering = ['name_fr']
    
    def __str__(self):
        return self.name_fr


class Collection(models.Model):
    """Artifact collections"""
    name = models.CharField(max_length=200, verbose_name=_("Nom"))
    description = models.TextField(blank=True)
    curator = models.CharField(max_length=100, verbose_name=_("Conservateur"))
    image = models.ImageField(
        upload_to='collections/',
        verbose_name=_("Image de collection"),
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _("Collection")
        verbose_name_plural = _("Collections")
        ordering = ['name_fr']
    
    def __str__(self):
        return self.name_fr


class Artifact(models.Model):
    """Main artifact model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inventory_number = models.CharField(max_length=50, unique=True, verbose_name=_("Numéro d'inventaire"))
    
    # Multilingual fields
    name = models.CharField(max_length=200, verbose_name=_("Nom"))
    description = models.TextField(blank=True)

    historical_context = models.TextField(blank=True)

    technique = models.CharField(max_length=200, verbose_name=_("Technique"))
    
    dimensions = models.CharField(max_length=100, verbose_name=_("Dimensions"))
    weight = models.CharField(max_length=50, verbose_name=_("Poids"), null=True, blank=True)
    material = models.CharField(max_length=100, verbose_name=_("Matériau"))

    
    # Relationships
    collection = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE,
        related_name='artifacts',
        verbose_name=_("Collection")
    )
    period = models.ForeignKey(
        Period,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='artifacts',
        verbose_name=_("Période")
    )
    culture = models.ForeignKey(
        Culture,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='artifacts',
        verbose_name=_("Culture")
    )
    
    # Media
    main_image = models.ImageField(
        upload_to='artifacts/',
        verbose_name=_("Image principale")
    )
    
    # QR Code
    qr_code = models.ImageField(
        upload_to='qr_codes/',
        verbose_name=_("Code QR"),
        blank=True,
        null=True
    )
    
    # Metadata
    acquisition_date = models.DateField(null=True, blank=True, verbose_name=_("Date d'acquisition"))
    acquisition_method = models.CharField(max_length=200, null=True, blank=True, verbose_name=_("Mode d'acquisition"))
    
    is_featured = models.BooleanField(default=False, verbose_name=_("Œuvre vedette"))
    is_on_display = models.BooleanField(default=True, verbose_name=_("Exposé au musée"))
    display_location = models.CharField(max_length=100, null=True, blank=True, verbose_name=_("Emplacement d'exposition"))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _("Œuvre")
        verbose_name_plural = _("Œuvres")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['inventory_number']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['is_on_display']),
        ]
    
    def __str__(self):
        return f"{self.inventory_number} - {self.name_fr}"
    
    def save(self, *args, **kwargs):
        # Generate QR code if it doesn't exist
        if not self.qr_code:
            self.generate_qr_code()
        super().save(*args, **kwargs)
    
    def generate_qr_code(self):
        """Generate QR code for the artifact"""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        artifact_url = f"https://museum-app.com/artifact/{self.id}"
        qr.add_data(artifact_url)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        filename = f'qr_{self.inventory_number}.png'
        self.qr_code.save(filename, File(buffer), save=False)


class ArtifactImage(models.Model):
    """Additional images for artifacts"""
    artifact = models.ForeignKey(
        Artifact,
        on_delete=models.CASCADE,
        related_name='additional_images',
        verbose_name=_("Œuvre")
    )
    image = models.ImageField(
        upload_to='artifacts/gallery/',
        verbose_name=_("Image")
    )
    caption = models.CharField(max_length=200, verbose_name=_("Légende"))
    order = models.PositiveIntegerField(default=0, verbose_name=_("Ordre d'affichage"))
    
    class Meta:
        verbose_name = _("Image supplémentaire")
        verbose_name_plural = _("Images supplémentaires")
        ordering = ['order']
    
    def __str__(self):
        return f"Image {self.order} - {self.artifact.name_fr}"


class AudioGuide(models.Model):
    """Audio guides for artifacts"""
    artifact = models.ForeignKey(
        Artifact,
        on_delete=models.CASCADE,
        related_name='audio_guides',
        verbose_name=_("Œuvre")
    )
    language = models.CharField(
        max_length=2,
        choices=[
            ('fr', 'Français'),
            ('en', 'English'),
            ('wo', 'Wolof'),
        ],
        verbose_name=_("Langue")
    )
    audio_file = models.FileField(
        upload_to='audio/guides/',
        validators=[FileExtensionValidator(allowed_extensions=['mp3', 'wav', 'm4a'])],
        verbose_name=_("Fichier audio")
    )
    duration = models.PositiveIntegerField(verbose_name=_("Durée (secondes)"))
    narrator = models.CharField(max_length=100, verbose_name=_("Narrateur"))
    transcript = models.TextField(verbose_name=_("Transcription"))
    
    class Meta:
        verbose_name = _("Audio guide")
        verbose_name_plural = _("Audios guides")
        unique_together = ['artifact', 'language']
        ordering = ['artifact', 'language']
    
    def __str__(self):
        return f"Audio {self.language.upper()} - {self.artifact.name_fr}"


class VideoContent(models.Model):
    """Video content for artifacts"""
    artifact = models.ForeignKey(
        Artifact,
        on_delete=models.CASCADE,
        related_name='videos',
        verbose_name=_("Œuvre")
    )
    title = models.CharField(max_length=200, verbose_name=_("Titre"))
    
    description = models.TextField(verbose_name=_("Description"))
    
    video_file = models.FileField(
        upload_to='videos/',
        validators=[FileExtensionValidator(allowed_extensions=['mp4', 'webm', 'ogg'])],
        verbose_name=_("Fichier vidéo"),
        null=True,
        blank=True
    )
    video_url = models.URLField(
        verbose_name=_("URL vidéo (YouTube/Vimeo)"),
        null=True,
        blank=True
    )
    duration = models.PositiveIntegerField(verbose_name=_("Durée (secondes)"))
    thumbnail = models.ImageField(
        upload_to='videos/thumbnails/',
        verbose_name=_("Vignette"),
        null=True,
        blank=True
    )
    
    video_type = models.CharField(
        max_length=20,
        choices=[
            ('documentary', 'Documentaire'),
            ('explanation', 'Explication'),
            ('interview', 'Interview'),
            ('animation', 'Animation'),
        ],
        verbose_name=_("Type de vidéo")
    )
    
    order = models.PositiveIntegerField(default=0, verbose_name=_("Ordre d'affichage"))
    is_published = models.BooleanField(default=True, verbose_name=_("Publié"))
    
    class Meta:
        verbose_name = _("Contenu vidéo")
        verbose_name_plural = _("Contenus vidéo")
        ordering = ['order']
    
    def __str__(self):
        return f"Vidéo - {self.title_fr}"


class MuseumVisit(models.Model):
    """Track virtual visits"""
    session_id = models.CharField(max_length=100, verbose_name=_("ID de session"))
    artifact = models.ForeignKey(
        Artifact,
        on_delete=models.CASCADE,
        related_name='visits',
        verbose_name=_("Œuvre visitée")
    )
    language = models.CharField(
        max_length=2,
        choices=[
            ('fr', 'Français'),
            ('en', 'English'),
            ('wo', 'Wolof'),
        ],
        verbose_name=_("Langue utilisée")
    )
    duration_seconds = models.PositiveIntegerField(default=0, verbose_name=_("Durée de visite (secondes)"))
    visited_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _("Visite")
        verbose_name_plural = _("Visites")
        ordering = ['-visited_at']
        indexes = [
            models.Index(fields=['session_id']),
            models.Index(fields=['visited_at']),
        ]
    
    def __str__(self):
        return f"Visite - {self.artifact.name_fr} ({self.language})"