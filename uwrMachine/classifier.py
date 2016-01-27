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
import parser as parser
import json

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



def configure_classifier(clf_type, params):
    data = json.loads(params)
    if clf_type =='svm':
        kernel = data['kernel']
        c = data['C']
        degree = data['degree']
        gamma =data['gamma']
        coef0 = data['coef0']
        probability  = data['probability']
        shrinking = data['shrinking']
        tol = data['tol']
        cache_size = data['cache_size']
        class_weight = data['class_weight']
        verbose = data['verbose']
        max_iter = data['max_iter']
        random_state = data['random_state']
        if not(random_state) :
            random_state = None
        clf = svm.SVC(kernel= kernel, C = float(c),degree = int(degree),gamma= gamma,coef0= float(coef0),probability = probability,shrinking= shrinking, tol= float(tol),cache_size= float(cache_size),class_weight = class_weight,verbose = verbose,max_iter= int(max_iter),random_state = random_state)
    if clf_type =='dTree':
        criterion = data['criterion']
        splitter = data['splitter']
        max_features = data['max_features']
        max_depth = data['max_depth']
        min_samples_split =data['min_samples_split']
        min_samples_leaf = data['min_samples_leaf']
        min_weight_fraction_leaf =data['min_weight_fraction_leaf']
        max_leaf_nodes = data['max_leaf_nodes']
        class_weight = data['class_weight']
        presort = data['presort ']
        random_state = data['random_state ']
        if not(random_state) :
            random_state = None
        clf = tree.DecisionTreeClassifier(criterion= criterion, splitter = splitter,max_features = int(max_features),max_depth= int(max_depth),min_samples_split= int(min_samples_split),min_samples_leaf = int(min_samples_leaf),min_weight_fraction_leaf= float(min_weight_fraction_leaf), max_leaf_nodes= float(max_leaf_nodes),class_weight= class_weight,presort = presort,random_state = random_state)
    if clf_type =='naive':
        clf = naive_bayes.GaussianNB()
    return clf

def configure_cross_validation(cv_type, params, n ):
    if(params == None):
        return None
    data = json.loads(params)
    if cv_type =='kFold':
        n_folds   = data['n_folds']
        shuffle   = data['shuffle']
        cv = cross_validation.KFold(n = n,n_folds=int(n_folds),shuffle=shuffle)
    if cv_type =='shuffleSplit':
        n_iter  = data['n_iter']
        test_size  = data['test_size']
        random_state  = data['random_state']
        if not(random_state) :
            random_state = None
        cv = cross_validation.ShuffleSplit(n = n ,n_iter = int(n_iter),test_size=int(test_size),random_state=random_state)
    return cv

def get_svm_params(str):
    kernel = str['kernel']
    c = str['C']
    degree = str['degree']
    gamma = str['gamma']
    coef0 = str['coef0']
    probability  = str['probability']
    shrinking = str['shrinking']
    tol = str['tol']
    cache_size = str['cache_size']
    class_weight = str['class_weight']
    verbose = str['verbose']
    max_iter = str['max_iter']
    decision_function_shape = str['decision_function_shape']
    random_state = str['random_state']

    return kernel, c, degree, gamma, coef0, probability, shrinking, tol, cache_size, class_weight, verbose, max_iter, decision_function_shape, random_state


def get_dTree_params(str):
    criterion = str['criterion']
    splitter = str['splitter']
    max_features = str['max_features']
    max_depth = str['max_depth']
    min_samples_split = str['min_samples_split']
    min_samples_leaf = str['min_samples_leaf']
    min_weight_fraction_leaf = str['min_weight_fraction_leaf']
    max_leaf_nodes = str['max_leaf_nodes']
    class_weight = str['class_weight']
    presort = str['presort ']
    random_state = str['random_state']

    return criterion, splitter, max_features, max_depth, min_samples_split, min_samples_leaf, min_weight_fraction_leaf, max_leaf_nodes, class_weight, presort, random_state

def get_shuffle_split_params(str):
    n_iter  = str['n_iter']
    test_size  = str['test_size']
    train_size  = str['train_size']
    random_state  = str['random_state']

    return n_iter, test_size, train_size, random_state

def get_kFold_params(str):
    n_folds   = str['n_folds']
    shuffle   = str['shuffle']

    return n_folds, shuffle

