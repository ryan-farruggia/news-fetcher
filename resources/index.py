import requests
import json

url = ('https://newsapi.org/v2/top-headlines?'
       'country=us&'
       'sortBy=popularity&'
       'apiKey=c53986d1dfcf40a6be9744c2d9d2dd99')

response = requests.get(url)

if response.status_code == 200:
    formatted_response = json.dumps(response.json(), indent=4)
    print(formatted_response)
else:
    print(response.status_code)
    print(response)