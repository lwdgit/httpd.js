const path = require('path')
const fs = require('fs')
import conf from './conf'

var Api = module.exports = {
  resolve: function (filepath) {
    if (/^[\\/]/.test(filepath)) {
      return path.join(conf.WEB_ROOT, filepath)
    } else {
      return path.join(__dirname, filepath)
    }
  },
  read: function (file) {
        // console.log(__filename);
    return fs.readFileSync(this.resolve(file))
  },
  write: function (file, content) {
    var type = Object.prototype.toString.call(content)
    if (type === '[object Object]' || type === '[object Array]') {
      content = JSON.stringify(content)
    } else if (type === '[object Function]') {
      content = content.toString()
    }
    return fs.writeFileSync(this.resolve(file), content)
  },
  parse: function (content) {
    return require('querystring').parse(content)
  },
  end: function (data) {

  }
}
Object.defineProperty(global, 'TH', {// 定义全局变量TH,并设置为只读，防止误修改
  enumerable: true,
  writable: false,
  value: Api
})
