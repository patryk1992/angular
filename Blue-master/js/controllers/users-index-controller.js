             
angular.module("Blue").controller("UsersIndexController",["$http","Base64","ngTableParams", function($http,Base64,ngTableParams){
	var controller=this;
	var originalData;
	 // $http.defaults.headers.common['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
	// $http.defaults.withCredentials = true;
	$http({method: 'GET', 
		url: '/dataprocessing/rest-api/users', 	
		headers: {
			'Authorization': 'Basic '+Base64.encode('admin:admin')			
			
		

		}
		}).success(function(data){
			controller.users=data._embedded.users;
			originalData = angular.copy(controller.users);
			controller.tableParams = new ngTableParams(
				{count:10}, 
				{dataset: controller.users});
		});

	controller.deleteCount = 0;
	controller.deletedUsers = [];	
    controller.add = add;
    controller.cancelChanges = cancelChanges;
    controller.del = del;
    controller.hasChanges = hasChanges;
    controller.saveChanges = saveChanges;

	function add() {
	    controller.isEditing = true;
	    controller.isAdding = true;
	    controller.tableParams.settings().dataset.unshift({
	        username: "",
	        email: null
	       
	    });
	      // we need to ensure the user sees the new row we've just added.
	      // it seems a poor but reliable choice to remove sorting and move them to the first page
	      // where we know that our new item was added to
	    controller.tableParams.sorting({});
	    controller.tableParams.page(1);
	    controller.tableParams.reload();
    }
 	function cancelChanges() {
      resetTableStatus();
      var currentPage = controller.tableParams.page();
      controller.tableParams.settings({
        dataset: angular.copy(originalData)
      });
      // keep the user on the current page when we can
      if (!controller.isAdding) {
        controller.tableParams.page(currentPage);
      }
    }

    function del(row) {
     /* _.remove(controller.tableParams.settings().dataset, function(item) {
        return row === item;
      });*/
      var index = controller.users.indexOf(row);
      if (index > -1) {
    		var user=controller.users.splice(index, 1);
    		controller.deletedUsers.push(user[0]);
	  }
      controller.deleteCount++;
      controller.tableTracker.untrack(row);
      controller.tableParams.reload().then(function(data) {
        if (data.length === 0 && controller.tableParams.total() > 0) {
          controller.tableParams.page(controller.tableParams.page() - 1);
          controller.tableParams.reload();
        }
      });
      
	  controller.tableParams.reload()

    }

    function hasChanges() {
      return controller.tableForm.$dirty || controller.deleteCount > 0
    }

    function resetTableStatus() {
      controller.isEditing = false;
      controller.isAdding = false;
      controller.deleteCount = 0;
      controller.tableTracker.reset();
      controller.tableForm.$setPristine();
    }

    function saveChanges() {
      resetTableStatus();
      var currentPage = controller.tableParams.page();
      //zmiania użytkownika
      var changedUsers=[];
      var tableDataset=controller.tableParams.settings().dataset;
      for( keyS in tableDataset){
      	for( keyO in originalData){
      		if(tableDataset[keyS].idUser==originalData[keyO].idUser){
      			if(tableDataset[keyS].username!=originalData[keyO].username || tableDataset[keyS].email!=originalData[keyO].email || tableDataset[keyS].roleNames[0]!=originalData[keyO].roleNames[0] ){
      				changedUsers.push(tableDataset[keyS]);
      			}
      		}
      	}
      }
      var addedUsers=[];
      for( key in tableDataset){
      	if(tableDataset[key].idUser==null){
      		var newUser={};
      		newUser.username=tableDataset[key].username;
      		newUser.password=tableDataset[key].username; //zakłądamy ze jak admin tworzy konto to password==username
      		//newUser.role=tableDataset[key].role;
      		addedUsers.push(newUser);
      	}
      }
       for( key in addedUsers){
	  		$http({method: 'POST', 
			url: '/dataprocessing/register',
			data: addedUsers[key],		 	
			headers: {
				'Authorization': 'Basic '+Base64.encode('admin:admin'),
				'Content-Type': 'application/json'		
			}
			}).success(function(data){
				var tmp=data;
				
			});
		}
      for( key in changedUsers){
	  		$http({method: 'PUT', 
			url: '/dataprocessing/rest-api/users/' + changedUsers[key].idUser,
			data: changedUsers[key],		 	
			headers: {
				'Authorization': 'Basic '+Base64.encode('admin:admin'),
				'Content-Type': 'application/json'		
			}
			}).success(function(data){
				var tmp=data;
				
			});
		}
      originalData = angular.copy(controller.tableParams.settings().dataset);

      // usuniecie użytkowników
      for( key in controller.deletedUsers){
	  		$http({method: 'DELETE', 
			url: '/dataprocessing/rest-api/users/'+controller.deletedUsers[key].idUser,		 	
			headers: {
				'Authorization': 'Basic '+Base64.encode('admin:admin'),
				'Content-Type': 'application/json'		
			}
			}).success(function(data){
				var tmp=data;
				
			});
		}
    }
  }
]);
