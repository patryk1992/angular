from sklearn import  svm

def getSupportVectorClassifier(C=1.0,
                               kernel='rbf',
                               degree=3,
                               gamma=0.0,
                               coef0=0.0,
                               shrinking=True,
                               probability=False,
                               tol=0.001,
                               cache_size=200,
                               class_weight=None,
                               verbose=False,
                               max_iter=-1,
                               random_state=None):

    classifier = svm.SVC(C,
                        kernel,
                        degree,
                        gamma,
                        coef0,
                        shrinking,
                        probability,
                        tol,
                        cache_size,
                        class_weight,
                        verbose,
                        max_iter,
                        random_state)

    return classifier

