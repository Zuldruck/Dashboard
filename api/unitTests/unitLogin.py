import json
import unittest

import flask
import requests
from requests import HTTPError


class UnitTestsLoginManagement(unittest.TestCase):

    def testRegisterAlreadyExist(self):

        # api-endpoint
        url = "https://0.0.0.0:5000/register"
        login = "simon1.provost@epitech.eu"
        password = "dasboard1234"
        admin = "1"

        PARAMS = {
            'login': login,
            'password': password,
            'admin': admin,
        }

        response = requests.post(url=url, json=PARAMS, verify=False)
        if response.status_code == 404:
            self.assertGreater(response.text.find('An account already exists with this email address'), -1)
        else:
            self.assertEqual(1, 2)

    def testRegisterDidNotExist(self):

        # api-endpoint
        url = "https://127.0.0.1:5000/register"
        login = "unitTestDashBoard@epitech.eu"
        password = "dasboard1234"
        admin = "1"

        PARAMS = {
            'login': login,
            'password': password,
            'admin': admin,
        }

        response = requests.post(url=url, json=PARAMS, verify=False)
        if response.status_code == 200:
            self.assertGreater(response.text.find('User registered.'), -1)
            print("JE SUIS LA")
            # api-endpoint
            url = "https://127.0.0.1:5000/delete"
            login = "unitTestDashBoard@epitech.eu"
            access_token = "bfac2a1da953e6d1df10d42747defc4391a7f918"

            PARAMS = {
                'login': login,
                'access_token': access_token,
            }

            response = requests.post(url=url, json=PARAMS, verify=False)
            print("debug : " + str(response.status_code))
            if response.status_code == 200:
                self.assertGreater(response.text.find('user deleted.'), -1)
            else:
                self.assertEqual(3, 2)
        else:
            self.assertEqual(1, 2)

    def testDeleteDoesntExist(self):

        # api-endpoint
        url = "https://127.0.0.1:5000/delete"
        login = "PUTE@epitech.eu"
        access_token = "bfac2a1da953e6d1df10d42747defc4391a7f918"

        PARAMS = {
            'login': login,
            'access_token': access_token,
        }

        response = requests.post(url=url, json=PARAMS, verify=False)
        if response.status_code == 404:
            self.assertGreater(response.text.find('Either the access_token doesn\'t have the right access or your user doesn\'t exist in our database.'), -1)
        else:
            self.assertEqual(1, 2)

    def testManagePermissionWithRightAccessToken(self):

        # api-endpoint
        url = "https://127.0.0.1:5000/register"
        login = "unitTestDashBoard@epitech.eu"
        password = "dasboard1234"
        admin = "0"

        PARAMS = {
            'login': login,
            'password': password,
            'admin': admin,
        }

        response = requests.post(url=url, json=PARAMS, verify=False)
        print("BITCHASS : " + str(response.status_code))
        if response.status_code == 200:
            self.assertGreater(response.text.find('User registered.'), -1)
            url = "https://127.0.0.1:5000/modifyPermission"
            login = "unitTestDashBoard@epitech.eu"
            access_token = "bfac2a1da953e6d1df10d42747defc4391a7f918"
            admin = "1"

            PARAMS = {
                'login': login,
                'access_token': access_token,
                'admin': admin,
            }

            response = requests.post(url=url, json=PARAMS, verify=False)
            print("CHIEF DEL CHIEF : " + str(response.status_code))
            if response.status_code == 200:
                self.assertGreater(response.text.find('Account updated'), -1)
                # api-endpoint
                url = "https://127.0.0.1:5000/delete"
                login = "unitTestDashBoard@epitech.eu"
                access_token = "bfac2a1da953e6d1df10d42747defc4391a7f918"

                PARAMS = {
                    'login': login,
                    'access_token': access_token,
                }

                response = requests.post(url=url, json=PARAMS, verify=False)
                print("debug : " + str(response.status_code))
                if response.status_code == 200:
                    self.assertGreater(response.text.find('user deleted.'), -1)
                else:
                    self.assertEqual(8, 0)
                return
            else:
                self.assertEqual(9, 0)
                return
        else:
            self.assertEqual(1, 3)

    def testManagePermissionWithouttRightAccessToken(self):

        # api-endpoint
        url = "https://127.0.0.1:5000/register"
        login = "unitTestDashBoard@epitech.eu"
        password = "dasboard1234"
        admin = "0"

        PARAMS = {
            'login': login,
            'password': password,
            'admin': admin,
        }

        response = requests.post(url=url, json=PARAMS, verify=False)
        print("BITCHASS : " + str(response.status_code))
        if response.status_code == 200:
            self.assertGreater(response.text.find('User registered.'), -1)
            url = "https://127.0.0.1:5000/modifyPermission"
            login = "unitTestDashBoard@epitech.eu"
            access_token = "BAD/ACCESS/TOKEN"
            admin = "1"

            PARAMS = {
                'login': login,
                'access_token': access_token,
                'admin': admin,
            }

            response = requests.post(url=url, json=PARAMS, verify=False)
            print("BITCHASS#2 : " + str(response.status_code))
            if response.status_code == 404:
                self.assertGreater(response.text.find('Either the access_token doesn\'t have the right access or your user doesn\'t exist in our database.'), -1)
                # api-endpoint
                url = "https://127.0.0.1:5000/delete"
                login = "unitTestDashBoard@epitech.eu"
                access_token = "bfac2a1da953e6d1df10d42747defc4391a7f918"

                PARAMS = {
                    'login': login,
                    'access_token': access_token,
                }

                response = requests.post(url=url, json=PARAMS, verify=False)
                print("BITCHASS#2 : " + str(response.status_code))
                if response.status_code == 200:
                    self.assertGreater(response.text.find('user deleted.'), -1)
                else:
                    self.assertEqual(1, 2)
                return
            else:
                self.assertEqual(1, 2)
        else:
            self.assertEqual(1, 2)


if __name__ == '__main__':
    UnitTestsLoginManagement.main()
