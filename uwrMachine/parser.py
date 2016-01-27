

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
    class_weight = str['class_weight ']
    verbose = str['verbose']
    max_iter = str['max_iter ']
    decision_function_shape = str['decision_function_shape ']
    random_state = str['random_state ']

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
    random_state = str['random_state ']

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