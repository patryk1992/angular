angular.module("Blue").controller("LoginIndexController", ['$scope', '$rootScope', '$location', 'AuthenticationService', '$http', 'Base64', '$window', '$cookieStore','USER_ROLES',
    function($scope, $rootScope, $location, AuthenticationService, $http, Base64, $window, $cookieStore,USER_ROLES) {
        // reset login status
       // AuthenticationService.ClearCredentials();
        var controller = this;
        controller.login = login;
        controller.logout = logout;
        controller.isAuthorized = isAuthorized;
        controller.checkRole = checkRole;


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
                AuthenticationService.SetCredentials(controller.username, controller.password, data);
                 $location.path('/classList');
            }).error(function(data) {
                $window.alert(JSON.stringify(data));
            });

        };

        function logout() {
            AuthenticationService.ClearCredentials();
             $location.path('/login');
        };

        function isAuthorized() {
            var globals = $cookieStore.get('globals');
            if (globals == undefined) {
                return false;
            } else {
                return true;
            }

        };
        function checkRole() {
            var globals = $cookieStore.get('globals');
            if (globals == undefined) {
                return false;
            } else {
                return true;
            }

        };
    }
]);
