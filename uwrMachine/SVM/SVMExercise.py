import numpy as np
import matplotlib.pyplot as plt
from classifier import train
from classifier import test
from sklearn import cross_validation
import Connection.GET as wtf
import Data.prep_terrain_data as prep_terrain_data
from sklearn.metrics import classification_report
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import f1_score
from sklearn import svm
from sklearn.externals import joblib

#features_train,  labels_train,  = wtf.getArrays()


features_train, labels_train, features_test, labels_test = prep_terrain_data.makeTerrainData()
#for (i, feature) in enumerate(features_test):
 #   print (i, len(feature))
#labels_train[0] = 1
# fit the model
cv = cross_validation.ShuffleSplit(len(features_train), n_iter=50, test_size=0.1, random_state=0)

train(svm.SVC(), train_sizes=np.linspace(.1, 1.0, 10),cv = cv, params = " ", features= features_train, labels=labels_train )


#pred, accuracy, recall, precision = test(clf, features_test, labels_test)

plt.show()

#clf.fit(features_train, labels_train)

#pred = clf.predict(features_test)

from sklearn.metrics import accuracy_score
#acc = accuracy_score(pred, labels_test)d
#print (" accuracy: ", acc)

#print(classification_report(labels_test, pred))
#precision = precision_score(labels_test, pred)
#print (" precision: ", precision)

#recall = recall_score(labels_test, pred)
#print (" recall: ", recall)

#f1 = f1_score(labels_test, pred)
#print (" f1: ", f1)

#import pickle
#s = pickle.dumps(clf)
#print (" dumps: ", s)
#print (" len: ", len(s))
#clf2 = pickle.loads(s)

#print(classification_report(labels_test, clf2.predict(features_test)))