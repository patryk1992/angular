             

angular.module("Blue").controller("LoginIndexController",  ['$scope', '$rootScope', '$location','AuthenticationService', '$http', 'Base64', '$window',
    function ($scope, $rootScope, $location, AuthenticationService, $http, Base64, $window) {
        // reset login status
        AuthenticationService.ClearCredentials();
  		var controller=this; 
  		controller.login=login;
        function login() {
        	AuthenticationService.ClearCredentials();
        	var tab="";
        	controller.username=this.inputLogin; 
        	controller.password=this.inputPassword;
        	$http({method: 'GET', 
				url: '/dataprocessing/rest-api/login', 	
				headers: {
					'Authorization': 'Basic '+Base64.encode(controller.username+':'+controller.password)	
				}
				}).success(function(data){
					AuthenticationService.SetCredentials(controller.username,controller.password);
				}).error(function(data){
                $window.alert(JSON.stringify(data));
            	});
           
        };
    }]);