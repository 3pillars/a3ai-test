import urllib.request, urllib.parse, re, time
UA={'User-Agent':'Mozilla/5.0'}
def rss(q):
    u='https://news.google.com/rss/search?q='+urllib.parse.quote(q)+'&hl=en-US&gl=US&ceid=US:en'
    x=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read().decode()
    out=[]
    for m in re.finditer(r'<item>(.*?)</item>',x,re.S):
        b=m.group(1)
        t=re.search(r'<title>(.*?)</title>',b,re.S); p=re.search(r'<pubDate>(.*?)</pubDate>',b,re.S); s=re.search(r'<source[^>]*>(.*?)</source>',b,re.S)
        if t: out.append((t.group(1),(s.group(1) if s else ''),(p.group(1) if p else '')))
    return out
qs=['Hormuz when:1h','Iran oil when:1h','site:reuters.com Hormuz when:2h','site:wsj.com Iran when:2h','site:apnews.com Iran when:2h','Houthi Saudi when:2h','oil price Brent when:1h','UKMTO when:2h']
seen=set()
for q in qs:
    print('###',q)
    for t,s,p in rss(q)[:12]:
        k=t[:70]
        if k in seen: continue
        seen.add(k)
        print('  ',p[5:16],'|',s,'|',t[:130])
    time.sleep(0.4)
