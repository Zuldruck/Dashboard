import requests
from flask import Blueprint, request, jsonify
from requests import HTTPError
from rankingIntraStudents import *

intra = Blueprint('intra', __name__)


@intra.route('/services/intra/ranking', methods=['POST'])
def getRanking():
    from index import db, user

    access_token = request.json["access_token"]
    city = request.json["city"]
    year = request.json["year"]

    all_users = db.child("users").get(user['idToken']).val()
    auto_login = db.child("services").child("epitech").child("apikey").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:
            return jsonify(ranking(year, city, auto_login)), 200
    return jsonify({"message": "Intra problem occured.", "access_token": access_token}), 404


@intra.route('/services/intra/listCity', methods=['POST'])
def getListCity():
    from index import db, user

    access_token = request.json["access_token"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:
            tmpDict = {
                "Tiranna": "AL/TIR",
                "Bruxelles": "BE/BRU",
                "Cotonou": "BJ/COT",
                "Bordeaux": "FR/BDX",
                "Lille": "FR/LIL",
                "Lyon": "FR/LYN",
                "Marseille": "FR/MAR",
                "Montpellier": "FR/MPL",
                "Nancy": "FR/NCY",
                "Nantes": "FR/NAN",
                "Nice": "FR/NCE",
                "Paris": "FR/PAR",
                "Rennes": "FR/REN",
                "Strasbourg": "FR/STG",
                "Toulouse": "FR/TLS",
                "Berlin": "DE/BER",
                "Barcelona": "ES/BAR",
            }
            return jsonify(tmpDict), 200
    return jsonify({"message": "Intra problem occured.", "access_token": access_token}), 404


@intra.route('/services/intra/getUserBinomes', methods=['POST'])
def getUserBinomes():
    from index import db, user

    access_token = request.json["access_token"]
    login = request.json["login"]

    auto_login = db.child("services").child("epitech").child("apikey").get(user['idToken']).val()
    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:
            url = "https://intra.epitech.eu/" + auto_login + "/user/" + login + "/binome"
            PARAMS = {
                'format': "json",
            }

            try:
                # sending get request and saving the response as response object
                response = requests.get(url=url, params=PARAMS)

                # If the response was successful, no Exception will be raised
                response.raise_for_status()
            except HTTPError as http_err:
                print(f'HTTP error occurred: {http_err}')  # Python 3.6
            except Exception as err:
                print(f'Other error occurred: {err}')  # Python 3.6
            else:
                binomes = response.json()["binomes"]
                list = []

                binome_nb = 5
                for x in binomes:
                    if binome_nb == 0:
                        break
                    loginWithoutEnd = ''
                    for j in x["login"]:
                        if j == '@':
                            break
                        loginWithoutEnd += j
                    tmpDict = {
                        "login": x["login"],
                        "picture": "https://intra.epitech.eu/file/userprofil/commentview/" + loginWithoutEnd + ".jpg",
                        "projects": x["weight"]
                    }
                    list.append(tmpDict)
                    binome_nb -= 1
            return jsonify(list), 200
    return jsonify({"message": "Intra problem occured.", "access_token": access_token}), 404


@intra.route('/services/intra/getUserModules', methods=['POST'])
def getUserModules():
    from index import db, user

    access_token = request.json["access_token"]
    login = request.json["login"]
    year = request.json["year"]

    auto_login = db.child("services").child("epitech").child("apikey").get(user['idToken']).val()
    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:
            url = "https://intra.epitech.eu/" + auto_login + "/user/" + login + "/notes"
            PARAMS = {
                'format': "json",
            }

            try:
                # sending get request and saving the response as response object
                response = requests.get(url=url, params=PARAMS)

                # If the response was successful, no Exception will be raised
                response.raise_for_status()
            except HTTPError as http_err:
                print(f'HTTP error occurred: {http_err}')  # Python 3.6
            except Exception as err:
                print(f'Other error occurred: {err}')  # Python 3.6
            else:
                modules = response.json()["modules"]
                list = []
                for x in modules:
                    if x["scolaryear"] != year or x["grade"] == "-" or x["credits"] == 0:
                        continue
                    tmpDict = {
                        "module": x["title"],
                        "grade": x["grade"],
                        "credits": x["credits"]
                    }
                    list.append(tmpDict)
            return jsonify(list), 200
    return jsonify({"message": "Intra problem occured.", "access_token": access_token}), 404