/**
 * @class
 * ChainNode - класс, используемый внутри класса ClassChain как элемент двухсвязного списка. Его самостоятельное использование не предусмотрено
 */
class ChainNode {
    /**
     * @constructor
     * @param {Function} fn функция
     * @param {Array} args массив аргументов функции
     */
    constructor(fn, args) {
        this.fn = fn || null;
        this.args = args || null;
        this.prev = null;
        this.next = null;
    }
}
/**
 * @class 
 * ClassChain Реализовует структуру для создания цепочки асинхронных орпераций, которуюе можно будет запустить
 */
class ClassChain {
    constructor() {
        this.head = null;
        this.tail = null;
        this.count = 0;
    }
    /**
     * @method добавляет асинхронную функцию в цепочку вызовов
     * @param {*} fn 
     * @param {*} args 
     * @returns 
     */
    do(fn, args) {
        const node = new ChainNode(fn, args);
        node.prev = this.tail;
        if (!this.head) {
            this.head = node;
        } else {
            this.tail.next = node;
        }
        this.tail = node;
        this.count++;
        return this;
    }
    /**
     * @method запускает цепочку вызовов
     */
    invoke() {
        let cur = this.head;
        if (cur && cur.fn) {
            cur.fn = cur.fn.bind(this, cur.args);
            cur.fn((error, data) => {
                if (error) console.log(error);
                else console.log(data);
                if (cur.next) {
                    this.head = this.head.next;
                    this.invoke();
                }
            });
        } 
    }
}
exports = { ClassChain : ClassChain };


