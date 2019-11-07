import json
import secrets

import bcrypt
import requests
from flask import Blueprint, request, jsonify
from requests import HTTPError

github = Blueprint('github', __name__)


@github.route('/services/github/popularRepositories', methods=['POST'])
def getpopularRepositories():
    from index import db, user

    access_token = request.json["access_token"]
    language = request.json["language"]
    sort = request.json["sort"]
    order = "desc"

    repo = []
    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:

            url = "https://api.github.com/search/repositories"
            PARAMS = {
                'q': "language:" + language,
                'sort': sort,
                'order': order,
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
                for x in response.json()["items"]:
                    if x == "error":
                        print("Error Request: " + response.json()['message'])
                        return jsonify({"success": 404, "message": "Error when fetching github repository."})
                    tmpDict = {
                        "name": x["name"],
                        "stars": x["watchers_count"],
                        "forks": x["forks"]
                    }
                    repo.append(tmpDict)
                return jsonify(repo)
    return jsonify({"success": 404, "message": "Github problem occured.", "access_token": access_token})
