# 关于表设计



# 1. 字段备注规范

可以将一些信息写入`MySql`的备注，这样就更方便的生成界面上的信息。使用`^`进行分割。

例如：`活动类型^^1:商品 2:团购`

| 顺序 | 字段  | 说明                                              |
| ---- | ----- | ------------------------------------------------- |
| 1    | title | 用于显示的标题，如果为空，那么就已fieldName来命名 |
| 2    | extra | 用于显示的提示信息                                |
| 3    | tips  | 用来给程序员看的，不显示出来                      |
| 4    | type  | 可以在edit页面中用那个控件来显示                  |
| 5    | rules | 校验规则，规则需要特殊定义                        |
| 6    |       | 扩展内容，现在还没有想好定义那些内容。            |









# 6. 其他



## 6.1 备注长度

尽量不要保存过长的备注，这里实验了一下，保存一个300的字符串是没有问题的。

```
一二三四五六七八九十0一二三四五六七八九十1一二三四五六七八九十3一二三四五六七八九十4一二三四五六七八九十5一二三四五六七八九十6一二三四五六七八九十7一二三四五六七八九十8一二三四五六七八九十9一二三四五六七八九十10一二三四五六七八九十0一二三四五六七八九十1一二三四五六七八九十3一二三四五六七八九十4一二三四五六七八九十5一二三四五六七八九十6一二三四五六七八九十7一二三四五六七八九十8一二三四五六七八九十9一二三四五六七八九十10一二三四五六七八九十0一二三四五六七八九十1一二三四五六七八九十3一二三四五六七八九十4一二三四五六七八九十5一二三四五六七八九十6一二三四五六七八九十7一二三四五六七八九十8一二三四五六七八九十9一二三四五六七八九十10
```



## 6.2 SQL样例



```sql
create table as_activity
(
    activity_id         mediumint auto_increment comment '活动编号' primary key,
    activity_title      varchar(255)                    not null comment '活动标题',
    activity_type       enum ('1', '2')                 null comment '活动类型^^1:商品 2:团购',
    activity_banner     varchar(255)                    not null comment '活动图片^^活动横幅大图片',
    activity_style      varchar(255)                    not null comment '活动模板^^活动页面模板样式标识码',
    activity_desc       varchar(1000)                   not null comment '活动描述',
    activity_start_date datetime                        not null comment '开始时间',
    activity_end_date   datetime                        not null comment '结束时间',
    activity_sort       tinyint(2) unsigned default 255 not null comment '排序',
    activity_state      tinyint(2) unsigned default 1   not null comment '活动状态^活动关闭后，在前台不显示。^0为关闭 1为开启'
)
    comment '活动' engine = InnoDB;
```

