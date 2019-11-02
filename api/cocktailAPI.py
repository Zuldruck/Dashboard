import json

import requests
from flask import Blueprint, request, jsonify
from requests.exceptions import HTTPError

cocktailPage = Blueprint('cocktailPage', __name__, template_folder='templates')


def isRightToken(token):
    from index import db, user

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        print("FIREBASE : " + all_users[x]["access_token"])
        print("token : " + str(token))
        if all_users[x]["access_token"] == token:
            return 1
    return 0


@cocktailPage.route('/services/cocktail/ingredients', methods=['POST'])
def getCocktailWithIngredient():
    """
    getCocktailWithIngredient -> This function will send you all the cocktails with the ingredient given in body args.
    @ingredient = "Vodka" for example.\n

    Example :\n
    url : "http://127.0.0.1:5000/services/cocktail/ingredients"\n
    param : "ingredient=Vodka"\n

    output : {"name": "'57 Chevy with a White License Plate", "picCocktail": "https://www.thecocktaildb.com/images/media/drink/qyyvtu1468878544.jpg", "id": "14029"}\n

    :return: list of dict.
    """

    ingredient = request.json["ingredient"]
    access_token = request.json["access_token"]

    if isRightToken(access_token) == 0:
        return jsonify({"success": 404, "message": "Error occurred with your access token."})

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
    return jsonify(cocktails)


@cocktailPage.route('/services/cocktail/listGlasses', methods=['POST'])
def getListOfDifferentGlasses():
    """
      getListOfDifferentGlasses -> This function will send you in json format all the glasses that the API contains.

      Example :\n
      url : "http://127.0.0.1:5000/services/cocktail/listGlasses"\n

      output : {"strGlass": "Highball glass"}, {"strGlass": "Collins glass"}\n

      :return: list of dict.
    """

    glasses = []
    access_token = request.json["access_token"]

    if isRightToken(access_token) == 0:
        return jsonify({"success": 404, "message": "Error occurred with your access token."})

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
                tmpDict = {
                    "name": x['strGlass'],
                }
                glasses.append(tmpDict)
    return jsonify(glasses)


@cocktailPage.route('/services/cocktail/cocktailGlasses', methods=['POST'])
def getAllCocktailsWithGlasses():
    """
         getAllCocktailsWithGlasses -> This function will send you all the cocktails that the glasses given in argument could be done with it.

         Example :\n
         url : "http://127.0.0.1:5000/services/cocktail/cocktailGlasses"\n
         param : "glasses=Cocktail_glass"

         output :
         {"name": "9 1/2 Weeks", "pic": "https://www.thecocktaildb.com/images/media/drink/xvwusr1472669302.jpg", "id": "16108"},
         {"name": "A. J.", "pic": "https://www.thecocktaildb.com/images/media/drink/uryyrr1472811418.jpg", "id": "17833"},\n

         :return: list of dict.
    """

    cocktails = []

    # api-endpoint
    url = "https://www.thecocktaildb.com/api/json/v1/1/filter.php"
    glasses = request.json["glasses"]
    access_token = request.json["access_token"]

    if isRightToken(access_token) == 0:
        return jsonify({"success": 404, "message": "Error occurred with your access token."})

    PARAMS = {
        'g': glasses,
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
    return jsonify(cocktails)
