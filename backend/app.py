from flask import Flask, jsonify
from flask_cors import CORS

from db import get_db_connection

from routes.ingredients import ingredients_bp
from routes.recipes import recipes_bp
from routes.recipe_ingredients import recipe_ingredients_bp
from routes.pantry import pantry_bp
from routes.matching import matching_bp


app = Flask(__name__)

CORS(app)

app.register_blueprint(ingredients_bp)
app.register_blueprint(recipes_bp)
app.register_blueprint(recipe_ingredients_bp)
app.register_blueprint(pantry_bp)
app.register_blueprint(matching_bp)


@app.route("/")
def home():
    return "PantryPal Backend is running!"

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "success": True,
        "message": "PantryPal API is running"
    })

@app.route("/api/test-db")
def test_database():
    try:
        connection = get_db_connection()
        connection.close()

        return {
            "success": True,
            "message": "PostgreSQL connected successfully!"
        }

    except Exception as error:
        return {
            "success": False,
            "error": str(error)
        }, 500


if __name__ == "__main__":
    app.run(debug=True)