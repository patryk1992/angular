import POST as post
import PUT as put

def classfier_to_send(learningCurve, content, flag):
    data ={
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


data1 = test_data_to_send(1, 1, 1)
post.send("http://localhost:8080/dataprocessing/rest-api/resultTestClassifiers",data1)

data2 = preds_to_send(2, 2, -5, 5)
post.send("http://localhost:8080/dataprocessing/rest-api/annotations",data2)

data3 = classfier_to_send(2, 2, 1)
put.send("http://localhost:8080/dataprocessing/rest-api/classifiers/",id,data3)