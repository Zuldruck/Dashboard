import requests
from flask import Blueprint, request, jsonify
from requests import HTTPError
import json

github = Blueprint('github', __name__)


@github.route('/services/github/popularRepositories', methods=['POST'])
def getpopularRepositories():
    from index import db, user

    access_token = request.json["access_token"]
    language = request.json["language"]
    sort = request.json["sort"]
    order = "desc"

    repo = []
    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:

            url = "https://api.github.com/search/repositories"
            PARAMS = {
                'q': "language:" + language,
                'sort': sort,
                'order': order,
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
                for x in response.json()["items"]:
                    if x == "error":
                        print("Error Request: " + response.json()['message'])
                        return jsonify({"message": "Error when fetching github repository."}), 404
                    tmpDict = {
                        "name": x["name"],
                        "stars": x["watchers_count"],
                        "forks": x["forks"]
                    }
                    repo.append(tmpDict)
                return jsonify(repo), 200
    return jsonify({"message": "Github problem occured.", "access_token": access_token}), 404


@github.route('/services/github/userInfo', methods=['POST'])
def getuserInfo():
    from index import db, user

    access_token_github = request.json["accessTokenGithub"]
    access_token = request.json["access_token"]
    userName = request.json["name"]

    infoUser = []
    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]['access_token'] == access_token:

            url = "https://api.github.com/users/" + userName

            try:
                # sending get request and saving the response as response object
                response = requests.get(url=url)

                # If the response was successful, no Exception will be raised
                response.raise_for_status()
            except HTTPError as http_err:
                print(f'HTTP error occurred: {http_err}')  # Python 3.6
            except Exception as err:
                print(f'Other error occurred: {err}')  # Python 3.6
            else:
                infoUser = {
                    "name": response.json()["name"],
                    "company": response.json()["company"],
                    "location": response.json()["location"],
                    "bio": response.json()["bio"],
                    "followers": response.json()["followers"],
                    "following": response.json()["following"]
                }
            return jsonify(infoUser), 200
    return jsonify({"message": "Github problem occured.", "access_token": access_token}), 404


def isRightToken(token):
    from index import db, user

    all_users = db.child("users").get(user['idToken']).val()

    for x in all_users:
        if all_users[x]["access_token"] == token:
            return 1
    return 0


@github.route('/services/github/userFollowers', methods=['POST'])
def getUserFollowers():
    from index import db, user

    access_token = request.json["access_token"]
    access_token_github = request.json["access_token_github"]

    followers = []

    if isRightToken(str(access_token)) == 0:
        return jsonify({"message": "Error occurred with your access token."}), 404

    url = "https://api.github.com/user/followers"
    PARAMS = {
        'Authorization': "token " + access_token_github,
    }

    try:
        # sending get request and saving the response as response object
        response = requests.get(url=url, headers=PARAMS)

        # If the response was successful, no Exception will be raised
        response.raise_for_status()
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')  # Python 3.6
    except Exception as err:
        print(f'Other error occurred: {err}')  # Python 3.6
    else:
        json_data = json.loads(response.text)
        for x in json_data:
            infoUser = {
                "name": x["login"],
            }
            followers.append(infoUser)
        return jsonify(followers), 200
    return jsonify({"message": "Error occurred with /user/followers."}), 404


@github.route('/services/github/languagesList', methods=['POST'])
def getlanguagesList():
    access_token = request.json["access_token"]

    if isRightToken(str(access_token)) == 0:
        return jsonify({"message": "Error occurred with your access token."}), 404

    tmpDict =  [
        "4th Dimension/4D",
        "ABAP",
        "ABC",
        "ActionScript",
        "Ada",
        "Agilent VEE",
        "Algol",
        "Alice",
        "Angelscript",
        "Apex",
        "APL",
        "AppleScript",
        "Arc",
        "Arduino",
        "ASP",
        "AspectJ",
        "Assembly",
        "ATLAS",
        "Augeas",
        "AutoHotkey",
        "AutoIt",
        "AutoLISP",
        "Automator",
        "Avenue",
        "Awk",
        "Bash",
        "Visual Basic",
        "bc",
        "BCPL",
        "BETA",
        "BlitzMax",
        "Boo",
        "Bourne Shell",
        "Bro",
        "C",
        "C Shell",
        "C#",
        "C++",
        "C++/CLI",
        "C-Omega",
        "Caml",
        "Ceylon",
        "CFML",
        "cg",
        "Ch",
        "CHILL",
        "CIL",
        "CL (OS/400)",
        "Clarion",
        "Clean",
        "Clipper",
        "Clojure",
        "CLU",
        "COBOL",
        "Cobra",
        "CoffeeScript",
        "ColdFusion",
        "COMAL",
        "Common Lisp",
        "Coq",
        "cT",
        "Curl",
        "D",
        "Dart",
        "DCL",
        "DCPU-16 ASM",
        "Delphi/Object Pascal",
        "DiBOL",
        "Dylan",
        "E",
        "eC",
        "Ecl",
        "ECMAScript",
        "EGL",
        "Eiffel",
        "Elixir",
        "Emacs Lisp",
        "Erlang",
        "Etoys",
        "Euphoria",
        "EXEC",
        "F#",
        "Factor",
        "Falcon",
        "Fancy",
        "Fantom",
        "Felix",
        "Forth",
        "Fortran",
        "Fortress",
        "Gambas",
        "GNU Octave",
        "Go",
        "Google AppsScript",
        "Gosu",
        "Groovy",
        "Haskell",
        "haXe",
        "Heron",
        "HPL",
        "HyperTalk",
        "Icon",
        "IDL",
        "Inform",
        "Informix-4GL",
        "INTERCAL",
        "Io",
        "Ioke",
        "J",
        "J#",
        "JADE",
        "Java",
        "Java FX Script",
        "JavaScript",
        "JScript",
        "JScript.NET",
        "Julia",
        "Korn Shell",
        "Kotlin",
        "LabVIEW",
        "Ladder Logic",
        "Lasso",
        "Limbo",
        "Lingo",
        "Lisp",
        "Logo",
        "Logtalk",
        "LotusScript",
        "LPC",
        "Lua",
        "Lustre",
        "M4",
        "MAD",
        "Magic",
        "Magik",
        "Malbolge",
        "MANTIS",
        "Maple",
        "Mathematica",
        "MATLAB",
        "Max/MSP",
        "MAXScript",
        "MEL",
        "Mercury",
        "Mirah",
        "Miva",
        "ML",
        "Monkey",
        "Modula-2",
        "Modula-3",
        "MOO",
        "Moto",
        "MS-DOS Batch",
        "MUMPS",
        "NATURAL",
        "Nemerle",
        "Nimrod",
        "NQC",
        "NSIS",
        "Nu",
        "NXT-G",
        "Oberon",
        "Object Rexx",
        "Objective-C",
        "Objective-J",
        "OCaml",
        "Occam",
        "ooc",
        "Opa",
        "OpenCL",
        "OpenEdge ABL",
        "OPL",
        "Oz",
        "Paradox",
        "Parrot",
        "Pascal",
        "Perl",
        "PHP",
        "Pike",
        "PILOT",
        "PL/I",
        "PL/SQL",
        "Pliant",
        "PostScript",
        "POV-Ray",
        "PowerBasic",
        "PowerScript",
        "PowerShell",
        "Processing",
        "Prolog",
        "Puppet",
        "Pure Data",
        "Python",
        "Q",
        "R",
        "Racket",
        "REALBasic",
        "REBOL",
        "Revolution",
        "REXX",
        "Ruby",
        "Rust",
        "S",
        "S-PLUS",
        "SAS",
        "Sather",
        "Scala",
        "Scheme",
        "Scilab",
        "Scratch",
        "sed",
        "Seed7",
        "Self",
        "Shell",
        "SIGNAL",
        "Simula",
        "Simulink",
        "Slate",
        "Smalltalk",
        "Smarty",
        "SPARK",
        "SPSS",
        "SQR",
        "Squeak",
        "Squirrel",
        "Standard ML",
        "Suneido",
        "SuperCollider",
        "TACL",
        "Tcl",
        "Tex",
        "thinBasic",
        "TOM",
        "Transact-SQL",
        "Turing",
        "TypeScript",
        "Vala/Genie",
        "VBScript",
        "Verilog",
        "VHDL",
        "VimL",
        "Visual Basic .NET",
        "WebDNA",
        "Whitespace",
        "X10",
        "xBase",
        "XBase++",
        "Xen",
        "XPL",
        "XSLT",
        "XQuery",
        "yacc",
        "Yorick",
        "Z shell"]
    return jsonify(tmpDict), 200
