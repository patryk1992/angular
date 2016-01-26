             
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
		.when('/classifiers/:collection_id',{
        templateUrl: 'templates/pages/classifiers/index.html',
        controller:'ClassifierController',
        controllerAs:'classifierCtrl'
        })		
		.when('/documents',{
        templateUrl: 'templates/pages/documents/index.html',
        controller:'DocumentsIndexController',
        controllerAs:'documentsIndexCtrl'
        })
		.when('/documentsDetails/:id',{
        templateUrl: 'templates/pages/documents/details.html',
        controller:'DocumentsDetailsController',
        controllerAs:'documentsDetailsCtrl'
        })
        .when('/documentsCollections',{
        templateUrl: 'templates/pages/documents/collectionsMarked.html',
        controller:'DocumentsCollectionsController',
        controllerAs:'documentsCollectionsCtrl'
        })
		.when('/classList',{
        templateUrl: 'templates/pages/classifiers/classList.html',
        controller:'ClassifierListController',
        controllerAs:'classifierListCtrl'
        })
		.when('/newDocs',{
        templateUrl: 'templates/pages/newDocs/index.html',
        controller:'addDocumentController',
        controllerAs:'addDocumentCtrl'
        });
});
