class EventEmitter {
    constructor() {
        this.events = {}; // hash of array of function
    }
    /**
     * @method
     * Метод подписывает функцию fn на событие с названием name
     * @param {String} name - название события
     * @param {Function} fn - функция - обработчик
     */
    on(name, fn) {
        const event = this.events[name];
        if (event) event.push(fn);
        else this.events[name] = [fn];
    };
    /**
     * @method
     * метод сообщает о событии и запускает его обработку
     * @param {String} name 
     * @param {Array} argsArr 
     */
    emit(name, argsArr) {
        const event = this.events[name];
        if (!event) return;
        for (const listener of event) listener.apply(null, argsArr);
    };
    /**
     * @method
     * Метод убивает все функции, подписанные на событие name
     * @param {String} name 
     */
    reset(name) {
        this.events[name] = [];
    };
    /**
     * @method
     * Метод убивает все функции - связанные с данным эмиттером
     */
    resetAll() { 
        this.events = {}; 
    };
}

// module.exports = EventEmitter;
exports = EventEmitter;