const cote=require('cote');
const MongoClient=require('mongodb').MongoClient;
const bson =require('bson');
const configdetails=require('../config');
//const libs=require('./index');


const ObjectId=bson.ObjectID;
const dbname=configdetails.MONGODB_DB;
const url="mongodb://"+configdetails.MONGODB_HOST+":"+configdetails.MONGODB_PORT+"/";

const product_responder=new cote.Responder({name:"product_responder",key:"product"});


product_responder.on('list',function(req,cb)
{
MongoClient.connect(url,function(err,dbo)
{
    if(err){
console.log(err);
//next(err);
}
dbo.db(dbname).collection("products").find({}).toArray(function(err,resp)
{
  if(err){
console.log(err);
//next(err);
}
  cb(null,resp);
  dbo.close();
})
})
})

product_responder.on('create',function(req,cb)
{
   MongoClient.connect(url,function(err,dbo)
{
    if(err){
console.log(err);
//next(err);
} 
dbo.db(dbname).collection("products").insert([{"gtin14":req.product.gtin,"name":req.product.name,"author":req.product.author,
"format":req.product.format,"publisher":req.product.publisher,"pages":req.product.pages,"images":[]}],function(err,resp)
{
  if(err){
console.log(err);
//next(err);
}
console.log(resp.insertedCount);
  cb(null,resp.insertedCount);
  dbo.close();
})
})
})

product_responder.on('edit',function(req,cb)
{
console.log(req.product);
MongoClient.connect(url,function(err,dbo)
{
if(err){
console.log(err);
//next(err);
}

dbo.db(dbname).collection("products").update({"gtin14":req.product.gtin},{$set:{"name":req.product.name,"author":req.product.author,
"format":req.product.format,"publisher":req.product.publisher,"pages":req.product.pages}},function(err,resp)
{
    if(err){
console.log(err);
//next(err);
}
console.log(resp.result.n);
  cb(null,resp.result.n);
    dbo.close();
})    
})
})

product_responder.on('editimage',function(req,cb)
{
console.log(req.product);
MongoClient.connect(url,function(err,dbo)
{
if(err){
console.log(err);
//next(err);
}

dbo.db(dbname).collection("products").update({"gtin14":req.bookgtin},{$set:{"images":req.imagename}},function(err,resp)
{
    if(err){
console.log(err);
//next(err);
}
console.log(resp.result.n);
  cb(null,resp.result.n);
    dbo.close();
})    
})



})

product_responder.on('delete',function(req,cb)
{
console.log(req);
  MongoClient.connect(url,function(err,dbo)
{
  if(err){
console.log(err);
//next(err);
}

dbo.db(dbname).collection("products").remove({"gtin14":req.product},function(err,resp)
{
if(err){
console.log(err);
//next(err);
}
console.log(resp.result.n);
  cb(null,resp.result.n);
    dbo.close();
})    

})
})