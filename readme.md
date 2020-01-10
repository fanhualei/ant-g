# Cli for Ant Design Pro

Generate `service`   `mock`   ` page` according to the table of the database

- [x] generate service
- [x] generate  mock
- [x] generate  Page
- [x] auto modify menu and route
- [ ] generate   test


# 1. Install

```shell
npm i -g ant-g
```



# 2. Usage Example



## 2.1 Create Ant Design Pro

Create a new empty folder as project root. Execute command in the folder:

```shell
npm create umi
```

[*must select TypeScripte*](https://pro.ant.design/docs/getting-started) 



## 2.2 Use Ant-g

Execute command in the folder: `ant-g`

```shell
$ ant-g
? Select the boilerplate type (Use arrow keys)
> init                      - Create g-config.json config file for generator
  initDataStructure         - Create data structure file from database, this file save /.g
  dependencies              - Add dependencies to the project
  service                   - Create service and data.d from db
  mock                      - Create mock from db
  pageConfig                - Create page config file for generator page
  pageGenerate              - Create page from config file


```

[detail  manual-cn](doc/manual-cn.md)

# 3. FAQ



## 3.1 mysql connect



### 08004 error

error message

```
Client does not support authentication protocol requested by server; consider upgrading MySQL client
```



The reason is that the initial password of the database is not configured. Execute the following command on the MySQL command line:

```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your password';
SELECT plugin FROM mysql.user WHERE User = 'root';
```









# 4. Change Logs


## 0.9.9

`2020-01-16`

* simple page template
    * ⚡ Promote  display and edit form by data type.
    



## 0.9.8

`2020-01-10`
* 🐞 fix searchForm.less missed bug.


## 0.9.7

`2020-01-10`
* ⚡ Added the function of configuring MySQL
* ⚡ Added shortcut command


## 0.9.6

`2020-01-02`
* ⚡ Add prettier module to prettier the code
* ⚡ Add generate page's code 

  

