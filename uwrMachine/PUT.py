import requests

def send(url, id, post_data):
    resp = requests.put(url+str(id), json=post_data, auth=('admin', 'admin'), headers = { 'Content-Type' : 'application/json' })
    print(resp)
