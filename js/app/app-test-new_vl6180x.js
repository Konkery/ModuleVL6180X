const I2Cbus = new ClassI2C();
const bus = I2Cbus.AddBus({sda: B15, scl: B14, bitrate: 100000 }).IDbus;
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
            { "Adafruit": "4328435534" }  
        ],
        IDsupplier: [
            { "Adafruit": "4328435534" }  
        ],
        HelpSens: "Proximity sensor"
    }
});

const vl6180 = ClassVL6180.setup(sensor_props, {
                            bus: bus, 
                            pins: [] }); 
const ch0 = vl6180.GetChannel(0);
const ch1 = vl6180.GetChannel(1);

//Запуск опроса обоих канала
ch0.Start();
ch1.Start();

//Вывод показаний с датчика раз в 1 сек.
setInterval(() => {
    if (ch0.IsUsed)
        console.log(ch0.Value + " lux");
    if (ch1.IsUsed)
        console.log(ch1.Value + " mm");
        console.log('\n');
}, 1000);


