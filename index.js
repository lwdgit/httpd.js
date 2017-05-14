#!/usr/bin/env node

var ret = require('./httpd.js').run(...process.argv.slice(2));
process.on('uncaughtException', function(e) {
    console.log('\r\nError:');
    if (e.message.indexOf('EADDRINUSE') > -1) {
        console.log('Port ' + ret.conf.PORT + ' is in use!!!!!!!!!!!!!');
    } else {
        console.log(e.stack);
    }
});
