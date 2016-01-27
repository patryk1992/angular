angular.module("Blue").controller("addDocumentController", ["$http", "Base64", "ngTableParams", "$cookieStore","$scope", "fileUpload", "paramService", function($http, Base64, ngTableParams, $cookieStore, $scope, fileUpload, paramService) {
    var controller = this;
    var globals = $cookieStore.get('globals');
    var items;

    $http({
        method: 'GET',
        url: '/dataprocessing/rest-api/documentCollections',
        headers: {
            'Content-Type': 'application/json',
        }
    }).success(function(data) {
        controller.results = data._embedded.documentCollections;
        originalData = angular.copy(controller.results);
        $scope.items = controller.results;
        });

    $scope.setCollection = function(item){
        $scope.collection = item;
        paramService.addProduct(item.idDocumentCollection);

    }

    $scope.isSelected = function(item) {
    return $scope.collection === item;
	}

$scope.sendJsonFile = function() {
	 $http.jsonp("http://localhost:8082/hello?callback=JSON_CALLBACK").then(function(json) {
            console.log(json); }); }
/*
	/*$scope.sendJsonFile = function() {
		var dataJ = JSON.stringify($scope.user);
		console.log(dataJ);
		    $http({
        method: 'POST',
        url: '/dataprocessing/rest-api/addDoc',
        headers: {
            'Content-Type': 'application/json',
        },
        data: dataJ
    }).success(function(data) {
        console.log("sukces");
        });

	}
	
   $http.jsonp("http://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Super%20Hero").
	$scope.sendJsonFile = function() {
		$http({
        method: 'GET',
        url: 'http://localhost:8082/hello',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token',
            'Access-Control-Allow-Methods': 'GET, PUT, POST'
        }
   	 }).success(function() { consola.log("asdasd"); });
	}
	*/	

}]);
    // jQuery
$('.dropdown-menu').find('input').click(function (e) {
    e.stopPropagation();
});
  