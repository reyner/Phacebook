var requirejs = require('requirejs');
requirejs.config({nodeRequire: require});

var LEDlist = [];

var buttonDown = function(){
	LEDlist[0].setOn();
	console.log("On!");
}

var buttonUp = function(){
	LEDlist[0].setOff();
}

requirejs(['public/scripts/libs/Noduino', 'public/scripts/libs/Noduino.Serial', 'public/scripts/libs/Logger'], function (NoduinoObj, NoduinoConnector, Logger) {
  var Noduino = new NoduinoObj({'debug': false}, NoduinoConnector, Logger);
  Noduino.connect(function(err, board) {
    if (err) { return console.log(err); }

    board.withLED({pin: 13}, function(err, LED) { LEDlist[0] = LED;});
    board.withAnalogInput({pin:  'A0'}, function(err, AnalogInput) { 
      AnalogInput.on('change', function(a) {
        if (a.value == 1023) {
        	//HACK: This is expecting a potentiometer changing signal between 0 and 1023
        	// Button just is an analog input with/without 5V for on/off
        	buttonDown();
        } else {
        	buttonUp();
        }
      });
    });
  });
});