const ClassBaseVL6180 = require('./ModuleVL6180');
/**
 * @class
 * Класс предоставляет необходимый функционал для работы с датчиками освещенности: 
 * - циклические и однократные замеры
 * - установку функций-обработчиков на обновление значений 
 * - калибровку получаемых значений
 */
class ClassALS {
    /**
     * @constructor
     * 
     * @param {ClassBaseVL6180} _opt - объект датчика
     */
    constructor(_opt) {
        this._ALS = _opt;
        this._Illuminance = undefined;
        this._Ee = new (require('https://raw.githubusercontent.com/Nicktonious/ModuleVL6180X/fork-Nikita/js/module/ClassEventEmitter.min.js'))();
        this._RangeInterval = null;
        this._ALS_MIN_TIME = this._ALS.ALS_MIN_TIME;  //рекомендованное минимальное ыремя необходимое на взятие одного замера
        this._CalibrOpt = { k: 1, a: 0 };
    }
    /*******************************************CONST********************************************/
    /**
     * @const
     * @type {number}
     * Константа ERROR_CODE_ARG_VALUE определяет код ошибки, которая может произойти
     * в случае передачи в конструктор не валидных данных
     */
    static get ERROR_CODE_ARG_VALUE() { return this._ALS_MIN_TIME; }
    /**
     * @const
     * @type {string}
     * Константа ERROR_MSG_ARG_VALUE определяет сообщение ошибки, которая может произойти
     * в случае передачи в конструктор не валидных данных
     */
    static get ERROR_MSG_ARG_VALUE() { return `ERROR>> invalid data. ClassID: ${this.name}`; }
    /*******************************************END CONST****************************************/
    get Illuminance() { return this._Range; }
    
    set Illuminance(_val) { this._Illuminance = _val * this._CalibrOpt.k 
                                         + this._CalibrOpt.a; }
    /**
     * @method
     * Метод вызывает одиночный запрос на замер освещенности датчиком.
     */
    UpdateIlluminance() {
        this._ALS.UpdateIlluminance(illuminance => {
            this.Illuminance = illuminance;
            if (this._Ee) this._Ee.emit('illuminanceUpdate', [this.Illuminance]);
        });
    }
    /**
     * @method
     * Метод запускает циклический опрос датчика на измрение освещенности.
     * @param {Number} [period] - время в мс за которое будет выполнен один замер.
     * При передаче пустого либо некорректного значения, величина периода будет установлена автоматически 
     * на обеспечивающую максимальную частоту опроса. 
     */
    StartIlluminanceMeasures(period) {
        period = period >= this._ALS_MIN_TIME ? period : this._ALS_MIN_TIME;

        let alsInterval = setInterval(() => {
            this._ALS.UpdateIlluminance();
        }, period);

        this._ALSInterval = alsInterval;
    }
    /**
     * @method
     * Метод останавливает циклическое выполнение замеров освещенности,
     * вызванных методом StartUlluminanceMeasures
     */
    StopIlluminanceMeasures() {
        clearInterval(this._ALSInterval);
        this._ALSInterval = null;
    }
    /**
     * @method 
     * Метод принимает в качестве аргумента функцию, которая будет вызвана при изменении значения расстояния (_Illuminance)
     * ПРИМЕЧАНИЕ! Многократный вызов этого метода с разными функциями не отменяет функции, которые были подписаны ранее.
     * @param {Function} handler 
     */
    OnUpdate(handler) {
        this._Ee.on('illuminanceUpdate', illuminance => {
            if (handler) handler.apply(this, [illuminance])
        });
    }
    /**
     * @method
     * Уничтожает все функции-обработчики, которые ранее были подписаны на изменение значения освещенности.
     */
    ResetOnUpdate() {
        this._Ee.reset('illuminanceUpdate');
    }
    /**
     * @method
     * Метод устанавливает параметры калибровки получаемых значений расстояния. 
     * Их смысл описывается функцией y = kx + a, где x - изначальное значение.
     * ПРИМЕЧАНИЕ: после вызова метода уже записанные значения остаются низменными.
     * @param {Number} _k - коэффициент на который умножается получаемое значение, получаемое с датчика.
     * @param {Number} _a - число на которое изменяется 
     */
    Calibrate(_k, _a) {
        if (typeof (_k) !== 'number' || 
            typeof (_a) !== 'number') {

                throw new err(ClassALS.ERROR_MSG_ARG_VALUE,
                              ClassALS.ERROR_CODE_ARG_VALUE);
        }
        this._CalibrOpt.k = _k;
        this._CalibrOpt.a = _a;
    }
    /**
     * @method
     * Метод возвращает стандартные значения калибровки получаемых результатов измерений.
     * ПРИМЕЧАНИЕ: после вызова метода уже записанные значения остаются низменными.
     */
    ResetCalibration() {
        this._CalibrOpt.k = 1;
        this._CalibrOpt.a = 0;
    }
}