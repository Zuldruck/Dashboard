import json
import unittest

import flask
import requests
from requests import HTTPError


class UnitTestsLoginManagement(unittest.TestCase):

    def testRegisterAlreadyExist(self):

        # api-endpoint
        url = "https://127.0.0.1:5000/register"
        login = "simon1.provost@epitech.eu"
        password = "dasboard1234"
        admin = "1"

        PARAMS = {
            'login': login,
            'password': password,
            'admin': admin,
        }

        try:
            response = requests.post(url=url, json=PARAMS, verify=False)
            response.raise_for_status()
        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6
        else:
            print("debug : " + str(response.text.find('"success": 404')))
            self.assertGreater(response.text.find('"success": 404'), -1)
            return
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

        try:
            response = requests.post(url=url, json=PARAMS, verify=False)
            response.raise_for_status()
        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6
        else:
            self.assertGreater(response.text.find('"success": 200'), -1)

            # api-endpoint
            url = "https://127.0.0.1:5000/delete"
            login = "unitTestDashBoard@epitech.eu"
            access_token = "5bb64545a192205b4ceaee83383206adff987fa9"

            PARAMS = {
                'login': login,
                'access_token': access_token,
            }

            try:
                response = requests.post(url=url, json=PARAMS, verify=False)
                response.raise_for_status()
            except HTTPError as http_err:
                print(f'HTTP error occurred: {http_err}')  # Python 3.6
            except Exception as err:
                print(f'Other error occurred: {err}')  # Python 3.6
            else:
                self.assertGreater(response.text.find('"success": 200'), -1)
                return
            return
        self.assertEqual(1, 2)

    def testDeleteDoesntExist(self):

        # api-endpoint
        url = "https://127.0.0.1:5000/delete"
        login = "PUTE@epitech.eu"
        access_token = "5bb64545a192205b4ceaee83383206adff987fa9"

        PARAMS = {
            'login': login,
            'access_token': access_token,
        }

        try:
            response = requests.post(url=url, json=PARAMS, verify=False)
            response.raise_for_status()
        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6
        else:
            self.assertGreater(response.text.find('"success": 404'), -1)
            return
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

        try:
            response = requests.post(url=url, json=PARAMS, verify=False)
            response.raise_for_status()
        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6
        else:
            self.assertGreater(response.text.find('"success": 200'), -1)
            url = "https://127.0.0.1:5000/permission"
            login = "unitTestDashBoard@epitech.eu"
            access_token = "5bb64545a192205b4ceaee83383206adff987fa9"
            admin = "1"

            PARAMS = {
                'login': login,
                'access_token': access_token,
                'admin': admin,
            }

            try:
                response = requests.post(url=url, json=PARAMS, verify=False)
                response.raise_for_status()
            except HTTPError as http_err:
                print(f'HTTP error occurred: {http_err}')  # Python 3.6
            except Exception as err:
                print(f'Other error occurred: {err}')  # Python 3.6
            else:
                self.assertGreater(response.text.find('"success": 200'), -1)
                # api-endpoint
                url = "https://127.0.0.1:5000/delete"
                login = "unitTestDashBoard@epitech.eu"
                access_token = "5bb64545a192205b4ceaee83383206adff987fa9"

                PARAMS = {
                    'login': login,
                    'access_token': access_token,
                }

                try:
                    response = requests.post(url=url, json=PARAMS, verify=False)
                    response.raise_for_status()
                except HTTPError as http_err:
                    print(f'HTTP error occurred: {http_err}')  # Python 3.6
                except Exception as err:
                    print(f'Other error occurred: {err}')  # Python 3.6
                else:
                    self.assertGreater(response.text.find('"success": 200'), -1)
                    return
                return
            self.assertEqual(1, 2)
        self.assertEqual(1, 2)

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

        try:
            response = requests.post(url=url, json=PARAMS, verify=False)
            response.raise_for_status()
        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6
        else:
            self.assertGreater(response.text.find('"success": 200'), -1)
            url = "https://127.0.0.1:5000/permission"
            login = "unitTestDashBoard@epitech.eu"
            access_token = "BAD/ACCESS/TOKEN"
            admin = "1"

            PARAMS = {
                'login': login,
                'access_token': access_token,
                'admin': admin,
            }

            try:
                response = requests.post(url=url, json=PARAMS, verify=False)
                response.raise_for_status()
            except HTTPError as http_err:
                print(f'HTTP error occurred: {http_err}')  # Python 3.6
            except Exception as err:
                print(f'Other error occurred: {err}')  # Python 3.6
            else:
                self.assertGreater(response.text.find('"success": 404'), -1)
                # api-endpoint
                url = "https://127.0.0.1:5000/delete"
                login = "unitTestDashBoard@epitech.eu"
                access_token = "5bb64545a192205b4ceaee83383206adff987fa9"

                PARAMS = {
                    'login': login,
                    'access_token': access_token,
                }

                try:
                    response = requests.post(url=url, json=PARAMS, verify=False)
                    response.raise_for_status()
                except HTTPError as http_err:
                    print(f'HTTP error occurred: {http_err}')  # Python 3.6
                except Exception as err:
                    print(f'Other error occurred: {err}')  # Python 3.6
                else:
                    self.assertGreater(response.text.find('"success": 200'), -1)
                    return
                return
            self.assertEqual(1, 2)
        self.assertEqual(1, 2)


if __name__ == '__main__':
    UnitTestsLoginManagement.main()
