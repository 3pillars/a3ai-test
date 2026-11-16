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
for q in ['site:bloomberg.com oil Iran when:2h','Iran ceasefire Hormuz plan when:1h','site:cnn.com Iran when:2h','Saudi Arabia Iran strike when:1h','VIX stocks oil Iran when:1h']:
    print('###',q)
    for t,s,p in rss(q)[:10]: print('  ',p[5:16],'|',s,'|',t[:130])
    time.sleep(0.4)
