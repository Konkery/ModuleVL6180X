const err = require('https://raw.githubusercontent.com/Konkery/ModuleAppError/main/js/module/ModuleAppError.js');
require('https://raw.githubusercontent.com/Konkery/ModuleAppMath/main/js/module/ModuleAppMath.min.js').is();

const ClassVL6180 = require('https://raw.githubusercontent.com/Nicktonious/ModuleVL6180X/fork-Nikita/js/module/ModuleVL6180.js').ClassVL6180;
const ClassBaseI2CBus = require('ClassBaseI2CBus.min');
const I2Cbus = new ClassBaseI2CBus();
let bus = I2Cbus.AddBus({sda:B9 , scl:B8, bitrate:100000 });

let vl = new ClassVL6180({i2c: bus.IDbus, irqPin: P4});

vl.StartRange(50);
setTimeout(() => {vl.StartALS(200);}, 10000);
setTimeout(() => {vl.StartDual(200);}, 20000);
// console.log(vl.Range, vl.Illuminance);
