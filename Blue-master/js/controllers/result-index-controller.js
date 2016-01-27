angular.module("Blue").controller("ResultIndexController", ["$http", "Base64", "ngTableParams", "$cookieStore", function($http, Base64, ngTableParams, $cookieStore) {
    var controller = this;
    var originalData;
    var classifiersData;
    var globals = $cookieStore.get('globals');
    // $http.defaults.headers.common['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
    // $http.defaults.withCredentials = true;
    $http({
        method: 'GET',
        url: '/dataprocessing/rest-api/resultTestClassifiers',
        headers: {
            'Content-Type': 'application/json',
            // 'params': {
            //     'wt': 'json',
            //     'q': '*:*'
            // }
        }
    }).success(function(data) {
        if (data._embedded != null) {
            controller.results = data._embedded.resultTestClassifiers; /////////////tu popraw przypisz poprawna tabele
            originalData = angular.copy(controller.results);

            controller.classifiersData = [];
            $http({
                method: 'GET',
                url: '/dataprocessing/rest-api/classifiers',
                headers: {
                    // 'Authorization': 'Basic '+Base64.encode('admin:admin')   
                }
            }).success(function(data) {
                controller.classifiersData = data._embedded.classifiers;
                controller.vectorizedDocumentCollections = [];
                $http({
                    method: 'GET',
                    url: '/dataprocessing/rest-api/vectorizedDocumentCollections',
                    headers: {
                        // 'Authorization': 'Basic '+Base64.encode('admin:admin')   
                    }
                }).success(function(data) {
                    controller.vectorizedDocumentCollections = data._embedded.vectorizedDocumentCollections;
                    controller.documentCollections = [];
                    $http({
                        method: 'GET',
                        url: '/dataprocessing/rest-api/documentCollections',
                        headers: {
                            // 'Authorization': 'Basic '+Base64.encode('admin:admin')   
                        }
                    }).success(function(data) {
                        controller.documentCollections = data._embedded.documentCollections;

                        // for (key in controller.results) {
                        //    controller.results[key].classifierName=getClassifierName( controller.results[key].classifierId);
                        //    controller.results[key].documentCollectionName=getDocumentCollectionName( controller.results[key].vectoriziedDocumentCollectionId);
                        // }
                        controller.tableParams = new ngTableParams({
                            count: 10
                        }, {
                            dataset: controller.results
                        });
                    });

                });


            });


        }
    });




    controller.deleteCount = 0;
    controller.deletedresults = [];
    controller.add = add;
    controller.cancelChanges = cancelChanges;
    controller.del = del;
    controller.hasChanges = hasChanges;
    controller.saveChanges = saveChanges;
    controller.getClassifierName = getClassifierName;
    controller.getDocumentCollectionName = getDocumentCollectionName;


    function getClassifierName(id) {

        for (key in controller.classifiersData) {
            if (controller.classifiersData[key].userId == id) {
                return controller.classifiersData[key].name;
            }
        }
    }

    function getDocumentCollectionName(id) {

        for (key in controller.vectorizedDocumentCollections) {
            if (controller.vectorizedDocumentCollections[key].idVectorizedDocumentCollection == id) {
                for (index in controller.documentCollections) {
                    if (controller.documentCollections[index].idDocumentCollection == controller.vectorizedDocumentCollections[key].documentCollectionId) {
                        return controller.documentCollections[index].name;
                    }
                }
            }
        }
    }

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
                method: 'DELETE',
                url: '/dataprocessing/rest-api/resultTestClassifiers/' + controller.deletedresults[key].idResultTestClassifier,
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
