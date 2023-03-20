I2C1.setup({sda: SDA, scl: SCL, bitrate: 400000});

const err = require('ModuleAppError.min');
const ClassVL6180XInner = require('ModuleVL6180XInner.min').ClassVL6180XInner;
const ClassVL6180X = require('ModuleVL6180X.min').ClassVL6180X; 
const ClassVL6180XALS = require('ModuleVL6180X.min').ClassVL6180XALS; 
const ClassVL6180XRange = require('ModuleVL6180X.min').ClassVL6180XRange; 

const vl6180x = new ClassVL6180X({i2c: I2C1, irqPin: P4});
vl6180x.launch();