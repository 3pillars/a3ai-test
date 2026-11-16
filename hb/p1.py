import json
s=json.load(open('hb/status.json')); t=json.load(open('hb/tick.json'))
print('STATUS keys:',list(s.keys()))
for k in ['brent','wti','change24h','change24hUsd','oilAsOf','marketTime','marketClosed','changeSource','shipsTransiting','stranded','strandedOffshore','measuredPopulation','aisStaleFixInZone','aisGapCarryoverInZone','aisConcurrentInZone','aisFirstFixInZone','throughputPercent','aisBasis','strandedOffshoreCoverageThin']:
    print(' ',k,'=',s.get(k))
print(' transitsBaseline',s.get('transitsBaseline'))
print('TICK:',json.dumps(t)[:1200])
print('dataHealth:',json.dumps(s.get('dataHealth'))[:800])
print('hormuzIndex:',json.dumps(s.get('hormuzIndex'))[:600])
print('iranRate:',json.dumps(s.get('iranRate'))[:600])
print('verdict:',json.dumps(s.get('verdict'))[:400])
print('events head:')
for e in (s.get('events') or [])[:12]:
    print('  -',json.dumps(e)[:300])
