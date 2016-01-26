import urllib3.request
import json
def getArrays(collectonId):
    X = []
    Y = []
    maxWord = 26014
    Xcnt = 0

    url = "http://www.naos-software.com/dataprocessing/rest-api/vectorizedDocumentCollections/search/findAllByDocumentCollectionId?documentCollectionId="+str(collectonId)
    response = urllib3.request.urlopen(url)
    content = response.read()
    data = json.loads(content.decode("utf8"))

    content = data['_embedded']
    resultDocuments = content['vectorizedDocumentCollections']

    for document in resultDocuments:
        tmpArr = document['result'].split(" ")
        Y.append(int(tmpArr[0]))
        X.append([0])

        for i in range(0, maxWord):
            X[Xcnt].append(0)

        for i in range(1, len(tmpArr)):
            word = tmpArr[i].split(":")
            X[Xcnt][int(word[0])] = int(word[1])

        Xcnt +=1

    return X, Y