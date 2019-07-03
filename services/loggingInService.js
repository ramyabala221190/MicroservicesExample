const cote=require('cote');
const MongoClient=require('mongodb').MongoClient;
const bson =require('bson');
const fs=require('fs');
const jwt=require('jsonwebtoken');
const configdetails=require('../config');

const ObjectId=bson.ObjectID;

const dbname=configdetails.MONGODB_DB;
const url="mongodb://"+configdetails.MONGODB_HOST+":"+configdetails.MONGODB_PORT+"/";
const privateKEY  = fs.readFileSync('../public/JWTKeys/private.key', 'utf8');
const publicKEY  = fs.readFileSync('../public/JWTKeys/public.key', 'utf8');


const admin_login_responder=new cote.Responder({name:"admin_login_responder",key:"login"});
const session_checker_responder=new cote.Responder({name:"session_checker_responder",key:"session"});


session_checker_responder.on('sessionCheck',function(req,cb)
{
jwt.verify(req.jwttoken, publicKEY, JSON.parse(configdetails.verifyOptions),function(err,decoded)
     {
        console.log(decoded);
if(err)
{
    if(err.name=="TokenExpiredError"){errmessage=err.message +" at "+err.expiredAt;}
    else if(err.name=="JsonWebTokenError"){errmessage=err.message;}
    else if(err.name=="NotBeforeError"){errmessage=err.message;}

cb(null,false);
    
}
else
{
cb(null,true);
}

     }) 


})


admin_login_responder.on('loginRequest',function(req,cb)
{
var token="";
    MongoClient.connect(url,function(err,dbo)
{
if(err){
console.log(err);
//next(err);
}
    dbo.db(dbname).collection("users").find({"username":req.username,"password":req.password,role:req.role}).toArray(function(err,resp)
    {
if(err){
console.log(err);
//next(err);
}
if(resp.length > 0)
{

token=jwt.sign({user:req.username,role:req.role},privateKEY,JSON.parse(configdetails.SignOptions));
console.log(token);

cb(null,{token:token,result:true});
}
else
{
cb(null,{token:token,result:false})
}

dbo.close();
    })
})

})