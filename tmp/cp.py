import urllib.request,json
UA={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36','Accept':'application/json'}
def get(u):
    try:
        return json.loads(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=40).read().decode())
    except Exception as e: return {'ERR':str(e)}
s=get('https://straits.live/status')
print('CHOKE',json.dumps(s.get('chokepoints'))[:1200])
ev=get('https://straits.live/api/v1/events')
for e in ev.get('events',[])[:14]:
    print(e.get('occurredAt'),'|',e.get('type'),'|',e.get('severity'),'|',(e.get('title') or '')[:130],'|',e.get('sourceName'))
