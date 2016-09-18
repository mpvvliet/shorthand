// TODO: implement usage of redis & attempt to run CD pipeline using docker-compose
// NOTE: XLR 4.6 won't run the docker-compose plugin

// require modules
var http = require('http');
var dispatcher = require('httpdispatcher');
var redis = require('redis');

// backwards compatibility, can be removed!
var cache = {};

// redis client
var client = redis.createClient(6379, 'redis');
client.on('connect', function() {
    console.log('Connected to redis');
});

//Lets define a port we want to listen to
const PORT=8080; 

//Lets use our dispatcher
function handleRequest(request, response){
    try {
        //log the request on console
        console.log(request.url);
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
    var result = "";

    client.exists(key, function(err, reply) {
        if (reply === 1) {
            console.log('key ' + key + ' found');

            client.get(key, function(err, reply) {
                console.log('reply = ' + reply);
                res.writeHead(200, {'Content-Type': 'application/json'});
                result = { "value": reply }
                res.write(JSON.stringify(result))
                res.end();
            });
        } else {
            console.log('key ' + key + ' NOT found');

            res.writeHead(404, {'Content-Type': 'application/json'});
            result = { "error": "key not found" }
            res.write(JSON.stringify(result))
            res.end();
        }
    });
});    

//A sample POST request
dispatcher.onPost(/val\/([^\/]+)$/, function(req, res) {
    var val = req.url.match(/val\/([^\/]+)$/)[1];
    var key = generateId();
    client.set(key, val, function(err, reply) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        var result = { "key": key }
        res.write(JSON.stringify(result))
        res.end();
    });
});

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
