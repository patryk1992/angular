angular.module("Blue").controller("ClassifierController",['$scope', function($scope) {
	$scope.data = {
	repeatSelect: null,
    algorithms : 
	[
		{
			id : '1',
			name: 'SVM',
			description: 'C-Support Vector Classification',
			note: 'The implementation is based on libsvm. The fit time complexity is more than quadratic with the number of samples which makes it hard to scale to dataset with more than a couple of 10000 samples. The multiclass support is handled according to a one-vs-one scheme.',
		},
		{
			id : '2',
			name: 'NaiveBytes',
			description: '*description*',
			note: '*note*',
		},
		{
			id : '3',
			name: 'DecisionTreeClassifier',
			description: 'A decision tree classifier.',
			note: 'Decision Trees (DTs) are a non-parametric supervised learning method used for classification and regression. The goal is to create a model that predicts the value of a target variable by learning simple decision rules inferred from the data features.',
		},
		],
		
	learningCurveAlgorithms:
	[
	{
			id : '0',
			name: 'none'

		},
		{
			id : '1',
			name: 'KFold',
			description: 'K-Folds cross validation iterator.',
			note: 'Provides train/test indices to split data in train test sets. Split dataset into k consecutive folds (without shuffling by default).\nEach fold is then used a validation set once while the k - 1 remaining fold form the training set.',
		},
		{
			id : '2',
			name: 'ShuffleSplit',
			description: 'Random permutation cross-validation iterator.',
			note: 'Yields indices to split data into training and test sets.\nContrary to other cross-validation strategies, random splits do not guarantee that all folds will be different, although this is still very likely for sizeable datasets.',
		}
		]
     
	};	 
    }]);
		