import json
import secrets

import bcrypt
from flask import Blueprint, request, jsonify

loginManagement = Blueprint('loginManagement', __name__)


def makePasswordHash(password):
    """
    makePasswordhash will encrypt a password given in argument and return the password encrypted.

    :param password: the password of the user.
    :return: encrypted password.
    """
    hash = bcrypt.hashpw(password=password.encode('utf-8'), salt=bcrypt.gensalt())
    return hash.decode('utf-8')


def isPasswordValid(self, password):
    """
    isPasswordValid will check if the password encrypted and the non encrypted password given in arguments match or not.\n

    :param self: password encrypted.(database)
    :param password: password of the user.
    :return: true if it's a match, false otherwise.
    """
    return bcrypt.checkpw(password.encode('utf-8'), self.encode('utf-8'))


@loginManagement.route('/register', methods=['POST'])
def register():
    """
    register will add the user information to our database.\n
    @login = login of the user(email).\n
    @password = password of the user.\n
    @admin = the admin permission of the user in our platejson. (1 || 0) \n

    example of request :
            http://127.0.0.1:5000/register\n
            login=simon1.provost@epitech.eu\n
            password=1p54er7H#\n
            admin=1\n
    :return:
        Error  : {"error": "404", "message": "An account already exists with this email address"}
        Success : {"success": "200", "message": "user registered."} .

    """
    from index import db, user

    login = request.json["login"]
    password = request.json["password"]
    admin = request.json["admin"]

    hashed = makePasswordHash(password)

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['email'] == login:
            return jsonify({"message": "An account already exists with this email address"}), 404

    access_token = secrets.token_hex(20)
    loginUser = {"email": login, "password": hashed, "admin": admin, "access_token": access_token,
                 "access_token_fb": 0,
                 "access_token_google": 0,
                 "access_token_spotify": 0,
                 "access_token_deezer": 0,
                 "access_token_github": 0,
                 "intra_autologin": "0",
                 "services": {
                     "football": 1,
                    "epitech": 1,
                    "spotify": 0,
                    "deezer": 0,
                    "github": 0,
                    "cocktail": 1,
                 },
                 "widgets": {
                     "0": "0"
                 }
                 }
    db.child("users").push(loginUser, user['idToken'])
    return jsonify({"message": "User registered.", "access_token": access_token}), 200


@loginManagement.route('/login', methods=['POST'])
def login():
    """
    login will login the user and give an access token from our API if the user log correspond in the database.
    if the loggin information was right, we will add the access token in his database cell as well.\n
    
    @login = login of the user(email).\n
    @password = password of the user.\n

    example of request :
            http://127.0.0.1:5000/login\n
            login=simon1.provost@epitech.eu\n
            password=1p54er7H#\n
    :return:
        Error: {"error": "404", "message": "Wrong password or username"}
        Success: {"success": "200", "access_token": access_token, "is_admin": True}

    """
    from index import db, user

    login = request.json["login"]
    password = request.json["password"]
    print(login)
    print(password)

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['email'] == login:
            if isPasswordValid(all_users[x]['password'], password):
                access_token = secrets.token_hex(20)
                db.child("users").child(x).update({"access_token": access_token}, user['idToken'])
                admin = all_users[x]["admin"]
                return jsonify({"access_token": access_token, "is_admin": True if admin == 1 else False}), 200
            else:
                return jsonify({"message": "Wrong password or username"}), 404

    return jsonify({"message": "Wrong password or username"}), 404


@loginManagement.route('/loginWithFacebook', methods=['POST'])
def loginWithFacebook():
    """
    loginWithFacebook will login the user and give an access token from our API if the user log correspond in the database.
    if the loggin information was right, we will add the access token in his database cell as well.\n

    """
    from index import db, user

    login = request.json["email"]
    access_token_fb = request.json["accessToken"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['email'] == login:
            access_token = secrets.token_hex(20)
            db.child("users").child(x).update({"access_token": access_token, "access_token_fb": access_token_fb},
                                              user['idToken'])
            return jsonify({"message": "Fb User Login.", "access_token": access_token,
                            "access_token_fb": access_token_fb,
                            "admin": True if all_users[x]["admin"] == 1 else False}), 200

    access_token = secrets.token_hex(20)
    hashed = makePasswordHash(secrets.token_hex(20))

    loginUser = {"email": login, "password": hashed, "admin": 0, "access_token": access_token,
                 "access_token_fb": access_token_fb,
                 "services": {
                     "football": 1,
                    "epitech": 1,
                    "spotify": 0,
                    "deezer": 0,
                    "github": 0,
                    "cocktail": 1,
                    "open_data": 1,
                 },
                 "widgets": {
                     "0": "0"
                 },
                 "access_token_google": 0,
                 "access_token_spotify": 0,
                 "access_token_deezer": 0,
                 "access_token_github": 0,
                 "intra_autologin": "0"
                 }
    db.child("users").push(loginUser, user['idToken'])
    return jsonify({"message": "Fb User registered.", "access_token": access_token,
                    "access_token_fb": access_token_fb, "admin": False}), 200


@loginManagement.route('/loginWithGoogle', methods=['POST'])
def loginWithGoogle():
    """
    loginWithGoogle will login the user and give an access token from our API if the user log correspond in the database.
    if the loggin information was right, we will add the access token in his database cell as well.\n

    """
    from index import db, user

    login = request.json["email"]
    access_token_google = request.json["accessToken"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['email'] == login:
            access_token = secrets.token_hex(20)
            db.child("users").child(x).update(
                {"access_token": access_token, "access_token_google": access_token_google}, user['idToken'])
            return jsonify({"message": "Google User Login.", "access_token": access_token,
                            "access_token_google": access_token_google,
                            "admin": True if all_users[x]["admin"] == 1 else False}), 200

    access_token = secrets.token_hex(20)
    hashed = makePasswordHash(secrets.token_hex(20))

    loginUser = {"email": login, "password": hashed, "admin": 0, "access_token": access_token,
                 "services": {
                     "football": 1,
                    "epitech": 1,
                    "spotify": 0,
                    "deezer": 0,
                    "github": 0,
                    "cocktail": 1,
                    "open_data": 1,
                 },
                 "widgets": {
                     "0": "0"
                 },
                 "access_token_fb": 0,
                 "access_token_google": access_token_google,
                 "access_token_spotify": 0,
                 "access_token_deezer": 0,
                 "access_token_github": 0,
                 "intra_autologin": "0"
                 }
    db.child("users").push(loginUser, user['idToken'])
    return jsonify({"message": "Google User registered.", "access_token": access_token,
                    "access_token_google": access_token_google, "admin": False}), 200


@loginManagement.route('/delete', methods=['POST'])
def delete():
    """
       delete will delete the user of the database with the loggin information given in information.
       If the access_token give in body args doesn't have the right access to delete user, our API will return an error.

       @login = login of the user(email).\n
       @access_token = Token of the user doing the request\n 

        example of request :
                http://127.0.0.1:5000/delete\n
                login=simon1.provost@epitech.eu\n
                access_token=$2b$12$mmML0e8FfPoKsLKyrTidje7lf9erfSu2OkV4NOUV.NuK7IF4z6CoW\n

       :return:
           {"error": "404", "message": "Either the access_token doesn't have the right access or your user didn't exist in our database."}
           Success:{"success": "200", "message": "user deleted."}. br>

       """

    from index import db, user

    login = request.json["login"]
    access_token = request.json["access_token"]
    right_access = 0

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == access_token and all_users[x]["admin"] == 1:
            right_access = 1
            break
    if right_access == 1:
        for x in all_users:
            if all_users[x]["email"] == login:
                db.child("users").child(x).remove(user['idToken'])
                return jsonify({"message": "user deleted."}), 200

    return jsonify({"message": "Either the access_token doesn't have the right access or your user "
                               "doesn't exist in our database."}), 404


@loginManagement.route('/modifyPermission', methods=['POST'])
def modifyPermission():
    """
    modifyPermission will change the permission admin of a specific user given in body args.
    Obviously you need to give an access token which have the right access to modify the permission of any user.\n

    @login = login of the user(email).\n
    @access_token = Token of the user doing the request.\n
    @admin = new permission that you need to change.\n

     example of request :
            http://127.0.0.1:5000/modifyPermission\n
            login=simon1.provost@epitech.eu\n
            access_token=$2b$12$mmML0e8FfPoKsLKyrTidje7lf9erfSu2OkV4NOUV.NuK7IF4z6CoW\n
            admin=1\n

    :return: json string will be return.
        Error: {"error": "404", "message": "Either the access_token doesn't have the right access or your user doesn't exist in our database."}
        Success: {"success": "200", "message": "Account updated"}
    """
    from index import db, user

    login = request.json["login"]
    access_token = request.json["access_token"]
    admin = request.json["admin"]
    right_access = 0
    # check user who own access_token got admin right

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == access_token and all_users[x]["admin"] == 1:
            right_access = 1
            break
    if right_access == 1:
        for x in all_users:
            if all_users[x]["email"] == login:
                db.child("users").child(x).update({"admin": admin}, user['idToken'])
                return jsonify({"message": "Account updated"}), 200

    return jsonify({"message": "Either the access_token doesn't have the right access or your user "
                               "doesn't exist in our database."}), 404


@loginManagement.route('/getUserInformations', methods=['POST'])
def getUserInformations():
    """
    permission will give you the informations of a specific user.
    Obviously you need to give an access token which have the right access to modify the permission of any user.\n

    @login = login of the user(email).\n
    @access_token = Token of the user doing the request.\n

     example of request :
            http://127.0.0.1:5000/getUserInformations\n
            access_token=$2b$12$mmML0e8FfPoKsLKyrTidje7lf9erfSu2OkV4NOUV.NuK7IF4z6CoW\n

    :return: json string will be return.
        Error: {"error": "404", "message": "Either the access_token doesn't have the right access or your user doesn't exist in our database."}
        Success: {"success": "200", "message": "Account updated"}
    """
    from index import db, user

    access_token = request.json["access_token"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == access_token:
            return jsonify({"user": all_users[x]}), 200
    return jsonify({"message": "Either the access_token doesn't have the right access or your user "
                               "doesn't exist in our database."}), 404


@loginManagement.route('/getUsers', methods=['POST'])
def getUsers():
    """
    permission will give you the permissions of a specific user.
    Obviously you need to give an access token which have the right access to modify the permission of any user.\n

    @login = login of the user(email).\n
    @access_token = Token of the user doing the request.\n

     example of request :
            http://127.0.0.1:5000/getUsers\n
            access_token=$2b$12$mmML0e8FfPoKsLKyrTidje7lf9erfSu2OkV4NOUV.NuK7IF4z6CoW\n

    :return: json string will be return.
        Error: {"error": "404", "message": "The access token is wrong or the user doesn't have the right access"}
        Success: {"success": "200", "message": "Account updated"}
    """
    from index import db, user

    access_token = request.json["access_token"]
    right_access = 0
    # check user who own access_token got admin right

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == access_token and all_users[x]["admin"] == 1:
            right_access = 1
            break
    if right_access == 1:
        return jsonify({"message": "", "users": all_users}), 200
    return jsonify({"message": "The access token is wrong or the user doesn't have the right access"}), 404


@loginManagement.route('/addSubscribedService', methods=['POST'])
def addSubscribedService():
    from index import db, user

    service = request.json["service"]
    access_token = request.json["access_token"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == access_token:
            db.child("users").child(x).child("services").update({service: 1}, user['idToken'])
            return jsonify({"message": "service user updated."}), 200
    return jsonify({"message": "user not found"}), 404


@loginManagement.route('/getSubscribedServices', methods=['POST'])
def getSusbscribedServices():
    from index import db, user

    access_token = request.json["access_token"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == access_token:
            return jsonify({"services": {
                "football": all_users[x]["services"]['football'],
                "epitech": all_users[x]["services"]['epitech'],
                "spotify": all_users[x]["services"]['spotify'],
                "github": all_users[x]["services"]['github'],
                "cocktail": all_users[x]["services"]['cocktail'],
                "open_data": all_users[x]["services"]['open_data'],
                "deezer": all_users[x]["services"]['deezer'],
            }
            }), 200
    return jsonify({"message": "user not found"}), 404


@loginManagement.route('/removeSubscribedService', methods=['POST'])
def removeSubscribedService():
    from index import db, user

    service = request.json["service"]
    access_token = request.json["access_token"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == access_token:
            if service == "github" or service == "spotify" or service == "deezer":
                db.child("users").child(x).update({"access_token_" + service: 0}, user['idToken'])
                db.child("users").child(x).child("services").update({service: 0}, user['idToken'])
            else:
                db.child("users").child(x).child("services").update({service: 0}, user['idToken'])
            return jsonify({"message": "Service removed."}), 200
    return jsonify({"message": "user not found"}), 404


@loginManagement.route('/loginWithDeezer', methods=['POST'])
def loginWithDeezer():
    from index import db, user

    access_token_deezer= request.json["access_token_deezer"]
    access_token = request.json["access_token"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:
            db.child("users").child(x).update(
                {"access_token_deezer": access_token_deezer},
                user['idToken'])
            return jsonify({"message": "Deezer User Login.",
                            "access_token_deezer": access_token_deezer,
                            "admin": True if all_users[x]["admin"] == 1 else False}), 200
    return jsonify({"message": "Deezer problem occured.", "access_token": access_token}), 404


@loginManagement.route('/loginWithSpotify', methods=['POST'])
def loginWithSpotify():
    from index import db, user

    access_token_spotify = request.json["access_token_spotify"]
    access_token = request.json["access_token"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:
            db.child("users").child(x).update(
                {"access_token_spotify": access_token_spotify},
                user['idToken'])
            return jsonify({"message": "Spotify User Login.",
                            "access_token_spotify": access_token_spotify,
                            "admin": True if all_users[x]["admin"] == 1 else False}), 200
    return jsonify({"message": "Spotify problem occured.", "access_token": access_token}), 404


@loginManagement.route('/loginWithGithub', methods=['POST'])
def loginWithGithub():
    from index import db, user

    access_token_github = request.json["accessTokenGithub"]
    access_token = request.json["access_token"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:
            db.child("users").child(x).update(
                {"access_token_github": access_token_github},
                user['idToken'])
            return jsonify({"message": "Github User Login.",
                            "access_token_github": access_token_github,
                            "admin": True if all_users[x]["admin"] == 1 else False}), 200
    return jsonify({"message": "Github problem occured.", "access_token": access_token}), 404


@loginManagement.route('/setEpitechAutologin', methods=['POST'])
def setAutologin():
    from index import db, user

    autologin = request.json["autologin"]
    access_token = request.json["access_token"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == access_token:
            db.child("users").child(x).update({"intra_autologin": autologin}, user['idToken'])
            return jsonify({"message": "Autologin added."}), 200
    return jsonify({"message": "User not found"}), 404


@loginManagement.route('/addWidget', methods=['POST'])
def addWidget():
    from index import db, user

    access_token = request.json["access_token"]
    widget = request.json["widget"]

    all_users = db.child("users").get(user['idToken']).val()

    widget["id"] = secrets.token_hex(6)

    for x in all_users:
        if all_users[x]["access_token"] == access_token:
            db.child("users").child(x).child("widgets").push(widget, user['idToken'])
            return jsonify({"message": "Widget added.", "id": widget["id"]}), 200
    return jsonify({"message": "User not found"}), 404


@loginManagement.route('/updateWidget', methods=['POST'])
def updateWidget():
    from index import db, user

    access_token = request.json["access_token"]
    widgetId = request.json["id"]
    settings = request.json["settings"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == access_token:
            widgets = db.child("users").child(x).child("widgets").get(user['idToken']).val()
            for y in widgets:
                if y == "0":
                    continue
                if widgets[y]["id"] == widgetId:
                    db.child("users").child(x).child("widgets").child(y).update({"settings": settings}, user['idToken'])
                    return jsonify({"message": "Widget updated."}), 200
    return jsonify({"message": "User or widget not found"}), 404


@loginManagement.route('/removeWidget', methods=['POST'])
def removeWidget():
    from index import db, user

    access_token = request.json["access_token"]
    widgetId = request.json["id"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == access_token:
            widgets = db.child("users").child(x).child("widgets").get(user['idToken']).val()
            for y in widgets:
                if y == "0":
                    continue
                if widgets[y]["id"] == widgetId:
                    db.child("users").child(x).child("widgets").child(y).remove(user['idToken'])
                    return jsonify({"message": "Widget removed."}), 200
    return jsonify({"message": "User or widget not found"}), 404


@loginManagement.route('/getWidgets', methods=['POST'])
def getWidgets():
    from index import db, user

    access_token = request.json["access_token"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == access_token:
            return jsonify({"widgets": all_users[x]["widgets"]}), 200
    return jsonify({"message": "User not found"}), 404
