// var this.regAddr = {
//     IDENTIFICATION__MODEL_ID: 0x000,
//     IDENTIFICATION__MODEL_REV_MAJOR: 0x001,
//     IDENTIFICATION__MODEL_REV_MINOR: 0x002,
//     IDENTIFICATION__MODULE_REV_MAJOR: 0x003,
//     IDENTIFICATION__MODULE_REV_MINOR: 0x004,
//     IDENTIFICATION__DATE_HI: 0x006,
//     IDENTIFICATION__DATE_LO: 0x007,
//     IDENTIFICATION__TIME: 0x008, // 16-bit

//     SYSTEM__MODE_GPIO0: 0x010,
//     SYSTEM__MODE_GPIO1: 0x011,
//     SYSTEM__HISTORY_CTRL: 0x012,
//     SYSTEM__INTERRUPT_CONFIG_GPIO: 0x014,
//     SYSTEM__INTERRUPT_CLEAR: 0x015,
//     SYSTEM__FRESH_OUT_OF_RESET: 0x016,
//     SYSTEM__GROUPED_PARAMETER_HOLD: 0x017,

//     SYSRANGE__START: 0x018,
//     SYSRANGE__THRESH_HIGH: 0x019,
//     SYSRANGE__THRESH_LOW: 0x01a,
//     SYSRANGE__INTERMEASUREMENT_PERIOD: 0x01b,
//     SYSRANGE__MAX_CONVERGENCE_TIME: 0x01c,
//     SYSRANGE__CROSSTALK_COMPENSATION_RATE: 0x01e, // 16-bit
//     SYSRANGE__CROSSTALK_VALID_HEIGHT: 0x021,
//     SYSRANGE__EARLY_CONVERGENCE_ESTIMATE: 0x022, // 16-bit
//     SYSRANGE__PART_TO_PART_RANGE_OFFSET: 0x024,
//     SYSRANGE__RANGE_IGNORE_VALID_HEIGHT: 0x025,
//     SYSRANGE__RANGE_IGNORE_THRESHOLD: 0x026, // 16-bit
//     SYSRANGE__MAX_AMBIENT_LEVEL_MULT: 0x02c,
//     SYSRANGE__RANGE_CHECK_ENABLES: 0x02d,
//     SYSRANGE__VHV_RECALIBRATE: 0x02e,
//     SYSRANGE__VHV_REPEAT_RATE: 0x031,

//     SYSALS__START: 0x038,
//     SYSALS__THRESH_HIGH: 0x03a,
//     SYSALS__THRESH_LOW: 0x03c,
//     SYSALS__INTERMEASUREMENT_PERIOD: 0x03e,
//     SYSALS__ANALOGUE_GAIN: 0x03f,
//     SYSALS__INTEGRATION_PERIOD: 0x040,

//     RESULT__RANGE_STATUS: 0x04d,
//     RESULT__ALS_STATUS: 0x04e,
//     RESULT__INTERRUPT_STATUS_GPIO: 0x04f,
//     RESULT__ALS_VAL: 0x050, // 16-bit
//     RESULT__HISTORY_BUFFER_0: 0x052, // 16-bit
//     RESULT__HISTORY_BUFFER_1: 0x054, // 16-bit
//     RESULT__HISTORY_BUFFER_2: 0x056, // 16-bit
//     RESULT__HISTORY_BUFFER_3: 0x058, // 16-bit
//     RESULT__HISTORY_BUFFER_4: 0x05a, // 16-bit
//     RESULT__HISTORY_BUFFER_5: 0x05c, // 16-bit
//     RESULT__HISTORY_BUFFER_6: 0x05e, // 16-bit
//     RESULT__HISTORY_BUFFER_7: 0x060, // 16-bit
//     RESULT__RANGE_VAL: 0x062,
//     RESULT__RANGE_RAW: 0x064,
//     RESULT__RANGE_RETURN_RATE: 0x066, // 16-bit
//     RESULT__RANGE_REFERENCE_RATE: 0x068, // 16-bit
//     RESULT__RANGE_RETURN_SIGNAL_COUNT: 0x06c, // 32-bit
//     RESULT__RANGE_REFERENCE_SIGNAL_COUNT: 0x070, // 32-bit
//     RESULT__RANGE_RETURN_AMB_COUNT: 0x074, // 32-bit
//     RESULT__RANGE_REFERENCE_AMB_COUNT: 0x078, // 32-bit
//     RESULT__RANGE_RETURN_CONV_TIME: 0x07c, // 32-bit
//     RESULT__RANGE_REFERENCE_CONV_TIME: 0x080, // 32-bit

//     RANGE_SCALER: 0x096, // 16-bit - see STSW-IMG003 core/inc/vl6180x_def.h

//     READOUT__AVERAGING_SAMPLE_PERIOD: 0x10a,
//     FIRMWARE__BOOTUP: 0x119,
//     FIRMWARE__RESULT_SCALER: 0x120,
//     I2C_SLAVE__DEVICE_ADDRESS: 0x212,
//     INTERLEAVED_MODE__ENABLE: 0x2a3
// };
/**
 * @typedef  {Object} ObjectVL6180XParam - тип аргумента 
 * @property {Object} i2c         1 - I2C шина
 * @property {Object} irqPin      2 - пин прерывания
 * Пример объекта с аргументами для генерации объекта:
 * {i2c:I2C1, irqPin:P4}
 */
/**
 * @class
 * Базовый класс, который выполняет основную работу с датчиком.
 */
class ClassBaseVL6180 {
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
        this._IrqPin = _opt.irqPin;
        this._I2Cbus = _opt.i2c;

        this._WaitForRange = false;
        // this._waitForRangeCallback = null;
        this._LatestRange = undefined;
        
        this._WaitForALS = false;
        // this._waitForALSCallback = null;
        this._LatestALS = undefined;

        this._Ee = new (require('./EventEmitter.js'))();

        this.this.regAddr = {
            IDENTIFICATION__MODEL_ID: 0x000,
            IDENTIFICATION__MODEL_REV_MAJOR: 0x001,
            IDENTIFICATION__MODEL_REV_MINOR: 0x002,
            IDENTIFICATION__MODULE_REV_MAJOR: 0x003,
            IDENTIFICATION__MODULE_REV_MINOR: 0x004,
            IDENTIFICATION__DATE_HI: 0x006,
            IDENTIFICATION__DATE_LO: 0x007,
            IDENTIFICATION__TIME: 0x008, // 16-bit
        
            SYSTEM__MODE_GPIO0: 0x010,
            SYSTEM__MODE_GPIO1: 0x011,
            SYSTEM__HISTORY_CTRL: 0x012,
            SYSTEM__INTERRUPT_CONFIG_GPIO: 0x014,
            SYSTEM__INTERRUPT_CLEAR: 0x015,
            SYSTEM__FRESH_OUT_OF_RESET: 0x016,
            SYSTEM__GROUPED_PARAMETER_HOLD: 0x017,
        
            SYSRANGE__START: 0x018,
            SYSRANGE__THRESH_HIGH: 0x019,
            SYSRANGE__THRESH_LOW: 0x01a,
            SYSRANGE__INTERMEASUREMENT_PERIOD: 0x01b,
            SYSRANGE__MAX_CONVERGENCE_TIME: 0x01c,
            SYSRANGE__CROSSTALK_COMPENSATION_RATE: 0x01e, // 16-bit
            SYSRANGE__CROSSTALK_VALID_HEIGHT: 0x021,
            SYSRANGE__EARLY_CONVERGENCE_ESTIMATE: 0x022, // 16-bit
            SYSRANGE__PART_TO_PART_RANGE_OFFSET: 0x024,
            SYSRANGE__RANGE_IGNORE_VALID_HEIGHT: 0x025,
            SYSRANGE__RANGE_IGNORE_THRESHOLD: 0x026, // 16-bit
            SYSRANGE__MAX_AMBIENT_LEVEL_MULT: 0x02c,
            SYSRANGE__RANGE_CHECK_ENABLES: 0x02d,
            SYSRANGE__VHV_RECALIBRATE: 0x02e,
            SYSRANGE__VHV_REPEAT_RATE: 0x031,
        
            SYSALS__START: 0x038,
            SYSALS__THRESH_HIGH: 0x03a,
            SYSALS__THRESH_LOW: 0x03c,
            SYSALS__INTERMEASUREMENT_PERIOD: 0x03e,
            SYSALS__ANALOGUE_GAIN: 0x03f,
            SYSALS__INTEGRATION_PERIOD: 0x040,
        
            RESULT__RANGE_STATUS: 0x04d,
            RESULT__ALS_STATUS: 0x04e,
            RESULT__INTERRUPT_STATUS_GPIO: 0x04f,
            RESULT__ALS_VAL: 0x050, // 16-bit
            RESULT__HISTORY_BUFFER_0: 0x052, // 16-bit
            RESULT__HISTORY_BUFFER_1: 0x054, // 16-bit
            RESULT__HISTORY_BUFFER_2: 0x056, // 16-bit
            RESULT__HISTORY_BUFFER_3: 0x058, // 16-bit
            RESULT__HISTORY_BUFFER_4: 0x05a, // 16-bit
            RESULT__HISTORY_BUFFER_5: 0x05c, // 16-bit
            RESULT__HISTORY_BUFFER_6: 0x05e, // 16-bit
            RESULT__HISTORY_BUFFER_7: 0x060, // 16-bit
            RESULT__RANGE_VAL: 0x062,
            RESULT__RANGE_RAW: 0x064,
            RESULT__RANGE_RETURN_RATE: 0x066, // 16-bit
            RESULT__RANGE_REFERENCE_RATE: 0x068, // 16-bit
            RESULT__RANGE_RETURN_SIGNAL_COUNT: 0x06c, // 32-bit
            RESULT__RANGE_REFERENCE_SIGNAL_COUNT: 0x070, // 32-bit
            RESULT__RANGE_RETURN_AMB_COUNT: 0x074, // 32-bit
            RESULT__RANGE_REFERENCE_AMB_COUNT: 0x078, // 32-bit
            RESULT__RANGE_RETURN_CONV_TIME: 0x07c, // 32-bit
            RESULT__RANGE_REFERENCE_CONV_TIME: 0x080, // 32-bit
        
            RANGE_SCALER: 0x096, // 16-bit - see STSW-IMG003 core/inc/vl6180x_def.h
        
            READOUT__AVERAGING_SAMPLE_PERIOD: 0x10a,
            FIRMWARE__BOOTUP: 0x119,
            FIRMWARE__RESULT_SCALER: 0x120,
            I2C_SLAVE__DEVICE_ADDRESS: 0x212,
            INTERLEAVED_MODE__ENABLE: 0x2a3
        };
        this._address = 0x29;
        this._scaling = 0;
        this._ptpOffset = 0;
        this._scalerValues = new Uint16Array([0, 253, 127, 84]);

        this._init();
        this._configureDefault();
        
        setWatch(this._handleIrq.bind(this), this._IrqPin, {
            repeat: true,
            edge: 'rising',
            debounce: 10
        });
    };
    // enableSetWatch() {    }
    /**
     * @method 
     * Метод принимает в качестве аргумента функцию, которая будет вызвана при изменении значения расстояния (_LatestRange)
     * ПРИМЕЧАНИЕ! Многократный вызов этого метода с разными функциями не отменяет функции, которые были подписаны ранее.
     * @param {Function} handler 
     */
    onRangeChange(handler) {
        this._Ee.on('rangeChange', range => {
            if (handler) handler.apply(this, [range])
        });
    }
    /**
     * @method
     * Убивает все функции-обработчики, которые ранее были подписаны на изменение значения расстояния.
     */
    ResetOnRangeChange() {
        this._Ee.reset('rangeChange');
    }
    /**
     * @method
     * Убивает все функции-обработчики, которые ранее были подписаны на изменение значения освещенности.
     */
    ResetOnALSChange() {
        this._Ee.reset('ALSChange');
    }
    /**
     * @method 
     * Метод принимает в качестве аргумента функцию, которая будет вызвана при изменении значения расстояния (_LatestALS)
     * ПРИМЕЧАНИЕ! Многократный вызов этого метода с разными функциями не отменяет функции, которые были подписаны ранее.
     * @param {Function} handler 
     */
    onALSChange(handler) {
        this._Ee.on('ALSChange', als => {
            if (handler) handler.apply(this, [als])
        });
    }
    /**
     * @method
     * Метод вызывает взятие замера расстояния, которое будет записано в поле _LatestRange
     */
    requestRangeUpdate() {
        this._write8bit(this.regAddr.SYSRANGE__START, 0x01);
        this._write8bit(this.regAddr.SYSTEM__INTERRUPT_CLEAR, 0x01);
        this._WaitForRange = true;
    }
    /**
     * @method
     * Метод вызывает взятие замера освещенности, которое будет записано в поле _LatestALS
     */
    requestALSUpdate() {
        this._write8bit(this.regAddr.SYSTEM__INTERRUPT_CLEAR, 0x02);
        this._write8bit(this.regAddr.SYSALS__START, 0x01);
        this._WaitForALS = true;
    }

    _handleRangeRequest() {
        this._WaitForRange = false;
        var range = this._read8bit(this.regAddr.RESULT__RANGE_VAL);
        this._write8bit(this.regAddr.SYSTEM__INTERRUPT_CLEAR, 0x01);
        if (range === 255) {
            this._LatestRange = Infinity;
        } else {
            this._LatestRange = range;
        } 
        this._Ee.emit('rangeChange', range);
    }

    _handleALSRequest() {
        this._WaitForALS = false;
        var ambient = this._read16bit(this.regAddr.RESULT__ALS_VAL);
        this._write8bit(this.regAddr.SYSTEM__INTERRUPT_CLEAR, 0x02);
        ambient = (0.32 * ambient) / 1.01;  // convert raw data to lux according to datasheet (section 2.13.4)
        this._LatestALS = ambient;
        this._Ee.emit('ALSChange', [ambient]);
    }
}

ClassBaseVL6180.prototype._handleIrq = function () {
    if (this._WaitForALS) {
        _handleALSRequest();
    } else if (this._WaitForRange) {
        _handleRangeRequest();
    }
};
//#region функции которые не стоит редактировать
ClassBaseVL6180.prototype._init = function () {
    // Store part-to-part range offset so it can be adjusted if scaling is changed
    this._ptpOffset = this._read8bit(this.regAddr.SYSRANGE__PART_TO_PART_RANGE_OFFSET);

    if (this._read8bit(this.regAddr.SYSTEM__FRESH_OUT_OF_RESET) === 1) {
        this._scaling = 1;
        this._write8bit(0x207, 0x01);
        this._write8bit(0x208, 0x01);
        this._write8bit(0x096, 0x00);
        this._write8bit(0x097, 0xfd); // RANGE_SCALER = 253
        this._write8bit(0x0e3, 0x00);
        this._write8bit(0x0e4, 0x04);
        this._write8bit(0x0e5, 0x02);
        this._write8bit(0x0e6, 0x01);
        this._write8bit(0x0e7, 0x03);
        this._write8bit(0x0f5, 0x02);
        this._write8bit(0x0d9, 0x05);
        this._write8bit(0x0db, 0xce);
        this._write8bit(0x0dc, 0x03);
        this._write8bit(0x0dd, 0xf8);
        this._write8bit(0x09f, 0x00);
        this._write8bit(0x0a3, 0x3c);
        this._write8bit(0x0b7, 0x00);
        this._write8bit(0x0bb, 0x3c);
        this._write8bit(0x0b2, 0x09);
        this._write8bit(0x0ca, 0x09);
        this._write8bit(0x198, 0x01);
        this._write8bit(0x1b0, 0x17);
        this._write8bit(0x1ad, 0x00);
        this._write8bit(0x0ff, 0x05);
        this._write8bit(0x100, 0x05);
        this._write8bit(0x199, 0x05);
        this._write8bit(0x1a6, 0x1b);
        this._write8bit(0x1ac, 0x3e);
        this._write8bit(0x1a7, 0x1f);
        this._write8bit(0x030, 0x00);
        this._write8bit(this.regAddr.SYSTEM__FRESH_OUT_OF_RESET, 0);
    } else {
        // Sensor has already been initialized, so try to get scaling settings by
        // reading registers.
        var s = this._read16bit(this.regAddr.RANGE_SCALER);
        if (s === this._scalerValues[3]) {
            this._scaling = 3;
        } else if (s === this._scalerValues[2]) {
            this._scaling = 2;
        } else {
            this._scaling = 1;
        }
        // Adjust the part-to-part range offset value read earlier to account for
        // existing scaling. If the sensor was already in 2x or 3x scaling mode,
        // precision will be lost calculating the original (1x) offset, but this can
        // be resolved by resetting the sensor and Arduino again.
        this._ptpOffset *= this._scaling;
    }
};

ClassBaseVL6180.prototype._write8bit = function (reg, val8bit) {
    this._I2Cbus.writeTo(this._address, (reg >> 8) & 0xff, reg & 0xff, val8bit);
};

ClassBaseVL6180.prototype._write16bit = function (reg, val16bit) {
    this._I2Cbus.writeTo(
        this._address,
        (reg >> 8) & 0xff,
        reg & 0xff,
        (val16bit >> 8) & 0xff,
        val16bit & 0xff
    );
};

ClassBaseVL6180.prototype._write32bit = function (reg, val32bit) {
    this._I2Cbus.writeTo(
        this._address,
        (reg >> 8) & 0xff,
        reg & 0xff,
        (val32bit >> 24) & 0xff,
        (val32bit >> 16) & 0xff,
        (val32bit >> 8) & 0xff,
        val32bit & 0xff
    );
};

ClassBaseVL6180.prototype._read8bit = function (reg) {
    this._I2Cbus.writeTo(this._address, (reg >> 8) & 0xff, reg & 0xff);
    var data = this._I2Cbus.readFrom(this._address, 1);
    return data[0];
};

ClassBaseVL6180.prototype._read16bit = function (reg) {
    this._I2Cbus.writeTo(this._address, (reg >> 8) & 0xff, reg & 0xff);
    var data = this._I2Cbus.readFrom(this._address, 2);
    return (data[0] << 8) + data[1];
};

ClassBaseVL6180.prototype._read32bit = function (reg) {
    this._I2Cbus.writeTo(this._address, (reg >> 8) & 0xff, reg & 0xff);
    var data = this._I2Cbus.readFrom(this._address, 4);
    return (data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3];
};

ClassBaseVL6180.prototype.setAddress = function (newAddr) {
    this._write8bit(this.regAddr.I2C_SLAVE__DEVICE_ADDRESS, newAddr & 0x7f);
    this._address = newAddr;
};

// Note that this function does not set up GPIO1 as an interrupt output as
// suggested, though you can do so by calling:
// this._write8bit(this.regAddr.SYSTEM__MODE_GPIO1, 0x10);
ClassBaseVL6180.prototype._configureDefault = function () {
    // устанавливаем пин прерывания
    this._write8bit(this.regAddr.SYSTEM__MODE_GPIO1, 0x30);
    // "Recommended : Public registers"
    // readout__averaging_sample_period = 48
    this._write8bit(this.regAddr.READOUT__AVERAGING_SAMPLE_PERIOD, 0x30);
    // sysals__analogue_gain_light = 6 (ALS gain = 1 nominal, actually 1.01 according to Table 14 in datasheet)
    this._write8bit(this.regAddr.SYSALS__ANALOGUE_GAIN, 0x46);
    // sysrange__vhv_repeat_rate = 255
    // (auto Very High Voltage temperature recalibration after every 255 range measurements)
    this._write8bit(this.regAddr.SYSRANGE__VHV_REPEAT_RATE, 0xff);
    // sysals__integration_period = 99 (100 ms)

    // AN4545 incorrectly recommends writing to register 0x040;
    // 0x63 should go in the lower byte, which is register 0x041.
    this._write16bit(this.regAddr.SYSALS__INTEGRATION_PERIOD, 0x0063);
    // sysrange__vhv_recalibrate = 1 (manually trigger a VHV recalibration)
    this._write8bit(this.regAddr.SYSRANGE__VHV_RECALIBRATE, 0x01);

    // "Optional: Public registers"
    // sysrange__intermeasurement_period = 9 (100 ms)
    this._write8bit(this.regAddr.SYSRANGE__INTERMEASUREMENT_PERIOD, 0x09);
    // sysals__intermeasurement_period = 49 (500 ms)
    this._write8bit(this.regAddr.SYSALS__INTERMEASUREMENT_PERIOD, 0x31);
    // als_int_mode = 4 (this.regAddr.ALS new sample ready interrupt); range_int_mode = 4
    // (range new sample ready interrupt)
    this._write8bit(this.regAddr.SYSTEM__INTERRUPT_CONFIG_GPIO, 0x24);
    // Reset other settings to power-on defaults

    // sysrange__max_convergence_time = 49 (49 ms)
    this._write8bit(this.regAddr.SYSRANGE__MAX_CONVERGENCE_TIME, 0x31);
    // disable interleaved mode
    this._write8bit(this.regAddr.INTERLEAVED_MODE__ENABLE, 0);
    // reset range scaling factor to 1x
    this.setScaling(1);
};

ClassBaseVL6180.prototype.setScaling = function (newScaling) {
    var DefaultCrosstalkValidHeight = 20; // default value of SYSRANGE__CROSSTALK_VALID_HEIGHT

    // do nothing if scaling value is invalid
    if (newScaling < 1 || newScaling > 3) {
        return;
    }

    this._scaling = newScaling;
    this._write16bit(this.regAddr.RANGE_SCALER, this._scalerValues[this._scaling]);
    // apply scaling on part-to-part offset
    this._write8bit(
        this.regAddr.SYSRANGE__PART_TO_PART_RANGE_OFFSET,
        this._ptpOffset / this._scaling
    );
    // apply scaling on CrossTalkValidHeight
    this._write8bit(
        this.regAddr.SYSRANGE__CROSSTALK_VALID_HEIGHT,
        DefaultCrosstalkValidHeight / this._scaling
    );
    // This function does not apply scaling to RANGE_IGNORE_VALID_HEIGHT.
    // enable early convergence estimate only at 1x scaling
    var rce = this._read8bit(this.regAddr.SYSRANGE__RANGE_CHECK_ENABLES);
    this._write8bit(
        this.regAddr.SYSRANGE__RANGE_CHECK_ENABLES,
        (rce & 0xfe) | (this._scaling === 1)
    );
};
//#endregion
//#region commented
// // Performs a single-shot ranging measurement
// ClassBaseVL6180.prototype.range = function (callback) {
//     this._write8bit(this.regAddr.SYSRANGE__START, 0x01);
//     this._write8bit(this.regAddr.SYSTEM__INTERRUPT_CLEAR, 0x01);
//     this._WaitForRange = true;
//     this._waitForRangeCallback = callback;
// };

// // Performs a single-shot ambient light measurement
// ClassBaseVL6180.prototype.ambient = function (callback) {
//     this._write8bit(this.regAddr.SYSTEM__INTERRUPT_CLEAR, 0x02);
//     this._write8bit(this.regAddr.SYSALS__START, 0x01);
//     this._WaitForALS = true;
//     this._waitForALSCallback = callback;
// };
//#endregion


class ClassVL6180 extends ClassBaseVL6180 {
    /**
     * @constructor
     * @param {ObjectVL6180XParam} _opt 
     */
    constructor(_opt) {
        super(_opt);
    }
    get isBusy() { return this._WaitForALS || this._WaitForRange };
    /**
     * @method
     * @param {Number} period 
     */
    startRangeMeasures(period, duration) {
        // period = period || 20;
        period = period >= 20 ? period : 20;
        duration = duration >= period ? duration : undefined;

        if (duration) {
            let timer = setTimeout(() => {
                fn = null;
            }, duration);
        }

        //вызывает this.requestRangeUpdate() с заданной периодичностью
        const fn = () => {         
            setTimeout(() => fn(), period);
            this.requestRangeUpdate();
        };
        if (!this.isBusy && fn) fn();

        this.startDualMeasures.cancel = function() {
            fn = null;
        }
    }

    // stopRangeMeasures() { return this.startDualMeasures.cancel(); }
    /**
     * @method
     * Метод обеспечивает выполнение  хотя бы одного кизмерения освещенности за указанный период в мс, а в оставшееся время выполняет замеры расстояния
     * @param {Number} period продолжительность периода в мс
     */
    startDualMeasures(period) {
        //this.onALSChange(this.startRangeMeasures.bind(this, [20, period - 120])); //[period-120] это приблизительное время которое должен будет исполняться startRangeMeasures() после отаботки измерения освещенности.
        // this.onALSChange();
        period = period > 120 ? period : 120;
        // duration = duration > period ? duration : undefined;

        let timer = setTimeout(() => {
            clearTimeout(timer);
            setTimeout(() => this.startDualMeasures(period), 20);
        }, period-20);

        setTimeout(() => { 
            let rangeFn = () => { //замыкаю вызов измерения расстояния чтобы рекурсивно его зациклить
                if (!timer._destroyed) { //если таймер не успел отработать, запускаем еще измерение расстояния
                    this.requestRangeUpdate();
                    setTimeout(() => rangeFn(), 20);
                }
            }
        }, 110);
        this.requestALSUpdate();

        this.startDualMeasures.cancel = function() {

        }
    }
}

exports = { ClassBaseVL6180: ClassBaseVL6180,
            ClassVL6180:     ClassVL6180    };
            // registers:       regAddr };