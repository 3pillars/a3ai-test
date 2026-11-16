import urllib.request, json
H={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36','Accept':'application/json'}
t=json.load(urllib.request.urlopen(urllib.request.Request('https://straits.live/api/v1/tick',headers=H),timeout=60))
print(json.dumps(t)[:2000])
