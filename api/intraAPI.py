import requests
from flask import Blueprint, request, jsonify
from requests import HTTPError
from rankingIntraStudents import *

intra = Blueprint('intra', __name__)


@intra.route('/services/intra/userInfo', methods=['POST'])
def getUserInfo():
    global infoUser
    from index import db, user

    auto_login = request.json["auth_login"]
    access_token = request.json["access_token"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:

            url = "https://intra.epitech.eu/" + auto_login + "/user"
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
                login = response.json().get("login", "null")
                loginWithoutEnd = ''
                for x in login:
                    if x == '@':
                        break
                    loginWithoutEnd += x
                infoUser = {
                    "name": response.json().get("title", "null"),
                    "picture": "https://intra.epitech.eu/file/userprofil/commentview/" + loginWithoutEnd + ".jpg",
                    "promo": "0",
                    "gpa": "0",
                }
                gpaValue = response.json().get("gpa", "null")
                promoValue = response.json().get("promo", "null")
                print(response.json())
                if gpaValue != "null":
                    infoUser.update({"gpa": response.json()["gpa"][0]["gpa"]})
                if promoValue != "null":
                    infoUser.update({"promo": response.json()["promo"]})
            return jsonify(infoUser)
    return jsonify({"success": 404, "message": "Intra problem occured.", "access_token": access_token})


@intra.route('/services/intra/ranking', methods=['POST'])
def getRanking():
    from index import db, user

    access_token = request.json["access_token"]
    city = request.json["city"]
    year = request.json["year"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:
            return jsonify(ranking(year, city, all_users[x]['intra_autologin']))
    return jsonify({"success": 404, "message": "Intra problem occured.", "access_token": access_token})


@intra.route('/services/intra/listCity', methods=['POST'])
def getListCity():
    from index import db, user

    access_token = request.json["access_token"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:
            tmpDict = {
                "Tiranna": "AL/TIR",
                "Bruxel": "BE/BRU",
                "Cotonou": "BJ/COT",
                "Bordeaux": "FR/BDX",
                "Lille": "FR/LIL",
                "Lyon": "FR/LYN",
                "Marseille": "FR/MAR",
                "Montpellier": "FR/MPL",
                "Nancy": "FR/NCY",
                "Nante": "FR/NAN",
                "Nice": "FR/NCE",
                "Paris": "FR/PAR",
                "Renne": "FR/REN",
                "Strasbourg": "FR/STG",
                "Toulouse": "FR/TLS",
                "Berlin": "DE/BER",
                "Barcelona": "ES/BAR"
            }
            return jsonify(tmpDict)
    return jsonify({"success": 404, "message": "Intra problem occured.", "access_token": access_token})