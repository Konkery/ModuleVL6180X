const err = require('M_AppError');
require('M_AppMath').is();

//const ClassVL6180 = require('https://raw.githubusercontent.com/Nicktonious/ModuleVL6180X/fork-Nikita/js/module/ModuleVL6180.min.js').ClassVL6180;
const ClassI2C = require('M_I2CBus');
const ClassMiddleSensor = require('M_SensorArchitecture');
const ClassVL6180 = require('M_VL6180');

const I2Cbus = new ClassI2C();
const bus = I2Cbus.AddBus({sda: P5, scl: P4, bitrate: 100000 }).IDbus;
const sensor_props = ({
    name: "VL6180",
    type: "sensor",
    channelNames: ['light', 'range'],
    typeInSignal: "analog",
    typeOutSignal: "digital",
    quantityChannel: 2,
    busTypes: ["i2c"],
    manufacturingData: {
        IDManufacturing: [
            { "Amperka": "AMP-B072" }
        ],
        IDsupplier: [
            { "Amperka": "AMP-B072" }
        ],
        HelpSens: "Proximity sensor"
    }
});

const vl = ClassVL6180.setup(sensor_props, {
                            bus: bus, 
                            pins: [] }); //некоторая инициализация класса, который реализует работу VL6180 в целом
const ch0 = vl.GetChannel(0);    //ch0 - канал отвечабщий за освещенность
const ch1 = vl.GetChannel(1);    //ch1 - канал отвечающий за измерения расстояния 
        


