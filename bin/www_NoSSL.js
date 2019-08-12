#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies.
 */
var app_1 = __importDefault(require("../app"));
var http_1 = __importDefault(require("http"));
var db_1 = require("../db");
// var debug = require('debug')('technica:server');
var enforce = require('express-sslify');
// , key = fs.readFileSync('server-key.pem')
// , cert = fs.readFileSync('server-crt.pem')
// , pfx = fs.readFileSync('smartdeep.io.pfx')
/* , options = {
  key: key,
  cert: cert, */
/*   pfx,
   passphrase: 'For(Life#0)'
 
   ca: fsx.readFileSync('ca-crt.pem'),
   crl: fsx.readFileSync('ca-crl.pem'),
   requestCert: true,
   rejectUnauthorized: true
}*/
// http.globalAgent.maxSockets = 100;
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(app_1.default.PORT.toString()), ip = app_1.default.IP.toString();
app_1.default.app.set('port', port);
app_1.default.app.set('ip', ip);
/**
 * Create HTTPS server.
 */
// for https
app_1.default.app.use(enforce.HTTPS({ trustProtoHeader: true }));
var server = http_1.default.createServer(/* options */ app_1.default.app);
/**
 * Event listener for HTTP server "listening" event.
 */
var onListening = function () { return __awaiter(_this, void 0, void 0, function () {
    var addr, bind, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                addr = server.address();
                bind = typeof addr === 'string'
                    ? 'pipe ' + addr
                    : 'port ' + (addr ? addr.port : null);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.DB.connect()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error("Unable to connect to Mongo!", err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, onListen);
server.on('error', onError);
server.on('listening', onListening);
// set up socket.io and bind it to our
// http server.
var io = app_1.default.socketio;
// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io(server);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    } // named pipe
    if (port >= 0) {
        return port;
    } // port number
    return false;
}
function onListen() {
    console.log('Server Running on %s:%s', ip, port);
    return ip;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
console.log('HTTPS Server listening on %s' /* , HOST */, port);
