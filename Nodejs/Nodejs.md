# Node.js

## Node.js介绍

### 是什么

- 运行JavaScript的一个运行时环境

- 事件驱动，非阻塞IO模型（异步），轻量和高效

- npm是世界上最大的开源库生态系统，绝大多数JavaScript相关的包都存放在npm上，这样能够让开发人员更方便的去下载使用包。

    - npm install jquery

- Node.js中的JavaScript

    - 没有BOM，DOM

    - Ecmascript

    - 在Node这个JavaScript执行环境中为JavaScript提供了一些服务器级别的操作API

        - 文件读写

        - 网络服务的构建

        - 网络通信

        - http 服务器

            ...

### 能做什么

- Web服务器后台（类似于Java服务器后台）
- 命令行工具

### 预备知识

- HTML
- CSS
- JavaScript
- 简单命令操作
- 具备服务端开发经验

### 一些资源

- 《《深入浅出Node.js》》
    - 纯理论
- 《《Node.js权威指南》》
    - API讲解
- 官方API文档：https://nodejs.org/dist/latest-v17.x/docs/api/

## 安装Node环境执行Hello World程序

- 安装：https://nodejs.org/en/download/
- 确认是否安装成功：node -v
- 环境变量

## HelloWorld程序

- 新建一个文件HelloWorld.js

    ```javascript
    var obj = 'Hello World'
    console.log(obj)
    ```

    

- 运行文件：node HelloWorld.js

- **文件名不要以node.js命名**

## 读取文件

```javascript
var fs = require('fs')
fs.readFile('xxx.txt', function(error, data){
    console.log(data.toString())
})
```

## Http模块

- 作为一个服务

- ```javascript
    var http = require('http')
    
    var server = http.createServer()
    server.on('request', function(){
        console.log('Receive client request')
    })
    server.listen(3000, function(){
        console.log('Server startup successfully.')
    })
    ```

- 

![](./resource/introduction/http_module.png)



```javascript
var http = require('http')
var server = http.createServer()
server.on('request', function(req, res){
    console.log('Request url is' + req.url)

    // res.write('hello')
    // res.write('world')
    // res.end()
    //res.end('Hello World')
    var url = req.url

    if(url == '/')
    {
        res.end('index page')
    }
    else if(url == '/login')
    {
        var products =[
            {
                name: 'apple',
                price: 1
            },
            {
                name: 'banana',
                price: 2
            },
            {
                name: 'mango',
                price: 3
            }
        ]
        res.end(JSON.stringify(products))
    }
    else
    {
        res.setHeader('Content-Type', 'text/plain;charset=utf-8') //设置response内容相应格式为文本类型，编码为utf-8
        res.end('404 Not Found.')
    }
    

})
server.listen(3000, function(){
    console.log('Server startup successfully')
})
```

## Node中的JavaScript

- EcmaScript

    - 没有DOM和BOM

- 核心模块

    - 文件操作：fs
    - http服务：http
    - path：路径操作模块
    - os：操作系统信息模块
    - https://nodejs.org/en/docs/

- 第三方模块 

- 用户自定义模块

    - require用来加载模块的

    - require还可以加载自己编写的模块

    - ```javascript
        require('./b.js') //加载自定义的b.js
        ```

    - Node中没有全局的作用域，只有模块作用域（**默认是文件隔离**），在其他文件中定义一样的变量名进行覆盖不管用，只会识别当前文件中的变量。

    - **exports**可以用来访问其他文件的内容，**导出对象，进而访问对象中的方法和属性**

        - a.js文件

        ```javascript
         var b = require('./b.js')
         console.log(b.foo)
         console.log(b.add(1,2))
        ```

        - b.js文件

        ```javascript
        exports.foo = 'BBB'
        exports.add = function(x, y){
            return x + y
        }
        ```

        

## Node中的模块系统





## Nodejs代码风格

https://standardjs.com/rules.html

- 当代码中采用无分号风格的时候，需要注意一下几个问题

    - 代码如果以下面几3个字符的时候，需要在符号前加分号

    - ```
        (]`
        ```

        ```javascript
        function say() {
          console.log('hello world')
        }
        
        say();
        
        (function() {
           console.log('hello')
         })
        
        ```

        

