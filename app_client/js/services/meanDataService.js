/**
 * Created by Adam on 3/16/17.
 */
var app = angular.module("MetronicApp");

app.service('meanData', ['$http', 'authentication',
  function ($http, authentication) {

    auth = {
      headers: {
        Authorization: 'Bearer ' + authentication.getToken()
      }
    };

    getProfile = function () {
      return $http.get('/api/profile', auth);
    };

    updateProfile = function (profile) {
      return $http.put('/api/updateProfile', profile, auth);
    };

    getRolodex = function () {
      return $http.get('/api/rolodex', auth);
    };

    saveContact = function (contact) {
      return $http.post('/api/saveContact', contact, auth);
    };

    updateContact = function (contact, onSuccess, onFailure) {
      $http.put('/api/updateContact', contact, auth).then(onSuccess, onFailure)
    };

    getCalendar = function () {
      return $http.get('/api/calendar', auth);
    };

    saveEvent = function (event) {
      return $http.post('/api/saveEvent', event, auth);
    };

    updateEvent = function (event) {
      return $http.put('/api/updateEvent', event, auth);
    };

    getBooklets = function () {
      return $http.get('/api/booklets', auth);
    };

    saveBooklet = function (booklet) {
      return $http.post('/api/saveBooklet', booklet, auth);
    };

    updateBooklet = function (booklet) {
      return $http.put('/api/updateBooklet', booklet, auth);
    };

    setActiveHandbook = function (booklet) {
      return $http.put('/api/setActiveHandbook', booklet, auth);
    };

    getActiveHandbook = function () {
      return $http.get('/api/getActiveHandbook', auth);
    };

    sendNewUserInviteEmail = function (user) {
      return $http.post('/api/sendNewUserInviteEmail', user, auth);
    };

    sendEmail = function (email, subject, content) {
      return $http.post('/api/sendEmail', user, auth);
    };

    getDocuments = function () {
      return $http.get('/api/getFiles', auth);
    };

    saveDocument = function (document) {
      return $http.post('/api/saveFile', document, auth);
    };

    signUpUser = function (user) {
      return $http.post('/api/signUpUser', user, auth);
    };

    saveEmployee = function (employee) {
      return $http.post('/api/saveEmployee', employee, auth);
    };

    updateEmployees = function (employee) {
      return $http.put('/api/updateEmployees', employee, auth);
    };

    getEmployees = function () {
      return $http.get('/api/getEmployees', auth);
    };

    return {
      getProfile: getProfile,
      updateProfile: updateProfile,
      getRolodex: getRolodex,
      saveContact: saveContact,
      updateContact: updateContact,
      getCalendar: getCalendar,
      saveEvent: saveEvent,
      updateEvent: updateEvent,
      getBooklets: getBooklets,
      saveBooklet: saveBooklet,
      updateBooklet: updateBooklet,
      getActiveHandbook: getActiveHandbook,
      setActiveHandbook: setActiveHandbook,
      sendNewUserInviteEmail: sendNewUserInviteEmail,
      sendEmail: sendEmail,
      getDocuments: getDocuments,
      saveDocument: saveDocument,
      signUpUser: signUpUser,
      saveEmployee: saveEmployee,
      updateEmployees: updateEmployees,
      getEmployees: getEmployees
    };
  }
]);