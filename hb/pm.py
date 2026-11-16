import urllib.request, json, time
UA={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'}
def get(u):
    return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read().decode()
EVENTS=['what-price-will-wti-hit-in-november-2026','us-x-iran-effective-ceasefire-begins-by-2-week-pause-20261108','israel-x-iran-ceasefire-continues-throughptptpt-20260716224448963','us-iran-hormuz-agreement-byptptpt-20260803235957575','us-announces-end-of-iranian-blockade-byptptpt-20260713152715080','iran-blockade-lifted-before-iran-oman-hormuz-agreement','will-the-us-invade-iran-before-2027','will-the-us-officially-declare-war-on-iran-by','next-us-iran-senior-diplomatic-meeting-byptptpt','where-will-the-next-us-iran-senior-diplomatic-meeting-take-placeptptpt','will-iran-target-saudi-arabia-byptptpt','houthi-x-saudi-arabia-effective-ceasefire-begins-by-20260916','bab-el-mandeb-strait-effectively-closed-by','iran-full-airspace-closure-byptptpt-20260625195253028','will-iran-target-iraq-byptptpt-20261110','how-many-ukmto-notices-november-1622','eu-emergency-diesel-stocks-end-of-november-2026','crude-oil-all-time-high-by','strait-of-hormuz-traffic-returns-to-normal-byptptpt','will-iran-target-united-arab-emirates-byptptpt-20260907','will-iran-target-jordan-by-20260909','will-iran-target-qatar-byptptpt']
out={}
for ev in EVENTS:
    try:
        d=json.loads(get('https://gamma-api.polymarket.com/events?slug='+ev))
        legs=[]
        if d:
            for m in d[0].get('markets',[]):
                if m.get('closed'): continue
                legs.append({'q':m.get('question'),'slug':m.get('slug'),'bid':m.get('bestBid'),'ask':m.get('bestAsk'),'liq':m.get('liquidity'),'ltp':m.get('lastTradePrice'),'d1':m.get('oneDayPriceChange')})
        out[ev]=legs
        print('==',ev)
        for l in legs: print('   ',l['bid'],'/',l['ask'],'liq',l['liq'],'ltp',l['ltp'],'d1',l['d1'],'|',l['q'][:80],'|',l['slug'])
    except Exception as e:
        print('==',ev,'ERR',e)
    time.sleep(0.25)
json.dump(out,open('hb/pm.json','w'))
