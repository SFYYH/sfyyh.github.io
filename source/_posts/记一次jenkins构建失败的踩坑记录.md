---
title: 记一次jenkins构建失败的踩坑记录
date: 2023-11-22 09:58:50
categories: Jenkins
tags:  
     - "日常小BUG"
     - "Jenkins学习"
---
# 记一次jenkins构建失败的踩坑记录

核心要旨:排错要一步一步排查,一步一步确认,确认问题失败在哪一步,而不是凭空猜测错误.

异常信息:

登录后复制

Started by user admin  
Running as SYSTEM  
Building in workspace /root/.jenkins/workspace/app-server  
using credential 2c84e055-ab32-4bcb-9642-e490e1fb4443  

 > /usr/bin/git rev-parse --is-inside-work-tree # timeout=10  
 > Fetching changes from the remote Git repository  
 > /usr/bin/git config remote.origin.url https://gitee.com/kinome/aggregationServicePlatform.git # timeout=10  
 > Using shallow fetch with depth 1  
 > Fetching upstream changes from https://gitee.com/kinome/aggregationServicePlatform.git  
 > /usr/bin/git --version # timeout=10  
 > using GIT\_ASKPASS to set credentials   
 > /usr/bin/git fetch --tags --progress --depth=1 https://gitee.com/kinome/aggregationServicePlatform.git +refs/heads/\*:refs/remotes/origin/\* # timeout=60  
 > /usr/bin/git rev-parse refs/remotes/origin/master^{commit} # timeout=10  
 > /usr/bin/git rev-parse refs/remotes/origin/origin/master^{commit} # timeout=10  
 > Checking out Revision 0e92eabfe44ed70dcc240fcd7b714c2de2f0c7c6 (refs/remotes/origin/master)  
 > /usr/bin/git config core.sparsecheckout # timeout=10  
 > /usr/bin/git checkout -f 0e92eabfe44ed70dcc240fcd7b714c2de2f0c7c6 # timeout=10  
 > Commit message: "commit"  
 > /usr/bin/git rev-list --no-walk 0e92eabfe44ed70dcc240fcd7b714c2de2f0c7c6 # timeout=10  
 > Parsing POMs  
 > Established TCP socket on 37780  
 > \[app-server\] $ /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.242.b08-0.el7\_7.x86\_64/jre/bin/java -cp /root/.jenkins/plugins/maven-plugin/WEB-INF/lib/maven3-agent-1.13.jar:/usr/share/maven/boot/plexus-classworlds.jar org.jvnet.hudson.maven3.agent.Maven3Main /usr/share/maven /root/.jenkins/war/WEB-INF/lib/remoting-4.2.jar /root/.jenkins/plugins/maven-plugin/WEB-INF/lib/maven3-interceptor-1.13.jar /root/.jenkins/plugins/maven-plugin/WEB-INF/lib/maven3-interceptor-commons-1.13.jar 37780  
 > ERROR: Failed to parse POMs  
 > java.io.IOException: Cannot run program "/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.242.b08-0.el7\_7.x86\_64/jre/bin/java" (in directory "/root/.jenkins/workspace/app-server"): error=2, 没有那个文件或目录  
 > at java.lang.ProcessBuilder.start(ProcessBuilder.java:1048)  
 > at hudson.Proc$LocalProc.<init>(Proc.java:252)  
 > at hudson.Proc$LocalProc.<init>(Proc.java:221)  
 > at hudson.Launcher$LocalLauncher.launch(Launcher.java:936)  
 > at hudson.Launcher$ProcStarter.start(Launcher.java:454)  
 > at hudson.maven.AbstractMavenProcessFactory.newProcess(AbstractMavenProcessFactory.java:280)  
 > at hudson.maven.ProcessCache.get(ProcessCache.java:236)  
 > at hudson.maven.MavenModuleSetBuild$MavenModuleSetBuildExecution.doRun(MavenModuleSetBuild.java:804)  
 > at hudson.model.AbstractBuild$AbstractBuildExecution.run(AbstractBuild.java:504)  
 > at hudson.model.Run.execute(Run.java:1856)  
 > at hudson.maven.MavenModuleSetBuild.run(MavenModuleSetBuild.java:543)  
 > at hudson.model.ResourceController.execute(ResourceController.java:97)  
 > at hudson.model.Executor.run(Executor.java:428)  
 > Caused by: java.io.IOException: error=2, 没有那个文件或目录  
 > at java.lang.UNIXProcess.forkAndExec(Native Method)  
 > at java.lang.UNIXProcess.<init>(UNIXProcess.java:247)  
 > at java.lang.ProcessImpl.start(ProcessImpl.java:134)  
 > at java.lang.ProcessBuilder.start(ProcessBuilder.java:1029)  
 > ... 12 more  
 > Finished: FAILURE



本质原因是因为jdk版本升级了,之前的javahome路径失效了导致的.

但是在java升级的那天,我修改了gitee的密码,然后我从一开始就以为是因为凭证出了问题(因为在第一步就是使用凭证拉取git上的项目),然后我又看到timeout=10这种提示,以为是真的超时了(其实只是在提示超时时间值,并没有真的超时),然后又是各种搜,各种尝试跟凭证有关的东西,甚至想用sshkey来弄结果不行.

但是其实一开始排查就发现用户名和密码正确,也没有报错,但是就是构建失败,其实这个时候我还是以为拉取失败了,这一步我应该在确认了用户名密码没错并且没报错的情况下,先检查有没有真的拉取到,然后再进行判断的,而不是理所当然的猜测.

然后检查到了其实是拉取到了,跟凭证没关系,往下走发现了java找不到的异常,修改javahome之后就可以了.

正好修改gitee的密码的那天升级了java,才对认知造成了影响.

所以以后如果出现bug,应该一步一步按照事实和异常消息来,并且检查相关配置,而不是盲目百度和把猜测作为事实.

\========== 更新 2021-05-19

![记一次jenkins构建失败的踩坑记录_jenkins](https://s2.51cto.com/images/blog/202208/18105254_62fda986e37fe13198.png?x-oss-process=image/watermark,size_16,text_QDUxQ1RP5Y2a5a6i,color_FFFFFF,t_30,g_se,x_10,y_10,shadow_20,type_ZmFuZ3poZW5naGVpdGk=/format,webp/resize,m_fixed,w_1184)

 -U clean install 用于解决 Jenkins构建未拉取最新的包导致自动构建失败 