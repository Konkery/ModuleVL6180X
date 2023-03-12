I2C1.setup({sda: SDA, scl: SCL, bitrate: 400000}); //нaстройка i2c 

const err = require('https://raw.githubusercontent.com/Konkery/ModuleAppError/main/js/module/ModuleAppError.min.js');
const ClassVL6180XDefault = require('ModuleVL6180XDefault')._class;
const ClassVL6180X = require('ModuleVL6180X').ClassVL6180X; //экспорт класса из моего модуля

const vl6180x = new ClassVL6180X({i2c: I2C1, irqPin: P4});

vl6180x.startDualMeasures(_interval = 250, _duration = 4);
