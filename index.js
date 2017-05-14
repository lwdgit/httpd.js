#!/usr/bin/env node

var ret = require('./http.js').run(process.argv);
process.on('uncaughtException', function(e) {
    console.log('\r\nError:');
    if (e.message.indexOf('EADDRINUSE') > -1) {
        console.log('Port ' + ret.conf.PORT + ' is in use!!!!!!!!!!!!!');
    } else {
        console.log(e.stack);
    }
});
