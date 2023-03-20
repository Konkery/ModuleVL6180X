// let path = 'C:\/Users\/Nikita\/ООО Мобильные Автоматизированные Системы\/EcoLite soft Т4_2023 - Документы\/02__Проект\/05__Software\/01__develop\/01__library\/ModuleVL6180X\/js\/module';
const ClassChain = require('D:/Utility_dev.js');
console.log(ClassChain);
// Emulate asynchronous calls

const wrapAsync = (fn) => (...args) => {
    setTimeout(() => fn(...args), Math.floor(Math.random() * 1000)
)};

// Asynchronous functions
const async1 = wrapAsync(console.log.bind(null, '1'));
const async2 = wrapAsync(console.log.bind(null, '2'));
const async3 = wrapAsync(console.log.bind(null, '3'));

// async1(); 
// async2();
// async3();

// const chain = new ClassChain();//.do(async1).do(async2).do(async3);

//#region funcs
// const async1 = wrapAsync((name, callback) => {
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

// Usage

// const some_chain = new ClassChain()
//     .do(readConfig, ['myConfig'])
//     .do(selectFromDb, ['select * from cities'])
//     .do(getHttpPage, ['http://vk.com'])
//     .do(readFile, ['README.md']);
// some_chain.invoke();
//#endregion