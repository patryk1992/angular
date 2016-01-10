angular.module("Blue").controller("addDocumentController", ["$http", "Base64", "ngTableParams", "$cookieStore","$scope", function($http, Base64, ngTableParams, $cookieStore, $scope) {
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

    }

    $scope.isSelected = function(item) {
    return $scope.collection === item;
}
   
}]);
    // jQuery
$('.dropdown-menu').find('input').click(function (e) {
    e.stopPropagation();
});
  