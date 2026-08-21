from flask import Blueprint, jsonify, request
from db import get_db_connection


pantry_bp = Blueprint(
    "pantry",
    __name__,
    url_prefix="/api/pantry"
)

@pantry_bp.route("/", methods=["GET"])
def get_pantry():

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                p.id,
                p.ingredient_id,
                i.name,
                p.quantity,
                p.expiry_date
            FROM pantry p
            JOIN ingredients i
                ON p.ingredient_id = i.id
            ORDER BY p.expiry_date ASC;
        """)

        rows = cursor.fetchall()

        pantry_items = []

        for row in rows:
            pantry_items.append({
                "id": row[0],
                "ingredient_id": row[1],
                "ingredient_name": row[2],
                "quantity": row[3],
                "expiry_date": str(row[4]) if row[4] else None
            })

        return jsonify(pantry_items)

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
@pantry_bp.route("/", methods=["POST"])
def add_pantry_item():

    data = request.get_json()

    ingredient_id = data.get("ingredient_id")
    quantity = data.get("quantity")
    expiry_date = data.get("expiry_date")

    if not ingredient_id:
        return jsonify({
            "success": False,
            "message": "ingredient_id is required"
        }), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO pantry
            (ingredient_id, quantity, expiry_date)
            VALUES (%s, %s, %s)
            RETURNING id;
        """, (
            ingredient_id,
            quantity,
            expiry_date
        ))

        pantry_id = cursor.fetchone()[0]

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Ingredient added to pantry",
            "pantry_id": pantry_id
        }), 201

    except Exception as error:

        if connection:
            connection.rollback()

        return jsonify({
    "success": False,
    "message": "Could not add pantry item. The ingredient may already exist."
}), 400

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

@pantry_bp.route("/<int:pantry_id>", methods=["PUT"])
def update_pantry_item(pantry_id):

    data = request.get_json()

    ingredient_id = data.get("ingredient_id")
    quantity = data.get("quantity")
    expiry_date = data.get("expiry_date")

    if not ingredient_id:
        return jsonify({
            "success": False,
            "message": "ingredient_id is required"
        }), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            UPDATE pantry
            SET
                ingredient_id = %s,
                quantity = %s,
                expiry_date = %s
            WHERE id = %s
            RETURNING id;
        """, (
            ingredient_id,
            quantity,
            expiry_date,
            pantry_id
        ))

        result = cursor.fetchone()

        if result is None:
            connection.rollback()

            return jsonify({
                "success": False,
                "message": "Pantry item not found"
            }), 404

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Pantry item updated successfully"
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

@pantry_bp.route("/<int:pantry_id>", methods=["DELETE"])
def delete_pantry_item(pantry_id):

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            DELETE FROM pantry
            WHERE id = %s
            RETURNING id;
        """, (pantry_id,))

        result = cursor.fetchone()

        if result is None:
            connection.rollback()

            return jsonify({
                "success": False,
                "message": "Pantry item not found"
            }), 404

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Pantry item deleted successfully"
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