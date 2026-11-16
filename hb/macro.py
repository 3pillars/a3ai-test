import urllib.request, json
import urllib.parse
UA={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'}
def get(u,h=None):
    hh=dict(UA); hh.update(h or {})
    return urllib.request.urlopen(urllib.request.Request(u,headers=hh),timeout=60).read().decode()
# CNBC quotes
try:
    d=json.loads(get('https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=@LCO.1&requestMethod=quick&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1'))
    for s in ['@LCO.1','@CL.1','.VIX','@GC.1','.DXY','US10Y','HYG','LQD','BTC=']:
        try:
            d2=json.loads(get('https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols='+urllib.parse.quote(s)+'&requestMethod=quick&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1'))
            q=d2['FormattedQuoteResult']['FormattedQuote'][0]
            print(s,'|',q.get('last'),'| chg',q.get('change'),q.get('change_pct'),'| prev',q.get('previous_day_closing'),'| time',q.get('last_time') or q.get('last_time_msec'),'| cur',q.get('currency'))
        except Exception as e: print(s,'ERR',e)
except Exception as e: print('cnbc ERR',e)
