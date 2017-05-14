(function () {
'use strict';

var template = function (list) {
    return "\n<!doctype html>\n<html>\n\n<head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html;charset=utf-8\"></meta>\n    <title>NodeJS Server</title>\n</head>\n\n<body>\n    <ul>\n        " + list + "\n    </ul>\n</body>\n    ";
};

var Conf = {
  LIST_DIR: true, // 是否显示目录
  CACHE: 'no-cache',
  DEFAULT_INDEX: ['index.html', 'index.htm'], // 默认首页索引
  // 以下设置无需配置
  WEB_ROOT: null,
  PORT: null,
  IP: null
};

var url$1 = require('url');

var _require = require('child_process');
var exec = _require.exec;

var Util = {
  isWin: /^win/i.test(process.platform),
  URI2Path: function URI2Path(uri) {
    uri = url$1.parse(uri).pathname.replace(/%20/g, ' ');
    var re = /(%[0-9A-Fa-f]{2}){3}/g;
    if (re.test(uri)) {
      // 能够正确显示中文，将三字节的字符转换为utf-8编码
      uri = uri.replace(re, function (word) {
        var buffer = new Buffer(3);
        var array = word.split('%');
        array.splice(0, 1);
        array.forEach(function (val, index) {
          buffer[index] = parseInt('0x' + val, 16);
        });
        return buffer.toString('utf8');
      });
    }
    return uri;
  },
  getIPAdress: function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
      var iface = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
    return '127.0.0.1'; // 如果没有找到IP，则返回127.0.0.1
  },
  proxy: function proxy(func, context) {
    return function () {
      return func.apply(context, arguments);
    };
  },
  open: function open(path, callback) {
    // console.log('browse ' + path + '\n');
    var cmd = path.replace(/"/g, '""');
    if (this.isWin) {
      cmd = 'start "" ' + cmd;
    } else {
      if (process.env['XDG_SESSION_COOKIE']) {
        cmd = 'xdg-open ' + cmd;
      } else if (process.env['GNOME_DESKTOP_SESSION_ID']) {
        cmd = 'gnome-open ' + cmd;
      } else {
        cmd = 'open ' + cmd;
      }
    }
    exec(cmd, callback);
  }
};

var Mime = {
  lookupExtension: function lookupExtension(ext, fallback) {
    return this.TYPES[ext.toLowerCase()] || fallback || 'text/plain';
  },

  TYPES: {
    '.3gp': 'video/3gpp',
    '.a': 'application/octet-stream',
    '.ai': 'application/postscript',
    '.aif': 'audio/x-aiff',
    '.aiff': 'audio/x-aiff',
    '.appcache': 'text/manifest',
    '.asc': 'application/pgp-signature',
    '.asf': 'video/x-ms-asf',
    '.asm': 'text/x-asm',
    '.asp': 'text/html',
    '.php': 'text/html',
    '.asx': 'video/x-ms-asf',
    '.atom': 'application/atom+xml',
    '.au': 'audio/basic',
    '.avi': 'video/x-msvideo',
    '.bat': 'application/x-msdownload',
    '.bin': 'application/octet-stream',
    '.bmp': 'image/bmp',
    '.bz2': 'application/x-bzip2',
    '.c': 'text/x-c',
    '.cab': 'application/vnd.ms-cab-compressed',
    '.cc': 'text/x-c',
    '.chm': 'application/vnd.ms-htmlhelp',
    '.class': 'application/octet-stream',
    '.com': 'application/x-msdownload',
    '.conf': 'text/plain',
    '.cpp': 'text/x-c',
    '.crt': 'application/x-x509-ca-cert',
    '.css': 'text/css',
    '.csv': 'text/csv',
    '.cxx': 'text/x-c',
    '.deb': 'application/x-debian-package',
    '.der': 'application/x-x509-ca-cert',
    '.diff': 'text/x-diff',
    '.djv': 'image/vnd.djvu',
    '.djvu': 'image/vnd.djvu',
    '.dll': 'application/x-msdownload',
    '.dmg': 'application/octet-stream',
    '.doc': 'application/msword',
    '.dot': 'application/msword',
    '.dtd': 'application/xml-dtd',
    '.dvi': 'application/x-dvi',
    '.ear': 'application/java-archive',
    '.eml': 'message/rfc822',
    '.eps': 'application/postscript',
    '.exe': 'application/x-msdownload',
    '.f': 'text/x-fortran',
    '.f77': 'text/x-fortran',
    '.f90': 'text/x-fortran',
    '.flv': 'video/x-flv',
    '.for': 'text/x-fortran',
    '.gem': 'application/octet-stream',
    '.gemspec': 'text/x-script.ruby',
    '.gif': 'image/gif',
    '.gz': 'application/x-gzip',
    '.h': 'text/x-c',
    '.hh': 'text/x-c',
    '.htm': 'text/html',
    '.html': 'text/html',
    '.ico': 'image/vnd.microsoft.icon',
    '.ics': 'text/calendar',
    '.ifb': 'text/calendar',
    '.iso': 'application/octet-stream',
    '.jar': 'application/java-archive',
    '.java': 'text/x-java-source',
    '.jnlp': 'application/x-java-jnlp-file',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'application/javascript;charset=utf-8',
    '.json': 'application/json',
    '.log': 'text/plain;charset=utf-8',
    '.m3u': 'audio/x-mpegurl',
    '.m4v': 'video/mp4',
    '.man': 'text/troff',
    '.manifest': 'text/cache-manifest',
    '.mathml': 'application/mathml+xml',
    '.mbox': 'application/mbox',
    '.mdoc': 'text/troff',
    '.me': 'text/troff',
    '.mid': 'audio/midi',
    '.midi': 'audio/midi',
    '.mime': 'message/rfc822',
    '.mml': 'application/mathml+xml',
    '.mng': 'video/x-mng',
    '.mov': 'video/quicktime',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.mp4v': 'video/mp4',
    '.mpeg': 'video/mpeg',
    '.mpg': 'video/mpeg',
    '.ms': 'text/troff',
    '.msi': 'application/x-msdownload',
    '.odp': 'application/vnd.oasis.opendocument.presentation',
    '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
    '.odt': 'application/vnd.oasis.opendocument.text',
    '.ogg': 'application/ogg',
    '.p': 'text/x-pascal',
    '.pas': 'text/x-pascal',
    '.pbm': 'image/x-portable-bitmap',
    '.pdf': 'application/pdf',
    '.pem': 'application/x-x509-ca-cert',
    '.pgm': 'image/x-portable-graymap',
    '.pgp': 'application/pgp-encrypted',
    '.pkg': 'application/octet-stream',
    '.pl': 'text/x-script.perl',
    '.pm': 'text/x-script.perl-module',
    '.png': 'image/png',
    '.pnm': 'image/x-portable-anymap',
    '.ppm': 'image/x-portable-pixmap',
    '.pps': 'application/vnd.ms-powerpoint',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.ps': 'application/postscript',
    '.psd': 'image/vnd.adobe.photoshop',
    '.py': 'text/x-script.python',
    '.qt': 'video/quicktime',
    '.ra': 'audio/x-pn-realaudio',
    '.rake': 'text/x-script.ruby',
    '.ram': 'audio/x-pn-realaudio',
    '.rar': 'application/x-rar-compressed',
    '.rb': 'text/x-script.ruby',
    '.rdf': 'application/rdf+xml',
    '.roff': 'text/troff',
    '.rpm': 'application/x-redhat-package-manager',
    '.rss': 'application/rss+xml',
    '.rtf': 'application/rtf',
    '.ru': 'text/x-script.ruby',
    '.s': 'text/x-asm',
    '.sgm': 'text/sgml',
    '.sgml': 'text/sgml',
    '.sh': 'application/x-sh',
    '.sig': 'application/pgp-signature',
    '.snd': 'audio/basic',
    '.so': 'application/octet-stream',
    '.svg': 'image/svg+xml',
    '.svgz': 'image/svg+xml',
    '.swf': 'application/x-shockwave-flash',
    '.t': 'text/troff',
    '.tar': 'application/x-tar',
    '.tbz': 'application/x-bzip-compressed-tar',
    '.tcl': 'application/x-tcl',
    '.tex': 'application/x-tex',
    '.texi': 'application/x-texinfo',
    '.texinfo': 'application/x-texinfo',
    '.text': 'text/plain',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
    '.torrent': 'application/x-bittorrent',
    '.tr': 'text/troff',
    '.txt': 'text/plain',
    '.vcf': 'text/x-vcard',
    '.vcs': 'text/x-vcalendar',
    '.vrml': 'model/vrml',
    '.war': 'application/java-archive',
    '.wav': 'audio/x-wav',
    '.wma': 'audio/x-ms-wma',
    '.wmv': 'video/x-ms-wmv',
    '.wmx': 'video/x-ms-wmx',
    '.wrl': 'model/vrml',
    '.wsdl': 'application/wsdl+xml',
    '.xbm': 'image/x-xbitmap',
    '.xhtml': 'application/xhtml+xml',
    '.xls': 'application/vnd.ms-excel',
    '.xml': 'application/xml',
    '.xpm': 'image/x-xpixmap',
    '.xsl': 'application/xml',
    '.xslt': 'application/xslt+xml',
    '.yaml': 'text/yaml',
    '.yml': 'text/yaml',
    '.zip': 'application/zip'
  }
};

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

var RequestHandle = function RequestHandle(request, response, conf) {
  this.conf = conf;
  this.request = request;
  this.response = response;
  this.uri = Util.URI2Path(request.url);
  this.url = url.parse(request.url);
  this.filename = path.join(this.conf.WEB_ROOT, this.uri);
  this.handle(this.filename, this.conf.EXTEND_EXT);
};

RequestHandle.prototype = {
  constructor: RequestHandle,
  handle: function handle(pathname, ext) {
    this.filename = pathname;
    if (pathname === __filename) {
      // 禁止查看自己
      this.goTo403();
      return;
    }

    fs.lstat(pathname, function (err, stat) {
      if (err) {
        if (!ext) {
          this.goTo404();
        } else {
          this.handle(path.join(pathname, ext));
        }
      } else {
        if (stat.isDirectory()) {
          var lastChar = this.uri.slice(-1);
          if (!(lastChar === '/' || lastChar === '\\')) {
            // 自动修正网址
            var rUrl = this.url.pathname + '/';
            if (this.url.search) rUrl += this.url.search;
            this.goTo301(rUrl);
            return;
          }

          this.searchDefaultIndex(pathname, this.conf.DEFAULT_INDEX.slice(0));
        } else {
          this.readFile();
        }
      }
    }.bind(this));
  },
  listDirectory: function listDirectory(parentDirectory, res) {
    if (!this.conf.LIST_DIR) {
      this.goTo403();
      return;
    }
    fs.readdir(parentDirectory, function (error, files) {
      if (error) {
        this.goToError(500, 'Readdir error!');
        return;
      }
      var body = this.showDirectory(parentDirectory, files);
      res.writeHead(200, {
        'Content-Type': 'text/html;charset=utf-8',
        'Content-Length': Buffer.byteLength(body, 'utf8'),
        'Server': 'NodeJS ' + process.version
      });
      res.write(body, 'utf8');
      res.end();
    }.bind(this));
  },
  searchDefaultIndex: function searchDefaultIndex(basedir, files) {
    // 遍历默认首页
    var file = files.shift();
    if (!file) {
      this.listDirectory(basedir, this.response);
      return;
    }
    this.filename = path.join(basedir, file);
    fs.exists(this.filename, function (exists) {
      if (exists) {
        this.readFile();
      } else {
        this.searchDefaultIndex(basedir, files);
      }
    }.bind(this));
  },
  showDirectory: function showDirectory(parent, files) {
    var res = [];
    res.push('<li><a href="../"><strong>../</strong></a></li>');
    files.forEach(function (val) {
      var stat;try {
        stat = fs.statSync(path.join(parent, val));
      } catch (e) {
        return;
      }
      if (stat.isDirectory(val)) {
        val = path.basename(val) + '/';
        res.push('<li><a href="' + val + '"><strong>' + val + '</strong></a></li>');
      } else {
        val = path.basename(val);
        res.push('<li><a href="' + val + '">' + val + '</a></li>');
      }
    });
    res.push('</ul>');

    return template(res.join(''));
  },
  readFile: function readFile() {
    // 读取文件
    var mime;
    fs.readFile(this.filename, function (err, content) {
      if (err) {
        this.response.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        this.response.end(err + '\n');
        return;
      }
      this.response.writeHead(200, {
        'Content-Type': mime = Mime.lookupExtension(path.extname(this.filename)),
        'Cache-Control': this.conf.CACHE || this.request.headers['cache-control'] || 'no-cache'
      });
      if (module.exports.middleHandle) {
        content = module.exports.middleHandle(content, {
          request: this.request,
          response: this.response,
          mime: mime,
          conf: this.Conf
        });
      }
      this.response.end(content);
    }.bind(this));
  },
  goToError: function goToError(num, text) {
    this.response.writeHead(num, {
      'Content-Type': 'text/plain'
    });
    this.response.end(text + '\n');
  },
  goTo301: function goTo301(path) {
    this.response.writeHead(301, {
      Location: path
    });
    this.response.end();
  },
  goTo403: function goTo403() {
    this.response.writeHead(403, {
      'Content-Type': 'text/plain'
    });
    this.response.end('403 Forbidden\n');
  },
  goTo404: function goTo404() {
    this.response.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    this.response.end('404 Not Found\n');
  }
};

var Server = function Server() {
  this.instance = null;
  this.conf = Object.create(Conf);
};

Server.prototype = {
  constructor: Server,
  createServer: function createServer() {
    this.instance = http.createServer(Util.proxy(function (request, response) {
      if (module.exports.preHandle) {
        var ret = module.exports.preHandle(request, response);
        if (ret === false) return;
      }
      this._request = new RequestHandle(request, response, this.conf);
    }, this));

    this.instance.listen(this.conf.PORT);
  },
  initConf: function initConf(port, webroot, conf) {
    port = +port || 80;
    webroot = webroot || '';
    conf = conf || {};

    this.conf.IP = conf.ip || '127.0.0.1';
    this.conf.WEB_ROOT = path.resolve(webroot);
    this.conf.PORT = port || 80;
  },
  startBrowser: function startBrowser() {
    setTimeout(function () {
      Util.open('http://127.0.0.1' + (~~this.conf.PORT === 80 ? '/' : ':' + this.conf.PORT + '/'), function (err) {
        if (err) {
          console.log(err);
          process.exit();
        }
      });
    }.bind(this), 2000);
  },
  init: function init(port, webroot, conf) {
    this.initConf(port, webroot, conf);
    this.createServer();
    if (conf.autoOpenBrowser !== false) {
      this.startBrowser();
    }

    console.log('Server running at http://' + this.conf.IP + (~~this.conf.PORT === 80 ? '' : ':' + this.conf.PORT) + '/');
    console.log('The webroot is: ' + this.conf.WEB_ROOT);
    return this;
  },
  start: function start() {
    for (var _len = arguments.length, argv = Array(_len), _key = 0; _key < _len; _key++) {
      argv[_key] = arguments[_key];
    }

    // 参数示例：
    // node http.js 800 ./dist
    // node http ./dist
    // node http 8080
    // node http
    var port, webroot;
    argv = argv.length ? argv : process.argv.slice(2);
    if (parseInt(argv[0], 10) == argv[0]) {
      // eslint-disable-line
      port = argv[0];
      webroot = argv[1];
    } else {
      port = 80;
      webroot = argv[0];
    }

    return this.init(port, webroot, {
      autoOpenBrowser: !!argv[2], // 是否自动打开浏览器
      workingDir: __dirname // 工作目录
    });
  }
};

module.exports = {
  Server: Server,
  run: function run() {
    var _ref;

    return (_ref = new Server()).start.apply(_ref, arguments);
  },
  preHandle: null,
  middleHandle: null
};

if (process.mainModule && process.mainModule.filename === __filename) {
  // 如果通过命令行直接启动，则执行start
  new Server().start();
}

}());
