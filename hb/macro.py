import urllib.request, json, re
def q(sym):
    u='https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=%s&requestMethod=quick&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1'%sym
    rq=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'})
    d=json.load(urllib.request.urlopen(rq,timeout=30))
    f=d['FormattedQuoteResult']['FormattedQuote'][0]
    return f
for s in ['@LCO.1','@CL.1','.VIX','US10Y','.DXY']:
    try:
        f=q(s); print(s,'| last',f.get('last'),'| chg%',f.get('change_pct'),'| time',f.get('last_time'),'| prevclose',f.get('previous_day_closing'))
    except Exception as e: print(s,'ERR',e)
