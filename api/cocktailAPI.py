import json

import requests
from flask import Blueprint, request, jsonify
from requests.exceptions import HTTPError

cocktailPage = Blueprint('cocktailPage', __name__, template_folder='templates')


def isRightToken(token):
    from index import db, user

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == token:
            return 1
    return 0


@cocktailPage.route('/services/cocktail/listIngredients', methods=['POST'])
def getingredientList():
    url = "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list"
    ingredients = []
    access_token = request.json["access_token"]

    if isRightToken(access_token) == 0:
        return jsonify({"message": "Error occurred with your access token."}), 404

    try:
        response = requests.get(url=url)
        response.raise_for_status()
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')  # Python 3.6
    except Exception as err:
        print(f'Other error occurred: {err}')  # Python 3.6
    else:
        if len(response.text) > 0:
            for x in response.json()['drinks']:
                ingredients.append(x['strIngredient1'])
    return jsonify(ingredients), 200



@cocktailPage.route('/services/cocktail/ingredients', methods=['POST'])
def getCocktailWithIngredient():

    ingredient = request.json["ingredient"]
    access_token = request.json["access_token"]

    if isRightToken(access_token) == 0:
        return jsonify({"message": "Error occurred with your access token."}), 404

    cocktails = []

    # api-endpoint
    url = "https://www.thecocktaildb.com/api/json/v1/1/filter.php"

    # defining a params dict for the parameters to be sent to the API
    PARAMS = {
        'i': ingredient,
    }

    try:
        response = requests.get(url=url, params=PARAMS)
        response.raise_for_status()
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')  # Python 3.6
    except Exception as err:
        print(f'Other error occurred: {err}')  # Python 3.6
    else:
        if len(response.text) > 0:
            for x in response.json()['drinks']:
                tmpDict = {
                    "name": x['strDrink'],
                    "picCocktail": x['strDrinkThumb'],
                    "id": x['idDrink'],
                }
                cocktails.append(tmpDict)
    return jsonify(cocktails), 200


@cocktailPage.route('/services/cocktail/listGlasses', methods=['POST'])
def getListOfDifferentGlasses():
    glasses = []
    access_token = request.json["access_token"]

    if isRightToken(access_token) == 0:
        return jsonify({"message": "Error occurred with your access token."}), 404

    # api-endpoint
    url = "https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list"

    try:
        response = requests.get(url=url)
        response.raise_for_status()
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')  # Python 3.6
    except Exception as err:
        print(f'Other error occurred: {err}')  # Python 3.6
    else:
        if len(response.text) > 0:
            for x in response.json()['drinks']:
                if x['strGlass'] != '':
                    glasses.append(x['strGlass'])
    return jsonify(glasses), 200


@cocktailPage.route('/services/cocktail/cocktailGlasses', methods=['POST'])
def getAllCocktailsWithGlasses():
    cocktails = []

    # api-endpoint
    url = "https://www.thecocktaildb.com/api/json/v1/1/filter.php"
    glass = request.json["glass"]
    access_token = request.json["access_token"]

    if isRightToken(access_token) == 0:
        return jsonify({"message": "Error occurred with your access token."}), 404

    PARAMS = {
        'g': glass,
    }

    try:
        response = requests.get(url=url, params=PARAMS)
        response.raise_for_status()
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')  # Python 3.6
    except Exception as err:
        print(f'Other error occurred: {err}')  # Python 3.6
    else:
        if len(response.text) > 0:
            for x in response.json()['drinks']:
                tmpDict = {
                    "name": x['strDrink'],
                    "pic": x['strDrinkThumb'],
                    "id": x['idDrink'],
                }
                cocktails.append(tmpDict)
    return jsonify(cocktails), 200
