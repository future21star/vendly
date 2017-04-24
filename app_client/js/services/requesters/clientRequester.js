/**
 * Created by Adam on 3/29/17.
 */
/**
 * Created by Adam on 3/16/17.
 */
var app = angular.module("MetronicApp");

app.service('clientRequester', ['$http', 'authentication',
  function ($http, authentication) {

    auth = {
      headers: {
        Authorization: 'Bearer ' + authentication.getToken()
      }
    };

    get = function (clientId) {
      return $http.get('/api/clients/' + clientId, auth);
    };

    return {
      get: get
    };
  }
]);