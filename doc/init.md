# 如何开发脚手架







# 1. 参考资料

[使用到的第三方组件](modules.md)



# 2. 环境搭建

在开发的过程中参考了[umi的脚手架](https://github.com/umijs/create-umi)。



## 2.1 创建工程目录

可以用`webstorm`创建一个空的`node`工程，主要是生成`package.json`。

或者建立一个目录，然后执行`cnpm init`，生成`package.json`文件。



## 2.2 搭建程序框架

先把菜单给搭建出来，然后编写代码。



### ① 创建程序入口

在根目录下创建下面两个文件

| 文件名   | 说明                                                  |
| -------- | ----------------------------------------------------- |
| index.js | 引用了`./lib/run`目录下的run文件。                    |
| cli.js   | 判断当前的node环境，如果没有问题，就进入到run的程序。 |
|          |                                                       |



### ② 创建lib目录

在根目录下建立一个`lib`目录，然后建立两个文件

| 文件名            | 说明                               |
| ----------------- | ---------------------------------- |
| run.js            | 引用了`./lib/run`目录下的run文件。 |
| BasicGenerator.js | 生成代码基类                       |
|                   |                                    |



### ③ 创建具体生成器

在`generators`下每创建一个目录，就会生成相应的代码。



| 文件名    | 说明                             |
| --------- | -------------------------------- |
| index.js  | 主程序，继承了 BasicGenerator.js |
| meta.json | 提示信息，写在这里               |
| templates | 模板目录，使用ejs的文件格式      |

例如：

判断配置文件是否存在，如果存在，那么报错，因为这个配置文件很重要，不能覆盖。

如果不存在，就从模板目录中复制一份。

```js
const chalk = require('chalk');
const BasicGenerator = require('../../BasicGenerator');


module.exports = class extends BasicGenerator {
    async initializing(){
        if(this.existConfigFile()){
            console.error(chalk.red(`> the file g-config.json is exists,you need to delete it manually `));
            process.exit(1);
        }
    }
    writing() {
        this.fs.copyTpl(
            this.templatePath('g-config.json'),
            this.destinationPath('g-config.json')
        );
    }
};

```



# 3. 调试

可以在`webstorm`之类的`idea`环境中直接调试。



## 3.1 菜单效果

如果想看菜单，那么在`idea`中效果不好，使用`link`后，直接使用命令来演示。

```shell
npm link
ant-g
```



## 3.2 Idea的Debug

通过idea的Debug工具来进行调试。





# 4.上传代码

①②③④⑤⑥⑦⑧⑨

[详细说明](https://github.com/fanhualei/donghai-cli/blob/master/docs/cli.md)

## ① 注册npm用户名

```
刚开始用一个189.cn的邮箱注册，注册成功了，但是npm发送的邮件确认地址收不到，所以就一直登录不了。
后来换成qq邮箱就可以了。
```



## ② 上传到npm服务器

```shell
# 先登录，需要输入用户名、密码、邮箱，建议使用qq.com邮箱，其他的邮箱不好用，见注册npm用户
npm login

# 进行发布,发不完后，可以去npm上看看发布的版本对不对。
npm publish
```



## ③ 下载实验一下

```
# 安装插件  必须时-g . 这个需要有人来测试一下。
$ npm install -g ant-g


```





