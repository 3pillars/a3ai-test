import urllib.request, urllib.parse, re, json
UA={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'}
def rss(q):
    u='https://news.google.com/rss/search?q='+urllib.parse.quote(q)+'&hl=en-US&gl=US&ceid=US:en'
    try:
        x=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30).read().decode('utf-8','ignore')
    except Exception as e:
        return []
    items=re.findall(r'<item>(.*?)</item>',x,re.S)
    out=[]
    for it in items:
        t=re.search(r'<title>(.*?)</title>',it,re.S)
        d=re.search(r'<pubDate>(.*?)</pubDate>',it,re.S)
        s=re.search(r'<source[^>]*>(.*?)</source>',it,re.S)
        out.append((d.group(1) if d else '', s.group(1) if s else '', (t.group(1) if t else '')[:160]))
    return out
qs=['oil price when:1h','Hormuz when:1h','Houthi when:1h','Iran when:1h','tanker when:1h','OPEC+ when:3h']
for q in qs:
    print('=====',q)
    for row in rss(q)[:22]: print(row[0][16:22],'|',row[1][:22],'|',row[2])
