             

angular.module("Blue").controller("RegisterIndexController",  ["$http",'$scope','$window' ,  function ($http, $scope, $window) {  
    var controller=this; 

    controller.register=register;
    function register() {
       if(this.inputPassword == this.inputPasswordConfirm){
        $http({method: 'POST', 
            url: '/dataprocessing/register',
            data: {username:this.inputLogin, password: this.inputPassword},          
            headers: {               
                'Content-Type': 'application/json'      
            }
            }).success(function(data){
                var tmp="";
            }).error(function(data){
                $window.alert(JSON.stringify(data));
            });
       }else{
            $window.alert("Hasła nie pasują do siebie.");
       }
    };

}]);