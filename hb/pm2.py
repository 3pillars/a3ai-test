import urllib.request, json, time
UA={'User-Agent':'Mozilla/5.0'}
def get(u): return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read().decode()
for ev in ['strait-of-hormuz-traffic-returns-to-normal-by-december-31','strait-of-hormuz-traffic-returns-to-normal-by-november-30-20260810151158765']:
    try:
        d=json.loads(get('https://gamma-api.polymarket.com/events?slug='+ev))
        print('==',ev)
        if d:
            for m in d[0].get('markets',[]):
                if m.get('closed'): continue
                print('  ',m.get('bestBid'),'/',m.get('bestAsk'),'liq',m.get('liquidity'),'ltp',m.get('lastTradePrice'),'|',m.get('question')[:70],'|',m.get('slug'))
    except Exception as e: print(ev,'ERR',e)
