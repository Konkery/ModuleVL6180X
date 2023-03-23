const ClassBaseVL6180 = require('./ModuleVL6180');

/**
 * @class
 * Класс предоставляет необходимый функционал для работы с датчиками измерения расстояния: 
 * - циклические и однократные замеры
 * - установку функций-обработчиков на обновление значений 
 * - калибровку получаемых значений
 * - получение значений в разных единицах измерения
 */
class ClassRangeSensor {
    /**
     * @constructor
     * 
     * @param {ClassBaseVL6180} _opt - объект датчика
     */
    constructor(_opt) {
        this._RangeSensor = _opt;
        this._Range = undefined;
        this._Ee = new (require('https://raw.githubusercontent.com/Nicktonious/ModuleVL6180X/fork-Nikita/js/module/ClassEventEmitter.min.js'))();
        this._RangeInterval = null;
        this._RANGE_MIN_TIME = this._RangeSensor.RANGE_MIN_TIME; //рекомендованное минимальное ыремя необходимое на взятие одного замера
        this._CalibrOpt = { k: 1, a: 0 };
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
    get Range() { return this._Range; } //стандартный геттер, возвращает расстояние в мм
    get RangeInSm() { return this._Range / 10; } //дополнительный геттер, возвращает расстояние в см
    get RangeInM() { return this._Range / 1000; } //дополнительный геттер, возвращает расстояние в м
    get RangeInInch() { return this._Range / 25.4; } //стандартный геттер, возвращает расстояние в мм

    set Range(_val) { this._Range = _val * this._CalibrOpt.k 
                                         + this._CalibrOpt.a; }
    /**
     * @method
     * Метод вызывает одиночный запрос на замер расстояния датчиком.
     */
    UpdateRange() {
        this._RangeSensor.UpdateRange(range => {
            this.Range = range;
            if (this._Ee) this._Ee.emit('rangeChange', [range]);
        });
    }
    /**
     * @method
     * Метод запускает циклический опрос датчика на измрение расстояния.
     * @param {Number} [period] - время в мс за которое будет выполнен один замер.
     * При передаче пустого либо некорректного значения, величина периода будет установлена автоматически 
     * на обеспечивающую максимальную частоту опроса. 
     */
    StartRangeMeasures(period) {
        period = period >= this._RANGE_MIN_TIME ? period : this._RANGE_MIN_TIME;

        let rangeInterval = setInterval(() => {
            this.UpdateRange();
        }, period);

        this._RangeInterval = rangeInterval;
    }
    /**
     * @method
     * Метод останавливает циклическое выполнение замеров расстояния,
     * вызванных методом StartRangeMeasures
     */
    StopRangeMeasures() {
        clearInterval(this._RangeInterval);
        this._RangeInterval = null;
    }
    /**
     * @method 
     * Метод принимает в качестве аргумента функцию, которая будет вызвана при изменении значения расстояния (_Range)
     * ПРИМЕЧАНИЕ! Многократный вызов этого метода с разными функциями не отменяет функции, которые были подписаны ранее.
     * @param {Function} handler 
     */
    OnUpdate(handler) {
        this._Ee.on('rangeChange', range => {
            if (handler) handler.apply(this, [range])
        });
    }
    /**
     * @method
     * Уничтожает все функции-обработчики, которые ранее были подписаны на изменение значения расстояния.
     */
    ResetOnUpdate() {
        this._Ee.reset('rangeChange');
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

                throw new err(ClassRangeSensor.ERROR_MSG_ARG_VALUE,
                              ClassRangeSensor.ERROR_CODE_ARG_VALUE);
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