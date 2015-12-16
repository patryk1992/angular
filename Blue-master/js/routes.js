             
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
		.when('/svm_params',{
        templateUrl: 'templates/pages/classifiers/svm_params_index.html',
        controller:'LearningCurveController',
        controllerAs:'learningCurveCtrl'
        })
		.when('/dTree_params',{
        templateUrl: 'templates/pages/classifiers/dTree_params_index.html',
        controller:'LearningCurveController',
        controllerAs:'learningCurveCtrl'
        })
		.when('/learningCurve',{
        templateUrl: 'templates/pages/learningCurve/index.html',
        controller:'LearningCurveController',
        controllerAs:'learningCurveCtrl'
        })
		.when('/kFold',{
        templateUrl: 'templates/pages/learningCurve/kFold_params_index.html',
        controller:'LearningCurveController',
        controllerAs:'learningCurveCtrl'
        })
		.when('/shuffleSplit',{
        templateUrl: 'templates/pages/learningCurve/shuffleSplit_params_index.html',
        controller:'LearningCurveController',
        controllerAs:'learningCurveCtrl'
        });
});