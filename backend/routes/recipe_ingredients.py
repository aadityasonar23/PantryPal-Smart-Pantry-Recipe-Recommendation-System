from flask import Blueprint, jsonify, request
from db import get_db_connection


recipe_ingredients_bp = Blueprint(
    "recipe_ingredients",
    __name__,
    url_prefix="/api/recipe-ingredients"
)

@recipe_ingredients_bp.route(
    "/recipe/<int:recipe_id>",
    methods=["GET"]
)
def get_recipe_ingredients(recipe_id):

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

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

        rows = cursor.fetchall()

        ingredients = []

        for row in rows:
            ingredients.append({
                "id": row[0],
                "name": row[1],
                "quantity": row[2]
            })

        return jsonify(ingredients)

    except Exception as error:

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

@recipe_ingredients_bp.route(
    "/",
    methods=["POST"]
)
def add_recipe_ingredient():

    data = request.get_json()

    recipe_id = data.get("recipe_id")
    ingredient_id = data.get("ingredient_id")
    quantity = data.get("quantity")

    if not recipe_id or not ingredient_id:
        return jsonify({
            "success": False,
            "message": "recipe_id and ingredient_id are required"
        }), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO recipe_ingredients
            (recipe_id, ingredient_id, quantity)
            VALUES (%s, %s, %s)
            RETURNING recipe_id, ingredient_id;
        """, (
            recipe_id,
            ingredient_id,
            quantity
        ))

        result = cursor.fetchone()

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Ingredient added to recipe",
            "recipe_id": result[0],
            "ingredient_id": result[1]
        }), 201

    except Exception as error:

        if connection:
            connection.rollback()

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

@recipe_ingredients_bp.route(
    "/recipe/<int:recipe_id>/ingredient/<int:ingredient_id>",
    methods=["DELETE"]
)
def remove_recipe_ingredient(recipe_id, ingredient_id):

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            DELETE FROM recipe_ingredients
            WHERE recipe_id = %s
            AND ingredient_id = %s
            RETURNING recipe_id, ingredient_id;
        """, (
            recipe_id,
            ingredient_id
        ))

        result = cursor.fetchone()

        if result is None:
            connection.rollback()

            return jsonify({
                "success": False,
                "message": "Recipe ingredient relationship not found"
            }), 404

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Ingredient removed from recipe"
        })

    except Exception as error:

        if connection:
            connection.rollback()

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()