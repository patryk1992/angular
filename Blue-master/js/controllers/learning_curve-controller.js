angular.module("Blue").controller("LearningCurveController",['$scope', function($scope) {
	$scope.data = {
    algorithms : 
	[
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
		