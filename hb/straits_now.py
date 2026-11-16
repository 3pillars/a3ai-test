import urllib.request, json
H={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36','Accept':'application/json'}
def g(u):
    return json.load(urllib.request.urlopen(urllib.request.Request(u,headers=H),timeout=60))
s=g('https://straits.live/status')
json.dump(s,open('status_now.json','w'))
print('asOf',s.get('asOf'))
print('OIL',{k:s.get(k) for k in ['brent','wti','change24h','change24hUsd','oilAsOf','marketTime','marketClosed','changeSource']})
print('SHIPS',{k:s.get(k) for k in ['shipsTransiting','stranded','strandedOffshore','measuredPopulation','aisStaleFixInZone','aisGapCarryoverInZone','aisConcurrentInZone','aisFirstFixInZone','throughputPercent','aisBasis','strandedOffshoreCoverageThin']})
print('baseline',s.get('transitsBaseline'))
print('health',json.dumps(s.get('dataHealth')))
print('verdict',s.get('verdict'))
print('hormuzIndex',json.dumps(s.get('hormuzIndex')))
print('iranRate',json.dumps(s.get('iranRate')))
print('dailyBrief',json.dumps(s.get('dailyBrief'))[:1200])
print('aisGaps',json.dumps(s.get('aisGaps'))[:1500])
print('vesselRisk',json.dumps(s.get('vesselRisk'))[:600])
print('chokepoints',json.dumps(s.get('chokepoints'))[:800])
ev=s.get('events') or []
print('EVENTS',len(ev))
for e in ev[:12]: print('  ',e.get('publishedAt') or e.get('timestamp'),'|',e.get('source'),'|',str(e.get('title'))[:110])
pm=s.get('predictionMarkets') or []
print('PM',len(pm))
for p in pm: print('  ',json.dumps(p)[:260])
print('gas',json.dumps(s.get('gas'))[:200])
