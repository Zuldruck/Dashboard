from flask import Flask
from footballAPI import footballpage
from loginManagement import loginManagement
from cocktailAPI import cocktailPage
from openDataMontpellierAPI import openDataMontpellier
from githubAPI import github

from flask import jsonify
import pyrebase
import json
import time
from flask_cors import CORS
from OpenSSL import SSL
import os

cer = os.path.join(os.path.dirname(__file__), 'server.crt')
key = os.path.join(os.path.dirname(__file__), 'server.key')

app = Flask(__name__)
app.register_blueprint(footballpage)
app.register_blueprint(loginManagement)
app.register_blueprint(cocktailPage)
app.register_blueprint(openDataMontpellier)
app.register_blueprint(github)


CORS(app)

config = {
    "apiKey": "AIzaSyAT3jR4FM2Aj-V90sYfVpOv2O96j2H6x5Y",
    "authDomain": "dashboard-d7ebf.firebaseapp.com",
    "databaseURL": "https://dashboard-d7ebf.firebaseio.com",
    "storageBucket": "dashboard-d7ebf.appspot.com",
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()
auth = firebase.auth()
user = auth.sign_in_with_email_and_password("lucas.sanchez@epitech.eu", "dashboard1234")

@app.route('/about')
def about():
    file = open("../about.json", "r")
    content = file.read()
    about_json = json.loads(content)
    about_json["server"]["current_time"] = int(time.time())
    return jsonify(about_json)

if __name__ == '__main__':
    context = (cer, key)
    app.run(host='0.0.0.0', debug=True, ssl_context=context)
