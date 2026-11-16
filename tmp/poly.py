import urllib.request, urllib.parse, json
UA={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36','Accept':'application/json'}
def get(u):
    try:
        r=urllib.request.Request(u,headers=UA)
        return json.loads(urllib.request.urlopen(r,timeout=45).read().decode())
    except Exception as e:
        return {'ERR':str(e)}
boards=['what-price-will-wti-hit-in-november-2026','us-x-iran-effective-ceasefire-begins-by-2-week-pause-20261108','israel-x-iran-ceasefire-continues-throughptptpt-20260716224448963','us-iran-hormuz-agreement-byptptpt-20260803235957575','us-announces-end-of-iranian-blockade-byptptpt-20260713152715080','next-us-iran-senior-diplomatic-meeting-byptptpt','where-will-the-next-us-iran-senior-diplomatic-meeting-take-placeptptpt','will-iran-target-saudi-arabia-byptptpt','will-iran-target-qatar-byptptpt','will-iran-target-united-arab-emirates-byptptpt-20260907','will-iran-target-jordan-by-20260909','houthi-x-saudi-arabia-effective-ceasefire-begins-by-20260916','bab-el-mandeb-strait-effectively-closed-by','iran-full-airspace-closure-byptptpt-20260625195253028','will-iran-target-iraq-byptptpt-20261110','how-many-ukmto-notices-november-1622','crude-oil-all-time-high-by','eu-emergency-diesel-stocks-end-of-november-2026']
def board(slug):
    d=get('https://gamma-api.polymarket.com/events?slug='+urllib.parse.quote(slug))
    if isinstance(d,dict): return d
    out=[]
    for ev in d:
        for m in ev.get('markets',[]):
            if m.get('closed'): continue
            b=m.get('bestBid'); a=m.get('bestAsk')
            try: b=float(b); a=float(a)
            except: b=m.get('bestBid'); a=m.get('bestAsk')
            out.append((m.get('question','')[:60], b,a, m.get('lastTradePrice'), m.get('liquidity'), m.get('slug')))
    return out
for s in boards:
    print('=== ',s)
    r=board(s)
    if isinstance(r,dict): print(r); continue
    for x in r: print(x)
singles=['will-the-us-invade-iran-before-2027','iran-blockade-lifted-before-iran-oman-hormuz-agreement','strait-of-hormuz-traffic-returns-to-normal-by-december-31','strait-of-hormuz-traffic-returns-to-normal-by-november-30-20260810151158765']
for s in singles:
    d=get('https://gamma-api.polymarket.com/markets?slug='+urllib.parse.quote(s))
    print('=== SINGLE',s)
    for m in (d if isinstance(d,list) else []):
        if m.get('closed'): continue
        print(m.get('question','')[:60], m.get('bestBid'), m.get('bestAsk'), m.get('lastTradePrice'), m.get('liquidity'))
