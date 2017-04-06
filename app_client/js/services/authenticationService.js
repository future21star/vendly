/**
 * Created by Adam on 3/16/17.
 */
var app = angular.module("MetronicApp");

app.service('authentication', ['$http', '$window',
    function($http, $window) {

        var saveToken = function(token) {
            $window.localStorage['mean-token'] = token;
        };

        var clearToken = function() {
            $window.localStorage.removeItem('mean-token');
        };

        var getToken = function() {
            return $window.localStorage['mean-token'];
        };

        var isLoggedIn = function() {
            var token = getToken();
            var payload;

            if (token) {
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function() {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return {
                    email: payload.email,
                    name: payload.name
                };
            }
        };

        var register = function(user) {
            console.log(`User: ${JSON.stringify(user)}`);
            return $http.post('/api/register', user).success(function(data) {
                saveToken(data.token);
            });
        };

        var login = function(user) {
            return $http.post('/api/login', user).success(function(data) {
                saveToken(data.token);
            });
        };

        var logout = function() {
            clearToken();
        };

        var changePassword = function() {
            return $http.post('/api/changePassword', user).success(function(data) {
                saveToken(data.token);
            });
        };

        return {
            currentUser: currentUser,
            saveToken: saveToken,
            getToken: getToken,
            isLoggedIn: isLoggedIn,
            register: register,
            login: login,
            logout: logout,
            changePassword: changePassword
        };
    }
]);