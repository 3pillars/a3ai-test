import json,urllib.request,sys
UA={'User-Agent':'Mozilla/5.0'}
def get(u):
    return json.load(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30))
slugs=sys.argv[1:]
for s in slugs:
    try:
        d=get(f'https://gamma-api.polymarket.com/events?slug={s}')
    except Exception as e:
        print(s,'ERR',e); continue
    if not d: print(s,'EMPTY'); continue
    e=d[0]
    print('==',s,'closed=',e.get('closed'),'vol=',e.get('volume'),'liq=',e.get('liquidity'))
    for m in e.get('markets',[]):
        op=m.get('outcomePrices')
        if isinstance(op,str):
            try: op=json.loads(op)
            except: pass
        print('  ',m.get('groupItemTitle') or m.get('question')[:60],'|p=',op,'|vol=',m.get('volume'),'|liq=',m.get('liquidity'),'|bid',m.get('bestBid'),'ask',m.get('bestAsk'),'|closed',m.get('closed'),'|uma',m.get('umaResolutionStatus'))
