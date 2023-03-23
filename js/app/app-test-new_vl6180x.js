I2C1.setup({sda: SDA, scl: SCL, bitrate: 400000});

const err = require('ModuleAppError.min');
const ClassBaseVL6180 = require('ModuleVL6180.min').ClassBaseVL6180;
const ClassVL6180 = require('ModuleVL6180.min').ClassVL6180; 

const vl6180 = new ClassBaseVL6180({i2c: I2C1, irqPin: P4});
vl6180.onALSChange(val => console.log(val));
vl6180.requestALSUpdate();
setTimeout(() => {
    vl6180.resetOnALSChange();
    vl6180.onALSChange(val => console.log(val+'!'));
    vl6180.requestALSUpdate();
}, 100);