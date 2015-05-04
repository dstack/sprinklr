var connect = require('connect'),
  dispatch = require('dispatch'),
  quip = require('quip'),
  http = require('http'),
  cp = require('child_process');

var starts = ['a', 'c', 'e', 'g'];
var stops = ['b', 'd', 'f', 'h'];

var state = ['off', 'off', 'off', 'off'];

// need to spin up the bridge exe right here

function USBSend(msg){
  cp.exec(' bin\\send.exe ' + msg);
}


function turnOnOffZone(z, cb, on){
  var zoneIdx = z - 1,
    set = on? starts : stops;
  if(set[zoneIdx]){
    // send set[zoneIdx];
    USBSend(set[zoneIdx]);
    state[zoneIdx] = on? 'on' : 'off';
    cb(true);
  }
  else{
    cb(false);
  }
}

var app = connect()
  app.use(require('serve-static')(__dirname + '/public'));
  app.use(dispatch({
    'GET /start/:zone': function(req,res,next,zone){
      turnOnOffZone(zone, function(done){
        if(done){
          res.writeHead(200);
          res.end('zone ' + zone + ' started');
        }
        else{
          res.writeHead(400);
          res.end('Zone '+zone+' not supported');
        }
      }, true);
    },
    'GET /stop/:zone':  function(req,res,next,zone){
      turnOnOffZone(zone, function(done){
        if(done){
          res.writeHead(200);
          res.end('zone ' + zone + ' stopped');
        }
        else{
          res.writeHead(400);
          res.end('Zone '+zone+' not supported');
        }
      });
    }
  }));

var server = http.createServer(app).listen(5280);
