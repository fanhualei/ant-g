# 使用的第三方模块



| 模块名           | 说明                                 |
| ---------------- | ------------------------------------ |
| yargs-parser     | 解析命令行参数                       |
| semver           | 版本语义分析组件                     |
| fs               | 文件系统组件                         |
| path             | NodeJS的path库                       |
| chalk            | 用来控制console.log输出的颜色        |
| mkdirp           | 能够生成创建文件夹中间所有层级       |
| inquirer         | 交互式命令行工具                     |
| clipboardy       | 访问系统的黏贴板                     |
| yeoman-generator | 一个脚手架生成工具                   |
| glob             | 使用 *等符号，来写一个规则，匹配文件 |
| debug            |                                      |
|                  |                                      |
|                  |                                      |



# 1 第三方库



## 1.1 yargs-parser

- [npm地址](https://www.npmjs.com/package/yargs-parser)
- [github地址](https://github.com/yargs/yargs-parser#readme)

```shell
npm i yargs-parser --save
```



```js
var argv = require('yargs-parser')(process.argv.slice(2))
console.log(argv)
```



```shell
node example.js --foo=33 --bar hello
{ _: [], foo: 33, bar: 'hello' }
```

*or parse a string!*

```js
var argv = require('yargs-parser')('--foo=99 --bar=33')console.log(argv)

```

```
{ _: [], foo: 99, bar: 33 }
```

Convert an array of mixed types before passing to `yargs-parser`:

```js
// <-- array to string
var parse = require('yargs-parser')parse(['-f', 11, '--zoom', 55].join(' '))   
// <-- array of strings
parse(['-f', 11, '--zoom', 55].map(String)) 

```



##  1.2 semver

[npm地址](https://www.npmjs.com/package/semver)

使用方法，可以分析判断版本

```js
const semver = require('semver')
 
semver.valid('1.2.3') // '1.2.3'
semver.valid('a.b.c') // null
semver.clean('  =v1.2.3   ') // '1.2.3'
semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3') // true
semver.gt('1.2.3', '9.8.7') // false
semver.lt('1.2.3', '9.8.7') // true
semver.minVersion('>=1.0.0') // '1.0.0'
semver.valid(semver.coerce('v2')) // '2.0.0'
semver.valid(semver.coerce('42.6.7.9.3-alpha')) // '42.6.7'
```





## 1.3 chalk 

[npm地址](https://www.npmjs.com/package/chalk)

```js
npm install chalk
const chalk = require('chalk');
console.log(chalk.blue('Hello world!'));
```



## 1.4 mkdirp

能够生成创建文件夹中间所有层级

```js
var mkdirp = require("mkdirp");
mkdirp('/a/b/c/d', function (err) {
    if (err) console.error(err)
    else console.log('pow!')
});
```



## 1.5 Inquirer

[NodeJs交互式命令行工具Inquirer.js](https://www.jianshu.com/p/db8294cfa2f7)

它是非常容易去处理以下几种事情的：

- 提供错误回调
- 询问操作者问题
- 获取并解析用户输入
- 检测用户回答是否合法
- 管理多层级的提示

> *note: Inquirer.js仅仅给用户提供了一个漂亮的界面和提出问题流的方式。假如说你正在寻找的是完全成熟的命令行调试程序，那么我推荐你去看看[commander](https://link.jianshu.com/?t=https://github.com/visionmedia/commander.js)， [vorpal](https://link.jianshu.com/?t=https://github.com/dthree/vorpal)，[args](https://link.jianshu.com/?t=https://github.com/leo/args)。*



## 1.6 clipboardy

Access the system clipboard (copy/paste)

```js
const clipboardy = require('clipboardy');
clipboardy.writeSync('🦄');
clipboardy.readSync();
//=> '🦄'
```



## 1.7 yeoman-generator

- [使用 yeoman-generator 生成脚手架](https://hateonion.me/posts/18dec17/)
- [官方网站](https://yeoman.io/authoring/)



### ① 执行顺序

```
initializing -- 初始化方法（检查状态、获取配置等）
prompting -- 获取用户交互数据（this.prompt()）
configuring -- 编辑和配置项目的配置文件
default -- 如果generator内部还有不符合任意一个任务队列任务名的方法，将会被放在default这个任务下进行运行
writing -- 填充预置模板
conflicts -- 处理冲突（仅限内部使用）
install -- 进行依赖的安装（eg：npm，bower）
end -- 最后调用，做一些clean工作
```



###  ② 拷贝文件

`yeoman`提供了[copyTpl](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fsboudrias%2Fmem-fs-editor%23copytplfrom-to-context-templateoptions--copyoptions)方法来完成模板的拷贝，`copyTpl`方法在`this.fs`下且默认使用`ejs`语法。

```js
class extends Generator {
  writing() {
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(this.name)
    );
  }
}
```



### ejs模板文件

https://ejs.bootcss.com/

```
<%=fields[i].camelColumnName%>: <%=fields[i].jsType%>; // <%=fields[i].columnComment%>
```

```
<%=fields[i].isNullable?'?':''%>
```

## 1.8 mysql

下面模拟实际情况

### ① 建立数据库

使用dock来建立

```dockerfile
version: '3'
services:
  #mysql
  mysql:
    hostname: mysql
    image: mysql:5.7
    restart: always
    ports: 
      - 3306:3306
    volumes:
      - ${DATA_PATH}/mysql/conf:/etc/mysql/conf.d
      - ${DATA_PATH}/mysql/data:/var/lib/mysql
      #初始化脚本
      - ./mysql/initdb/init.sql:/docker-entrypoint-initdb.d/init.sql
      - /etc/localtime:/etc/localtime:ro
    environment:
      MYSQL_ROOT_PASSWORD: rootmysql
```

```shell
docker-compose up -d
docker-compose exec  mysql  mysql -uroot -prootmysql
use phoenix;
show tables;
```

如果发现表都建立了，那么就192.168.1.179来连接数据库



如何出现什么错误可以关闭防火墙： 我是在本机测试的，所以没有关闭防火墙。

```
systemctl stop firewalld
firewall-cmd --state
```





### ② 开发程序

安装[mysql插件ali-rds](https://github.com/ali-sdk/ali-rds)

```shell
npm install ali-rds
```









①②③④⑤⑥⑦⑧⑨



## 2 系统函数



## 2.1 fs

文件管理组件

[Node.js之fs用法详解](https://www.jianshu.com/p/26a6b6266dd9)



## 2.2 path

使用了NodeJS的path组件。

- [path组件npm地址](https://www.npmjs.com/package/path)
- [Node.js Path 模块](https://www.runoob.com/nodejs/nodejs-path-module.html)

**path.join([path1][, path2][, ...])**
用于连接路径。该方法的主要用途在于，会正确使用当前系统的路径分隔符，Unix系统是"/"，Windows系统是"\"。







## 2.3 process

`process`对象是一个全局对象，他提供当前Node.js进程相关的有关信息，以及控制当前Nodejs进程，因为是全局变量，所以不需要`require`

- [node之process模块](https://www.jianshu.com/p/56b9cb8ac2ea)
- [Node.js v12.14.0 文档](http://nodejs.cn/api/process.html)

```js
cwd = process.cwd()

if (process.platform !== `linux` || process.env.DISPLAY) {
    
process.send && process.send({ type: 'prompt' });
process.emit('message', { type: 'prompt' });

process.exit(1);
```

> process.cwd()

`process.cwd()`方法返回nodejs进程当前工作



> process.platform

process.platform属性返回字符串，标识Node.js进程运行其上的操作系统平台。



> process.env

`process.env`属性返回一个包含用户环境信息的对象

在process.env中新增一个属性，会将属性值转换成字符串



> process.send(message[,sendHandle[,option]],callback])

如果node进程是通过IPC通信产生的，那么process.send()可以与父进程通信，发送消息



例子,一个经典的事件监听触发，进程通信例子：

master.js

```js
var childprocess = require('child_process');
var worker = childprocess.fork('./worker.js');

console.log('pid in master:', process.pid);

//监听事件
worker.on('message', function(msg) {
  console.log('1:', msg);
})
process.on('message', function(msg) {
  console.log('2:', msg);
})

worker.send('---');

//触发事件 message
process.emit('message', '------');
```

worker.js

```js
console.log('pid in worker:', process.pid);

process.on('message', function(msg) {
  console.log('3:', msg);
});

process.send('===');
process.emit('message', '======');
```

```shell
$ node master.js


pid in master: 22229      // 主进程创建后打印其 pid
2: ------                 // 主进程收到给自己发的消息
pid in worker: 22230      // 子进程创建后打印其 pid
3: ======                 // 子进程收到给自己发的消息 
1: ===                    // 主进程收到来自子进程的消息
3: ---                    // 子进程收到来自主进程的消息
```

[上述例子参考资料](https://blog.csdn.net/tanglitong/article/details/78739491)

其中有两个有趣的点：

在主进程中，使用 worker.on(‘message’, …) 监听来自子进程的消息，使用 process.on(‘message’, …) 监听给自己发的消息。但是在子进程中，只有 process.on(‘message’, …) 一种消息监听方式，无法区分消息来源。

如果有给自己发消息的情况，则必须将对应的消息监听的代码放在消息发送代码前面，否则无法监听到该消息发送。例如将 master.js 的最后一行代码 process.emit(‘message’, ‘——‘); 放置到该文件第一行，则运行结果不会输出 2: ——。

如果不能控制消息监听代码和消息发送代码的先后顺序，可将给自己发送消息的代码改写为 setImmediate(process.emit.bind(process, ‘message’, {{message}}));



## 2.4 glob

node的glob模块允许你使用 *等符号, 来写一个glob规则,像在shell里一样,获取匹配对应规则的文件.

[glob简介](https://www.jianshu.com/p/82f53bbcd56d)

```js
//*:匹配路径中某部分:0个或多个字符
glob("js/*.js",function (er, files) {
    console.log(files)
})
```





## 2.5 debug

- [开始学nodejs —— 调试篇](https://www.cnblogs.com/tzyy/p/5028348.html)

```
#在linux中启动：
DEBUG=mydebug:* node app.js
#在windows中启动
set DEBUG=mydebug:* & node app.js
```



```js
var debug=require("debug")("mydebug:http"),
    work=require("./work"),
    http=require("http");
http.createServer(function(req,res){
    debug(req.method + ' ' + req.url);
    res.end('hello\n');
}).listen(3000,function(){
    debug("listening");
});
```





# 3 参考文章



* [Node中国](http://nodejs.cn/)
* [js菜鸟](https://www.runoob.com/js/js-tutorial.html)

