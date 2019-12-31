# koa-static-middle
A Static Middleware based on Koa
## installation
`$ npm install koa-static-middle`

## Api
```js
  const koa = require("koa");
  const app = new koa();
  const static = require("koa-static-middle");
  app.use(static(root,Opts));
  app.listen(80);
```
* `root`root directory string. this is `neccessary`！！！
* `opts`options Object

### Opts
* `maxAge`Browser cache max-age in milliseconds. defaults to 0
* `index`Default file name, defaults to 'index.html'
* `resHeader`Response header,defaults to '{}'

## Example
```js
  const koa = require("koa");
  const app = new koa();
  const static = require("koa-static-middle");
  //opts is {}
  app.use(static("./static"));

  //default file is index.txt
  app.use(static("./static",{index:"index.txt"}));

  //maxAge is 10
  app.use(static("./static"),{maxAge:10});

  //set resHeader,this is used by ctx.set()
  app.use(static("./static",{resHeader:{"Cache-Control":"public","ETag":123}}));

  //if opts.index is index.html, then http://127.0.0.1 will visit the path "./static/index.html"
  app.listen(80);
```
## License
`ISC`