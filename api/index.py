from flask import Flask
from footballAPI import footballpage

from flask import jsonify
import pyrebase
import json
import time

app = Flask(__name__)
app.register_blueprint(footballpage)

config = {
    "apiKey": "AIzaSyAT3jR4FM2Aj-V90sYfVpOv2O96j2H6x5Y",
    "authDomain": "dashboard-d7ebf.firebaseapp.com",
    "databaseURL": "https://dashboard-d7ebf.firebaseio.com",
    "storageBucket": "dashboard-d7ebf.appspot.com"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()
auth = firebase.auth()
user = auth.sign_in_with_email_and_password("lucas.sanchez@epitech.eu", "dashboard1234")


@app.route('/')
def root():
    users = db.child('users').get(user['idToken'])
    return jsonify(users.val())


@app.route('/about')
def about():
    file = open("../about.json", "r")
    content = file.read()
    about_json = json.loads(content)
    about_json["server"]["current_time"] = int(time.time())
    return jsonify(about_json)


if __name__ == '__main__':
    app.run()
