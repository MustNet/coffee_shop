import os
from flask import Flask, request, jsonify, abort
from sqlalchemy import exc
import json
from flask_cors import CORS

from .database.models import db_drop_and_create_all, setup_db, Drink
from .auth.auth import AuthError, requires_auth

app = Flask(__name__)
setup_db(app)
CORS(app)

'''
!! NOTE: Uncomment this line only on the very first run
!! It will DROP all records and recreate the tables
'''
with app.app_context():
    #db_drop_and_create_all()  # <- beim ersten Lauf einkommentieren
    pass


# ROUTES


@app.route('/drinks', methods=['GET'])
def get_drinks():
    """
    GET /drinks
    Public endpoint, returns only drink.short()
    """
    try:
        drinks = Drink.query.all()
        drinks_short = [drink.short() for drink in drinks]
        return jsonify({
            'success': True,
            'drinks': drinks_short
        }), 200
    except Exception:
        abort(500)


@app.route('/drinks-detail', methods=['GET'])
@requires_auth('get:drinks-detail')
def get_drinks_detail(jwt):
    """
    GET /drinks-detail
    Requires get:drinks-detail permission
    Returns drink.long()
    """
    try:
        drinks = Drink.query.all()
        drinks_long = [drink.long() for drink in drinks]
        return jsonify({
            'success': True,
            'drinks': drinks_long
        }), 200
    except Exception:
        abort(500)


@app.route('/drinks', methods=['POST'])
@requires_auth('post:drinks')
def create_drink(jwt):
    """
    POST /drinks
    Requires post:drinks permission
    Creates a new Drink and returns it in long() format
    """
    body = request.get_json()
    if not body:
        abort(400)

    title = body.get('title', None)
    recipe = body.get('recipe', None)

    if not title or not recipe:
        abort(422)

    try:
        drink = Drink(title=title, recipe=json.dumps(recipe))
        drink.insert()
        return jsonify({
            'success': True,
            'drinks': [drink.long()]
        }), 200
    except Exception:
        abort(422)


@app.route('/drinks/<int:id>', methods=['PATCH'])
@requires_auth('patch:drinks')
def update_drink(jwt, id):
    """
    PATCH /drinks/<id>
    Requires patch:drinks permission
    Updates an existing Drink
    """
    drink = Drink.query.get(id)
    if not drink:
        abort(404)

    body = request.get_json()
    if not body:
        abort(400)

    try:
        if 'title' in body:
            drink.title = body['title']
        if 'recipe' in body:
            drink.recipe = json.dumps(body['recipe'])
        drink.update()
        return jsonify({
            'success': True,
            'drinks': [drink.long()]
        }), 200
    except Exception:
        abort(422)


@app.route('/drinks/<int:id>', methods=['DELETE'])
@requires_auth('delete:drinks')
def delete_drink(jwt, id):
    """
    DELETE /drinks/<id>
    Requires delete:drinks permission
    Deletes a Drink by id
    """
    drink = Drink.query.get(id)
    if not drink:
        abort(404)

    try:
        drink.delete()
        return jsonify({
            'success': True,
            'delete': id
        }), 200
    except Exception:
        abort(422)


# ERROR HANDLING

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": 404,
        "message": "resource not found"
    }), 404


@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        "success": False,
        "error": 400,
        "message": "bad request"
    }), 400


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "error": 500,
        "message": "internal server error"
    }), 500


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    """
    Custom handler for AuthError
    """
    return jsonify({
        "success": False,
        "error": ex.status_code,
        "message": ex.error['description']
    }), ex.status_code
