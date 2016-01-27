import requests

def send(url, post_data):
    resp = requests.post(url, json=post_data, auth=('admin', 'admin'), headers = { 'Content-Type' : 'application/json' })
    print(resp)
