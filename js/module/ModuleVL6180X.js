const ClassVL6180XDefault = require('ModuleVL6180XDefault')._class;
// const ClassAppError = require('https://raw.githubusercontent.com/Konkery/ModuleAppError/main/js/module/ModuleAppError.js');

class ClassVL6180X extends ClassVL6180XDefault {
  //_opts: {i2c: I2C1, irqPin: irqPin}
  //TODO: добавить валидацию аргументов пользуясь расширенным классом ошибок
  constructor(_opts){
    super(_opts);
    this.name = 'ClassVL6180X';
  }
};

ClassVL6180X.prototype.startDualMeasures = function(){
    setInterval(() => {
        this.ambient((err, value) => {
            if (err) {

            } else {
                console.log(`${value} lux`)
            }
        });
    }, 300);
    setTimeout(() => {
        setInterval(() => {
            this.range((er, val) => {
                if (er) {

                } else {
                    console.log(`${val} mm`)
                }
            });
        }, 300);
    }, 150);
};

exports = ClassVL6180X;