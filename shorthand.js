
//Lets require/import the HTTP module
var http = require('http');
var dispatcher = require('httpdispatcher');
var cache = {};

//Lets define a port we want to listen to
const PORT=8080; 

//Lets use our dispatcher
function handleRequest(request, response){
    try {
        //log the request on console
        //console.log(request.url);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

//A sample GET request    
dispatcher.onGet(/\/([^\/]+)$/, function(req, res) {
    var key = req.url.match(/\/([^\/]+)$/)[1];
    var value = cache[key];
    var result = "";
    if (value == null) {
        res.writeHead(404, {'Content-Type': 'application/json'});
        result = { "error": "key not found" }
    } else {
        res.writeHead(200, {'Content-Type': 'application/json'});
        result = { "value": value }
    }
    res.write(JSON.stringify(result))
    res.end();
});    

//A sample POST request
dispatcher.onPost(/\/([^\/]+)$/, function(req, res) {
    var key = req.url.match(/\/([^\/]+)$/)[1];
    cache[key] = JSON.parse(req.body).value

    res.writeHead(200, {'Content-Type': 'application/json'});
    var result = { "status": "OK" }
    res.write(JSON.stringify(result))
    res.end();
});

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
