---
title: kali Linux磁盘扩容
date: 2023-08-18 14:30:54
categories: "实用技巧"
tags: 
     - "磁盘分区"
     - "kali-linux"
---

> 在安装kali时，我们有时候会给kali分配的空间比较少。刚开始还算够用，但随着软件的不断安装和系统的更新。这时我们之前分配的空间就显得不足了。那该怎样扩容你的磁盘呢？首先我们查看当前磁盘占有率 终端执行命令！

## df -h

![Untitled](images/Kali%20Linux%E7%A3%81%E7%9B%98%E6%89%A9%E5%AE%B9%20acc69512f3234acbaff24d48a796ddc1/Untitled.png)

编辑切换为居中

可以看到，目前我们已经占有了58%，/便是我们的根目录。 

## 😘增加磁盘

在vmware虚拟机中，选择编辑虚拟机设置>磁盘>扩展

设置最大磁盘大小，这里我的磁盘也比较有限，设置60G

然后重新启动Kali linux虚拟机，会发现磁盘的容量并没有增加，这里是因为我们没有对其进行挂载。我们使用kali中的磁盘管理工具进行挂载，执行下面的命令。

![Untitled](images/Kali%20Linux%E7%A3%81%E7%9B%98%E6%89%A9%E5%AE%B9%20acc69512f3234acbaff24d48a796ddc1/Untitled%201.png)

这时候，我们可以看到有15G没有分配的空间。这便是刚才扩容的部分。

停用SWAP空间

![Untitled](images/Kali%20Linux%E7%A3%81%E7%9B%98%E6%89%A9%E5%AE%B9%20acc69512f3234acbaff24d48a796ddc1/Untitled%202.png)

先将未分配的15G给到extended上，选择extended右键调整大小。向右拖到可以调整大小。

![Untitled](images/Kali%20Linux%E7%A3%81%E7%9B%98%E6%89%A9%E5%AE%B9%20acc69512f3234acbaff24d48a796ddc1/Untitled%203.png)

然后移动linux-swap的位置 这里注意是点击白色的部分，向右移动到最后。

![Untitled](images/Kali%20Linux%E7%A3%81%E7%9B%98%E6%89%A9%E5%AE%B9%20acc69512f3234acbaff24d48a796ddc1/Untitled%204.png)

![Untitled](images/Kali%20Linux%E7%A3%81%E7%9B%98%E6%89%A9%E5%AE%B9%20acc69512f3234acbaff24d48a796ddc1/Untitled%205.png)

点击调整大小移动后点击确定

![Untitled](images/Kali%20Linux%E7%A3%81%E7%9B%98%E6%89%A9%E5%AE%B9%20acc69512f3234acbaff24d48a796ddc1/Untitled%206.png)

再次选择extended，调整大小/移动，向右拖动将里面的空间全给出去。

![Untitled](images/Kali%20Linux%E7%A3%81%E7%9B%98%E6%89%A9%E5%AE%B9%20acc69512f3234acbaff24d48a796ddc1/Untitled%207.png)

对齐到需要选择柱面，然后保存

![Untitled](images/Kali%20Linux%E7%A3%81%E7%9B%98%E6%89%A9%E5%AE%B9%20acc69512f3234acbaff24d48a796ddc1/Untitled%208.png)

现在我们来调整/dev/sda1分区的大小。向右拖动就行了。

![Untitled](images/Kali%20Linux%E7%A3%81%E7%9B%98%E6%89%A9%E5%AE%B9%20acc69512f3234acbaff24d48a796ddc1/Untitled%209.png)

最后点击保存

![Untitled](images/Kali%20Linux%E7%A3%81%E7%9B%98%E6%89%A9%E5%AE%B9%20acc69512f3234acbaff24d48a796ddc1/Untitled%2010.png)

现在我们来看看

![Untitled](images/Kali%20Linux%E7%A3%81%E7%9B%98%E6%89%A9%E5%AE%B9%20acc69512f3234acbaff24d48a796ddc1/Untitled%2011.png)

已经成功了。

## 原理

我们是不能直接给/dev/sda1分区调整大小的。只能通过swap（交换空间）进行中转。然后再调整/dev/sda1分区的大小就行了。最后一定要记得保存哦！ 

## [https://www.bilibili.com/read/cv19163012](https://www.bilibili.com/read/cv19163012) 出处：bilibili