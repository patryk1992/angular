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
		

}]);
    // jQuery
$('.dropdown-menu').find('input').click(function (e) {
    e.stopPropagation();
});
  