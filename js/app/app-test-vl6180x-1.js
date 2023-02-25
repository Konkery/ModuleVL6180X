I2C1.setup({sda: SDA, scl: SCL, bitrate: 400000}); //нaстройка i2c 

const ClassVL6180X = require('ModuleVL6180X'); //экспорт класса из моего модуля
const vl6180x = new ClassVL6180X({i2c: I2C1, irqPin: P4});

console.log(vl6180x.testMethod()); //вызов тестового метода 