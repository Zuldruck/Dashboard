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
    park = request.json["park"]

    if isRightToken(str(access_token)) == 0:
        return jsonify({"message": "Error occurred with your access token."}), 404

    obj = getXml("http://data.montpellier3m.fr/sites/default/files/ressources/TAM_MMM_VELOMAG.xml")
    mlist = obj['vcs']['sl']['si']

    for x in mlist:
        name = x['@na']
        if name[2:] == park or name[3:] == park:
            dict = {
                "occupiedPlaces": x['@av'],
                "availablePlaces": x['@fr'],
                "creditsCardAvailable": x.get('@cb', "0"),
                "latitude": x['@la'],
                "longitude": x['@lg'],
                "stationName": x['@na'],
                "totalPlaces": x['@to']
            }
            return jsonify(dict), 200
    return jsonify({"message": "Park not found"}), 404


@openDataMontpellier.route('/services/openDataMontpellier/listVeloMaggParks', methods=['POST'])
def listVeloMaggParks():
    access_token = request.json["access_token"]

    if isRightToken(str(access_token)) == 0:
        return jsonify({"message": "Error occurred with your access token."}), 404

    obj = getXml("http://data.montpellier3m.fr/sites/default/files/ressources/TAM_MMM_VELOMAG.xml")
    mlist = obj['vcs']['sl']['si']
    allparks = []

    for x in mlist:
        name = x['@na']
        if name[1] == ' ':
            allparks.append(name[2:])
        else:
            allparks.append(name[3:])
    return jsonify(allparks), 200


def urlOfTheParkingTargeted(parking):
    if parking == "Antigone":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_ANTI.xml"
    elif parking == "Comédie":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_COME.xml"
    elif parking == "Corum":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_CORU.xml"
    elif parking == "Europa":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_EURO.xml"
    elif parking == "Foch":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_FOCH.xml"
    elif parking == "Gambetta":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_GAMB.xml"
    elif parking == "Gare":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_GARE.xml"
    elif parking == "Triangle":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_TRIA.xml"
    elif parking == "Arc de Triomphe":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_ARCT.xml"
    elif parking == "Pitot":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_PITO.xml"
    elif parking == "Circe":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_CIRC.xml"
    elif parking == "Sabines":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_SABI.xml"
    elif parking == "Garcia Lorca":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_GARC.xml"
    elif parking == "Sablassou":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_CAS_SABL.xml"
    elif parking == "Mosson":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_MOSS.xml"
    elif parking == "Saint Jean Le Sec":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_STJ_SJLC.xml"
    elif parking == "Euromédecine":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_MEDC.xml"
    elif parking == "Occitanie":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_OCCI.xml"
    elif parking == "Vicarello":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_CAS_VICA.xml"
    elif parking == "Gaumont EST":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_GA109.xml"
    elif parking == "Gaumont OUEST":
        return "http://data.montpellier3m.fr/sites/default/files/ressources/FR_MTP_GA250.xml"
    else:
        return "ERROR"


@openDataMontpellier.route('/services/openDataMontpellier/listParkings', methods=['POST'])
def getParkingsList():
    access_token = request.json["access_token"]

    if isRightToken(str(access_token)) == 0:
        return jsonify({"message": "Error occurred with your access token."}), 404

    list = [
        "Antigone",
        "Comédie",
        "Corum",
        "Europa",
        "Foch",
        "Gambetta",
        "Gare",
        "Triangle",
        "Arc de Triomphe",
        "Pitot",
        "Circe",
        "Sabines",
        "Garcia Lorca",
        "Sablassou",
        "Mosson",
        "Saint Jean Le Sec",
        "Euromédecine",
        "Occitanie",
        "Vicarello",
        "Gaumont EST",
        "Gaumont OUEST"
    ]
    return jsonify(list), 200


@openDataMontpellier.route('/services/openDataMontpellier/parkingVisibility', methods=['POST'])
def getParkingsVisibility():
    access_token = request.json["access_token"]

    if isRightToken(str(access_token)) == 0:
        return jsonify({"message": "Error occurred with your access token."}), 404

    parking = request.json["parking"]
    res = urlOfTheParkingTargeted(parking)
    if res == "ERROR":
        return jsonify({"message": "Error with your parking targeted."}), 404
    obj = getXml(res)
    mlist = obj['park']
    tmpDict = {}

    for x in mlist:
        tmpDict[x] = mlist[x]
    return jsonify(tmpDict), 200
