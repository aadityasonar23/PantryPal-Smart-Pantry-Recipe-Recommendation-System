from flask import Blueprint, jsonify, request
from datetime import date, timedelta

from db import get_db_connection


matching_bp = Blueprint(
    "matching",
    __name__,
    url_prefix="/api"
)


@matching_bp.route("/match-recipes/", methods=["POST"])
def match_recipes():

    connection = None
    cursor = None

    try:

        
        # 1. Get selected ingredients from React
        

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required"
            }), 400

        selected_ids = data.get(
            "ingredient_ids",
            []
        )

        if not isinstance(selected_ids, list):

            return jsonify({
                "success": False,
                "message": "ingredient_ids must be a list"
            }), 400

        selected_ids = {
            int(ingredient_id)
            for ingredient_id in selected_ids
        }


        
        # 2. Connect to PostgreSQL
        

        connection = get_db_connection()
        cursor = connection.cursor()


        
        # 3. Get all recipes + their ingredients
        

        cursor.execute("""
            SELECT
                r.id,
                r.name,
                r.image_url,
                ri.ingredient_id
            FROM recipes r
            JOIN recipe_ingredients ri
                ON r.id = ri.recipe_id
            ORDER BY r.id;
        """)

        rows = cursor.fetchall()


        recipes = {}


        for row in rows:

            recipe_id = row[0]
            recipe_name = row[1]
            image_url = row[2]
            ingredient_id = row[3]

            if recipe_id not in recipes:

                recipes[recipe_id] = {
                    "id": recipe_id,
                    "name": recipe_name,
                    "image_url": image_url,
                    "ingredient_ids": []
                }

            recipes[recipe_id][
                "ingredient_ids"
            ].append(ingredient_id)


        
        # 4. Get ingredient names
        

        cursor.execute("""
            SELECT
                id,
                name
            FROM ingredients;
        """)

        ingredient_rows = cursor.fetchall()

        ingredient_names = {
            row[0]: row[1]
            for row in ingredient_rows
        }


        
        # 5. Find ingredients that expire soon
        

        today = date.today()

        soon_date = today + timedelta(days=2)


        cursor.execute("""
            SELECT
                ingredient_id,
                expiry_date
            FROM pantry
            WHERE expiry_date IS NOT NULL
              AND expiry_date <= %s;
        """, (soon_date,))


        pantry_rows = cursor.fetchall()


        expiring_ids = {
            row[0]
            for row in pantry_rows
        }


        
        # 6. Calculate recipe matches
        

        results = []


        for recipe in recipes.values():

            required = set(
                recipe["ingredient_ids"]
            )

            if not required:
                continue


            matched = (
                required &
                selected_ids
            )


            missing = (
                required -
                selected_ids
            )


            match_percentage = round(
                (
                    len(matched) /
                    len(required)
                ) * 100
            )


            # Ingredients used by this recipe
            # that are also expiring soon

            expiring_used = (
                matched &
                expiring_ids
            )


            # 5 points for each expiring
            # ingredient, maximum 15 points

            expiry_bonus = min(
                len(expiring_used) * 5,
                15
            )


            final_score = min(
                match_percentage +
                expiry_bonus,
                100
            )


            matched_names = [
                ingredient_names[
                    ingredient_id
                ]
                for ingredient_id in matched
                if ingredient_id in ingredient_names
            ]


            missing_names = [
                ingredient_names[
                    ingredient_id
                ]
                for ingredient_id in missing
                if ingredient_id in ingredient_names
            ]


            expiring_names = [
                ingredient_names[
                    ingredient_id
                ]
                for ingredient_id in expiring_used
                if ingredient_id in ingredient_names
            ]


            results.append({

                "recipe_id":
                    recipe["id"],

                "recipe_name":
                    recipe["name"],

                "image_url":
                    recipe["image_url"],

                "match_percentage":
                    match_percentage,

                "final_score":
                    final_score,

                "matched_count":
                    len(matched),

                "matched_ingredients":
                    matched_names,

                "missing_ingredients":
                    missing_names,

                "expiring_used":
                    expiring_names

            })


        
        # 7. Sort highest score first
        

        results.sort(
            key=lambda recipe:
                recipe["final_score"],
            reverse=True
        )


        
        # 8. Return results
        

        return jsonify({
            "success": True,
            "count": len(results),
            "results": results
        })


    except ValueError:

        return jsonify({
            "success": False,
            "message": "Ingredient IDs must be numbers"
        }), 400


    except Exception as error:

        return jsonify({
            "success": False,
            "message": "Recipe matching failed",
            "error": str(error)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()