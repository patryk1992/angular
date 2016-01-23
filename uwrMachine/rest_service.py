from bottle import request, run, route, response
import bottle
import GET as wtf
import classifier
import numpy as np
import POST as post
import pickle
import PUT as put
import json
from io import StringIO
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from json import dumps, loads

@route('/hello', method = 'GET')
def hello():
    callback = request.GET.get('callback')
    classifier_name = request.GET.get('classifier_name')
    print(callback)
    print(classifier_name)
    return '{0}({1})'.format(callback, {'a':1, 'b':2})

def jsonp(request, dictionary):
	if (request.query.callback):
		return "%s(%s)" % (request.query.callback, dictionary)
	return dictionary

@route('/train', method = 'POST')
def train():
    classifier_name = request.forms.get('classifier_name')
    classifier_type = request.forms.get('classifier_type')
    classifier_params = request.forms.get('classifier_params')
    cross_validation_type = request.forms.get('cross_validation_type')
    train_size = request.forms.get('train_size')
    clf = classifier.configure_classifier(classifier_type,classifier_params)
    cv = classifier.configure_cross_validation(cross_validation_type,classifier_params)
    features_train, labels_train = wtf.getArrays()

    fig = clf, train_sizes, train_scores, test_scores = classifier.train(clf,
                        train_sizes = np.linspace(.1, 1.0,train_size),
                        cv = cv,
                        params = " ",
                        features = features_train,
                        labels = labels_train )
    imgdata = StringIO.StringIO()
    fig.savefig(imgdata, format='svg')
    imgdata.seek(0)  # rewind the data

    svg_dta = imgdata.buf  # this is svg data
    import pickle
    s = pickle.dumps(clf)
    data = classifier_to_send(classifier_name, classifier_params, svg_dta, s, 1)
    put.send("http://naos-software.com/dataprocessing/rest-api","/classifiers",classifier_name, data)
    pred = clf.predict(features_train)
    from sklearn.metrics import accuracy_score
    acc = accuracy_score(labels_train, pred)
    precision = precision_score(labels_train, pred)
    recall = recall_score(labels_train, pred)

    data = test_data_to_send(classifier_name, 0, " ", precision, acc, recall)
    post.send("http://naos-software.com/dataprocessing/rest-api","/result_test_classifier", classifier_name, data)

    return "wolololo"

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
   def test():
    classifier_name = request.forms.get('classifier_name')
    classifier_dump = request.forms.get('classifier')
    features_train, labels_train = wtf.getArrays()
    clf = pickle.loads(classifier_dump)
    preditions, accuracy, recall, precision = classifier.test(clf = clf, features = features_train, labels = labels_train)

    data1 = test_data_to_send(classifier_name, 0, " ", precision, accuracy, recall)
    post.send("http://naos-software.com/dataprocessing/rest-api","/result_test_classifier","",data1)

    return "wolololo"

def classifier_to_send(name, parameter, learningCurve, content, flag):
    data ={
        "name" : name,
        "parameter" : parameter,
        "learningCurve" : learningCurve,
        "content" : content,
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

def test():
    classifier_name = request.forms.get('classifier_name')
    classifier_dump = request.forms.get('classifier')
    features_train, labels_train = wtf.getArrays()
    clf = pickle.loads(classifier_dump)
    preditions, accuracy, recall, precision = classifier.test(clf = clf, features = features_train, labels = labels_train)



    return data1+data2

app = bottle.app()


@app.route('/cors', method=['GET'])
def lvambience():
    response.headers['Content-type'] = 'application/json'
    return '[1]'


app.install(EnableCors())


app.run(host='localhost', port=8082)
