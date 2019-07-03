const cote=require('cote');
const express=require('express');
const app=express();


const requester=new cote.Requester({name:"currency_convert_requester",key:'currency'});

app.get('/currconvert',function(req,res)
{
//When i hit http://localhost:8080/currconvert?from=eur&to=inr&amt=100
//The below request is sent and the corresponding responder sends back the response which is logged.
requester.send({type:'convert',from:req.query.from,to:req.query.to,amount:req.query.amt},function(err,curr)
{
    if(err) console.log(err);
    console.log(curr);
})
})

app.get('/updateRate',function(req,res)
{
console.log(req.query);
requester.send({type:'update',rate:req.query.rate},function(err,updatedRate)
{
console.log(updatedRate);
})

})

app.listen(8080,function()
{
    console.log("app listening on port 8080");
})