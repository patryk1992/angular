from bottle import request, run, route, response
import bottle
import GET as wtf
import classifier
import numpy as np
import POST as post
import pickle
import PUT as put
import json
import random
from io import StringIO
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from json import dumps, loads

def makeTerrainData(n_points=1000):
###############################################################################
### make the toy dataset
    random.seed(42)
    grade = [random.random() for ii in range(0,n_points)]
    bumpy = [random.random() for ii in range(0,n_points)]
    error = [random.random() for ii in range(0,n_points)]
    y = [round(grade[ii]*bumpy[ii]+0.3+0.1*error[ii]) for ii in range(0,n_points)]
    for ii in range(0, len(y)):
        if grade[ii]>0.8 or bumpy[ii]>0.8:
            y[ii] = 1.0

### split into train/test sets
    X = [[gg, ss] for gg, ss in zip(grade, bumpy)]
    split = int(0.75*n_points)
    X_train = X[0:split]
    X_test  = X[split:]
    y_train = y[0:split]
    y_test  = y[split:]

    grade_sig = [X_train[ii][0] for ii in range(0, len(X_train)) if y_train[ii]==0]
    bumpy_sig = [X_train[ii][1] for ii in range(0, len(X_train)) if y_train[ii]==0]
    grade_bkg = [X_train[ii][0] for ii in range(0, len(X_train)) if y_train[ii]==1]
    bumpy_bkg = [X_train[ii][1] for ii in range(0, len(X_train)) if y_train[ii]==1]

#    training_data = {"fast":{"grade":grade_sig, "bumpiness":bumpy_sig}
#            , "slow":{"grade":grade_bkg, "bumpiness":bumpy_bkg}}


    grade_sig = [X_test[ii][0] for ii in range(0, len(X_test)) if y_test[ii]==0]
    bumpy_sig = [X_test[ii][1] for ii in range(0, len(X_test)) if y_test[ii]==0]
    grade_bkg = [X_test[ii][0] for ii in range(0, len(X_test)) if y_test[ii]==1]
    bumpy_bkg = [X_test[ii][1] for ii in range(0, len(X_test)) if y_test[ii]==1]

    test_data = {"fast":{"grade":grade_sig, "bumpiness":bumpy_sig}
            , "slow":{"grade":grade_bkg, "bumpiness":bumpy_bkg}}

    return X_train, y_train, X_test, y_test
#    return training_data, test_data

@route('/hello', method = 'GET')
def hello():
    callback = request.GET.get('callback')
    print(callback)
    return '{0}({1})'.format(callback, {'a':1, 'b':2})

def jsonp(request, dictionary):
	if (request.query.callback):
		return "%s(%s)" % (request.query.callback, dictionary)
	return dictionary


@route('/train', method = 'GET')
def train():
    callback = request.GET.get('callback')
    classifier_name = request.GET.get('classifier_name')
    classifier_type = request.GET.get('classifier_type')
    classifier_params = request.GET.get('classifier_params')
    cross_validation_type = request.GET.get('cross_validation_type')
    cross_validation_params = request.GET.get('cross_validation_params')
    collection_id = request.GET.get('collection_id')
    train_size = request.GET.get('train_size')
    data = classifier_to_send(classifier_name, classifier_params, "", "", 1)
    post.send("http://localhost:8080/dataprocessing/rest-api/classifiers/",data)
    print("Params :")
    print(classifier_name)
    print(classifier_type)
    print(classifier_params)
    print(cross_validation_type)
    print(cross_validation_params)
    print(collection_id)
    print(train_size)
    clf = classifier.configure_classifier(classifier_type,classifier_params)
    #features_train, labels_train = makeTerrainData(n_points=200)
    features_train, labels_train, features_test, labels_test = makeTerrainData()
    #print(features_train)
    if(cross_validation_type == 'None') :
            cross_validation_type = None

    cv = classifier.configure_cross_validation(cross_validation_type,cross_validation_params, n = len(features_train))
	
    print("features_train :")
    print(len(features_train))
    print("labels_train :")
    print(len(labels_train))
    clf.fit(features_train, labels_train)

    fig = classifier.train(clf,
                        train_sizes = np.linspace(.1, 1.0,train_size),
                        cv = cv,
                        params = " ",
                        features = features_train,
                        labels = labels_train )
    imgdata = StringIO()
    fig.savefig(imgdata, format='svg')
    imgdata.seek(0)  # rewind the data

    svg_dta = imgdata.getvalue()  # this is svg data
    import pickle
    s = pickle.dumps(clf)
    print("classifier dump:")
    #print(s)
    data = classifier_to_send(classifier_name, classifier_params, svg_dta, s, 1)
    put.send("http://localhost:8080/dataprocessing/rest-api/classifiers",classifier_name, data)
    pred = clf.predict(features_train)
    from sklearn.metrics import accuracy_score
    acc = accuracy_score(labels_train, pred)
    precision = precision_score(labels_train, pred)
    recall = recall_score(labels_train, pred)

    #print("Test :")
    #print("accuracy" + acc)
    #print("precision" + precision)
    #print("recall" + recall)

    data = test_data_to_send(classifier_name, 0, " ", precision, acc, recall)
    post.send("http://localhost:8080/dataprocessing/rest-api/result_test_classifier", data)

    return '{0}({1})'.format(callback, {'a':1, 'b':2})

class EnableCors(object):
    name = 'enable_cors'
    api = 2

    def apply(self, fn, context):
        def _enable_cors(*args, **kwargs):
            # set CORS headers
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT'
            response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

            if bottle.request.method != 'OPTIONS':
                # actual request; reply with the actual response
                return fn(*args, **kwargs)

        return _enable_cors



@route('/test', method = 'POST')
def test():
    callback = request.GET.get('callback')
    classifier_name = request.GET.get('classifier_name')
    classifier_dump = request.GET.get('classifier')
    collection_id = request.GET.get('collection_id')
    print("Params :")
    print(classifier_name)
    features_train, labels_train = wtf.getArrays(collection_id)
    clf = pickle.loads(classifier_dump)
    preditions, accuracy, recall, precision = classifier.test(clf = clf, features = features_train, labels = labels_train)
    print("Test :")
    print("accuracy" + accuracy)
    print("precision" + precision)
    print("recall" + recall)
    data1 = test_data_to_send(classifier_name, 0, " ", precision, accuracy, recall)
    post.send("http://localhost:8080/dataprocessing/rest-api","/result_test_classifier","",data1)

    return '{0}({1})'.format(callback, {'a':1, 'b':2})

def classifier_to_send(name, parameter, learningCurve, content, flag):
    data ={
        "name" : name,
        "parameter" : parameter,
        "learningCurve" : learningCurve,
        "content" : str(content),
        "flag" : flag
    }
    return data

def preds_to_send(questionId, documentId, value, range):
    data ={
        "userId" : "2",
        "questionId" : questionId,
        "documentId" : documentId,
        "value" : value,
        "range" : range,
    }
    return data

def test_data_to_send(classifierId, vectoriziedDocumentCollectionId, parameter, precision, accuracy, recall):
    data ={
        "classifierId" : classifierId,
        "vectoriziedDocumentCollectionId" : vectoriziedDocumentCollectionId,
        "parameter" : parameter,
        "precision" : precision,
        "accuracy" : accuracy,
        "recall" : recall
    }
    return data

app = bottle.app()


@app.route('/cors', method=['GET'])
def lvambience():
    response.headers['Content-type'] = 'application/json'
    return '[1]'


app.install(EnableCors())


app.run(host='localhost', port=8082)

