var app = angular.module("MetronicApp");

app.service('UserInfo', ['$http', 'authentication',
    function($http, authentication) {
        var auth = {
            headers: {
                Authorization: 'Bearer ' + authentication.getToken()
            }
        };

        var getTasks = function(task) {
            return $http.get('/api/getTasks', auth);
        };

        return {
            getTasks: getTasks
        };
    }
]);