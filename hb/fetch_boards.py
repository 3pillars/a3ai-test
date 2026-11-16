import urllib.request, json, sys
def g(u):
    return json.load(urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent':'Mozilla/5.0'}), timeout=45))
def prices(o):
    if isinstance(o,list): return o
    return [o]
slugs=sys.argv[1:]
out={}
for sl in slugs:
    try:
        ev=g('https://gamma-api.polymarket.com/events?slug='+sl)
    except Exception as e:
        print(sl,'ERR',e); continue
    if not ev: print('###',sl,'NO DATA'); continue
    e=ev[0]
    print('###',sl,'|',e.get('title'))
    for m in (e.get('markets') or []):
        if m.get('closed'): continue
        print('  -',m.get('slug'),'|',m.get('question'),'| bid',m.get('bestBid'),'ask',m.get('bestAsk'),'| p',prices(m.get('outcomePrices')),'| ltp',m.get('lastTradePrice'),'| 1d',m.get('oneDayPriceChange'),'| liq',m.get('liquidityNum'),'| v24',m.get('volume24hr'))
