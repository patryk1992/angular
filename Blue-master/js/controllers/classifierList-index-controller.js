angular.module("Blue").controller("ClassifierListController", ["$http", "Base64", "$window", "ngTableParams", "$cookieStore", "$location", function($http, Base64, $window, ngTableParams, $cookieStore, $location) {
    var controller = this;
    controller.results = [];
    var originalData;
    var globals = $cookieStore.get('globals');
    // $http.defaults.headers.common['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
    // $http.defaults.withCredentials = true;
    $http({
        method: 'GET',
        url: '/dataprocessing/rest-api/classifiers',
        headers: {
            'Content-Type': 'application/json',
            // 'params': {
            //     'wt': 'json',
            //     'q': '*:*'
            // }
        }
    }).success(function(data) {
        var next = data._links.next;
        controller.results = controller.results.concat(data._embedded.classifiers);
        if (next != null) {
            getFullData(data);
        } else {
            originalData = angular.copy(controller.results);
            controller.tableParams = new ngTableParams({
                count: 10
            }, {
                dataset: controller.results
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
    controller.showResults = showResults;
    controller.test = test;
    controller.getFullData = getFullData;

    function getFullData(data) {

        $http({
            method: 'GET',
            url: data._links.next.href,
            headers: {
                'Content-Type': 'application/json',
                // 'params': {
                //     'wt': 'json',
                //     'q': '*:*'
                // }
            }
        }).success(function(data) {
            controller.results = controller.results.concat(data._embedded.classifiers);
            if (data._links.next != null) {
                getFullData(data);
            } else {
                originalData = angular.copy(controller.results);
                controller.tableParams = new ngTableParams({
                    count: 10
                }, {
                    dataset: controller.results
                });
            }
        });
    }

    function showResults(result) {
        console.log("tutaj daj wyswietlanie res");
        $window.open("data:text/html," + encodeURIComponent(result.learningCurve), "_blank", "width=800,height=600");
    }

    function test(result) {
        console.log("przejscie testu");
        $location.path('/testClassifier/' + result.idClassifier);

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
        console.log(controller.deletedresults);
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

        console.log("funkcja saveChanges");
        var globals = $cookieStore.get('globals');
        resetTableStatus();
        var currentPage = controller.tableParams.page();
        //zmiania użytkownika
        var changedUsers = [];
        var tableDataset = controller.tableParams.settings().dataset;
        console.log("przed petlami " + controller.deletedresults);

        originalData = angular.copy(controller.tableParams.settings().dataset);
        console.log("lista");
        // usuniecie użytkowników
        for (key in controller.deletedresults) {
            console.log(controller.deletedresults[key]);
            $http({
                method: 'DELETE',
                url: '/dataprocessing/rest-api/classifiers/' + controller.deletedresults[key].idClassifier,
                headers: {
                    'Authorization': 'Basic ' + globals.currentUser.authdata,
                    'Content-Type': 'application/json'
                }
            }).success(function(data) {
                console.log("usunieto");
                var tmp = data;

            });
        }
    }
}]);
