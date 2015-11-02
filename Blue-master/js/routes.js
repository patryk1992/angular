             
angular.module("Blue").config(function($routeProvider){
$routeProvider.when('/',{
        templateUrl: 'templates/pages/users/index.html',
        })
		.when('/register',{
        templateUrl: 'templates/pages/register/register.html',
        })
		.when('/login',{
        templateUrl: 'templates/pages/login/login.html',
        })
		.when('/users',{
        templateUrl: 'templates/pages/users/index.html',
        });
});