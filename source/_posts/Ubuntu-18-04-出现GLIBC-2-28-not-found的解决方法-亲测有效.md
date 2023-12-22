---
title: Ubuntu 18.04 出现GLIBC_2.28 not found的解决方法(亲测有效)
date: 2023-11-21 18:34:43
categories: Ubuntu
tags:  
     - "日常小BUG"
     - "Linux学习"
---
## Ubuntu 18.04 出现GLIBC\_2.28 not found的解决方法(亲测有效)

##### 环境

```auto
# uname -a
Linux Ubuntu 5.4.0-144-generic #161~18.04.1-Ubuntu SMP Fri Feb 10 15:55:22 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
```

##### 分析原因

glibc是linux底层的API库。通常情况下，有些环境需要glibc更高的版本才支持，比如`GLIBC_2.28`。

另外对它操作升级，可能有导致系统崩溃的风险。

##### 经验与教训

使用`GLIBC_xxx`的源码包编译升级的惨案:

+   提醒：在其他博客教程上，有些网友(我也不另外,后面可拯救回来)就按照教程并使用`GLIBC_xxx`的源码包并去升级，结果往往是系统崩溃而告终。
    
+   glibc库对linux系统非常重要，轻易不要更换。如果需要更换，需提前备份好原本的相关库以防万一。
    
+   若在使用源码包去升级之后出现`segmentation fault`,命令无法使用的情况。
    
+   解决方法：  
    若安装失败，可能导致各指令出错，除了cd、pwd基本都不可使用，这时候千万不要关闭窗口(如果关闭将导致将无法打开，只能重装系统)，比如安装libc-2.28.so出错了，需拯救系统。可尝试输入其中一条
    

```auto
export LD_PRELOAD=/lib64/librt-2.XX.so
export LD_PRELOAD=/lib64/libm-2.XX.so
export LD_PRELOAD=/lib64/libpthread-2.XX.so
export LD_PRELOAD=/lib64/libc-2.XX.so
export LD_PRELOAD=/lib/x86_64-linux-gnu/libc-2.XX.so
```

(XX指原本的版本，看文件夹有哪个就试一下)，然后ls这些指令就可以用了，再使用ln -s把以前的库链接回来。

```auto
cd /lib/x86_64-linux-gnu
ll     # 文件详细信息

ln -sf libc-2.27.so libc.so.6   # libc-2.27.so是原有版本
rm  libc-2.28.so     #删除
```

##### 软件包升级`GLIBC_2.28`

`1` 查看服务器当前版本，命令如下：

```auto
strings /lib/x86_64-linux-gnu/libc.so.6 | grep GLIBC_
```

返回的结果如下：

```auto
GLIBC_2.2.5
GLIBC_2.2.6
GLIBC_2.3
GLIBC_2.3.2
GLIBC_2.3.3
GLIBC_2.3.4
GLIBC_2.4
GLIBC_2.5
GLIBC_2.6
GLIBC_2.7
GLIBC_2.8
GLIBC_2.9
GLIBC_2.10
GLIBC_2.11
GLIBC_2.12
GLIBC_2.13
GLIBC_2.14
GLIBC_2.15
GLIBC_2.16
GLIBC_2.17
GLIBC_2.18
GLIBC_2.22
GLIBC_2.23
GLIBC_2.24
GLIBC_2.25
GLIBC_2.26
GLIBC_2.27
GLIBC_PRIVATE
```

说明服务器当前是没有GLIBC\_2.28

`2` 使用软件包升级方式

+   参考[debian网址](https://packages.debian.org/buster/)并搜索想要的软件或者工具等，如`libc6`,有结果如下：  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/5ea130bc73c341d183a14190db14e8b4.png)  
    具体就不介绍了，请浏览官网了解。
    
+   添加软件源，`/etc/apt/sources.list`文件中像下面这样添加一行：
    

```auto
deb http://security.debian.org/debian-security buster/updates main 
```

+   系统可用的软件包更新，刷新软件包的缓存

```auto
sudo apt update  # 更新软件源
```

+   `apt-get update`之后若出现下面提示：  
    `由于没有公钥，无法验证下列签名： NO_PUBKEY 112695A0E562B32A NO_PUBKEY 54404762BBB6E853`

```auto
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 112695A0E562B32A 54404762BBB6E853
```

+   其中后面的`112695A0E562B32A 54404762BBB6E853`就是上面提到的`NO_PUBKEY 112695A0E562B32A NO_PUBKEY 54404762BBB6E853`中的公钥，替换成对应的即可。然后重新`apt-get update`即可。
    
+   查看软件包可更新列表
    

```auto
sudo apt list --upgradable   
```

如下图所示：  
![在这里插入图片描述](https://img-blog.csdnimg.cn/de34ac38295e4c8e9f5854cbc3a18aa1.png)

+   安装libc6

```auto
sudo apt install libc6-dev  /sudo apt install libc6
```

`3` 查看服务器当前版本：

```auto
strings /lib/x86_64-linux-gnu/libc.so.6 | grep GLIBC_
```

返回的结果如下：

```auto
GLIBC_2.2.5
GLIBC_2.2.6
GLIBC_2.3
GLIBC_2.3.2
GLIBC_2.3.3
GLIBC_2.3.4
GLIBC_2.4
GLIBC_2.5
GLIBC_2.6
GLIBC_2.7
GLIBC_2.8
GLIBC_2.9
GLIBC_2.10
GLIBC_2.11
GLIBC_2.12
GLIBC_2.13
GLIBC_2.14
GLIBC_2.15
GLIBC_2.16
GLIBC_2.17
GLIBC_2.18
GLIBC_2.22
GLIBC_2.23
GLIBC_2.24
GLIBC_2.25
GLIBC_2.26
GLIBC_2.27
GLIBC_2.28     # 多出该版本，说明安装成功，系统也能正常使用。
GLIBC_PRIVATE
```

如下图所示：  
![在这里插入图片描述](https://img-blog.csdnimg.cn/94237d434d92453481306bf27dba3d1b.png)