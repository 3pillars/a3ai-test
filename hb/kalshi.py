import urllib.request, json, time
UA={'User-Agent':'Mozilla/5.0'}
def get(u):
    return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read().decode()
for t in ['KXHORMUZWEEKLY-26NOV15-T15','KXHORMUZWEEKLY-26NOV15-T20','KXHORMUZWEEKLY-26NOV15-T25','KXHORMUZWEEKLY-26NOV15-T30','KXHORMUZWEEKLY-26NOV15-T40','KXHORMUZWEEKLY-26NOV15-T50']:
    try:
        d=json.loads(get('https://api.elections.kalshi.com/trade-api/v2/markets/'+t))['market']
        print(t,'bid',d.get('yes_bid_dollars'),'ask',d.get('yes_ask_dollars'),'last',d.get('last_price_dollars'),'OI',d.get('open_interest_fp'),'vol',d.get('volume_fp'),'v24',d.get('volume_24h_fp'),'bsz',d.get('yes_bid_size_fp'),'asz',d.get('yes_ask_size_fp'))
    except Exception as e: print(t,'ERR',e)
    time.sleep(0.2)
try:
    m=json.loads(get('https://api.manifold.markets/v0/market/pUncsZnp2u'))
    print('MANIFOLD prob',m.get('probability'),'vol',m.get('volume'),'v24',m.get('volume24Hours'),'bettors',m.get('uniqueBettorCount'))
except Exception as e: print('manifold ERR',e)
