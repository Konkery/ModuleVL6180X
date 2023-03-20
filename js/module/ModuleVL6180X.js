/**
 * @typedef  {Object} ObjectVL6180XParam - тип аргумента метода AddBus
 * @property {Object} i2c         1 - I2C шина
 * @property {Object} irqPin      2 - пин прерывания
 * Пример объекта с аргументами для генерации объекта:
 * {i2c:I2C1, irqPin:P4}
 */
/**
 * @class
 * Основной класс для работы с датчиком
 */
class ClassVL6180X {
    /**
     * @constructor
     * @param {ObjectVL6180XParam} _opt 
     */
    constructor(_opt) {
        if ((!_opt)                         ||
            (!(_opt.i2c instanceof I2C))    ||
            (!(_opt.irqPin instanceof Pin))) {
            throw new err(ClassVL6180X.ERROR_MSG_ARG_VALUE,
                ClassVL6180X.ERROR_CODE_ARG_VALUE);
        }
        this.name = 'VL6180X';
        this._vl6180x = new ClassVL6180XInner(_opt);
        this._rangeInterface = new ClassVL6180XRange(this);
        this._ALSInterface = new ClassVL6180XALS(this);

        setWatch(this._handleIrq.bind(this), _opt.irqPin, {
            repeat: true,
            edge: 'rising'
        });
    }

    /*******************************************CONST********************************************/
    /**
     *@const
     *@type {String}
     *возвращает имя модуля
     */
    static get NAME() { return 'VL6180X' };
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
    static get ERROR_MSG_ARG_VALUE() { return `ERROR>> invalid data. ClassID: ${this.NAME}`; }
    /*******************************************END CONST****************************************/
    _handleIrq() {
        // console.log('main handleIrq');
        if (this._ALSInterface._waitForALS) {
            this._ALSInterface._handleIrq();
        } else if (this._rangeInterface._waitForRange) {
            this._rangeInterface._handleIrq();
        }
    }
    /**
     * @method 
     * внутренний геттер значения расстояния
     */
    get getRange() { return this._rangeInterface._range; }
    /**
     * @method 
     * внутренний геттер значения освещенности
     */
    get getALS() { return this._ALSInterface._ALS; }

    launch() {
        let total_interv = 200;
        let als_interv = 120;
        let range_interv = 30;
        setInterval(() => {
            // this._rangeInterface.updateRange();
            this._ALSInterface.updateALS();
            setTimeout(() => {
                this._rangeInterface.updateRange();
            }, als_interv);
        }, total_interv);
    }
}

class ClassVL6180XRange {
    /**
     * @constructor
     * @param {ClassVL6180X} self
     */
    constructor(_self) {
        this.self = _self;
        this._rangeValue = 0;
        this._waitForRange = false;
    }
    /**
     * @method
     * функция-обработчик прерывания под измерение расстояния
     */
    _handleIrq() {
        // console.log('range handleIrq');
        if (this._waitForRange) {
            this._waitForRange = false;
            let range = this.self._vl6180x._read8bit(regAddr.RESULT__RANGE_VAL);
            this.self._vl6180x._write8bit(regAddr.SYSTEM__INTERRUPT_CLEAR, 0x01);
            if (range === 255) {
                this._range = Infinity;
            } else {
                this._range = range;
            }  
        }
    }
    /**
     * @method 
     * Метод запускает процесс измерения расстояния, результат которого потом будет обработан и записан в _range
     */
    updateRange() {
        if (this._waitForRange) {
            return;
        }
        this.self._vl6180x._write8bit(regAddr.SYSRANGE__START, 0x01);
        this.self._vl6180x._write8bit(regAddr.SYSTEM__INTERRUPT_CLEAR, 0x01);
        this._waitForRange = true;
    }
    /**
     * @method
     * 
     * @param {Number} value
     */
    set _range(value) {
        this._rangeValue = value;
    }
    get _range() { return this._rangeValue; }
}

class ClassVL6180XALS {
    /**
     * @constructor
     * @param {ClassVL6180X} self
     */
    constructor(_self) {
        this.self = _self;
        this._ALSValue = 0;
        this._waitForALS = false;
    }
    /**
     * @method
     * функция-обработчик прерывания под измерение освещенности
     */
    _handleIrq() {
        // console.log('als handleIrq');
        if (this._waitForALS) {
            // console.log('false');
            this._waitForALS = false;
            let ambient = this.self._vl6180x._read16bit(regAddr.RESULT__ALS_VAL);
            this.self._vl6180x._write8bit(regAddr.SYSTEM__INTERRUPT_CLEAR, 0x02);
            // convert raw data to lux according to datasheet (section 2.13.4)
            ambient = (0.32 * ambient) / 1.01;
            this._ALS = ambient;
        }
    }
    /**
     * @method 
     * Метод запускает процесс измерения расстояния, результат которого потом будет обработан и записан в _ALSValue
     */
    updateALS() {
        if (this._waitForALS) {
            return;
        }
        this.self._vl6180x._write8bit(regAddr.SYSTEM__INTERRUPT_CLEAR, 0x02);
        this.self._vl6180x._write8bit(regAddr.SYSALS__START, 0x01);
        this._waitForALS = true;
        // console.log(`updALS ${this._waitForALS}`);
    }
    /**
     * @method
     * 
     * @param {Number} value
     */
    set _ALS(value) {
        this._ALSValue = value;
    }
    get _ALS() { return this._ALSValue; }
}

exports = { ClassVL6180X :     ClassVL6180X,
            ClassVL6180XALS:   ClassVL6180XALS,
            ClassVL6180XRange: ClassVL6180XRange };