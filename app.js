var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , https = require('https')
  , path = require('path')
  , Facebook = require('facebook-node-sdk')
  , OpenGraph = require('facebook-open-graph');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('vintage'));
  app.use(express.session());
  app.use(Facebook.middleware({ appId: '363584837051315', secret: '3672c2b90cfbec3ad232978a94451617' }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var openGraph = new OpenGraph('thephantomphacebook');

function facebookGetUser() {
  return function(req, res, next) {
    req.facebook.getUser( function(err, user) {
      if (!user || err){
        res.redirect('/login');
      } else {
        req.facebook.getUserAccessToken(function(err, token) {
          req.session.access_token = token
          req.user = user;
          next();
        });
      }
    });
  }
}

app.get('/', facebookGetUser(), routes.index);
app.get('/token', facebookGetUser(), function(req, res) {
  res.send(req.session.access_token);
});
app.get('/login', Facebook.loginRequired(), function(req, res){
  res.redirect('/');
});

app.get('/buttonpush', facebookGetUser(), function(req, res) {
  // enable fb:explicitly_shared
  var options = true;
  // the options parameter may be omitted if you have nothing to put in there
  openGraph.publish('151116079', req.session.access_token ,'push','button','http://fathomless-shore-6512.herokuapp.com/objects/button.html',options,function(err,response){
    res.send("success");
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
