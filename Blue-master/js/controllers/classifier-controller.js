angular.module("Blue").controller("ClassifierController",['$http', '$scope', function($http, $scope) {
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
		$http({method: 'POST', 
				url: '/dataprocessing/rest-api/', 	
				data: {
					'classifier_name' : classifier_name,
					'classifier_type' : classifier_type,
					'classifier_params' : params,
					'cross_validation_type' : cross_validation_type,
					'cross_validation_params' : lcparams,
					'collection_id' : 2,
					},
				headers: {               
					'Content-Type': 'application/json'      
				}
				}).success(function(data){
					var params = "";
				}).error(function(data){
					//$window.alert(JSON.stringify(data));
            	});
	};
	
    }]);
		