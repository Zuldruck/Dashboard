from flask import Blueprint, request, jsonify
import json
import bcrypt
import requests
from requests.exceptions import HTTPError
from datetime import datetime
import secrets

loginManagement = Blueprint('loginManagement', __name__, template_folder='templates')


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
    register will add the user information to the database of our plateform.
    @login = login of the user(email).\n
    @password = password of the user.\n
    @admin = the admin permission of the user in our plateform. (1 || 0) \n

    example of request :
        http://127.0.0.1:5000/register?login=simon1.provost@epitech.eu&password=dashboard1234&admin=1
    :return: <br>
    json with error 404 if it doesn't works <br>
    json with the key in the databse if it was a success.<br>

    """
    from index import db, user

    login = request.args.get("login")
    password = request.args.get("password")

    admin = request.args.get("admin")

    hashed = makePasswordHash(password)

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['email'] == login:
            return json.dumps({"error": "404", "message": "email already found in the databse"})

    loginUser = {"email": login, "password": hashed, "admin": admin}
    res = db.child("users").push(loginUser, user['idToken'])
    return jsonify(res)


@loginManagement.route('/login', methods=['POST'])
def login():
    """
    login will login the user and give an access token from our API if the user log correspond to anything in the database.
    @login = login of the user(email).\n
    @password = password of the user.\n

    example of request :
        http://127.0.0.1:5000/login?login=simon1.provost@epitech.eu&password=dashboard1234
    :return: <br>
        json with error 404 if it doesn't works <br>
        json with the access_token if it was a success loggin.<br>

    """
    from index import db, user

    login = request.args.get("login")
    password = request.args.get("password")

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['email'] == login:
            if isPasswordValid(all_users[x]['password'], password):
                return json.dumps({"success": "202", "access_token": secrets.token_hex(20)})
            else:
                return json.dumps({"error": "404", "message": "WRONG PASSWORD."})

    return json.dumps({"error": "404", "message": "anything found in the database."})


@loginManagement.route('/delete', methods=['POST'])
def delete():
    """
       delete will delete the user of the database with the loggin information given in information.
       @login = login of the user(email).\n
       @password = password of the user. to check if it's the real user which delete his account.\n

        example of request :
            http://127.0.0.1:5000/delete?login=simon1.provost@epitech.eu&password=dashboard1234

       :return: <br>
           json with error 404 if it doesn't works <br>
           json with success 202 if it was a success. br>

       """

    from index import db, user

    login = request.args.get("login")
    password = request.args.get("password")

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['email'] == login:
            if isPasswordValid(all_users[x]['password'], password):
                db.child("users").child(x).remove(user['idToken'])
                return json.dumps({"success": "202", "message": "Account deleted"})
            else:
                return json.dumps({"error": "404", "message": "WRONG PASSWORD."})

    return json.dumps({"error": "404", "message": "anything found in the database."})


@loginManagement.route('/permission', methods=['POST'])
def modifyPermission():
    """
    modifyPermission will change the permission admin of a specific user give in paramets.\n
    @login = login of the user(email).\n
    @password = password of the user.\n
    @admin = new permission that you need to change.\n

     example of request :
        http://127.0.0.1:5000/register?login=simon1.provost@epitech.eu&password=dashboard1234&admin=<newPermission>

    :return: json string will be return.<br>
        Error 404 + message if it doesn't works.<br>
        Success 202 + message if it is well updated.<br>
    """
    from index import db, user

    login = request.args.get("login")
    password = request.args.get("password")
    admin = request.args.get("admin")

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['email'] == login:
            if isPasswordValid(all_users[x]['password'], password):
                db.child("users").child(x).update({"admin": admin}, user['idToken'])
                return json.dumps({"success": "202", "message": "Account updated"})
            else:
                return json.dumps({"error": "404", "message": "WRONG PASSWORD."})

    return json.dumps({"error": "404", "message": "anything found in the database."})
