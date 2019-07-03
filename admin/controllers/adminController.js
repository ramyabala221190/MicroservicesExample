(function()
{

'use strict';

var app=angular.module("adminapp");

app.controller("adminController",adminController);

adminController.$inject=['adminService','loginService','$state'];

function adminController(adminService,loginService,$state)
{
var adminController=this;
adminController.productList=[];
adminController.editForm=false;
adminController.successEdit=false;
adminController.failedEdit=false;
adminController.successDel=false;
adminController.failedDel=false;

adminController.createForm=false;
adminController.successcrt=false;
adminController.failedcrt=false;
adminController.invalidLogin=false;
adminController.user="";


adminController.editProduct=function(x)
{
adminController.editForm=true;
adminController.gtin=x.gtin14;
adminController.bookName=x.name;
adminController.bookAuthor=x.author;
adminController.bookFormat=x.format;
adminController.bookPublisher=x.publisher;
adminController.bookPages=x.pages;
document.getElementById('editfrm').style.display='block';
}

adminController.createProduct=function()
{
adminController.createForm=true;
document.getElementById('crtfrm').style.display='block';
}

adminController.creatingProduct=function(gtin,name,author,format,publisher,pages)
{
closeModal();
adminService.creatingProduct(gtin,name,author,format,publisher,pages)
.then(function(response)
{
if(response.sessionCheck)
{
if(response.result > 0)
{
adminController.successcrt=true;
adminController.failedcrt=false;
adminController.getProducts();   
}
else
{
adminController.successcrt=false;
adminController.failedcrt=true;
}
}
else
{
    $state.go("login");
}
})
.catch(function(err)
{
adminController.successcrt=false;
adminController.failedcrt=true;
    console.log(err);
})
.finally(function()
{
    console.log("finally block");
})

}

adminController.editingProduct=function(gtin,name,author,format,publisher,pages)
{
closeModal();
adminService.editingProduct(gtin,name,author,format,publisher,pages)
.then(function(response)
{
if(response.sessionCheck)
{
if(response.result > 0)
{
adminController.successEdit=true;
adminController.failedEdit=false;
adminController.getProducts();   
}
else
{
adminController.failedEdit=true;
adminController.successEdit=false;
}
}
else
{
$state.go("login");    
}
})
.catch(function(err)
{
adminController.failedEdit=true;
adminController.successEdit=false;
    console.log(err);
})
.finally(function()
{
    console.log("finally block");
})

}

adminController.upload=function(gtin,index)
{
var fileInput=document.getElementById('book_image'+index).files;
var formdata=new FormData();
var filename="";

formdata.append("uploads",fileInput[0], fileInput[0].name);
filename=fileInput[0].name;
for(var pair of formdata.entries()) {
      console.log(pair[0]+', '+pair[1]);
    }

adminService.upload(gtin,formdata,filename)
.then(function(response)
{
if(response.sessionCheck)
{
if(response.result > 0)
{
adminController.successEdit=true;
adminController.failedEdit=false;
adminController.getProducts();   
}
else
{
adminController.failedEdit=true;
adminController.successEdit=false;
}
}
else
{
$state.go("login");      
}

})
.catch(function(err)
{
adminController.failedEdit=true;
adminController.successEdit=false;
    console.log(err);
})
.finally(function()
{
    console.log("finally block");
})

}

adminController.getProducts=function()
{
console.log("getting products");
adminService.getProducts()
.then(function(response)
{
if(response.sessionCheck)
{
adminController.productList=response.result;
}
else
{
$state.go("login");       
}
})
.catch(function(err)
{

console.log(err);
})
.finally(function()
{
    console.log("finally block");
})

}

adminController.loggingIn=function(username,password)
{
adminController.invalidLogin=false;
console.log("entered login function");
loginService.login(username,password)
.then(function(response)
{
console.log(response);
if(!response.login)
{
adminController.invalidLogin=true;
}
else
{
$state.go("admin");
}
})
.catch(function(err)
{
console.log(err);
})
.finally(function()
{
    console.log("finally block");
})
}

adminController.deleteProducts=function(gtin14)
{
adminService.deleteProducts(gtin14)
.then(function(response)
{
if(response.sessionCheck)
{
if(response.result > 0)
       {
           adminController.successDel=true;
           adminController.failedDel=false;
           adminController.getProducts();
       }
       else
       {
           adminController.successDel=false;
           adminController.failedDel=true;
       } 
} 
       else
       {
$state.go("login");   
       } 
})
.catch(function(err)
{
adminController.successDel=false;
adminController.failedDel=true;
console.log(err);
})
  .finally(function()
{
    console.log("finally block");
})           
}

}


})();