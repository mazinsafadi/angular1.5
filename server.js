/*================= Packet Management Server =================*/

/* Modules required*/
var express  = require('express');	
var app      = express();// Express is used for web-app mvc framework
var path = require('path');//to resolve any absolute path issues

app.use(express.static(path.resolve('./'))); // set the static files location /public/img will be /img for users
app.listen(2019); //Listen at 9191
app.get('*', function(req, res) {
res.sendfile('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
}); 
console.log("Server started at port 2019");