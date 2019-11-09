import requests
from flask import Blueprint, request, jsonify
from requests import HTTPError

spotify = Blueprint('spotify', __name__)


@spotify.route('/services/spotify/userInfo', methods=['POST'])
def getUserInfo():
    from index import db, user

    access_token_spotify = request.json["accessTokenSpotify"]
    access_token = request.json["access_token"]

    infoUser = []
    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:

            url = "https://api.spotify.com/v1/me"
            PARAMS = {
                'Authorization': "Bearer " + access_token_spotify,
            }

            try:
                # sending get request and saving the response as response object
                response = requests.get(url=url, headers=PARAMS)

                # If the response was successful, no Exception will be raised
                response.raise_for_status()
            except HTTPError as http_err:
                print(f'HTTP error occurred: {http_err}')  # Python 3.6
            except Exception as err:
                print(f'Other error occurred: {err}')  # Python 3.6
            else:
                infoUser = {
                    "name": response.json()["display_name"],
                    "followers": response.json()["followers"]["total"],
                    "country": response.json()["country"],
                    "userId": response.json()["id"],
                }
            return jsonify(infoUser)
    return jsonify({"success": 404, "message": "Spotify problem occured.", "access_token": access_token})


@spotify.route('/services/spotify/playlistsUser', methods=['POST'])
def getPlaylistsUser():
    global userId
    from index import db, user

    access_token_spotify = request.json["accessTokenSpotify"]
    access_token = request.json["access_token"]

    playlists = []
    all_users = db.child("users").get(user['idToken']).val()

    url = "https://api.spotify.com/v1/me"
    PARAMS = {
        'Authorization': "Bearer " + access_token_spotify,
    }

    try:
        # sending get request and saving the response as response object
        response = requests.get(url=url, headers=PARAMS)

        # If the response was successful, no Exception will be raised
        response.raise_for_status()
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')  # Python 3.6
    except Exception as err:
        print(f'Other error occurred: {err}')  # Python 3.6
    else:
        userId = response.json()["id"]

    for x in all_users:
        if all_users[x]['access_token'] == access_token:

            url = "https://api.spotify.com/v1/users/" + userId + "/playlists"
            PARAMS = {
                'Authorization': "Bearer " + access_token_spotify,
            }

            try:
                # sending get request and saving the response as response object
                response = requests.get(url=url, headers=PARAMS)

                # If the response was successful, no Exception will be raised
                response.raise_for_status()
            except HTTPError as http_err:
                print(f'HTTP error occurred: {http_err}')  # Python 3.6
            except Exception as err:
                print(f'Other error occurred: {err}')  # Python 3.6
            else:
                for x in response.json()["items"]:
                    tmpDict = {
                        "name": x["name"],
                        "playlist_id": x["id"],
                        "image_url": x["images"][0]["url"],
                    }
                    playlists.append(tmpDict)
            return jsonify(playlists)
    return jsonify({"success": 404, "message": "Spotify problem occured.", "access_token": access_token})
