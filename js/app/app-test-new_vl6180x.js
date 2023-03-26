I2C1.setup({sda: SDA, scl: SCL, bitrate: 400000});
const err = require('https://raw.githubusercontent.com/Konkery/ModuleAppError/main/js/module/ModuleAppError.js');

const ClassBaseVL6180 = require('ModuleVL6180.min').ClassBaseVL6180;
const ClassALS = require('ModuleALS.min');
const ClassRangeSensor = require('ModuleRangeSensor.min');

try {
    const base = new ClassBaseVL6180({i2c: I2C1, irqPin: P4});
} catch (error) {
    console.log(error.msg);
}
                   
const als = new ClassALS(base);
//als.OnUpdate(x => console.log(x));
//als.UpdateIlluminance();
//als.StartIlluminanceMeasures(1000);

//const ranger = new ClassRangeSensor(base);

//ranger.StartRangeMeasures(1200);
//ranger.OnUpdate(x => console.log(x));
//ranger.Calibrate(1, 100);
