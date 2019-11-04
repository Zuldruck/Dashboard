import json
import traceback

from flask import Blueprint, request, jsonify

openDataMontpellier = Blueprint('openDataMontpellier', __name__, template_folder='templates')


def isRightToken(token):
    from index import db, user

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == token:
            return 1
    return 0


def getXml(urlTargeted):
    global data
    import urllib3
    import xmltodict
    url = urlTargeted

    http = urllib3.PoolManager()

    response = http.request('GET', url)
    try:
        data = xmltodict.parse(response.data)
    except:
        print("Failed to parse xml from response (%s)" % traceback.format_exc())
    return data


@openDataMontpellier.route('/services/openDataMontpellier/veloMaggParks', methods=['POST'])
def getParks():
    access_token = request.json["access_token"]

    if isRightToken(str(access_token)) == 0:
        return jsonify({"success": 404, "message": "Error occurred with your access token."})

    obj = getXml("http://data.montpellier3m.fr/sites/default/files/ressources/TAM_MMM_VELOMAG.xml")
    mlist = obj['vcs']['sl']['si']
    allparks = []

    for x in mlist:
        tmpDict = {
            "occupiedPlaces": x['@av'],
            "availablePlaces": x['@fr'],
            "creditsCardAvailable": x.get('@cb', "0"),
            "latitude": x['@la'],
            "longitude": x['@lg'],
            "stationName": x['@na'],
            "totalPlaces": x['@to']
        }
        allparks.append(tmpDict)
    return json.dumps(allparks)


def urlOfTheParkingTargeted(parking):
    if parking == "Antigone":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_ANTI.xml"
    elif parking == "Comédie":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_COME.xml"
    elif parking == "Corum":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_CORU.xml"
    elif parking == "Europa":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_EURO.xml"
    elif parking == "Foch":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_FOCH.xml"
    elif parking == "Gambetta":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_GAMB.xml"
    elif parking == "Gare":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_GARE.xml"
    elif parking == "Triangle":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_TRIA.xml"
    elif parking == "Arc de Triomphe":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_ARCT.xml"
    elif parking == "Pitot":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_PITO.xml"
    elif parking == "Circe":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_CIRC.xml"
    elif parking == "Sabines":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_SABI.xml"
    elif parking == "Garcia Lorca":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_GARC.xml"
    elif parking == "Sablassou":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_CAS_SABL.xml"
    elif parking == "Mosson":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_MOSS.xml"
    elif parking == "Saint Jean Le Sec":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_STJ_SJLC.xml"
    elif parking == "Euromédecine":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_MEDC.xml"
    elif parking == "Occitanie":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_OCCI.xml"
    elif parking == "Vicarello":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_CAS_VICA.xml"
    elif parking == "Gaumont EST":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_GA109.xml"
    elif parking == "Gaumont OUEST":
        return "https://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_GA250.xml"
    else:
        return "ERROR"


@openDataMontpellier.route('/services/openDataMontpellier/listParkings', methods=['POST'])
def getParkingsList():
    access_token = request.json["access_token"]

    if isRightToken(str(access_token)) == 0:
        return jsonify({"success": 404, "message": "Error occurred with your access token."})

    list = []

    tmpDict = {
        "1": "Antigone",
        "2": "Comédie",
        "3": "Corum",
        "4": "Europa",
        "5": "Foch",
        "6": "Gambetta",
        "7": "Gare",
        "8": "Triangle",
        "9": "Arc de Triomphe",
        "10": "Pitot",
        "11": "Circe",
        "12": "Sabines",
        "13": "Garcia Lorca",
        "14": "Sablassou",
        "15": "Mosson",
        "16": "Saint Jean Le Sec",
        "17": "Euromédecine",
        "18": "Occitanie",
        "19": "Vicarello",
        "20": "Gaumont EST",
        "21": "Gaumont OUEST"
    }
    list.append(tmpDict)
    return json.dumps(list)


@openDataMontpellier.route('/services/openDataMontpellier/parkingVisibility', methods=['POST'])
def getParkingsVisibility():
    access_token = request.json["access_token"]

    if isRightToken(str(access_token)) == 0:
        return jsonify({"success": 404, "message": "Error occurred with your access token."})

    parking = request.json["parking"]
    res = urlOfTheParkingTargeted(parking)
    if res == "ERROR":
        return jsonify({"success": 404, "message": "Error with your parking targeted."})
    obj = getXml(res)
    mlist = obj['park']
    parkingInformation = []

    for x in mlist:
        tmpDict = {
            x: mlist[x]
        }
        parkingInformation.append(tmpDict)
    return json.dumps(parkingInformation)
