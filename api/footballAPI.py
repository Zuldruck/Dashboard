from flask import Blueprint, request, jsonify
import json
import requests
from requests.exceptions import HTTPError
from datetime import datetime

footballpage = Blueprint('footballpage', __name__, template_folder='templates')


def getCompetitions():
    """
    getCompetitions will return you all the competition that the API have.

    Format json which are returned :
    "country_name": x['country_name'] --> name of the country.
    "league_id": x['league_id']       --> Unique ID of the competition (needed for few other requests)
    "league_name": x['league_name'],  --> name of the league.
    :rtype: object
    """

    from index import db, user
    country = ""
    competitions = []

    # api-endpoint
    url = "https://apiv2.apifootball.com/"

    # location given here
    action = "get_leagues"
    APIkey = db.child('services').child('football').child('apikey').get(user['idToken']).val()
    # defining a params dict for the parameters to be sent to the API
    PARAMS = {
        'action': action,
        'country_id': country,
        'APIkey': APIkey
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
        for x in response.json():
            if x == "error":
                print("Error Request: " + response.json()['message'])
                return json.dumps({"success": 404, "message": "Error when fetching competitions."})
            tmpDict = {
                "country_name": x['country_name'],
                "league_id": x['league_id'],
                "league_name": x['league_name'],
            }
            competitions.append(tmpDict)
    return json.dumps(competitions)


def getLeagueByName(countryName, leagueName):
    """
    getLeagueByName which will return to you the index or not of the league that you are given in argument.


    :param countryName: name of the country you need to target.
    :param leagueName: competition name you need to target in the country.
    :return: -1 if error and >= 0 if something are found.
    """
    allCompetitions = json.loads(getCompetitions())
    print(allCompetitions)
    for x in allCompetitions:
        if x == "error":
            print("Error Request: " + allCompetitions['message'])
            return -1
        if x['league_name'] == leagueName and x['country_name'] == countryName:
            return x['league_id']
    return -1


def isRightToken(token):
    from index import db, user

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        print("FIREBASE : " + all_users[x]["access_token"])
        print("token : " + str(token))
        if all_users[x]["access_token"] == token:
            return 1
    return 0


@footballpage.route('/services/football/rank', methods=['POST'])
def rankLeague():
    from index import db, user

    country = request.json["country"]
    league = request.json["league"]
    access_token = request.json["access_token"]

    if isRightToken(str(access_token)) == 0:
        return jsonify({"message": "Error occurred with your access token."}), 404

    league_id = getLeagueByName(country, league)
    print(league_id)
    teams = []

    # api-endpoint
    url = "https://apiv2.apifootball.com/"

    # location given here
    action = "get_standings"
    APIkey = db.child('services').child('football').child('apikey').get(user['idToken']).val()
    # defining a params dict for the parameters to be sent to the API
    PARAMS = {
        'action': action,
        'league_id': league_id,
        'APIkey': APIkey
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
        for x in response.json():
            if x == "error":
                print("Error Request: " + response.json()['message'])
                return jsonify({"message": "Error when fetching rank leagues."}), 404
            tmpDict = {
                "name": x['team_name'],
                "position": x['overall_league_position'],
                "match_played": x['overall_league_payed'],
                "match_winned": x['overall_league_W'],
                "match_draw": x['overall_league_D'],
                "match_loosed": x['overall_league_L']
            }
            teams.append(tmpDict)
    return jsonify(teams), 200


@footballpage.route('/services/football/live', methods=['POST'])
def liveScore():
    from index import db, user

    country = request.json["country"]
    league = request.json["league"]
    access_token = request.json["access_token"]

    if isRightToken(access_token) == 0:
        return jsonify({"message": "Error occurred with your access token."}), 404

    league_id = getLeagueByName(country, league)
    print(league_id)
    teams = []

    # api-endpoint
    url = "https://apiv2.apifootball.com/"

    # location given here
    action = "get_events"
    APIkey = db.child('services').child('football').child('apikey').get(user['idToken']).val()
    # defining a params dict for the parameters to be sent to the API
    PARAMS = {
        'action': action,
        'league_id': league_id,
        'APIkey': APIkey,
        'from': datetime.date(datetime.now()),
        'to': datetime.date(datetime.now())
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
        for x in response.json():
            if x == "error":
                print("Error Request: " + response.json()['message'])
                return jsonify({"message": "Error when fetching live scores."}), 404
            if x['match_live'] == '1':
                tmpDict = {
                    "match_hometeam_name": x['match_hometeam_name'],
                    "match_hometeam_score": x['match_hometeam_score'],
                    "match_awayteam_name": x['match_awayteam_name'],
                    "match_awayteam_score": x['match_awayteam_score'],
                }
                teams.append(tmpDict)
    return jsonify(teams), 200


@footballpage.route('/services/football/listLeaguesDashboard', methods=['POST'])
def getListLeaguesDashboard():
    access_token = request.json["access_token"]

    if isRightToken(str(access_token)) == 0:
        return jsonify({"message": "Error occurred with your access token."}), 404

    tmpDict = {
        "France": "Ligue 1",
        "Italy": "Serie A",
        "England": "Premier League",
        "Spain": "LaLiga",
        "Germany": "Bundesliga",
    }
    return jsonify(tmpDict), 200