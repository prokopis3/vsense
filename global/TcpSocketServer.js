"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp
server, but for some reason omit a client connecting to it.  I added an
example at the bottom.
Save the following server in example.js:
*/
// var sys = require('sys')
var net = require("net");
var _1 = require(".");
var gps = require('gps-tracking');
var TcpSocketServer = /** @class */ (function () {
    function TcpSocketServer(svraddr, svrport) {
        var gbr = new _1.GBRoutines();
        this.svraddr = gbr.Variablevalid(svraddr) == null ? '0.0.0.0' : svraddr;
        this.svrport = gbr.Variablevalid(svrport) == null ? 8000 : svrport;
        this.sockets = [];
        this.gpsOptions = {
            'debug': false,
            //'host'                  : 'isense.westeurope.cloudapp.azure.com',// '40.115.55.149',
            'port': 8081,
            'device_adapter': "TK103"
        };
    }
    TcpSocketServer.prototype.TcpGpsTrack = function () {
        var server = gps.server(this.gpsOptions, function (device, connection) {
            device.on("connected", function (data) {
                console.log("I'm a new device connected" + (" " + data));
                return data;
            });
            device.on("login_request", function (device_id, msg_parts) {
                console.log('Hey! I want to start transmiting my position. Please accept me. My name is ' + device_id);
                device.login_authorized(true);
                console.log("Ok, " + device_id + ", you're accepted!");
            });
            device.on("ping", function (data) {
                //this = device
                console.log("I'm here: " + data.latitude + ", " + data.longitude + " (" + device.getUID() + ")");
                //Look what informations the device sends to you (maybe velocity, gas level, etc)
                //console.log(data);
                return data;
            });
            device.on("alarm", function (alarm_code, alarm_data, msg_data) {
                console.log("Help! Something happend: " + alarm_code + " (" + alarm_data.msg + ")");
            });
            //Also, you can listen on the native connection object
            connection.on('data', function (data) {
                //echo raw data package
                console.log(data.toString());
            });
        });
    };
    TcpSocketServer.prototype.TcpClientTK103 = function () {
        var client = new net.Socket(), HOST = this.gpsOptions.host, PORT = this.gpsOptions.port;
        client.connect(PORT, HOST, function () {
            console.log('Client connected to: ' + HOST + ':' + PORT);
            // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
            client.write('(009205906401BP05000009205906401190629A2321.5726N08518.8931E000.01027100.000001000000L076864EE)');
        });
        client.on('data', function (data) {
            console.log('Client received: ' + data);
            var ival = 10000;
            setInterval(function () {
                console.log("Client writing interval: " + ival + data);
                client.write('(009205906401BR00190629A2321.5729N08518.8934E000.01033420.000001000007L076864EE)');
            }, ival);
            if (data.toString().endsWith('exit')) {
                client.destroy();
            }
        });
        // Add a 'close' event handler for the client socket
        client.on('close', function () {
            console.log('Client closed');
        });
        client.on('error', function (err) {
            console.error(err);
        });
    };
    TcpSocketServer.prototype.TcpServertk102 = function () {
        this.server = require('tk102');
        // start server 
        this.server.createServer({
            ip: this.svraddr,
            port: this.svrport
        });
        // incoming data, i.e. update a map 
        this.server.on('track', function (gps) {
            //updateMap (gps.geo.latitude, gps.geo.longitude);
            console.log('GPS: ', gps.geo.latitude + " " + gps.geo.longitude);
        });
        this.server.on('data', function (raw) {
            console.log('Incoming data: ' + raw);
        });
        this.server.on('listening', function (listen) {
            // listen = { port: 56751, family: 2, address: '0.0.0.0' } 
            console.log('listening from ', listen);
        });
        this.server.on('connection', function (socket) {
            console.log('Connection from ' + socket.remoteAddress);
        });
        this.server.on('disconnect', function (socket) {
            console.log('Disconnected device ' + socket.remoteAddress);
        });
        this.server.on('timeout', function (socket) {
            console.log('Time out from ' + socket.remoteAddress);
        });
        this.server.on('fail', function (err) {
            console.log(err);
        });
        this.server.on('error', function (err) {
            console.log(err);
        });
        this.server.on('log', function (name, value) {
            console.log('Event: ' + name);
            console.log(value);
        });
        /*this.server = net.createServer(function(socket) {
            var sockets = [];
            // sys.puts('Connected: ' + socket.remoteAddress + ':' + socket.remotePort);
         // socket.write('Hello ' + socket.remoteAddress + ':' + socket.remotePort + '\r\n');
            socket.write('check24800')
            socket.pipe(socket);
            sockets.push(socket);
        
             socket.on('data', function(data) {  // client writes message
                if (data == 'exit\n') {
                    // sys.puts('exit command received: ' + socket.remoteAddress + ':' + socket.remotePort + '\n');
                    socket.destroy();
                    var idx = sockets.indexOf(socket);
                    if (idx != -1) {
                        delete sockets[idx];
                    }
                    this.sockets = sockets;
                    return;
                }
                console.log(`Tcp IP Server side Received from Client: ${data}`)
                 var len = sockets.length;
                for (var i = 0; i < len; i ++) { // broad cast
                    if (sockets[i] != socket) {
                        if (sockets[i]) {
                            console.log('broadcast')
                            sockets[i].write(socket.remoteAddress + ':' + socket.remotePort + ':' + data);
                        }
                    }
                }
                this.sockets = sockets;
            });
             socket.on('end', function() { // client disconnects
                // sys.puts('Disconnected: ' + data + data.remoteAddress + ':' + data.remotePort + '\n');
                var idx = sockets.indexOf(socket);
                if (idx != -1) {
                    delete sockets[idx];
                }
                this.sockets = sockets;
            });
        })
         this.server.listen(svrport, svraddr);*/
        // sys.puts('Server Created at ' + svraddr + ':' + svrport + '\n');
    };
    return TcpSocketServer;
}());
var tcpsock = new TcpSocketServer();
// tcpsock.TcpGpsTrack()
exports.default = tcpsock;
