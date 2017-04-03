/**
 * Created by Adam on 3/16/17.
 */
var app = angular.module("MetronicApp");

app.service('meanData', ['$http', 'authentication',
    function($http, authentication) {

        var auth = {
            headers: {
                Authorization: 'Bearer ' + authentication.getToken()
            }
        };

        var getProfile = function() {
            return $http.get('/api/profile', auth);
        };

        var updateProfile = function(profile) {
            return $http.put('/api/updateProfile', profile, auth);
        };

        var getRolodex = function() {
            return $http.get('/api/rolodex', auth);
        };

        var saveContact = function(contact) {
            return $http.post('/api/saveContact', contact, auth);
        };

        var getCalendar = function() {
            return $http.get('/api/calendar', auth);
        };

        var saveEvent = function(event) {
            return $http.post('/api/saveEvent', event, auth);
        };

        var updateEvent = function(event) {
            return $http.put('/api/updateEvent', event, auth);
        };

        var getBooklets = function() {
            return $http.get('/api/booklets', auth);
        };

        var saveBooklet = function(booklet) {
            return $http.post('/api/saveBooklet', booklet, auth);
        };

        var updateBooklet = function(booklet) {
            return $http.put('/api/updateBooklet', booklet, auth);
        };

        var setActiveHandbook = function(booklet) {
            return $http.put('/api/setActiveHandbook', booklet, auth);
        };

        var getActiveHandbook = function() {
            return $http.get('/api/getActiveHandbook', auth);
        };

        var sendNewUserInviteEmail = function(user) {
            return $http.post('/api/sendNewUserInviteEmail', user, auth);
        };

        var sendEmail = function(email, subject, content) {
            return $http.post('/api/sendEmail', user, auth);
        };

        var getDocuments = function() {
            return $http.get('/api/getFiles', auth);
        };

        var saveDocument = function(document) {
            return $http.post('/api/saveFile', document, auth);
        };

        var signUpUser = function(user) {
            return $http.post('/api/signUpUser', user, auth);
        };

        var saveEmployee = function(employee) {
            return $http.post('/api/saveEmployee', employee, auth);
        };

        var updateEmployees = function(employee) {
            return $http.put('/api/updateEmployees', employee, auth);
        };

        var getEmployees = function() {
            return $http.get('/api/getEmployees', auth);
        };

        return {
            getProfile: getProfile,
            updateProfile: updateProfile,
            getRolodex: getRolodex,
            saveContact: saveContact,
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