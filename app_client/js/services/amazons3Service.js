/**
 * Created by Adam on 3/16/17.
 */
var app = angular.module("MetronicApp");

app.service('amazons3', ['$http', 'authentication',
    function($http, authentication) {
        var uploadFile = function(file) {
            sign_request(file).success(function(response) {
                upload(file.file, response.signed_request, response.url, function() {
                    // document.getElementById("preview").src = response.url
                });
            });
        };

        var uploadAvatar = function(file) {
            sign_avatar(file).success(function(response) {
                upload(file, response.signed_request, response.url, function() {
                    document.getElementById("preview").src = response.url
                });
            });
        };

        var getImage = function() {

        };

        function upload(file, signed_request, url, done) {
            var xhr = new XMLHttpRequest();
            xhr.open("PUT", signed_request);
            xhr.setRequestHeader('x-amz-acl', 'public-read');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    done()
                }
            };

            xhr.send(file)
        }

        function sign_request(file) {
            return $http.get("/api/sign?file_name=" + file.name + "&file_type=" + file.file.type, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        }

        function sign_avatar(file) {
            // TODO remove avatar naming and change to file.name
            return $http.get("/api/sign?file_name=" + 'avatar.png' + "&file_type=" + file.type, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        }

        return {
            uploadFile: uploadFile,
            uploadAvatar: uploadAvatar,
            getImage: getImage
        };
    }
]);
