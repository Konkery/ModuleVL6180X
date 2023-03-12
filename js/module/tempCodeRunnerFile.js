Emulate asynchronous calls

const wrapAsync = (fn) => (...args) => setTimeout(
    () => fn(...args), Math.floor(Math.random() * 1000)
);

// Asynchronous functions

const readConfig = wrapAsync((name, callback) => {
    console.log('(1) config loaded');
    callback(null, { name });
});

const selectFromDb = wrapAsync((query, callback) => {
    console.log('(2) SQL query executed');
    callback(null, [{ name: 'Samara' }, { name: 'Roma' } ]);
});

const getHttpPage = wrapAsync((url, callback) => {
    console.log('(3) Page retrieved');
    callback(null, '<html>Some archaic web here</html>');
});

const readFile = wrapAsync((path, callback) => {
    console.log('(4) Readme file loaded');
    callback(null, 'file content');
});

Usage

const some_chain = new ClassChain()
    .do(readConfig, ['myConfig'])
    .do(selectFromDb, ['select * from cities'])
    .do(getHttpPage, ['http://vk.com'])
    .do(readFile, ['README.md']);
some_chain.invoke();