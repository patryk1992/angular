angular.module("Blue").controller("ClassifierController",['$http', '$scope', '$routeParams', 'Base64', '$cookieStore', "$location",  function($http, $scope, $routeParams, Base64, $cookieStore, $location) {
	var controller = this;
    var collectionItems;
	var vectorizedDocumentItems;
	var document_id;
	var questionsItems;
	var globals = $cookieStore.get('globals');
	var idPobrane = $routeParams;
	console.log(idPobrane);
	console.log("abc " +$routeParams.collection_id);
	console.log("abc" + $routeParams.classifier_id);

    $http({
        method: 'GET',
        url: '/dataprocessing/rest-api/documentCollections',
        headers: {
            'Content-Type': 'application/json',
        }
    }).success(function(data) {
        controller.collectionResults = data._embedded.documentCollections;
        originalData = angular.copy(controller.collectionResults);
        $scope.collectionItems = controller.collectionResults;
		$scope.documentCollection = $scope.collectionItems[0];
        });
		
	$scope.setCollection = function(item){
		console.log("setColl " + item.idDocumentCollection);
        $scope.documentCollection = item;
    }

    $scope.isSelected = function(item) {

    return $scope.documentCollection === item;
	}
	
	if($routeParams.collection_id != undefined) {
	$http({
        method: 'GET',
        url: '/dataprocessing/rest-api/vectorizedDocumentCollections/search/findAllByDocumentCollectionId?documentCollectionId='+$routeParams.collection_id,
        headers: {
            'Content-Type': 'application/json'
        }

    }).success(function(data) {
        controller.vectorizedDocumentResult = data._embedded.vectorizedDocumentCollections;
        vectorizedDocumentOriginalData = angular.copy(controller.vectorizedDocumentResult);
        $scope.vectorizedDocumentItems = controller.vectorizedDocumentResult;
		$scope.vectorizedDocumentCollection = $scope.vectorizedDocumentItems[0];
        });

	}

    $scope.setVectorizedDocumentCollection = function(item){
    		console.log("setColl " + item.idDocumentCollection);
        $scope.vectorizedDocumentCollection = item;
    }
	
	$scope.isVectorizedDocumentSelected = function(item) {
    return $scope.vectorizedDocumentCollection === item;
	}
	
	
	

	$http({
        method: 'GET',
        url: '/dataprocessing/rest-api/questions',
        headers: {
            'Content-Type': 'application/json'
        }
    }).success(function(data) {
        controller.questionsResult = data._embedded.questions;
        questionsOriginalData = angular.copy(controller.questionsResult);
        $scope.questionsItems = controller.questionsResult;
		$scope.questionsCollection = $scope.questionsItems[0];
        });

    $scope.setQuestionsCollection = function(item){
        $scope.questionsCollection = item;
    }
	
	$scope.isQuestionsSelected = function(item) {
    return $scope.questionsCollection === item;
	}
	
	
	$scope.data = {
	repeatSelect: null,
    algorithms : 
	[
		{
			id : '0',
			name: 'SVM',
			algName: 'svm',
			description: 'C-Support Vector Classification',
			note: 'The implementation is based on libsvm. The fit time complexity is more than quadratic with the number of samples which makes it hard to scale to dataset with more than a couple of 10000 samples. The multiclass support is handled according to a one-vs-one scheme.',
		},
		{
			id : '1',
			name: 'NaiveBytes',
			algName : 'naive',
			description: '*description*',
			note: '*note*',
		},
		{
			id : '2',
			name: 'DecisionTreeClassifier',
			algName : 'dTree',
			description: 'A decision tree classifier.',
			note: 'Decision Trees (DTs) are a non-parametric supervised learning method used for classification and regression. The goal is to create a model that predicts the value of a target variable by learning simple decision rules inferred from the data features.',
		},
	],
	learningCurveAlgorithms:
	[
	{
			id : '0',
			name: 'none',
			algName: 'none'

		},
		{
			id : '1',
			name: 'KFold',
			algName: 'kFold',
			description: 'K-Folds cross validation iterator.',
			note: 'Provides train/test indices to split data in train test sets. Split dataset into k consecutive folds (without shuffling by default).\nEach fold is then used a validation set once while the k - 1 remaining fold form the training set.',
		},
		{
			id : '2',
			name: 'ShuffleSplit',
			algName: 'shuffleSplit',
			description: 'Random permutation cross-validation iterator.',
			note: 'Yields indices to split data into training and test sets.\nContrary to other cross-validation strategies, random splits do not guarantee that all folds will be different, although this is still very likely for sizeable datasets.',
		}
	]
	};

	$scope.addNewClassifier = function()
	{
		
		var params = $scope.fields[$scope.data.repeatSelect];
		var lcparams = $scope.lcfields[$scope.data.repeatSelectLCurve];
		var classifier_name = $scope.classifierName;
		var classifier_type = $scope.data.algorithms[$scope.data.repeatSelect].algName;
		var cross_validation_type = $scope.data.learningCurveAlgorithms[$scope.data.repeatSelectLCurve].algName;
		var train_size = $scope.train_size;
		var vectorizedDocumentCollectionId = $scope.vectorizedDocumentCollection.idVectorizedDocumentCollection;

		$http({
			method: 'POST',
			url: '/dataprocessing/rest-api/classifiers',
			headers: {
				'Authorization': 'Basic '+ globals.currentUser.authdata,
				'Content-Type': 'application/json',
			},
			data:
			{
				'userId' : globals.currentUser.id,
				'vectorizedDocumentCollectionId' : vectorizedDocumentCollectionId,
				'date' : Date.now(),
				'name' : classifier_name,
				'parameter' : JSON.stringify(params),
				'learningCurve' : 'todo',
				'content' : 'todo',
				'flag' : 0
			}
		}).success(function(json) {
			console.log(json);
			var classifier_id = json.idClassifier;
			
			$http({
			method: 'POST',
			url: '/dataprocessing/rest-api/resultTestClassifiers',
			headers: {
				'Authorization': 'Basic '+ globals.currentUser.authdata,
				'Content-Type': 'application/json',
			},
			data:
			{
				'classifierId' : classifier_id,
				'vectorizedDocumentCollectionId' : vectorizedDocumentCollectionId,
				'parameter' : JSON.stringify(params),
				'precision' : 0,
				'accuracy' : 0,
				'recall' : 0
			}
			}).success(function(json) {
				console.log(json);
				
				
				$http.jsonp("http://localhost:8082/train?callback=JSON_CALLBACK",
				{params : 
					{
						'user_id' : globals.currentUser.id,
						'classifier_id' : classifier_id,
						'vectorized_document_collection_id' : vectorizedDocumentCollectionId,
						'classifier_name' : classifier_name,
						'classifier_type' : classifier_type,
						'classifier_params' : params,
						'cross_validation_type' : cross_validation_type,
						'cross_validation_params' : lcparams,
						'collection_id' : $routeParams.collection_id,
						'train_size' : train_size,
						'result_test_classifiers_id' : json.idResultTestClassifier
					}
				}
				).then(function(json) {
					console.log(json); });

			 });
         });
		$location.path('/classList');
	};

	$scope.startTest = function()
	{
		var idDocumentCollection = $scope.documentCollection.idDocumentCollection;
		console.log("tutaj " + idDocumentCollection);
		$http({
			method: 'GET',
			url: '/dataprocessing/rest-api/documentCollections/'+idDocumentCollection+'/documents',        
			headers: {
				'Content-Type': 'application/json',
			}
		}).success(function(data) {
			controller.documentsListResult = data._embedded.documents;
			document_id = controller.documentsListResult[0];
			
			$http({
				method: 'GET',
				url: '/dataprocessing/rest-api/classifiers/'+ $routeParams.classifier_id,
				headers: {
					'Content-Type': 'application/json',
				}
			}).success(function(data) {
			
			
			
			$http.jsonp("http://localhost:8082/annotations?callback=JSON_CALLBACK",
			{params : 
				{
					'collection_id' : idDocumentCollection,
					'classifier_dump' : data.content,
					'document_id' : document_id,
					'question_id' : $scope.questionsCollection.idQuestion,
					'range' : $scope.range,
				}
			}
			).then(function(json) {
				console.log(json); });
			});
		});

		$location.path('/classList');
	};
}]);
		