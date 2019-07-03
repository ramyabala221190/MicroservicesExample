const cote=require('cote');

const publisher=new cote.Publisher({name:"currencyrate_update_publisher"});
const responder=new cote.Responder({name:"currencyrate_update_responder",key:'currency'});

responder.on('update',function(req,cb)
{
   console.log(req);
cb(null,"Changed Rate");
publisher.publish("rate_updated",req.rate);
})

