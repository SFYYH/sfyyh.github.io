---
title: 搭建github博客教程
date: 2023-12-03 11:47:04
categories: "杂类学习"
tags:  
     - "博客搭建教程"
---
# 【2023最新版】Hexo+github搭建个人博客并绑定个人域名

## [Hexo](https://so.csdn.net/so/search?q=Hexo&spm=1001.2101.3001.7020)+github搭建个人博客并绑定个人域名

#### 安装并配置Node.js

Node.js下载:【它让JavaScript成为与PHP、Python、Perl、Ruby等服务端语言平起平坐的脚本语言。】

教程：https://blog.csdn.net/weixin\_52799373/article/details/123840137（过程详细，还覆盖win11，评论下面还有师叔的足迹）

注意一

全局安装最常用的 express 模块 进行测试命令如下:

```coffeescript
npm install express -g
```

报错图片：

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/566631a93202e6841e3b9728d4181c78.png)

解决方法：

+   【亲测有效】

+   需要删除 npmrc 文件。

+   \*\*强调：\*\*不是nodejs安装目录npm模块下的那个npmrc文件

+   而是在 C:\\Users\\（你的用户名）\\下的.npmrc文件

+   ***聪明的你，一定想到了直接用evering搜索，省的还要调用文件管理器在一点一点的找***

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/c55ce90256466fb4321c7ceec2174333.png)

注意二

**在文章第四歩测试上查看安装结果**

可能会出现下面照片结果，更改了目录为什么还是C盘目录下，这时候只需要以管理员身份运行命令即可。

在下面路径下找到cmd.exe并且管理员身份运行即可。

推测：出像这种现象的原因就是执行权限不够，推荐大家在桌面建立一个快捷方式（管理员命令的）cmd

```vbnet
C:\Windows\System32\cmd.exe
```

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/910c8ab64ab09363b6746b621bc8055a.png)

创建管理员权限的cmd桌面快捷方式

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/a24b65ce36754df5b84ebd74dcae3937.png)

#### 安装并配置Git

git是一个并源的分布式版本控制系统，可以有效、高速地处理从很小到非常大的项目版本管理

Windows系统Git安装教程：https://www.cnblogs.com/xueweisuoyong/p/11914045.html

#### 生成SSH Keys

生成ssh

```csharp
 ssh-keygen -t rsa -C "你的邮箱地址"
```

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/ffb1c86562ad1f7c9e38918c6a71ac24.png)

找到秘钥位置并复制

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/40764e8f2ea3b220e1492173880c71b4.png)

测试ssh是否绑定成功

```typescript
ssh -T git@github.com
```

如果问你（yes or no）,直接 yes 就可以得到下面这段话

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/0b809bb5e4c84157c139e010e1bc7917.png)

#### 本地访问博客

1、创建一个名为 Blog 的文件，在里面启用 Git Bash Here

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/124885ee5a5be2c2605f30b880329825.png)

2、初始化hexo

```csharp
hexo init
```

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/93962986201290891b09b0266420f301.png)

3、生成本地的hexo页面

```undefined
hexo s
```

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/7c03fe7e8d60be5cf82963e8103f9f6b.png)

4、访问

打开本地服务区

```cobol
http://localhost:4000/
```

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/975e56860c24c8076fb91ad2ec24e4f2.png)

> 长按 Ctrl + c 关闭服务器

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/745143e1d8f6411d54566506d555c313.png)

#### 上传到Github

修改-config.yml文件

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/5dad89898d2144898261ea18aefaa30f.png)

把图片上位置更换成

```haskell
deploy:  type: git  repository: 你的github地址  branch: main
```

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/85937e8781a64d4a893c4981e00e6a26.png)

安装hexo-deployer-git 自动部署发布工具

```sql
npm install hexo-deployer-git --save
```

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/681b76b969aa195e15d44c8bfc71565c.png)

生成页面

```undefined
hexo g
```

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/412c15c15d8987484a32f9546e4f9095.png)

注意一

如果报错如下：（无报错，请忽略此条）

报错信息是提示hexo的yml配置文件 冒号后面少了空格解决方案：到提示行将对应的空格补上即可

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/5f5f79045917c6d093df24b22e641516.png)

本地文件上传到Github上面

```undefined
hexo d
```

中间会出现一个登录界面，可以用令牌登录。（令牌及时保存，就看不到了）

结束以后就上传 Github 就成功了！！！

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/15bc2a357a6eac25ec4719dcec9c5007.png)

注意二

如果出现如图错误网络报错，再次尝试，多次尝试，直到更换WiFi~~~~

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/5a2a4dabd744ba6a750102dfc623993e.png)

#### 访问GitHub博客

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/aa9870ef4369263b6560c13aa5d753c9.png)

访问博客，开始的页面是初始化页面，没有做美化和增加内容。

```cobol
https://wushishu.github.io/
```

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/c05cd48fac0243ff9963413b078d2fcc.png)

### 第二部分 文档学习

#### 撰写博客

***电脑要必须有Typora！电脑要必须有Typora！电脑要必须有Typora！***（重要的事情说三遍）

文本教程：https://dhndzwxj.vercel.app/3276806131.html

hexo标签教程：http://haiyong.site/post/cda958f2.html（参考文档看需求加不加）

我们打开自己的博客根目录，跟着我一个个了解里面的这些文件（夹）都是干什么的：

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/d12390a33a7bc45be0582ac20092c28b.png)

+   `_config.yml`：俗称站点配置文件，很多与博客网站的格式、内容相关的设置都需要在里面改。

+   `node_modules`:存储Hexo插件的文件，可以实现各种扩展功能。一般不需要管。

+   `package.json`：别问我，我也不知道干嘛的。

+   `scaffolds`：模板文件夹，里面的`post.md`文件可以设置每一篇博客的模板。具体用起来就知道能干嘛了。

+   `source`：非常重要。所有的个人文件都在里面！

+   `themes`：主题文件夹，可以从[Hexo主题官网](https://hexo.io/themes/ "Hexo主题官网")或者网上大神的Github主页下载各种各样美观的主题，让自己的网站变得逼格高端的关键！

接下来重点介绍`source`文件夹。新建的博客中，`source`文件夹下默认只有一个子文件夹——`_posts`。我们写的博客都放在这个子文件夹里面。我们还可以在`source`里面新建各种子文件夹满足自己的个性化需求，对初学者而言，我们先把精力放在主线任务上，然后再来搞这些细节。

> hexo官方文档：https://hexo.io/zh-cn/docs/commands.html

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/8389594494d846358792082d4096fce7.png)

写好内容后，在命令行一键三连：

> 'hexo cl'命令用于清除缓存文件（db.json）和已生成的静态文件（public）。
>
> 例如：在更换主题后，如果发现站点更改不生效，可以运行该命令。

```undefined
hexo cl
```

```undefined
hexo g
```

```undefined
hexo s
```

然后随便打开一个浏览器，在网址栏输入`localhost:4000/`，就能发现自己的网站更新了！不过这只是在本地进行了更新，要想部署到网上（Github上），输入如下代码：

```undefined
hexo d
```

然后在浏览器地址栏输入`https://yourname.github.io`，或者`yourname.github.io`就能在网上浏览自己的博客了！

以上，我们的博客网站1.0版本就搭建完成了，如果没有更多的需求，做到这里基本上就可以了。如果有更多的要求，还需要进一步的精耕细作！

#### 精耕细作

\*\*海拥\\Butterfly 主题美化：\*\*http://haiyong.site/post/22e1d5da.html

**Butterfly参考文档（小白慎入，但是他也是你走向DIY必须迈出的一歩）**:https://butterfly.js.org/posts/dc584b87/#Post-Front-matter

文章中要更改的文件（.yml .bug 等）可以要用viscode打开！！！

Butterfly 主题安装

```cobol
git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

这里面如果报错，如下图所示（长路漫漫，bug满满）

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/e28a8a9ed9eb2848f84075e0e0aeba0e.png)

只需要在命令行中执行

```php
git config --global --unset http.proxy git config --global --unset https.proxy
```

再次安装主题即可成功

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/8e0ff6ac2ae7b9712214f13438a40f27.png)

**应用主题**

```vbnet
theme: butterfly
```

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/1a1fed2db4bbb066f43e879fb70cf5c5.png)

**安装插件**

如果你没有 pug 以及 stylus 的渲染器，请下载安装：

```sql
npm install hexo-renderer-pug hexo-renderer-stylus --save
```

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/cee71aa9a5c2766541aac4d5aa03c48a.png)

#### Butterfly 主题美化

生成文章唯一链接

Hexo的默认文章链接格式是年，月，日，标题这种格式来生成的。如果你的标题是中文的话，那你的URL链接就会包含中文，

复制后的URL路径就是把中文变成了一大堆字符串编码，如果你在其他地方用这边文章的url链接，偶然你又修改了改文章的标题，那这个URL链接就会失效。为了给每一篇文章来上一个属于自己的链接，写下此教程，利用 hexo-abbrlink 插件，A Hexo plugin to generate static post link based on post titles ,来解决这个问题。 参考github官方： hexo-abbrlink 按照此教程配置完之后如下：

1、安装插件，在博客根目录 \[Blogroot\] 下打开终端，运行以下指令：

```sql
npm install hexo-abbrlink --save
```

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/6af8bde01cd64d3a7e38d3e4c2fd9816.png)

2、插件安装成功后，在根目录 \[Blogroot\] 的配置文件 \_config.yml 找到 permalink：

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/img_convert/34cc88e45553f0dad679ca75f96168c2.png)

#### 发布博客

这次了解我上面只有一个HelloWord的时候，为什么不让右键新建，**因为需要命令生成啊，铁汁！**

```less
npm i hexo-deployer-git
```

```csharp
hexo new post "新建博客文章名"
```

```cobol
hexo cl && hexo g  && hexo s
```

#### hexo更换背景图片

背景图片参考网址：

+   https://wallhaven.cc/

+   https://wall.alphacoders.com/

+   https://bz.zzzmh.cn/index

*本方法解决的是多次同步到GitHub上背景图片未成功的情况*

直接更改原文件

图片所在目录：`hexo/themes/landscape/source/css/images/`

图片名称：`banner.jpg`

### 

### 第三部分 绑定自己的域名

博客地址：https://www.likecs.com/show-30474.html

**绑定之后你就有有一个自己专属的博客了。**

买一个域名，可以一块钱白嫖，但是续费贵的飞天！！！

***注意请谨慎绑定，想我就会出现提交一次 (hexo d) ,需要重新绑定域名***

> 声明：如果遇到什么不懂的可以先百度，在不懂可以微信我wushibo0820



## 问题：解决git@github.com: Permission denied (publickey). fatal: Could not read from remote repository. Pleas



![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/20200603101902230.png)

#### 一:原因分析

Permission denied (publickey) 没有权限的publickey ，出现这错误一般是以下两种原因

+   客户端与服务端未生成 ssh key
+   客户端与服务端的ssh key不匹配

找到问题的原因了，解决办法也就有了，重新生成一次ssh key ，服务端也重新配置一次即可。

####  

#### 二:客户端生成ssh key

在cmd里面输入

ssh-keygen -t rsa -C "xxxxxxxx@qq.com"

```perl
ssh-keygen -t rsa -C "youremail@example.com"
```

xxxxxx[@qq.com](mailto:youremail@example.com)改为自己的邮箱即可，途中会让你输入密码啥的，不需要管，一路回车即可，会生成你的ssh key。（如果重新生成的话会覆盖之前的ssh key。）

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/202006031025357.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1dfMzE3,size_16,color_FFFFFF,t_70)

#### 三:输入箭头处路径

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/20200603102554725.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1dfMzE3,size_16,color_FFFFFF,t_70)

#### 四:打开id\_rsa.pub文件,并且复制内容

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/20200603102735768.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1dfMzE3,size_16,color_FFFFFF,t_70)

#### 配置服务端

#### 五:在github上打开箭头处,点击Setting

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/20200603102157756.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1dfMzE3,size_16,color_FFFFFF,t_70)

#### 六:点击SSH and GPG keys

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/20200603102223280.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1dfMzE3,size_16,color_FFFFFF,t_70)

#### 七:打开你刚刚生成的id\_rsa.pub，将里面的内容复制，进入你的github账号，在settings下，SSH and GPG keys下new SSH key，然后将id\_rsa.pub里的内容复制到Key中，完成后Add SSH Key。

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/2020060310174263.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1dfMzE3,size_16,color_FFFFFF,t_70)

#### 八:然后添加后入下图所示

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/20200603101823216.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1dfMzE3,size_16,color_FFFFFF,t_70)

#### 九:用idea再次提交文件到 github上,显示提交成功

![](https://proxy.iximp.top/https://img-blog.csdnimg.cn/20200603103159683.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1dfMzE3,size_16,color_FFFFFF,t_70)

