import urllib.request, json, sys, time
UA={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'}
def g(u):
    return json.load(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=45))
slugs=sys.argv[1:]
for sl in slugs:
    try:
        ev=g('https://gamma-api.polymarket.com/events?slug='+sl)
    except Exception as e:
        print(sl,'ERR',e); continue
    if not ev:
        print(sl,'NO DATA'); continue
    e=ev[0]
    print('###',sl)
    for m in (e.get('markets') or []):
        if m.get('closed'): continue
        toks=m.get('clobTokenIds')
        if isinstance(toks,str):
            try: toks=json.loads(toks)
            except Exception: toks=[]
        if not toks: continue
        tid=toks[0]
        try:
            bk=g('https://clob.polymarket.com/book?token_id='+str(tid))
            bids=sorted([(float(b['price']),float(b['size'])) for b in (bk.get('bids') or [])],reverse=True)[:4]
            asks=sorted([(float(a['price']),float(a['size'])) for a in (bk.get('asks') or [])])[:4]
        except Exception as ex:
            print('  -',m.get('question')[:70],'| BOOK ERR',ex); continue
        print('Q:',m.get('question'))
        print('   bid',[(round(p,4),round(s,2)) for p,s in bids])
        print('   ask',[(round(p,4),round(s,2)) for p,s in asks])
    time.sleep(0.2)
