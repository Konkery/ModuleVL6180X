// const ClassVL6180XDefault = require('ModuleVL6180XDefault').VL6180X;

/**
 * @class
 * Класс ClassVL6180X реализует логику работы датчика расстояния и освещенности VL6180X
 */
class ClassVL6180X {
    /**
     * @constructor
     * @param {{i2c, irqPin}} _opt - объект с полями i2c и irqPin
     */
    constructor(_opt) {
        this.name = 'ClassVL6180X';

        if (_opt === undefined) {
            throw new err(ClassVL6180X.ERROR_MSG_ARG_VALUE,
                          ClassVL6180X.ERROR_CODE_ARG_VALUE);
        }
        if (!(_opt.i2c instanceof I2C)) {
            throw new err(ClassVL6180X.ERROR_MSG_ARG_VALUE,
                          ClassVL6180X.ERROR_CODE_ARG_VALUE);
        }
        if (!(_opt.irqPin instanceof Pin)) {
            throw new err(ClassVL6180X.ERROR_MSG_ARG_VALUE,
                          ClassVL6180X.ERROR_CODE_ARG_VALUE);
        }
        this._vl6180x = new ClassVL6180XDefault(_opt);
    }
    /*******************************************CONST********************************************/
    /**
     * @const
     * @type {number}
     * Константа ERROR_CODE_ARG_VALUE определяет код ошибки, которая может произойти
     * в случае передачи в конструктор не валидных данных
     */
    static get ERROR_CODE_ARG_VALUE() { return 10; }
    /**
     * @const
     * @type {string}
     * Константа ERROR_MSG_ARG_VALUE определяет сообщение ошибки, которая может произойти
     * в случае передачи в конструктор не валидных данных
     */
    static get ERROR_MSG_ARG_VALUE() { return `ERROR>> invalid data. ClassID: ${this.name}`; }
    /*******************************************END CONST****************************************/
    /**
     * @method в течение заданного времени с указанным интервалом выполняются парные замеры уровня освещенности и расстояния
     * 
     * @param {Number} _interval - интервал между выполнением замеров [250 <= x]
     * @param {Number} _duration - общая продолжительность выполнения команды в секундах [default = Infinity]
     */
    startDualMeasures(_interval, _duration) {
        let interval = _interval && 
                       _interval >= 250 ? _interval : 250;
        let duration = _duration ? _duration : Infinity;

        let timeOnAmb;
        let timeOnRange;

        let time_start = getTime();

        const amb_interval = setInterval(() => {
            this._vl6180x.ambient((error, value) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(`${value} lux`);
                    // timeOnAmb = getTime();
                }
            });
        }, interval);
        setTimeout(() => {
            const range_iterval = setInterval(() => {
                this._vl6180x.range((error, value) => {
                    if (error) {
                        console.log(Infinity);
                    } else {
                        console.log(`${value} mm`);
                        // timeOnRange = getTime();
                        // console.log(timeOnRange-timeOnAmb);

                        if (getTime() - time_start >= duration) {
                            clearInterval(range_iterval);
                            clearInterval(amb_interval);
                        }
                    }
                });
            }, interval);
        }, interval/2);
    }
}
exports = { ClassVL6180X: ClassVL6180X };