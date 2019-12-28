# Cli for Ant Design Pro

希望通过数据库，来生成相关的代码。

- [x] 生成service脚本
- [x] 生成mock脚本
- [ ] 生成Page脚本
- [ ] 生成test脚本
- [ ] 自动修改路由与菜单



# 1. Install



```shell
npm i ant-g
# or
yarn add ant-g
```



# 2. Usage Example

输入`ant-g`，有下面的功能可以使用。

```shell
$ ant-g
? Select the boilerplate type (Use arrow keys)
> init            - Create g-config.json config file for generator.
  dependencies    - Add dependencies to the project
  service         - Create service and data.d from db .
  mock            - Create mock from db .
  exit            - exit the program

```



## 2.1 init

在根目录生成`g-config.josn` 代码，用来配置要生成的代码。

```json
{
  "public": {
    "apiBasePath": "/api/shop/"
  },
  "db": {
    "host": "192.168.1.179",
    "user": "root",
    "password": "rootmysql",
    "database": "phoenix",
    "port": 3306,
    "tablePrefix": "as_"
  },
  "mock": {
    "tableReg": "",
    "tables": ["actionLog" ]
  },
  "service": {
    "tableReg": "",
    "tables": ["actionLog" ]
  }
}
```

> public 

用来配置公用参数。

`apiBasePath`是API的接口



> db

用来配置数据库的连接方式。

`tablePrefix` 表的前缀，例如：`as_user_type` 会去掉前缀，并且转成驼峰`userType`



> service

配置数据库中的那些表，要生成service .

`tableReg` 可以使用模糊查询。

`tables` 明确指定要查询的表，这个优先级要高于`tableReg`



> mock

配置数据库中的那些表，要生成mock.



## 2.2 dependencies

将用到的组件与函数，复制到`components` 与`utils`的`Wk`目录下。 这些代码今后会简化开发。



## 2.3 service

生成`service`与`data.d` 代码，统一放在`src/service`目录下。



## 2.4 mock

生成`mock`代码，统一放在`mock`目录下。



## 2.5 exit

退出应用程序



# 3. FAQ





# 4. Others

