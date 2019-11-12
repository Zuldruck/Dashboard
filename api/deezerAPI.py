import json

import requests
from flask import Blueprint, request, jsonify
from requests import HTTPError

deezer = Blueprint('deezer', __name__)


@deezer.route('/services/deezer/playlistsUserDeezer', methods=['POST'])
def getPlaylistsDeezerUser():
    global userId
    from index import db, user

    access_token_deezer = request.json["accessTokenDeezer"]
    access_token = request.json["access_token"]

    playlists = []
    all_users = db.child("users").get(user['idToken']).val()

    url = "https://api.deezer.com/user/me"
    print(access_token_deezer)
    PARAMS = {
        'access_token': access_token_deezer,
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
        userId = 0
        json_data = json.loads(response.text)
        userId = json_data['id']
        for x in all_users:
            if all_users[x]['access_token'] == access_token:

                url = "https://api.deezer.com/user/me/playlists"
                PARAMS = {
                    'access_token': access_token_deezer,
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
                    json_data = json.loads(response.text)
                    for x in json_data["data"]:
                        tmpDict = {
                            "name": x["title"],
                            "playlist_id": x["id"],
                        }
                        playlists.append(tmpDict)
                    return jsonify(playlists), 200
    return jsonify({"message": "Spotify problem occured."}), 404

