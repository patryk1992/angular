angular.module("Blue").controller("LoginIndexController", ['$scope', '$rootScope', '$location', 'AuthenticationService', '$http', 'Base64', '$window', "$cookieStore",
    function($scope, $rootScope, $location, AuthenticationService, $http, Base64, $window, $cookieStore) {
        // reset login status
        AuthenticationService.ClearCredentials();
        var controller = this;
        controller.login = login;
        controller.logout = logout;
        controller.isAuthorized = isAuthorized;

        function login() {
            AuthenticationService.ClearCredentials();
            var tab = "";
            controller.username = this.inputLogin;
            controller.password = this.inputPassword;
            $http({
                method: 'GET',
                url: '/dataprocessing/rest-api/login',
                headers: {
                    'Authorization': 'Basic ' + Base64.encode(controller.username + ':' + controller.password)
                }
            }).success(function(data) {
                AuthenticationService.SetCredentials(controller.username, controller.password, data.roleName);
            }).error(function(data) {
                $window.alert(JSON.stringify(data));
            });

        };

        function logout() {
            AuthenticationService.ClearCredentials();
        };

        function isAuthorized() {
            var globals = $cookieStore.get('globals');
            if (globals == undefined) {
                return false;
            } else {
                return true;
            }

        };
    }
]);
