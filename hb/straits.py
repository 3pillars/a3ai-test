import urllib.request, json
UA={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36','Accept':'application/json'}
def get(u):
    return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read().decode()
for name,u in [('status','https://straits.live/status'),('tick','https://straits.live/api/v1/tick')]:
    try:
        d=json.loads(get(u))
        open(f'hb/{name}.json','w').write(json.dumps(d))
        print(name,'OK',len(json.dumps(d)))
    except Exception as e:
        print(name,'ERR',e)
