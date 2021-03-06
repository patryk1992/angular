angular.module("Blue").controller("DocumentsDetailsController", ["$http", "Base64", "ngTableParams", "$cookieStore", "$routeParams", "$window", "$location", function($http, Base64, ngTableParams, $cookieStore, $routeParams, $window, $location) {
    var controller = this;
    var originalData;
    var globals = $cookieStore.get('globals');
    var idColl = $routeParams.id;
    $http({
        method: 'GET',
        url: '/dataprocessing/rest-api/documentCollections/'+idColl+'/documents',        
        headers: {
            'Content-Type': 'application/json',
            // 'params': {
            //     'wt': 'json',
            //     'q': '*:*'
            // }
        }
    }).success(function(data) {
        controller.results = data._embedded.documents;
        originalData = angular.copy(controller.results);
        controller.tableParams = new ngTableParams({
            count: 10
        }, {
            dataset: controller.results
        });
    });

    controller.deleteCount = 0;
       controller.deletedresults = [];
    controller.add = add;
    controller.cancelChanges = cancelChanges;
    controller.del = del;
    controller.hasChanges = hasChanges;
    controller.saveChanges = saveChanges;
    controller.showContent = showContent;
    
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
        var index = controller.results.indexOf(row);
        if (index > -1) {
            var doc = controller.results.splice(index, 1);
            controller.deletedresults.push(doc[0]);
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

    function showContent(res) {
        console.log(res);
        $window.open("data:text/html,"+ encodeURIComponent(res.contents), "_blank", "width=800,height=600");
    }

    function goToAnnotation(res) {
        console.log(res);
       // $location.path('/documentsDetails/'+res.idDocumentCollection);
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

        // usuniecie użytkowników
        for (key in controller.deletedresults) {
            $http({
                method: 'GET',
                url: '/solr/collection1/update?stream.body=<delete><query>id:' + controller.deletedresults[key].id+'</query> </delete>&commit=true',
                headers: {
                    // 'Authorization': 'Basic '+Base64.encode('admin:admin'),
                    'Content-Type': 'application/json'
                }
            }).success(function(data) {
                var tmp = data;

            });
        }
    }
}]);
