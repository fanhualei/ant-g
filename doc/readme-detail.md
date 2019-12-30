# Cli for Ant Design Pro

希望通过数据库，来生成相关的代码。

- [x] 生成service脚本
- [x] 生成mock脚本
- [ ] 生成Page脚本
- [ ] 生成test脚本
- [ ] 自动修改路由与菜单



# 1. Install



```shell
# 一定要 -g 不然运行不了
npm i -g ant-g
```



# 2. Usage Example

输入`ant-g`，有下面的功能可以使用。

```shell
$ ant-g
? Select the boilerplate type (Use arrow keys)
> init                      - Create g-config.json config file for generator.
  initDataStructure         - Create data structure file from database, this file save /.g dir .
  dependencies              - Add dependencies to the project
  service                   - Create service and data.d from db .
  mock                      - Create mock from db .
  pageConfig                - Create page config file for generator page
  pageGenerate              - Create page from config file.


```



## step1: Defining database structures

跟后端商量好了数据库的存储结构，并生成数据库。假设要生成的数据库如下:

```sql
CREATE DATABASE `phoenix`;

USE `phoenix`;


DROP TABLE IF EXISTS `as_action_log`;
CREATE TABLE `as_action_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `long_time` bigint(20) unsigned NOT NULL COMMENT '访问时间',
  `time` datetime DEFAULT NULL COMMENT '发生时间',
  `log_day` varchar(20) NOT NULL COMMENT '访问日期',
  `app_name` varchar(50) NOT NULL DEFAULT '' COMMENT '应用编码',
  `url` varchar(2000) DEFAULT NULL COMMENT 'url',
  `ip` varchar(50) NOT NULL COMMENT 'IP',
  `controller` varchar(50) NOT NULL DEFAULT '',
  `action` varchar(50) NOT NULL DEFAULT '',
  `method` varchar(50) NOT NULL DEFAULT '',
  `url_para` varchar(1000) DEFAULT '',
  `user` varchar(500) DEFAULT '',
  `user_agent` varchar(500) DEFAULT '',
  `refer` varchar(1000) DEFAULT '',
  `parameters` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1403 DEFAULT CHARSET=utf8 COMMENT='Action日志';



LOCK TABLES `as_action_log` WRITE;
UNLOCK TABLES;



DROP TABLE IF EXISTS `as_activity`;
CREATE TABLE `as_activity` (
  `activity_id` mediumint(9) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `activity_title` varchar(255) NOT NULL COMMENT '标题',
  `activity_type` enum('1','2') DEFAULT NULL COMMENT '活动类型 1:商品 2:团购',
  `activity_banner` varchar(255) NOT NULL COMMENT '活动横幅大图片',
  `activity_style` varchar(255) NOT NULL COMMENT '活动页面模板样式标识码',
  `activity_desc` varchar(1000) NOT NULL COMMENT '描述',
  `activity_start_date` datetime NOT NULL COMMENT '开始时间',
  `activity_end_date` datetime NOT NULL COMMENT '结束时间',
  `activity_sort` tinyint(2) unsigned NOT NULL DEFAULT '255' COMMENT '排序',
  `activity_state` tinyint(2) unsigned NOT NULL DEFAULT '1' COMMENT '活动状态 0为关闭 1为开启',
  PRIMARY KEY (`activity_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='活动表';

```



## step2:  exec init command

在根目录生成`g-config.josn` 代码，你需要配置相关的内容

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



## step3: exec initDataStructure command

这个命令会根据数据库的结构，生成这么`.g/dataStructure.json`。 后面的程序会利用这个文件来生成后续的脚本。

你可以根据自己的需要修改这个文件，重新执行`initDataStructure `会备份你修改的文件，并且根据数据库生成新的文件。



## step4 exec dependencies command

一些公用的组件与函数，复制到`components` 与`utils`的`Wk`目录下，简化今后开发。



## step5 exec service command

生成`service`与`data.d` 代码，统一放在`src/service`目录下。



## step6 exec mock command

生成`mock`代码，统一放在`mock`目录下。



## step7 exec pageConfig command

这个命令用来生成`pageConfig`文件，你可以修改这个文件的内容，因为后续的操作，会根据这个文件来生成相应的代码



## step8 exec pageGenrate command

输入`文件名`，可以根据这个文件名来生成相应的页面代码。



# 4. FAQ





# 5. Change Logs

* 对新生成的代码进行格式化

* 完善pageCofig 文件的自动生成

  

