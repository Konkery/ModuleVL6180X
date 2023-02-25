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
    let timeOnAmb;
    let timeOnRange;
    setInterval(() => {
        this.ambient((err, value) => {
            if (err) {

            } else {
                console.log(`${value} lux`);
                timeOnAmb = getTime();
            }
        });
    }, 300);
    setTimeout(() => {
        setInterval(() => {
            this.range((err, value) => {
                if (err) {

                } else {
                    // console.log(`${value} mm`);
                    timeOnRange = getTime();
                    console.log(timeOnRange-timeOnAmb);
                }
            });
        }, 300);
    }, 150);
};

exports = ClassVL6180X;