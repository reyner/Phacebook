var requirejs = require('requirejs');
requirejs.config({nodeRequire: require});

var LEDlist = [];
var curInterval = 100;

function stepper() {
  while (true) {
    LEDlist[0].setOn();
    LEDlist[1].setOn();
    LEDlist[0].setOff();
    LEDlist[1].setOff();
  }  
}

/**
 * Start blinking sequence if all LEDs are up and running
 */
function startSequence(interval) {
  currentStepper = setInterval(function() {
    return stepper();
  }, interval);
}

requirejs(['../public/scripts/libs/Noduino', '../public/scripts/libs/Noduino.Serial', '../public/scripts/libs/Logger'], function (NoduinoObj, NoduinoConnector, Logger) {
  var Noduino = new NoduinoObj({'debug': false}, NoduinoConnector, Logger);
  Noduino.connect(function(err, board) {
    if (err) { return console.log(err); }

    board.withLED({pin: 11}, function(err, LED) { LEDlist[0] = LED; LED.setOn();});
    board.withLED({pin: 12}, function(err, LED) {
      LEDlist[1] = LED;
      // startSequence(curInterval);

      LEDlist[1].blink(250);
      LEDlist[0].blink(250);
    });

    // board.withLED({pin: 13}, function(err, LED) {
    //   if (err) { return console.log(err); }

    //   LED.blink(250);
    //   LED.on('on', function(e) {
    //     console.log('LED is on!');
    //   });
    // });
  });
});