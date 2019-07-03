const cote=require('cote');

const responder=new cote.Responder({name:"currency_request_responder",key:'currency'});
const subscriber=new cote.Subscriber({name:"currencyrate_update_subscriber"});

const rates={eur_inr:78.54};
var res="";

responder.on('convert',function(req,cb){
    console.log(req);
if(req.from=="eur" && req.to=="inr")
{
res=req.amount *rates.eur_inr;
}
else if(req.from=="inr" && req.to=="eur")
{
   res=req.amount /rates.eur_inr; 
}
cb(null,res); //this sends back the response back to the requester.
})

//A subscriber listens to an updates published by the publisher in another responders.
//when update-publisher.js updates the rate,it is published. The subscriber below keeps listening
//to updates of type:'rate_updated'
//This is useful when changes made in a responder file need to be updated in the file where the changed resource is being
//used
subscriber.on('rate_updated',function(updatedRate)
{
console.log("subscriber called");
rates.eur_inr=updatedRate;
})

