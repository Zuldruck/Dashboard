import requests

apiRoot = "https://intra.epitech.eu/"
ALL = "AL/TIR|BE/BRU|BJ/COT|FR/BDX|FR/RUN|FR/LIL|FR/LYN|FR/MAR|FR/MPL|FR/NCY|FR/NAN|FR/NCE|FR/PAR|FR/REN|FR/STG|FR/TLS|DE/BER|ES/BAR"


def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

def ranking(year, city, autologin):
    list = []
    offset = 0

    if city == "ALL":
        city = ALL
    toAdd = requests.get(
        apiRoot + autologin + "/user/filter/user?format=json&location=" + city + "&year=2019&active=true&promo=" + year + "&offset=" + str(
            offset)).json()
    users = toAdd.get("items")
    if users == None:
        return []
    totalSize = toAdd.get("total")
    while len(users) != totalSize:
        offset += 48
        toAdd = requests.get(
            apiRoot + autologin + "/user/filter/user?format=json&location=" + city + "&year=2019&active=true&promo=" + year + "&offset=" + str(
                offset)).json().get("items")
        if toAdd == None:
            return []
        users += toAdd

    if users == None or len(users) == 0:
        return []
    for user in users:
        userInfo = requests.get(apiRoot + autologin + "/user/" + user.get("login") + '?format=json').json()
        gpa = userInfo.get("gpa")[0].get("gpa")
        if is_number(gpa) == False:
            continue
        list.append({
            "gpa": gpa,
            "city": userInfo.get("location"),
            "user": user.get("title")
        })
    list.sort(key=lambda x: x.get("gpa"), reverse=True)
    return list
