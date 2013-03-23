var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , https = require('https')
  , path = require('path')
  , Facebook = require('facebook-node-sdk');

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
  console.log('trying button push');
  var options = {
      host: 'graph.facebook.com',
      port: 443,
      method: 'POST',
      path: '/me/thephantomphacebook:push?button=http://reyner.be/trouble/button.html&access_token=' + req.session.access_token
    };
  https.request(options, function(fbres) {
     console.log('STATUS: ' + fbres.statusCode);
     console.log('HEADERS: ' + JSON.stringify(fbres.headers));

      var output = '';
      fbres.on('data', function (chunk) {
          //console.log("CHUNK:" + chunk);
          output += chunk;
      });

      fbres.on('end', function() {
        console.log('posted:');
        console.log(output);
      });
      fbres.on('err', function(err) {
        console.log('error');
        console.log(err);
      });
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
