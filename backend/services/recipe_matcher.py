from datetime import date


def calculate_recipe_matches(
    recipes,
    selected_ingredient_ids,
    expiring_ingredient_ids=None
):

    if expiring_ingredient_ids is None:
        expiring_ingredient_ids = set()

    selected_ingredient_ids = set(
        selected_ingredient_ids
    )

    expiring_ingredient_ids = set(
        expiring_ingredient_ids
    )

    results = []

    for recipe in recipes:

        required = set(
            recipe["ingredient_ids"]
        )

        if not required:
            continue

        matched = (
            required &
            selected_ingredient_ids
        )

        missing = (
            required -
            selected_ingredient_ids
        )

        match_percentage = round(
            len(matched) /
            len(required) *
            100
        )

        expiring_used = (
            matched &
            expiring_ingredient_ids
        )

        expiry_bonus = min(
            len(expiring_used) * 5,
            15
        )

        final_score = min(
            match_percentage +
            expiry_bonus,
            100
        )

        results.append({

            "recipe_id":
                recipe["id"],

            "recipe_name":
                recipe["name"],

            "image_url":
                recipe.get("image_url"),

            "match_percentage":
                match_percentage,

            "final_score":
                final_score,

            "matched_count":
                len(matched),

            "matched_ingredients":
                list(matched),

            "missing_ingredients":
                list(missing),

            "expiring_used":
                list(expiring_used)

        })


    results.sort(
        key=lambda recipe:
            recipe["final_score"],
        reverse=True
    )

    return results