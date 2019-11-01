import unittest

import requests
from requests import HTTPError
from loginManagement import *


class UnitTestsLoginManagement(unittest.TestCase):

    def testRegisterAlreadyExist(self):

        # api-endpoint
        url = "http://127.0.0.1:5000/register"
        login = "simon1.provost@epitech.eu"
        password = "dasboard1234"
        admin = "1"

        PARAMS = {
            'login': login,
            'password': password,
            'admin': admin,
        }

        try:
            response = requests.post(url=url, data=PARAMS)
            response.raise_for_status()
        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6
        else:
            str = '{"error": "404", "message": "An account already exists with this email address"}'
            self.assertEqual(response.text, str)
            return
        self.assertEqual(1, 2)

    def testRegisterDidNotExist(self):

        # api-endpoint
        url = "http://127.0.0.1:5000/register"
        login = "unitTestDashBoard@epitech.eu"
        password = "dasboard1234"
        admin = "1"

        PARAMS = {
            'login': login,
            'password': password,
            'admin': admin,
        }

        try:
            response = requests.post(url=url, data=PARAMS)
            response.raise_for_status()
        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6
        else:
            str = '{"success": "200", "message": "user registered."}'
            self.assertEqual(response.text, str)

            # api-endpoint
            url = "http://127.0.0.1:5000/delete"
            login = "unitTestDashBoard@epitech.eu"
            access_token = "3e7757969ba10a3cce9cc3615f0a50fbe9e0fca9"

            PARAMS = {
                'login': login,
                'access_token': access_token,
            }

            try:
                response = requests.post(url=url, data=PARAMS)
                response.raise_for_status()
            except HTTPError as http_err:
                print(f'HTTP error occurred: {http_err}')  # Python 3.6
            except Exception as err:
                print(f'Other error occurred: {err}')  # Python 3.6
            else:
                print("OUIII")
                str = '{"success": "200", "message": "user deleted."}'
                self.assertEqual(response.text, str)
                return
            return
        self.assertEqual(1, 2)

    def testDeleteDoesntExist(self):

        # api-endpoint
        url = "http://127.0.0.1:5000/delete"
        login = "PUTE@epitech.eu"
        access_token = "3e7757969ba10a3cce9cc3615f0a50fbe9e0fca9"

        PARAMS = {
            'login': login,
            'access_token': access_token,
        }

        try:
            response = requests.post(url=url, data=PARAMS)
            response.raise_for_status()
        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6
        else:
            str = '{"error": "404", "message": "Either the access_token doesn\'t have the right access or your user didn\'t exist in our database."}'
            self.assertEqual(response.text, str)
            return
        self.assertEqual(1, 2)

    def testManagePermissionWithRightAccessToken(self):

        # api-endpoint
        url = "http://127.0.0.1:5000/register"
        login = "unitTestDashBoard@epitech.eu"
        password = "dasboard1234"
        admin = "0"

        PARAMS = {
            'login': login,
            'password': password,
            'admin': admin,
        }

        try:
            response = requests.post(url=url, data=PARAMS)
            response.raise_for_status()
        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6
        else:
            str = '{"success": "200", "message": "user registered."}'
            self.assertEqual(response.text, str)
            url = "http://127.0.0.1:5000/permission"
            login = "unitTestDashBoard@epitech.eu"
            access_token = "3e7757969ba10a3cce9cc3615f0a50fbe9e0fca9"
            admin = "1"

            PARAMS = {
                'login': login,
                'access_token': access_token,
                'admin': admin,
            }

            try:
                response = requests.post(url=url, data=PARAMS)
                response.raise_for_status()
            except HTTPError as http_err:
                print(f'HTTP error occurred: {http_err}')  # Python 3.6
            except Exception as err:
                print(f'Other error occurred: {err}')  # Python 3.6
            else:
                str = '{"success": "200", "message": "Account updated"}'
                self.assertEqual(response.text, str)
                # api-endpoint
                url = "http://127.0.0.1:5000/delete"
                login = "unitTestDashBoard@epitech.eu"
                access_token = "3e7757969ba10a3cce9cc3615f0a50fbe9e0fca9"

                PARAMS = {
                    'login': login,
                    'access_token': access_token,
                }

                try:
                    response = requests.post(url=url, data=PARAMS)
                    response.raise_for_status()
                except HTTPError as http_err:
                    print(f'HTTP error occurred: {http_err}')  # Python 3.6
                except Exception as err:
                    print(f'Other error occurred: {err}')  # Python 3.6
                else:
                    str = '{"success": "200", "message": "user deleted."}'
                    self.assertEqual(response.text, str)
                    return
                return
            self.assertEqual(1, 2)
        self.assertEqual(1, 2)

    def testManagePermissionWithouttRightAccessToken(self):

        # api-endpoint
        url = "http://127.0.0.1:5000/register"
        login = "unitTestDashBoard@epitech.eu"
        password = "dasboard1234"
        admin = "0"

        PARAMS = {
            'login': login,
            'password': password,
            'admin': admin,
        }

        try:
            response = requests.post(url=url, data=PARAMS)
            response.raise_for_status()
        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6
        else:
            str = '{"success": "200", "message": "user registered."}'
            self.assertEqual(response.text, str)
            url = "http://127.0.0.1:5000/permission"
            login = "unitTestDashBoard@epitech.eu"
            access_token = "BAD/ACCESS/TOKEN"
            admin = "1"

            PARAMS = {
                'login': login,
                'access_token': access_token,
                'admin': admin,
            }

            try:
                response = requests.post(url=url, data=PARAMS)
                response.raise_for_status()
            except HTTPError as http_err:
                print(f'HTTP error occurred: {http_err}')  # Python 3.6
            except Exception as err:
                print(f'Other error occurred: {err}')  # Python 3.6
            else:
                str = '{"error": "404", "message": "Either the access_token doesn\'t have the right access or your user didn\'t exist in our database."}'
                self.assertEqual(response.text, str)
                # api-endpoint
                url = "http://127.0.0.1:5000/delete"
                login = "unitTestDashBoard@epitech.eu"
                access_token = "3e7757969ba10a3cce9cc3615f0a50fbe9e0fca9"

                PARAMS = {
                    'login': login,
                    'access_token': access_token,
                }

                try:
                    response = requests.post(url=url, data=PARAMS)
                    response.raise_for_status()
                except HTTPError as http_err:
                    print(f'HTTP error occurred: {http_err}')  # Python 3.6
                except Exception as err:
                    print(f'Other error occurred: {err}')  # Python 3.6
                else:
                    str = '{"success": "200", "message": "user deleted."}'
                    self.assertEqual(response.text, str)
                    return
                return
            self.assertEqual(1, 2)
        self.assertEqual(1, 2)


if __name__ == '__main__':
    UnitTestsLoginManagement.main()
