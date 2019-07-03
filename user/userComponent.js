const cote=require('cote');
const express=require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const port=require('../config');
const app=express();

app.use(express.static(__dirname)); 
app.use(express.static('../public')); 
app.use(bodyParser.json());
app.use(cookieParser());


app.set('view engine','ejs');
app.engine('html', require('ejs').renderFile);

app.disable('x-powered-by');

const user_product_requestor=new cote.Requester({name:"user_product_requestor",key:"product"});
const user_cart_requestor=new cote.Requester({name:"user_cart_requestor",key:"cart"});
const user_login_requestor=new cote.Requester({name:"user_login_requestor",key:"login"});
const session_checking_requestor=new cote.Requester({name:"session_checking_requestor",key:"session"});

//-----------------------------------------------------------------------------------------------------------------

var sessionChecker=function(req,res,next)
{
//This is for checking logged-in users
console.log("session checker");
session_checking_requestor.send({type:'sessionCheck',jwttoken:req.cookies.jwttoken},function(err,sessionResult)
{
if(sessionResult)
{
   next();
}
else
{
res.clearCookie('jwttoken');
res.redirect('/unAuthorised');
}

})

}

app.use(function(req, res,next) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private'); //Setting the header values
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('X-Frame-Options', 'deny');
  res.header('X-Content-Type-Options', 'nosniff');
  next();
})

app.use(['/loginStatus','/getProducts','/addCartDetails','/checkCart'],sessionChecker);

//------------------------------------------------------------------------------------------------------------------



app.post('/login',function(req,res,next)
{
console.log(req.body);
user_login_requestor.send({type:'loginRequest',username:req.body[0].username,password:req.body[0].password,role:"user"},function(err,loginresult)
{
if(err){console.log(err);}
console.log(loginresult);
if(loginresult.result)
{
    res.clearCookie('jwttoken');
    res.clearCookie('user_cookie');
    res.cookie('jwttoken',loginresult.token,{httpOnly:true}); 
    res.cookie('user_cookie',req.body[0].username);
    res.send({login:true,user:req.body[0].username});
}
else
{
   res.clearCookie('jwttoken');
   res.clearCookie('user_cookie');
   res.send({login:false,user:""}); 
}
})

})

app.get('/loginStatus',function(req,res)
{
res.send({sessionCheck:true});
})

app.get('/getProducts',function(req,res)
{
user_product_requestor.send({type:'list'},function(err,products)
{
    if(err){console.log(err);}
    res.send({result:products,sessionCheck:true});
})
})


app.post('/addCartDetails',function(req,res)
{
console.log(req.body[0]);
user_cart_requestor.send({type:'addCart',product:req.body[0]},function(err,insertDetails)
{
if(err){console.log(err);}
    res.send({result:insertDetails,sessionCheck:true});
})
})

app.get('/checkCart',function(req,res)
{
console.log(req.query);
user_cart_requestor.send({type:'getCart',product:req.query},function(err,cartDetails)
{
if(err){console.log(err);}
console.log(cartDetails);
res.send({result:cartDetails,sessionCheck:true});
})  
})

app.all('/unAuthorised',function(req,res,next)
{
console.log("entering the unauthorised route");
res.send({sessionCheck:false});
})

//Default Route in case nothing specified.
app.use(function(req, res) {

  console.log("entered default route");
  res.render('index.html');
})

app.listen(port.NODE_PORT_USER,function()
{
    console.log("app listening on port"+port.NODE_PORT_USER);
})
