import json
import time
import requests
from bs4 import BeautifulSoup
import random
from requests.packages.urllib3.util.retry import Retry
from requests.sessions import HTTPAdapter

# Example of fetching free proxies (be cautious with free proxies)
proxy_list_url = 'https://www.sslproxies.org/'
response = requests.get(proxy_list_url)

soup = BeautifulSoup(response.text, 'html.parser')

# Extract proxy IPs and ports
proxies = []
for row in soup.find(class_='table-responsive').tbody.find_all('tr'):
    proxies.append(f"http://{row.find_all('td')[0].text}:{row.find_all('td')[1].text}")
print(proxies)
# Function to get a random proxy
def get_random_proxy():
    return random.choice(proxies)


proxy = {
    'http': get_random_proxy(),
    'https': get_random_proxy()
}
def scrap():
 from urllib.request import Request, urlopen

 req = Request(
    url='https://crypto.com/price', 
    headers={'User-Agent': 'Mozilla/5.0',"proxies":proxy["https"]},
    
 )
 webpage = urlopen(req).read()
 print(req)
 #print(webpage)
 soup = BeautifulSoup(webpage, 'html.parser')
 results = soup.find(id="__next")
 print(results)
 elements = results.find_all("table")
 print(elements)
 for element in elements:
        time.sleep(0.125)
        k = element.find('tbody')
        z=k.find_all(class_="css-1cxc880")
        list1=[]
        i = 0
        for x in z:
            #" print(x)
            print("***************************************")
            e=x.find_all(class_="css-87yt5a")
            price=x.find_all(class_="css-16q9pr7")
           
            CoinSymbol=str(e[0])
            Price_Tracker=str(price[0])
            print(CoinSymbol[CoinSymbol.index('auto')+len('auto">'):CoinSymbol.index("</p>")])
            print(Price_Tracker[Price_Tracker.index('$'):Price_Tracker.index("</p>")])
            Tracker=str(Price_Tracker[Price_Tracker.index("title="):])
            print(Tracker[Tracker.index(">")+1:Tracker.index("</p>")])

            row={"coin":CoinSymbol[CoinSymbol.index('auto')+len('auto">'):CoinSymbol.index("</p>")],"price":Price_Tracker[Price_Tracker.index('$'):Price_Tracker.index("</p>")],"diff":Tracker[Tracker.index(">")+1:Tracker.index("</p>")]}
            #insert first time
           
            import pymongo
            mongo = pymongo.MongoClient("mongodb://localhost:27017/")
            db = mongo["Coin_db"]
            col = db["coins"]
            """""
            w=col.insert_one(row)
            """
            #updating coin values
            my_query = { "coin": row["coin"] }
            new_values = { "$set": { "price":  row["price"] , "diff":row["diff"]} }
           
            col.update_one(my_query, new_values)
           # time.sleep(0.1)
            list1.append(row)
        return  json.dumps(list1)

         #   for x in col.find():
          #      print(x)
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def scrap_coins():

    
    l=scrap()
    data = {"coins":l}
    return l
@app.route("/ETH_to_USD")
def eth_rate():
     import pymongo
     import json
     mongo = pymongo.MongoClient("mongodb://localhost:27017/")
     db = mongo["Coin_db"]
     col = db["coins"]
     for x in col.find({ "coin":"Ethereum" }):
         print(x)
         break;
     return json.dumps(x["price"])
     
  
   
if __name__ == '__main__':
    app.run(debug=True)