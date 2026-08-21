from flask import Blueprint, jsonify
from db import get_db_connection


ingredients_bp = Blueprint(
    "ingredients",
    __name__,
    url_prefix="/api/ingredients"
)


@ingredients_bp.route("/", methods=["GET"])
def get_ingredients():

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT id, name FROM ingredients ORDER BY name;"
        )

        rows = cursor.fetchall()

        ingredients = []

        for row in rows:
            ingredients.append({
                "id": row[0],
                "name": row[1]
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