import urllib.request, json
UA={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36','Accept':'application/json'}
def get(u):
    try:
        r=urllib.request.Request(u,headers=UA)
        return json.loads(urllib.request.urlopen(r,timeout=40).read().decode())
    except Exception as e:
        return {'ERR':str(e)}
s=get('https://straits.live/status')
keys=['brent','wti','change24h','change24hUsd','oilAsOf','marketTime','marketClosed','changeSource','shipsTransiting','stranded','strandedOffshore','measuredPopulation','aisStaleFixInZone','aisGapCarryoverInZone','aisConcurrentInZone','aisFirstFixInZone','throughputPercent','aisBasis','dataHealth']
out={k:s.get(k) for k in keys}
print('STATUS',json.dumps(out,indent=1))
print('BASELINE',json.dumps(s.get('transitsBaseline')))
print('DAILYBRIEF',json.dumps(s.get('dailyBrief'))[:2000])
print('HORMUZIDX',json.dumps(s.get('hormuzIndex')))
print('IRANRATE',json.dumps(s.get('iranRate')))
print('PRED',json.dumps(s.get('predictionMarkets'))[:1500])
print('AISGAPS',json.dumps(s.get('aisGaps'))[:1500])
print('VESSEL',json.dumps(s.get('vesselRisk'))[:800])
t=get('https://straits.live/api/v1/tick')
print('TICK',json.dumps(t)[:2500])
ir=get('https://straits.live/api/v1/iran-rate')
print('IRANRATEAPI',json.dumps(ir)[:800])
ev=get('https://straits.live/api/v1/events')
print('EVENTS',json.dumps(ev)[:2000])
