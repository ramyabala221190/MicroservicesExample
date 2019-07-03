const cote=require('cote');
const express=require('express');
const bodyParser=require('body-parser');
const multer=require('multer');
const cookieParser=require('cookie-parser');
const port=require('../config');

const app=express();

//Below is needed to render html files in views directory via res.render
app.set('view engine','ejs');
app.engine('html', require('ejs').renderFile);

app.use(cookieParser());

//Below is needed to use static files:css,JS and images in the directory specified
app.use(express.static(__dirname)); //current admin directory
app.use(express.static('../public')); //relative path:public directory

app.use(bodyParser.json());

app.disable('x-powered-by');

var storage = multer.diskStorage(
    {
    destination: function (request, file, callback) {
        callback(null, '../public/images/');
    },
    filename: function (request, file, callback) {
        console.log(file);
        callback(null, file.originalname)
    }
}
);

var upload = multer({ storage: storage });


const admin_product_requestor=new cote.Requester({name:"admin_product_requestor",key:"product"});
const session_checker_requestor=new cote.Requester({name:"session_checker_requestor",key:"session"});
const admin_login_requestor=new cote.Requester({name:"admin_login_requestor",key:"login"});



//-----------------------------------------------Middleware functions------------------------------------------

var sessionChecker=function(req,res,next)
{
//This is for checking logged-in users
console.log("session checker");
session_checker_requestor.send({type:'sessionCheck',jwttoken:req.cookies.jwttoken},function(err,sessionResult)
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

app.use(['/loginStatus','/getProducts','/createProduct','/editProduct','/deleteProduct','/editImage'],sessionChecker);

//-----------------------------------------------Routes--------------------------------------------------------

app.post('/login',function(req,res,next)
{
console.log(req.body);
admin_login_requestor.send({type:'loginRequest',username:req.body[0].username,password:req.body[0].password,role:"admin"},function(err,loginresult)
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
   res.clearCookie('user_cookie');
   res.clearCookie('jwttoken');
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
admin_product_requestor.send({type:'list'},function(err,products)
{
    res.send({result:products,sessionCheck:true});
})
})

app.post('/createProduct',function(req,res)
{
admin_product_requestor.send({type:'create',product:req.body[0]},function(err,products)
{
    res.send({result:products,sessionCheck:true});
})
})

app.put('/editProduct',function(req,res)
{
console.log(req.body[0]);
admin_product_requestor.send({type:'edit',product:req.body[0]},function(err,editCount)
{
    console.log(editCount);
    res.send({result:editCount,sessionCheck:true});
})
})

app.delete('/deleteProduct',function(req,res)
{
console.log(req.query);
admin_product_requestor.send({type:'delete',product:req.query.gtin14},function(err,deleteCount)
{
    res.send({result:deleteCount,sessionCheck:true});
})
})

app.put('/editImage',upload.array('uploads'),function(req,res)
{
admin_product_requestor.send({type:'editimage',bookgtin:req.query.gtin,imagename:req.query.filename},function(err,updateCount)
{
    res.send({result:updateCount,sessionCheck:true});
})

})

app.all('/unAuthorised',function(req,res,next)
{
console.log("entering the unauthorised route");
res.clearCookie('user_cookie');
res.clearCookie('jwttoken');
res.send({sessionCheck:false});
})

//Default Route in case nothing specified.
app.use(function(req, res) {

  console.log("entered default route");
  res.render('index.html');
})


app.listen(port.NODE_PORT_ADMIN,function()
{
    console.log("app listening on port"+port.NODE_PORT_ADMIN);
})

