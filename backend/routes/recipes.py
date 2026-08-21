from flask import Blueprint, jsonify, request

from db import get_db_connection


recipes_bp = Blueprint(
    "recipes",
    __name__,
    url_prefix="/api/recipes"
)


@recipes_bp.route("/", methods=["GET"])
def get_recipes():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                id,
                name,
                description,
                image_url,
                cooking_time,
                difficulty
            FROM recipes
            ORDER BY id DESC;
        """)

        rows = cursor.fetchall()

        recipes = []

        for row in rows:

            recipes.append({
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "image_url": row[3],
                "cooking_time": row[4],
                "difficulty": row[5]
            })

        return jsonify(recipes)

    except Exception as error:

        return jsonify({
            "success": False,
            "message": "Failed to fetch recipes",
            "error": str(error)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


@recipes_bp.route("/<int:recipe_id>", methods=["GET"])
def get_recipe(recipe_id):

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                id,
                name,
                description,
                image_url,
                cooking_time,
                difficulty
            FROM recipes
            WHERE id = %s;
        """, (recipe_id,))

        recipe = cursor.fetchone()

        if recipe is None:

            return jsonify({
                "success": False,
                "message": "Recipe not found"
            }), 404

        cursor.execute("""
            SELECT
                i.id,
                i.name,
                ri.quantity
            FROM recipe_ingredients ri
            JOIN ingredients i
                ON ri.ingredient_id = i.id
            WHERE ri.recipe_id = %s
            ORDER BY i.name;
        """, (recipe_id,))

        ingredient_rows = cursor.fetchall()

        ingredients = []

        for row in ingredient_rows:

            ingredients.append({
                "id": row[0],
                "name": row[1],
                "quantity": row[2]
            })

        result = {
            "id": recipe[0],
            "name": recipe[1],
            "description": recipe[2],
            "image_url": recipe[3],
            "cooking_time": recipe[4],
            "difficulty": recipe[5],
            "ingredients": ingredients
        }

        return jsonify(result)

    except Exception as error:

        return jsonify({
            "success": False,
            "message": "Failed to fetch recipe",
            "error": str(error)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()