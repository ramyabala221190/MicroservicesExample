
function Updateuser()
{
var cook=document.cookie.split(";");

for(var i=0;i<cook.length;i++)
{
console.log(cook[i]);
console.log(cook[i].substring(0,cook[i].indexOf("=")));
console.log(cook[i].substring(cook[i].indexOf("=")+1));
if(cook[i].substring(0,cook[i].indexOf("="))=="user_cookie")
{
window.localStorage.setItem("user_cookie",cook[i].substring(cook[i].indexOf("=")+1));
document.getElementById('username').innerHTML=cook[i].substring(cook[i].indexOf("=")+1);
}

}

}

function showAJAXSpinner()
{
document.getElementById('loadingRequest').style.display="block";
}

function hideAJAXSpinner()
{
      document.getElementById('loadingRequest').style.display="none";
}