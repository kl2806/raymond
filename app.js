var express = require('express')
var path = require('path');
var app = express();
var http = require('http');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({ ws: true });
var server = http.createServer(app);
var io = require('socket.io')(server);
var config = require('./config');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config')

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? config.port : 3000;

if (isDeveloping) {
	var bundle = require('./server/bundle.js');
	bundle();  

	app.all('/build/*', function (req, res) {
		proxy.web(req, res, {
		    target: 'http://localhost:8080'
		});
	});

	app.get('/socket.io/*', function(req, res) {
	  console.log("proxying GET request", req.url);
	  proxy.web(req, res, { target: 'http://localhost:8080'});
	});

	app.post('/socket.io/*', function(req, res) {
	  console.log("proxying POST request", req.url);
	  proxy.web(req, res, { target: 'http://localhost:8080'});
	});

	app.on('upgrade', function (req, socket, head) {
	  proxy.ws(req, socket, head);
	});
}

var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var mongoose = require('mongoose');
mongoose.connect(config.mongoose.url);

require('babel/register');
app.set('views', path.join(__dirname, 'app/views'))
app.set('view engine', 'jade')
app.use(express.static(path.join(__dirname, 'app')))

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	secret: 'cookiezcookiezcookiez',
	name: 'this_cookie',
	proxy: true,
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./scripts/calendar/calendar')(io);
require('./scripts/chat/chat').chatHandler(io);
require('./scripts/auth/authenticate')(config.googleAuth, passport);
require('./scripts/routes')(app, passport);

proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

server.listen(port, function () {
	// catch 404 and forward to error handler
	console.log("*****************************");
	console.log("* App running at port: " + port + " *");
	console.log("*****************************");
});








