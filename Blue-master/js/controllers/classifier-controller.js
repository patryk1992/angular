angular.module("Blue").controller("ClassifierController",['$scope', function($scope) {
	$scope.data = {
	repeatSelect: null,
    algorithms : 
	[
		{
			id : '1',
			name: 'SVC',
			description: 'C-Support Vector Classification',
			note: 'The implementation is based on libsvm. The fit time complexity is more than quadratic with the number of samples which makes it hard to scale to dataset with more than a couple of 10000 samples.\nThe multiclass support is handled according to a one-vs-one scheme.',
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
			note: '*note*',
		},
		]	
     
	};	 
    }]);
		