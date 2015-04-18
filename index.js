var connect = require('connect'),
  dispatch = require('dispatch'),
  quip = require('quip'),
  http = require('http'),
  cp = require('child_process');

var starts = ['a', 'c', 'e', 'g'];
var stops = ['b', 'd', 'f', 'h'];

var state = ['off', 'off', 'off', 'off'];

// need to spin up the bridge exe right here

function createBridge(){
  var bridge = cp.spawn('bin/digiusb.exe',[], {stdio: 'inherit'});
  bridge.on('error', function(msg){
    console.log('err', arguments);
  });
  bridge.on('exit', function(msg){
    console.log('exit', arguments);
  });
  bridge.on('close', function(msg){
    console.log('close', arguments);
  });
  bridge.on('disconnect', function(msg){
    console.log('disc', arguments);
  });
  bridge.on('message', function(msg){
    console.log('msg', arguments);
  });
}

var bridgeUSB =createBridge();

function turnOnOffZone(z, on){
  var zoneIdx = zone - 1,
    set = on? starts : stops;
  if(set[zoneIdx]){
    // send set[zoneIdx];
    state[zoneIdx] = on? 'on' : 'off';
    return true;
  }
  else{
    return false;
  }
}

var app = connect()
  app.use(quip);
  app.use(require('serve-static')(__dirname + '/public'));
  app.use(dispatch({
    '/start/:zone': function(req,res,next,zone){
      var done = turnOnOffZone(zone, true);
      if(done){
        res.ok('zone ' + zone + ' started');
      }
      else{
        res.error('Zone '+zone+' not supported');
      }
    },
    '/stop/:zone':  function(req,res,next,zone){
      var done = turnOnOffZone(zone);
      if(done){
        res.ok('zone ' + zone + ' stopped');
      }
      else{
        res.error('Zone '+zone+' not supported');
      }
    },
  }));

var server = http.createServer(app).listen(5280);