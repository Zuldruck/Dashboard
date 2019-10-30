from flask import Blueprint, request
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
                return response.json()
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


@footballpage.route('/services/football/rank', methods=['GET'])
def rankLeague():
    """
    rankLeague is the route which will be called when the user want to know the rank of the popular competition in the world of the football. \n
    this route needed two different arguments :  \n

    @country = the country that you target. \n
    @league = the competition name that you target in the country chosen. \n

    An exemple with this route :
        url : "http://127.0.0.1:5000/services/football/rank" \n
        league=Ligue 1 \n
        country=France \n
        url + param : http://127.0.0.1:5000/services/football/rank?league=Ligue 1&country=France \n \n

    An example of output :
        [
           {
              "name":"Paris SG", \n
              "position":"1", \n
              "match_played":"11", \n
              "match_winned":"9", \n
              "match_draw":"0", \n
              "match_loosed":"2" \n
           },\n
           {
              "name":"Nantes", \n
              "position":"2", \n
              "match_played":"11", \n
              "match_winned":"6", \n
              "match_draw":"1", \n
              "match_loosed":"4" \n
           },
            ...
        ]
    :return: <br>The function will return a list of dict which will contained this kind of variable : <br><br>
        ⚫ name of the club. <br>
        ⚫ position in the ranking (sort in order by default). <br>
        ⚫ count of played match. <br>
        ⚫ count of won match. <br>
        ⚫ count of draw match. <br>
        ⚫ count of loosed match. <br><br>
        If there is problem with the name of the country or the league our API will return this kind of json : <br><br>
        {
            "error": 404,
            "message": "No league found (please check your plan)!!"
        }
    """
    from index import db, user

    country = request.args.get("country")
    league = request.args.get("league")
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
                return response.json()
            tmpDict = {
                "name": x['team_name'],
                "position": x['overall_league_position'],
                "match_played": x['overall_league_payed'],
                "match_winned": x['overall_league_W'],
                "match_draw": x['overall_league_D'],
                "match_loosed": x['overall_league_L']
            }
            teams.append(tmpDict)
    return json.dumps(teams)


@footballpage.route('/services/football/live', methods=['GET'])
def liveScore():
    """
        liveScore is the route which will be called when the user want to know actual live score of the popular competitions match in the world of the football today.
        \nthis route needed two different arguments :\n\n

        @country = the country that you target.\n
        @league = the competition name that you target in the country chosen.\n

        An exemple with this route :
            url : "http://127.0.0.1:5000/services/football/live"\n
            league=Ligue 1\n
            country=France\n
            url + param : http://127.0.0.1:5000/services/football/live?league=Coupe de la Ligue\n

        An example of output :
            [
               {
                  "match_hometeam_name":"Amiens",\n
                  "match_hometeam_score":"3",\n
                  "match_awayteam_name":"Angers",\n
                  "match_awayteam_score":"2"\n
               },\n
               {
                  "match_hometeam_name":"Montpellier",\n
                  "match_hometeam_score":"3",\n
                  "match_awayteam_name":"Nancy",\n
                  "match_awayteam_score":"2"\n
               },
               ...
            ]
        :return: <br>The function will return a list of dict which will contained this kind of variable :<br><br>
            ⚫ name of the club  [HOME]<br>
            ⚫ score of the club  [HOME]<br>
            ⚫ name of the club  [AWAY]<br>
            ⚫ score of the club  [AWAY]<br><br>
            If there is no event today the API will return this kind of json :<br>
            {
                "error": 404,
                "message": "No event found (please check your plan)!"
            }
        """
    from index import db, user

    country = request.args.get("country")
    league = request.args.get("league")
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
                return response.json()
            if x['match_live'] == '1':
                tmpDict = {
                    "match_hometeam_name": x['match_hometeam_name'],
                    "match_hometeam_score": x['match_hometeam_score'],
                    "match_awayteam_name": x['match_awayteam_name'],
                    "match_awayteam_score": x['match_awayteam_score'],
                }
                teams.append(tmpDict)
        print(teams)
    return json.dumps(teams)
