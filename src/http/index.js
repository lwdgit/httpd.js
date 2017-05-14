import Server from './server.js'

module.exports = {
  Server: Server,
  run: function (...args) {
    return new Server().start(...args)
  },
  preHandle: null,
  middleHandle: null
}

if (process.mainModule && process.mainModule.filename === __filename) { // 如果通过命令行直接启动，则执行start
  new Server().start()
}
