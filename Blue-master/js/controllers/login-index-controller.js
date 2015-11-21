             

angular.module("Blue").controller("LoginIndexController",  ['$scope', '$rootScope', '$location','AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();
  		var controller=this; 
  		controller.login=login;
        function login() {
        	var tab="";
        	
            AuthenticationService.SetCredentials(this.username,this.password);
        };
    }]);