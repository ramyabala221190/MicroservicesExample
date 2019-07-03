const cote=require('cote');
 
const exchangeRateResponder=new cote.Responder({name:'exchangerate', key:'exchange'});

const rates={"BGN":1.9558,"NZD":1.7201,"ILS":4.053,"RUB":72.9275,"CAD":1.5021,"USD":1.1289,"PHP":58.556,"CHF":1.1207,"ZAR":16.7876,"AUD":1.6336,"JPY":122.44,"TRY":6.6343,"HKD":8.8375,"MYR":4.7068,"THB":35.25,"HRK":7.4128,"NOK":9.772,"IDR":16135.37,"DKK":7.4678,"CZK":25.581,"HUF":322.0,"GBP":0.88948,"MXN":21.6384,"KRW":1335.74,"ISK":141.5,"SGD":1.5423,"BRL":4.3429,"PLN":4.2574,"INR":78.4745,"RON":4.7221,"CNY":7.8144,"SEK":10.6968};

exchangeRateResponder.on('exc',function(req,cb)
{
cb(null,rates);    
})