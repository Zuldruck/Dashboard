from flask import Blueprint, request, jsonify
from flask_cors import CORS
import json
import bcrypt
import requests
from datetime import datetime
import secrets

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
    register will add the user injsonation to the database of our platejson.
    @login = login of the user(email).\n
    @password = password of the user.\n
    @admin = the admin permission of the user in our platejson. (1 || 0) \n

    example of request :
        http://127.0.0.1:5000/register
            login=simon1.provost@epitech.eu
            password=1p54er7H#
            admin=1
    :return: <br>
    json with success 404 if it doesn't works <br>
    json with the key in the databse if it was a success.<br>

    """
    from index import db, user

    login = request.json["login"]
    password = request.json["password"]
    admin = request.json["admin"]

    hashed = makePasswordHash(password)

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['email'] == login:
            return jsonify({"success": 404, "message": "An account already exists with this email address"})

    access_token = secrets.token_hex(20)
    loginUser = {"email": login, "password": hashed, "admin": admin, "access_token": "0"}
    db.child("users").push(loginUser, user['idToken'])
    # return a success
    return jsonify({"success": 200, "message": "User registered.", "access_token": access_token})


@loginManagement.route('/login', methods=['POST'])
def login():
    """
    login will login the user and give an access token from our API if the user log correspond to anything in the database.
    @login = login of the user(email).\n
    @password = password of the user.\n

    example of request :
        http://127.0.0.1:5000/login
            login=simon1.provost@epitech.eu
            password=1p54er7H#
    :return: <br>
        json with success 404 if it doesn't works <br>
        json with the access_token if it was a success loggin.<br>

    """
    from index import db, user

    login = request.json["login"]
    password = request.json["password"]

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['email'] == login:
            if isPasswordValid(all_users[x]['password'], password):
                # update access token in database
                access_token = secrets.token_hex(20)
                db.child("users").child(x).update({"access_token": access_token}, user['idToken'])
                return jsonify({"success": 200, "access_token": access_token})
            else:
                return jsonify({"success": 404, "message": "Wrong password or username"})

    return jsonify({"success": 404, "message": "Wrong password or username"})


@loginManagement.route('/delete', methods=['POST'])
def delete():
    """
       delete will delete the user of the database with the loggin injsonation given in injsonation.
       @login = login of the user(email).\n
       @access_token = Token of the user doing the request\n 

        example of request :
            http://127.0.0.1:5000/delete
                login=simon1.provost@epitech.eu
                access_token=$2b$12$mmML0e8FfPoKsLKyrTidje7lf9erfSu2OkV4NOUV.NuK7IF4z6CoW

       :return: <br>
           json with success 404 if it doesn't works <br>
           json with success 200 if it was a success. br>

       """

    from index import db, user

    login = request.json["login"]
    access_token = request.json["access_token"]
    right_access = 0

    # check user who own access_token got admin right

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == access_token and all_users[x]["admin"] == "1":
            right_access = 1
            break
    if right_access == 1:
        for x in all_users:
            if all_users[x]["email"] == login:
                db.child("users").child(x).remove(user['idToken'])
                return jsonify({"success": 200, "message": "user deleted."})

    return jsonify({"success": 404, "message": "anything found in the database."})


@loginManagement.route('/permission', methods=['POST'])
def modifyPermission():
    """
    modifyPermission will change the permission admin of a specific user give in paramets.\n
    @login = login of the user(email).\n
    @access_token = Token of the user doing the request.\n
    @admin = new permission that you need to change.\n

     example of request :
        http://127.0.0.1:5000/register
            login=simon1.provost@epitech.eu
            access_token=$2b$12$mmML0e8FfPoKsLKyrTidje7lf9erfSu2OkV4NOUV.NuK7IF4z6CoW
            admin=1

    :return: json string will be return.<br>
        success 404 + message if it doesn't works.<br>
        Success 200 + message if it is well updated.<br>
    """
    from index import db, user

    login = request.json["login"]
    access_token = request.json["access_token"]
    admin = request.json["admin"]
    right_access = 0
    # check user who own access_token got admin right

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == access_token and all_users[x]["admin"] == "1":
            right_access = 1
            break
    if right_access == 1:
        for x in all_users:
            if all_users[x]["email"] == login:
                db.child("users").child(x).update({"admin": admin}, user['idToken'])
                return jsonify({"success": 200, "message": "Account updated"})
    
    return jsonify({"success": 404, "message": "anything found in the database."})
