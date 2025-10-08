#!/usr/bin/env python3
import os
import django
import json
from pathlib import Path
from django.core.files import File

# Configure Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "museum_api.settings")  # <- ton settings
django.setup()

from artifacts.models import Period, Culture, Collection, Artifact

DATA_JSON = Path("data/sample_data.json")

def load_json():
    with open(DATA_JSON, "r", encoding="utf-8") as f:
        return json.load(f)

def main():
    data = load_json()

    # Périodes historiques
    for period in data.get("periods", []):
        obj, created = Period.objects.get_or_create(
            name_fr=period["name_fr"],
            defaults={
                "name_en": period.get("name_en"),
                "name_wo": period.get("name_wo"),
                "description_fr": period.get("description_fr"),
                "description_en": period.get("description_en"),
                "description_wo": period.get("description_wo"),
                "start_year": period.get("start_year"),
                "end_year": period.get("end_year"),
            },
        )
        print(f"{'Créé' if created else 'Existant'}: Period {obj.name_fr}")

    # Cultures
    for culture in data.get("cultures", []):
        obj, created = Culture.objects.get_or_create(
            name_fr=culture["name_fr"],
            defaults={
                "name_en": culture.get("name_en"),
                "name_wo": culture.get("name_wo"),
                "description_fr": culture.get("description_fr"),
                "description_en": culture.get("description_en"),
                "description_wo": culture.get("description_wo"),
            },
        )
        print(f"{'Créé' if created else 'Existant'}: Culture {obj.name_fr}")

    # Collections
    for collection in data.get("collections", []):
        obj, created = Collection.objects.get_or_create(
            name_fr=collection["name_fr"],
            defaults={
                "name_en": collection.get("name_en"),
                "name_wo": collection.get("name_wo"),
                "description_fr": collection.get("description_fr"),
                "description_en": collection.get("description_en"),
                "description_wo": collection.get("description_wo"),
                "curator_fr": collection.get("curator_fr", "Inconnu"),
                "curator_en": collection.get("curator_en", ""),
                "curator_wo": collection.get("curator_wo", ""),
            },
        )

        # Gérer l'image si elle existe
        if "image" in collection and collection["image"]:
            img_path = Path("data/images") / Path(collection["image"]).name
            if img_path.exists():
                with open(img_path, "rb") as f:
                    obj.image.save(img_path.name, File(f), save=True)
        print(f"{'Créé' if created else 'Existant'}: Collection {obj.name_fr}")

    # Artefacts
    for artifact in data.get("artifacts", []):
        collection_obj = Collection.objects.get(pk=artifact["collection"])
        period_obj = Period.objects.get(pk=artifact["period"])
        culture_obj = Culture.objects.get(pk=artifact["culture"])

        obj, created = Artifact.objects.get_or_create(
            inventory_number=artifact["inventory_number"],
            defaults={
                "name_fr": artifact.get("name_fr"),
                "name_en": artifact.get("name_en"),
                "name_wo": artifact.get("name_wo"),
                "description_fr": artifact.get("description_fr", ""),
                "description_en": artifact.get("description_en", ""),
                "description_wo": artifact.get("description_wo", ""),
                "historical_context_fr": artifact.get("historical_context_fr", ""),
                "historical_context_en": artifact.get("historical_context_en", ""),
                "historical_context_wo": artifact.get("historical_context_wo", ""),
                "technique_fr": artifact.get("technique_fr", ""),
                "technique_en": artifact.get("technique_en", ""),
                "technique_wo": artifact.get("technique_wo", ""),
                "dimensions": artifact.get("dimensions", ""),
                "weight": artifact.get("weight", ""),
                "material_fr": artifact.get("material_fr", ""),
                "material_en": artifact.get("material_en", ""),
                "material_wo": artifact.get("material_wo", ""),
                "collection": collection_obj,
                "period": period_obj,
                "culture": culture_obj,
                "is_featured": artifact.get("is_featured", False),
                "is_on_display": artifact.get("is_on_display", True),
                "display_location": artifact.get("display_location", ""),
            },
        )

        # Ajouter l'image principale
        if "main_image" in artifact and artifact["main_image"]:
            img_path = Path("data/images") / Path(artifact["main_image"]).name
            if img_path.exists():
                with open(img_path, "rb") as f:
                    obj.main_image.save(img_path.name, File(f), save=True)

        print(f"{'Créé' if created else 'Existant'}: Artifact {obj.inventory_number} - {obj.name_fr}")

if __name__ == "__main__":
    main()
