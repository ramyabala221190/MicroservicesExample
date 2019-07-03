const cote=require('cote');
const MongoClient=require('mongodb').MongoClient;
const bson =require('bson');
const ObjectId=bson.ObjectID;

const configdetails=require('../config');

const dbname=configdetails.MONGODB_DB;
const url="mongodb://"+configdetails.MONGODB_HOST+":"+configdetails.MONGODB_PORT+"/";

const cart_responder=new cote.Responder({name:'cart_responder',key:'cart'});

cart_responder.on('getCart',function(req,cb)
{
var cartList=[];
MongoClient.connect(url,function(err,dbo)
{
    if(err){
console.log(err);
//next(err);
}
dbo.db(dbname).collection("cartDetails").find({"username":req.product.user}).toArray(function(err,resp)
{
  if(err){
console.log(err);
//next(err);
}
console.log(resp[0].books.length);

if(resp[0].books.length > 0)
{
for(var i=0;i<resp[0].books.length;i++)
{
console.log(resp[0].books[i]);
dbo.db(dbname).collection("products").find({"gtin14":resp[0].books[i]}).toArray(function(err,bookList)
{
  if(err){
console.log(err);
//next(err);
}
cartList.push(bookList[0]);
})
}

const checkCartTimer=setInterval(()=>{
if(cartList.length > 0)
{
clearInterval(checkCartTimer);
cb(null,cartList);
}
},1000);

}
else
{
cb(null,cartList);
}


dbo.close();
})
})

})

cart_responder.on('addCart',function(req,cb)
{
var bookList=[];

MongoClient.connect(url,function(err,dbo)
{
    if(err){
console.log(err);
//next(err);
}
dbo.db(dbname).collection("cartDetails").find({"username":req.product.username}).toArray(function(err,resp)
{
  if(err){
console.log(err);
//next(err);
}
console.log(resp);
if(resp.length > 0)
{
bookList=resp[0].books;
bookList.push(req.product.gtin);

dbo.db(dbname).collection("cartDetails").update({"username":req.product.username},{$set:{"books":bookList}},function(err,updresp)
{
    if(err){
console.log(err);
//next(err);
}
console.log(updresp);
  cb(null,updresp.result.n);
})    

}
else
{
bookList.push(req.product.gtin);
dbo.db(dbname).collection("cartDetails").insert([{"username":req.product.username,"books":bookList}],function(err,insresp)
{
    if(err){
console.log(err);
//next(err);
}
console.log(insresp);
  cb(null,insresp.result.n);
})     
}
  dbo.close();
})
})


})