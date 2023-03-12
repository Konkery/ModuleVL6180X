'use strict';

// const { EventEmitter } = require('node:events');

// const emitter = new EventEmitter();

// const EventEmitter = function() {
//     this.events = {};
// }
// EventEmitter.prototype.on = function(id, callback) {
//     if (this.events[id]) {
//         this.events[id].push(callback);
//     } else {
//         this.events[id] = [callback];
//     }
// }
// EventEmitter.prototype.emit = function(id) {
//     if (this.events[id]) {
//         let fnArr = this.events[id];
//         fnArr.forEach(fn => fn());
//     }
// }
// const ee = new EventEmitter();
// ee.on('bello', console.log.bind(null, 'hello'));
// ee.on('bello', console.log.bind(null, 'hello2'));
// ee.emit('bello')

const ClassChain = require('./Utility').ClassChain;
