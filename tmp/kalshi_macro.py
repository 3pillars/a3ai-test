import urllib.request, json
UA={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36','Accept':'application/json'}
def get(u):
    try:
        r=urllib.request.Request(u,headers=UA)
        return json.loads(urllib.request.urlopen(r,timeout=40).read().decode())
    except Exception as e:
        return {'ERR':str(e)}
for t in ['KXHORMUZWEEKLY-26NOV15-T15','KXHORMUZWEEKLY-26NOV15-T20','KXHORMUZWEEKLY-26NOV15-T25','KXHORMUZWEEKLY-26NOV15-T30']:
    d=get('https://api.elections.kalshi.com/trade-api/v2/markets/'+t)
    m=d.get('market',{})
    print(t, 'bid',m.get('yes_bid_dollars'),'ask',m.get('yes_ask_dollars'),'last',m.get('last_price_dollars'),'OI',m.get('open_interest_fp'),'vol',m.get('volume_fp'),'v24',m.get('volume_24h_fp'),'bsz',m.get('yes_bid_size_fp'),'asz',m.get('yes_ask_size_fp'))
def cnbc(sym):
    d=get('https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=%s&requestMethod=quick&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1'%sym)
    try:
        q=d['FormattedQuoteResult']['FormattedQuote'][0]
        return q.get('last'),q.get('last_time'),q.get('change_pct'),q.get('previous_day_closing')
    except Exception as e:
        return d
for s in ['HYG','LQD','US10Y','.DXY','.VIX','@LCO.1','@CL.1','@GC.1']:
    print(s,cnbc(s))
print('GOLD',get('https://api.gold-api.com/price/XAU'))
print('BTC',get('https://api.exchange.coinbase.com/products/BTC-USD/ticker'))
m=get('https://api.manifold.markets/v0/market/pUncsZnp2u')
print('MANIFOLD',m.get('probability'),m.get('volume'),m.get('volume24Hours'),m.get('uniqueBettorCount'))
