
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

function generateId() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

//A sample GET request    
dispatcher.onGet(/key\/([^\/]+)$/, function(req, res) {
    var key = req.url.match(/key\/([^\/]+)$/)[1];
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
dispatcher.onPost(/val\/([^\/]+)$/, function(req, res) {
    var val = req.url.match(/val\/([^\/]+)$/)[1];
    var key = generateId();
    cache[key] = val

    res.writeHead(200, {'Content-Type': 'application/json'});
    var result = { "key": key }
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
