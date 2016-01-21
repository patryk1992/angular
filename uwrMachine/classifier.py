from sklearn import  svm
from sklearn import  tree
from sklearn import  naive_bayes
from sklearn.metrics import precision_score
from sklearn.metrics import precision_score
from sklearn.metrics import accuracy_score
from sklearn.metrics import recall_score
from sklearn.learning_curve import learning_curve
import sklearn.cross_validation as cross_validation
import numpy as np
import matplotlib.pyplot as plt
import parser

def train(clf, train_sizes, cv, params, features, labels):

#    train_sizes, train_scores, test_scores = learning_curve(clf, features, labels, cv = cv, train_sizes = train_sizes,n_jobs = 1)
    return plot_learning_curve(clf, title = "Test", X = features,y = labels, cv = cv, train_sizes = train_sizes,n_jobs = 1)
    #clf_string = pickle.dumps(clf)

 #   return clf, train_sizes, train_scores, test_scores




def test(clf, features, labels):
    preditions = clf.predict(features)
    accuracy = accuracy_score(labels, preditions)
    recall = recall_score(labels, preditions)
    precision = precision_score(labels, preditions)
    return preditions, accuracy, recall, precision







def plot_learning_curve(estimator, title, X, y, ylim=None, cv=None,
                        n_jobs=1, train_sizes=np.linspace(.1, 1.0, 5)):
    """
    Generate a simple plot of the test and traning learning curve.

    Parameters
    ----------
    estimator : object type that implements the "fit" and "predict" methods
        An object of that type which is cloned for each validation.

    title : string
        Title for the chart.

    X : array-like, shape (n_samples, n_features)
        Training vector, where n_samples is the number of samples and
        n_features is the number of features.

    y : array-like, shape (n_samples) or (n_samples, n_features), optional
        Target relative to X for classification or regression;
        None for unsupervised learning.

    ylim : tuple, shape (ymin, ymax), optional
        Defines minimum and maximum yvalues plotted.

    cv : integer, cross-validation generator, optional
        If an integer is passed, it is the number of folds (defaults to 3).
        Specific cross-validation objects can be passed, see
        sklearn.cross_validation module for the list of possible objects

    n_jobs : integer, optional
        Number of jobs to run in parallel (default 1).
    """
    plt.figure()
    plt.title(title)
    if ylim is not None:
        plt.ylim(*ylim)
    plt.xlabel("Training examples")
    plt.ylabel("Score")
    train_sizes, train_scores, test_scores = learning_curve(
        estimator, X, y, cv=cv, n_jobs=n_jobs, train_sizes=train_sizes)
    train_scores_mean = np.mean(train_scores, axis=1)
    train_scores_std = np.std(train_scores, axis=1)
    test_scores_mean = np.mean(test_scores, axis=1)
    test_scores_std = np.std(test_scores, axis=1)
    plt.grid()
    plt.fill_between(train_sizes, train_scores_mean - train_scores_std,
                     train_scores_mean + train_scores_std, alpha=0.1,
                     color="r")
    plt.fill_between(train_sizes, test_scores_mean - test_scores_std,
                     test_scores_mean + test_scores_std, alpha=0.1, color="g")
    plt.plot(train_sizes, train_scores_mean, 'o-', color="r",
             label="Training score")
    plt.plot(train_sizes, test_scores_mean, 'o-', color="g",
             label="Cross-validation score")

    plt.legend(loc="best")
    return plt




def configure_classifier(clf_type, params ):
    if clf_type =='svm':
        clf = svm.SVC(parser.get_svm_params(params))
    if clf_type =='dTree':
        clf = tree.DecisionTreeClassifier(parser.get_dTree_params(params))
    if clf_type =='naive':
        clf = naive_bayes.GaussianNB()
    return clf

def configure_cross_validation(cv_type, params ):
    if cv_type =='kFold':
        cv = cross_validation.KFold(parser.get_kFold_params(params))
    if cv_type =='shuffleSplit':
        cv = cross_validation.ShuffleSplit(parser.get_shuffle_split_params(params))
    return cv