---
title: centos7 卸载docker
date: 2023-11-23 10:52:31
categories: 疑难解答
tags:  
     - "文章收录"
     - "拯救小白系列"
---
# centos7 卸载docker

## CentOS 7下如何卸载Docker

!\[CentOS 7下如何卸载Docker\](

> 本文介绍了在CentOS 7上如何卸载Docker。我们将使用命令行来完成这个过程。在开始之前，请确保您具有管理员权限。

### 1\. 检查Docker安装情况

在卸载Docker之前，首先我们需要检查系统中是否已经安装了Docker。可以使用以下命令来验证：

登录后复制

```shell
docker version
1.
```

如果您看到有关Docker的版本信息，则表示Docker已经安装在您的系统中。如果没有任何输出，说明您的系统中没有安装Docker。

### 2\. 停止Docker服务

在卸载Docker之前，我们需要停止正在运行的Docker服务。可以使用以下命令来停止Docker服务：

登录后复制

```shell
sudo systemctl stop docker
1.
```

### 3\. 卸载Docker软件包

现在我们可以开始卸载Docker软件包了。可以使用以下命令来卸载Docker：

登录后复制

```shell
sudo yum remove docker
1.
```

执行以上命令后，系统将提示您确认是否要卸载Docker软件包。输入`y`并按下回车键继续。

### 4\. 删除Docker数据目录

卸载Docker软件包后，还需要手动删除Docker的数据目录。可以使用以下命令来删除Docker数据目录：

登录后复制

```shell
sudo rm -rf /var/lib/docker
1.
```

### 5\. 删除Docker镜像和容器

卸载Docker后，您可能还需要删除已经下载的Docker镜像和容器。可以使用以下命令来删除所有Docker镜像和容器：

登录后复制

```shell
docker rm -f $(docker ps -a -q)
docker rmi -f $(docker images -a -q)
1.2.
```

执行以上命令后，系统将删除所有已经停止的容器和所有的镜像。

### 6\. 清理Docker残留配置

有时候，即使卸载了Docker软件包，系统中仍然可能会有一些残留的配置文件。可以使用以下命令来清理Docker的残留配置：

登录后复制

```shell
sudo rm -rf /etc/docker
sudo rm -rf ~/.docker
1.2.
```

### 结论

在本文中，我们介绍了在CentOS 7上如何卸载Docker。通过使用命令行，您可以轻松地完成这个过程。请记住，在卸载Docker之前，一定要停止正在运行的Docker服务，并且备份您的重要数据。希望本文对您有所帮助！

卸载Docker的过程