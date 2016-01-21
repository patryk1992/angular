var myApp  = angular.module('Blue',['ngRoute','ngTable','ngCookies']);



myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

myApp.service('fileUpload', ['$http', '$cookieStore', function ($http, $cookieStore) {
    this.uploadFileToUrl = function(file, jsonData, uploadUrl){
        var fd = new FormData();
        
        var globals = $cookieStore.get('globals');
        console.log(globals.currentUser.authdata);
        fd.append('file', file);
       // fd.append("jsonData", jsonData);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined,
            		  'Authorization': 'Basic ' +globals.currentUser.authdata
        }
        })
        .success(function(){
        })
        .error(function(){
        });
    };


}]);


myApp.service('paramService', function() {
  var paramList = [];

  var addProduct = function(newObj) {
      paramList.push(newObj);
  };

  var getProducts = function(){
      return paramList;
  };

  return {
    addProduct: addProduct,
    getProducts: getProducts
  };

});


myApp.controller('myCtrl', ['$scope', 'fileUpload', 'paramService', function($scope, fileUpload, paramService){
    
    $scope.uploadFile = function(){
        var file = $scope.myFile;
       	var jsonData = paramService.getProducts();
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "/dataprocessing/add";
        fileUpload.uploadFileToUrl(file,angular.toJson(jsonData), uploadUrl);
    };
    
}]);


myApp.constant('USER_ROLES', {
  all: '*',
  admin: 'ROLE_ADMIN',
  expert: 'ROLE_EXPERT',
  annotator: 'ROLE_ANNOTATOR',
  banned: 'ROLE_BANNED'
});
