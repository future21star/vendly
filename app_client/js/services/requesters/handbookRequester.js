/**
 * Created by Adam on 4/23/17.
 */

var app = angular.module("MetronicApp");

app.service('handbookRequester', ['$http', 'authentication',
  function ($http, authentication) {

    auth = {
      headers: {
        Authorization: 'Bearer ' + authentication.getToken()
      }
    };

    get = function (handbookId) {
      return $http.get('/api/handbooks/' + handbookId, auth);
    };

    return {
      get: get
    };
  }
]);