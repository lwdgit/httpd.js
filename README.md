# httpd.js

> 极简http静态服务器，就只有一个文件: [httpd.js](https://unpkg.com/httpd.js)。

## 全局使用
   
> npm install httpd.js -g

> httpd.js 8080

> httpd.js 8080 ./webroot
   
> 参数说明：
   httpd.js 端口号 目录 是否自动启动浏览器(1或0)

## unpkg
  
 > wget https://unpkg.com/httpd.js
 
 > node httpd.js

## 模块使用

```javascript
   require('httpd.js').run(8080);
   // 或
   require('httpd.js').run(8080, './webroot', {
         ip: '127.0.0.1',//可以省略
         autoOpenBrowser: true //可以省略
   });
```

