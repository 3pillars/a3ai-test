import urllib.request, json
def g(u): return json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=45))
for t in ['T15','T20','T25','T30','T40','T50']:
    tk='KXHORMUZWEEKLY-26NOV15-'+t
    try:
        m=g('https://api.elections.kalshi.com/trade-api/v2/markets/'+tk)['market']
        print(t,'| bid',m.get('yes_bid_dollars'),'ask',m.get('yes_ask_dollars'),'| last',m.get('last_price_dollars'),'prev',m.get('previous_price_dollars'),'| OI',m.get('open_interest_fp'),'| vol',m.get('volume_fp'),'| v24',m.get('volume_24h_fp'),'| bsz',m.get('yes_bid_size_fp'),'| asz',m.get('yes_ask_size_fp'))
    except Exception as e: print(t,'ERR',e)
