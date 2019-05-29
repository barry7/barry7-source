# 简单的服务端渲染
项目地址:<https://github.com/barry7/learnSSR/tree/server-side-render-withoutAjax-dev>
## package.json

查看`package.json`可以发现，
当我们执行`npm run build`时，其实是执行了
`webpack --config webpack.client.conf.js && webpack --config webpack.server.conf.js`
那么我们去查看这几个`conf.js`。

## conf.js

### webpack.client.conf.js

一开始引入了`webpack-merge`，和`webpack.base.conf.js`进行了混入，
并且使用`html-webpack-plugin`生成html模板。  
查看`webpack.base.conf.js`，其中指定了一些路径和模块。  
入口文件为`./entry-client.js`，其中代码只有三行
```javascript
const createApp = require('./main.js');
const app = createApp();
app.$mount('#app');
```
从`main.js`中导入一个工厂函数，然后将生成的VUE实例挂载到`div#app`上。
查看`main.js`。
```javascript
const Vue = require('vue');
const App = require('./App.vue').default;
function createApp() {
    const app = new Vue({
        render: h => h(App)
    });
    return app;
};
module.exports = createApp;
```
简单来说就是引入了一个Vue组件`App.vue`，也就是`Foo.vue`和`Bar.vue`的根组件。
然后导出一个创建Vue实例的工厂函数。
### webpack.server.conf.js

类似`client`。但其中有些设置需要注意：
 - `target: 'node'`：指定 Node 环境，避免非 Node 环境特定 API 报错，如 document 等；
 - `filename: '[name].js'`：因为服务器是 Node，所以必须按照 commonjs 规范打包才能被服务器调用。

入口文件为`./entry-server.js`，其中代码只有三行
```javascript
const createApp = require('./main.js');
module.exports = createApp;
```
和上面客户端渲染的文件类似，只是不需要挂载了，这是因为服务端渲染的内容会挂载到HTML文件中
`<!--vue-ssr-outlet-->`注释处。

至此，打包完成。


## server.js

执行`npm run`，其实是执行了`node server.js`。

查看`server.js`，
首先引入需要的模块，比如`fs`、`path`、还有用作服务器的`express`等。

分别启动两个服务器，`server`、`feServer`
 - `server`：首先实例化一个`renderer`，并且使用`dist/index.ssr.html`作为`template`，
 当请求进入的时候，使用工厂函数实例化一个`app`，
 使用`renderer`的`renderToString`方法将`app`转为HTML字符串传回。
 最后监听`8002`端口  
    - 我们可以看下`dist/index.ssr.html`的结构：
    ````html
       <!DOCTYPE html>
       <html lang="en">
       
       <head>
           <meta charset="UTF-8">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <meta http-equiv="X-UA-Compatible" content="ie=edge">
           <title>服务端渲染</title>
       </head>
       
       <body>
       <div id="app">
           <!--vue-ssr-outlet-->
       </div>
       <script type="text/javascript" src="client.js"></script>
       </body>
       
       </html>
    ````
    其中注释部分就是`app`转换为字符串插入的地方，并且最后引入了`client.js`。
  - `feServer`：`feServer`就相对简单一些了，当请求进入的时候，直接返回相应的HTML即可。
    - 我们也看下`dist/index.html`的代码：
    ````html
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>浏览器渲染</title>
        </head>
        
        <body>
        <div id="app">
            <app></app>
        </div>
        <script type="text/javascript" src="client.js"></script></body>
        
        </html>
    ````
    其中只有一个id为`app`的div，是一会`client.js`中VUE实例挂载的位置。

 ##查看结果
最后使用浏览器打开[localhost:8002/index](http://localhost:8002/index)查看SSR的效果，或者打开
[localhost:8003/index](http://localhost:8003/index)查看普通客户端渲染的效果。  

<div align="center">
<img src="./assets/SSR.jpg">  
</div>
  
看到` data-server-rendered="true"`就知道是服务器渲染的DIV了。

## 性能对比

### 客户端渲染
<div align="center">
<img src="./assets/client-performance.jpg">  
</div>

客户端渲染的`First Paint`时间是靠后的，
他需要等待js下载完成，才可以实例化Vue对象，然后执行完Vue的生命周期才可以渲染。

### 服务端渲染
<div align="center">
<img src="./assets/ssr-performance.jpg">  
</div>

可以看到，服务端渲染的`First Paint`时间是远远快于客户端渲染的，
这是因为他不需要等待js下载就可以渲染。
