             
angular.module("Blue").config(function($routeProvider){
$routeProvider.when('/',{
        templateUrl: 'templates/pages/users/index.html',
        })
		.when('/register',{
        templateUrl: 'templates/pages/register/register.html',
        controller:'RegisterIndexController',
        controllerAs:'registerIndexCtrl'
        })
		.when('/login',{
        templateUrl: 'templates/pages/login/login.html',
        controller:'LoginIndexController',
        controllerAs:'loginIndexCtrl'
        })
		.when('/users',{
        templateUrl: 'templates/pages/users/index.html',
        controller:'UsersIndexController',
        controllerAs:'usersIndexCtrl'
        })
                .when('/result',{
        templateUrl: 'templates/pages/result/index.html',
        controller:'ResultIndexController',
        controllerAs:'resultIndexCtrl'
        })
		.when('/classifiers',{
        templateUrl: 'templates/pages/classifiers/index.html',
        controller:'ClassifierController',
        controllerAs:'classifierCtrl'
        })
		.when('/svc_params',{
        templateUrl: 'templates/pages/classifiers/svc_params_index.html',
        controller:'LearningCurveController',
        controllerAs:'learningCurveCtrl'
        });
});