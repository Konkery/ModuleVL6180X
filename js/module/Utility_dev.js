class ChainNode {
    constructor(fn, args) {
        this.fn = fn || null;
        this.args = args || null;
        this.prev = null;
        this.next = null;
    }
}

class ClassChain {
    constructor() {
        this.head = null;
        this.tail = null;
        this.count = 0;
    }
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
    invoke() {
        let cur = this.head;
        if (cur?.fn) {
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

// Emulate asynchronous calls

const wrapAsync = (fn) => (...args) => setTimeout(
    () => fn(...args), Math.floor(Math.random() * 1000)
);

// Asynchronous functions

// const readConfig = wrapAsync((name, callback) => {
//     console.log('(1) config loaded');
//     callback(null, { name });
// });

// const selectFromDb = wrapAsync((query, callback) => {
//     console.log('(2) SQL query executed');
//     callback(null, [{ name: 'Samara' }, { name: 'Roma' } ]);
// });

// const getHttpPage = wrapAsync((url, callback) => {
//     console.log('(3) Page retrieved');
//     callback(null, '<html>Some archaic web here</html>');
// });

// const readFile = wrapAsync((path, callback) => {
//     console.log('(4) Readme file loaded');
//     callback(null, 'file content');
// });

// // Usage

// const some_chain = new ClassChain()
//     .do(readConfig, ['myConfig'])
//     .do(selectFromDb, ['select * from cities'])
//     .do(getHttpPage, ['http://vk.com'])
//     .do(readFile, ['README.md']);
// some_chain.invoke();

// class Node {
//     constructor(_data) {
//         this.data = _data;
//         // this.list = _list;
//         this.next = null;
//         this.prev = null;
//     }
// }
// class LinkedList {
//     constructor(node_val) {
//         let node = null;
//         if (node_val) {
//             node = new Node(node_val);
//         }
//         this.head = node || null;
//         this.tail = this.head || null;
//         this.length = 0;
//     }
//     add(node_val) {
//         this.length++;
//         const node = new Node(node_val);
//         node.prev = this.tail;
//         if (!this.head) {
//             this.head = node;
//         } else {
//             this.tail.next = node;
//         }
//         this.tail = node;
//         return this;
//     }
// }

exports.ClassChain = ClassChain;


