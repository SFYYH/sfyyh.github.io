---
title: kubernetes核心概念
date: 2023-11-24 08:29:53
categories: K8s
tags:  
     - "K8s基础学习"
     - "编程知识"
---
## 01-kubernetes核心概念

1 有了docker 什么要用kubernetes



2 多容器跨主机提供服务

3 多容器分布节点部署

4 多容器的升级

5 高效管理容器



docker管理工具

Docker compose, docker machine, docker swarm



常见的容器编排工具：

kubernetes  google伯格系统

swarm  2018已经被docker废弃

mesos marathon  容器编排组件



<!-- ![img](01-kubernetes核心概念.assets\kuadm01-17006173052243.png) -->









## 02-kubernetes是什么

Kubernetes 是一个开源的容器编排引擎，用来对容器化应用进行自动化部署、 扩缩和管理。该项目托管在 [CNCF](https://www.cncf.io/about)。

kubernetes是google 2014年开源的一个容器集群管理系统。简称k8s

Kubernetes 用于容器化应用程序的部署



官网

https://kubernetes.io/zh/



## 03-kubernetes架构与组件

master 管理节点（管理集群）

Kubectl 管理工具

Api server,scheduler, conttroller manager，etcd分布式键值存储数据库



API Server：所有服务访问的唯一入口，提供认证、授权、访问控制、API 注册和发现等机制

Scheduler：负责资源的调度，按照预定的调度策略将 Pod 调度到相应的机器上

Controller Manager：负责维护集群的状态，比如副本期望数量、故障检测、自动扩展、滚动更新等

etcd：键值对数据库，保存了整个集群的状态



Node 工作节点（运行应用）

Kubelet 代理

负责维护容器的生命周期，同时也负责 Volume 和网络的管理

kubelet的主要功能就是定时从node上获取 pod/container 的期望状态。并负责管理pod和它们上面的容器，如images镜像、volumes、etc并确保这些Pod正常运行，能实时返回Pod的运行状态。

注意

在kubernetes 的设计中，最基本的管理单位是 pod，而不是 container。pod 是 kubernetes 在容器上的一层封装，由一组运行在同一主机的一个或者多个容器组成。



Kube-proxy 

负责为 Service 提供 cluster 内部的服务发现和负载均衡

kube-proxy的作用主要是负责service的实现，具体来说，就是实现了内部从pod到service和外部的从node port向service的访问，其实就是pod的网络代理



Container runtime：

负责镜像管理以及 Pod 和容器的真正运行



除了核心组件，还有一些推荐的插件：
CoreDNS：可以为集群中的 SVC 创建一个域名 IP 的对应关系解析的 DNS 服务
Dashboard：为Kubernetes 集群提供了一个 B/S 架构的访问入口
Ingress Controller：官方只能够实现四层的网络代理，而 Ingress 可以实现七层的代理
Prometheus：给 Kubernetes 集群提供资源监控的能力
Federation： 提供一个可以跨集群中心多 Kubernetes 的统一管理功能，提供跨可用区的集群





## 05-kubernetes各个组件调用关系

master：集群的控制平面，负责集群的决策 ( 管理 )
ApiServer : 资源操作的唯一入口，接收用户输入的命令，提供认证、授权、API注册和发现等机制
Scheduler : 负责集群资源调度，按照预定的调度策略将Pod调度到相应的node节点上
ControllerManager : 负责维护集群的状态，比如程序部署安排、故障检测、自动扩展、滚动更新等
Etcd ：负责存储集群中各种资源对象的信息

node：集群的数据平面，负责为容器提供运行环境 ( 干活 )
Kubelet : 负责维护容器的生命周期，即通过控制docker，来创建、更新、销毁容器
KubeProxy : 负责提供集群内部的服务发现和负载均衡
Docker : 负责节点上容器的各种操作



<!-- ![img](图片素材/组件调用流程.png) -->



下面，以部署一个nginx服务来说明kubernetes系统各个组件调用关系：
kubernetes环境启动之后，master和node都会将自身的信息存储到etcd数据库中，一个nginx服务的安装请求会首先被发送到master节点的apiServer组件,apiServer组件会调用scheduler组件来决定到底应该把这个服务安装到哪个node节点上,此时它会从etcd中读取各个node节点的信息，然后按照特定的算法进行选择，并将结果告知apiServer，apiServer调用controller-manager去调度Node节点安装nginx服务，kubelet接收到指令后，会通知docker，然后由docker来启动一个nginx的pod，pod是kubernetes的最小操作单元，容器必须跑在pod中至此，一个nginx服务就运行了，如果需要访问nginx，就需要通过kube-proxy来对pod产生访问的代理。这样外界用户就可以访问集群中的nginx服务了

## 05-kubernetes概念

Master：集群控制节点，每个集群需要至少一个master节点负责集群的管控
Node：工作负载节点，由master分配容器到这些node工作节点上，然后node节点上的docker负责容器的运行
Pod：kubernetes的最小控制单元，容器都是运行在pod中的，一个pod中可以有1个或者多个容器
Controller：控制器，通过它来实现对pod的管理，比如启动pod、停止pod、伸缩pod的数量等等
Service：pod对外服务的统一入口，下面可以维护者同一类的多个pod
Label：标签，用于对pod进行分类，同一类pod会拥有相同的标签
NameSpace：命名空间，用来隔离pod的运行环境





## 06-kubernetes集群架构

官方文档 概念 和任务。

官网

https://kubernetes.io/zh/



k8s的部署方式：

minikube：一个用于快速搭建单节点kubernetes的工具，minikube顾名思义即迷你型Kubernetes，非常适合快速学习k8s的各个组件的作用及yml的编写。



Kubeadm 部署  ：官方提供的一个用于快速搭建kubernetes集群的工具

- https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm/



二进制部署  ： 从官网下载每个组件的二进制包，依次去安装，此方式对于理解kubernetes组件更加有效

- https://github.com/kubernetes/kubernetes

  

第三方工具部署： rancher  webui



k8s服务器硬件配置：



<!-- <img src="图片素材/image-20220607193947482.png" alt="image-20220607193947482" style="zoom:50%;" /> -->



kubernetes集群大体上分为两类：一主多从和多住多从

- 一主多从：一台master节点和多台node节点，搭建简单，但是有单机故障风险，适用于测试环境

- 多主多从：多台master节点和多台node节点，搭建相对负载，安全性高，适用于生产环境

  <!-- ![image-20220607194851548](图片素材/image-20220607194851548.png) -->



## 07-kubeadm快速部署k8s

第一步首先安装 Linux ubuntu18.04

ubuntu下载地址：[http://cdimage.ubuntu.com/releases/](http://cdimage.ubuntu.com/releases/18.04.2/release/)

Ubuntu18.04设置国内源

阿里源

```b
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
```

中科大源

```b
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-security main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-security main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
```

网易源

```bash
deb http://mirrors.163.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ bionic-backports main restricted universe multiverse
```

清华源

```b
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-security main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-security main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
```



第二步： 安装docker

第三步:    安装对应版本的kubeadm工具

第四步： 初始k8s集群

第五步： 安装k8s网络插件



## 08-部署k8s v1.26版本

### 8.1 系统环境准备

```
1.1 安装所需工具
yum -y install vim
yum -y install wget
# 设置yum源
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
1.2 修改主机名
#master
hostnamectl set-hostname master-01
#node1
hostnamectl set-hostname node-01
#node2
hostnamectl set-hostname node-02
1.3 编辑hosts
[root@localhost ~]# vim /etc/hosts

# 增加以下内容
192.168.31.249 master-01
192.168.31.250 node-01
192.168.31.251 node-02

1.4 安装ntpdate并同步时间
yum -y install ntpdate
ntpdate ntp1.aliyun.com

1.5 安装并配置 bash-completion，添加命令自动补充
yum -y install bash-completion
source /etc/profile
1.6 关闭防火墙
systemctl stop firewalld.service 
systemctl disable firewalld.service
1.7 关闭selinux
sed -i 's/enforcing/disabled/' /etc/selinux/config  # 永久关闭
1.8 关闭 swap
free -h
sudo swapoff -a
sudo sed -i 's/.*swap.*/#&/' /etc/fstab
free -h
二：安装k8s 1.26.x
2.1 安装 Containerd
yum install -y yum-utils device-mapper-persistent-data lvm2
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo 
sudo yum install -y containerd.io

systemctl stop containerd.service

cp /etc/containerd/config.toml /etc/containerd/config.toml.bak
sudo containerd config default > $HOME/config.toml
sudo cp $HOME/config.toml /etc/containerd/config.toml
# 修改 /etc/containerd/config.toml 文件后，要将 docker、containerd 停止后，再启动
sudo sed -i "s#registry.k8s.io/pause#registry.cn-hangzhou.aliyuncs.com/google_containers/pause#g" /etc/containerd/config.toml
# https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#containerd-systemd
# 确保 /etc/containerd/config.toml 中的 disabled_plugins 内不存在 cri
sudo sed -i "s#SystemdCgroup = false#SystemdCgroup = true#g" /etc/containerd/config.toml

#启动containerd
systemctl start containerd.service
systemctl status containerd.service
2.2 添加阿里云 k8s 镜像仓库
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
# 是否开启本仓库
enabled=1
# 是否检查 gpg 签名文件
gpgcheck=0
# 是否检查 gpg 签名文件
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
2.3 将桥接的 IPv4 流量传递到 iptables 的链
# 设置所需的 sysctl 参数，参数在重新启动后保持不变
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# 应用 sysctl 参数而不重新启动
sudo sysctl --system

# 启动br_netfilter
modprobe br_netfilter
echo 1 > /proc/sys/net/ipv4/ip_forward
2.4 安装k8s
# 2023-03-02，经过测试，版本号：1.26.2，
yum install -y kubelet-1.26.3-0 kubeadm-1.26.3-0 kubectl-1.26.3-0 --disableexcludes=kubernetes --nogpgcheck

systemctl daemon-reload
systemctl restart kubelet
systemctl enable kubelet
```

### 8.2 初始化master集群

```
如需订制版本安装：
需获取镜像文件,查看需要的镜像
kubeadm config images list

系统输出:
[root@master-01 ~]# kubeadm config images list
I1122 10:13:55.024056   66494 version.go:256] remote version is much newer: v1.28.4; falling back to: stable-1.26
registry.k8s.io/kube-apiserver:v1.26.11
registry.k8s.io/kube-controller-manager:v1.26.11
registry.k8s.io/kube-scheduler:v1.26.11
registry.k8s.io/kube-proxy:v1.26.11
registry.k8s.io/pause:3.9
registry.k8s.io/etcd:3.5.6-0
registry.k8s.io/coredns/coredns:v1.9.3
[root@master-01 ~]# 


编辑一个文件, 命名为： install_k8s_images.sh

vim install_k8s_images.sh

#! /bin/bash
images=(
    kube-apiserver:v1.26.11
    kube-controller-manager:v1.26.11
    kube-scheduler:v1.26.11
    kube-proxy:v1.26.11
    pause:3.9
    etcd:3.5.6-0
    coredns:1.9.3
)

for imageName in ${images[@]} ; do
    docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName k8s.gcr.io/$imageName
done


将文件设置为可运行：
chmod a+x install_k8s_images.sh

运行 install_k8s_images.sh 安装所需要的镜像
./install_k8s_images.sh

注意：以上步骤需要在Master和work机器完成
```

通过kubeadm命令初始化master集群

–kubernetes-version: 用于指定k8s版本；
–apiserver-advertise-address：用于指定kube-apiserver监听的ip地址,就是 master本机IP地址。
–pod-network-cidr：用于指定Pod的网络范围； 10.244.0.0/16
–service-cidr：用于指定SVC的网络范围；
–image-repository: 指定阿里云镜像仓库地址

```
kubeadm init --kubernetes-version=v1.26.11 --apiserver-advertise-address=0.0.0.0 --image-repository registry.aliyuncs.com/google_containers --kubernetes-version v1.26.11 --pod-network-cidr=10.244.0.0/16
```

<!-- ![](01-kubernetes核心概念.assets/kuadm01-17006173052243.png) -->

8.2.1配置集群配置文件

```
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config

设置配置文件变量
export KUBECONFIG=/etc/kubernetes/admin.conf

echo export KUBECONFIG=/etc/kubernetes/admin.conf >> /etc/profile
source /etc/profile


```

8.2.2 各个工作节点，执行如下命令将工作节点加入集群

```
kubeadm join 192.168.31.249:6443 --token f1226v.yjwsbpyrjs9oojmc --discovery-token-ca-cert-hash sha256:34220ce3bb6d29429afa0b1c6505ff14cc1aee7373a9b973904abd592aec3b3c
```

查看加入集群的工作节点与token

```
[root@master-01 ~]# kubeadm token create --print-join-command
kubeadm join 192.168.31.249:6443 --token ojjtbl.lkchb9823sltuhwn --discovery-token-ca-cert-hash sha256:34220ce3bb6d29429afa0b1c6505ff14cc1aee7373a9b973904abd592aec3b3c 
[root@master-01 ~]# kubectl get node
NAME        STATUS     ROLES           AGE     VERSION
master-01   NotReady   control-plane   20m     v1.26.3
node-01     NotReady   <none>          15m     v1.26.3
node-02     NotReady   <none>          9m37s   v1.26.3
[root@master-01 ~]# 


```

8.2.3 配置k8s网络

```
 maste节点配置网络,使用Calico
# 下载
wget --no-check-certificate https://projectcalico.docs.tigera.io/archive/v3.25/manifests/calico.yaml

# 修改 calico.yaml 文件
vim calico.yaml
# 在 - name: CLUSTER_TYPE 下方添加如下内容
- name: CLUSTER_TYPE
  value: "k8s,bgp"
  # 下方为新增内容
- name: IP_AUTODETECTION_METHOD
  value: "interface=网卡名称"
  # INTERFACE_NAME=ens33
  
设置pod网络为10.244.0.0/16 与前面初始步骤一致
- name: CALICO_IPV4POOL_CIDR
  value: "10.244.0.0/16"

kubeadm 支持多种网络插件，我们选择 Calico 网络插件（kubeadm 仅支持基于容器网络接口（CNI）的网络（不支持kubenet）。），默认情况下，它给出的pod的IP段地址是 192.168.0.0/16 ,如果你的机器已经使用了此IP段，就需要修改这个配置项，将其值改为在初始化 Master 节点时使用 kubeadm init –pod-network-cidr=x.x.x.x/x 的IP地址段

然后在部署 Pod 网络组件，当然对于现在的网络环境来说这些都不是必须的
kubectl apply -f calico.yaml
 稍等片刻查询 pod 详情，你也可以使用 watch 命令来实时查看 pod 的状态，等待 Pod 网络组件部署成功后，就可以看到一些信息了，包括 Pod 的 IP 地址信息，这个过程时间可能会有点长。
 
kubectl get pods -n <namespace> --watch
可以通过Ctrl+C终止这个Watch模式

查看日志命令用于拍错
journalctl -xefu kubelet

```

### 8.3 kubelet启用lvs负载

```
安装ipvsadm
yum install -y ipvsadm

手动载入如下模块
modprobe ip_vs
modprobe ip_vs_rr
modprobe ip_vs_wrr
modprobe ip_vs_sh

确认ipvs模块以及载入
root@manager:~# lsmod|grep ip_vs
ip_vs_sh               16384  0
ip_vs_wrr              16384  0
ip_vs_rr               16384  12
ip_vs                 172032  18 ip_vs_rr,ip_vs_sh,ip_vs_wrr
nf_conntrack          172032  7 xt_conntrack,nf_nat,nf_nat_ipv6,ipt_MASQUERADE,nf_nat_ipv4,nf_conntrack_netlink,ip_vs
nf_defrag_ipv6         20480  2 nf_conntrack,ip_vs
libcrc32c              16384  4 nf_conntrack,nf_nat,xfs,ip_vs

否则要自己构建模块载入配置文件 并设置权限,以下是debian10的配置实例
echo > /etc/systemd/system/kubelet.service.d/10-proxy-ipvs.conf <<-'EOF'
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack
modprobe -- br_netfilter
EOF

chmod +x /etc/systemd/system/kubelet.service.d/10-proxy-ipvs.conf 


本例是cenntos配置实例
cat > /usr/lib/systemd/system/kubelet.service.d/10-proxy-ipvs.conf << 'EOF'
[Service]
ExecStartPre=-modprobe ip_vs
ExecStartPre=-modprobe ip_vs_rr
ExecStartPre=-modprobe ip_vs_wrr
ExecStartPre=-modprobe ip_vs_sh
EOF

chmod +x /usr/lib/systemd/system/kubelet.service.d/10-proxy-ipvs.conf
scp /usr/lib/systemd/system/kubelet.service.d/10-proxy-ipvs.conf root@192.168.3.166:/usr/lib/systemd/system/kubelet.service.d/10-proxy-ipvs.conf
scp /usr/lib/systemd/system/kubelet.service.d/10-proxy-ipvs.conf root@192.168.3.167:/usr/lib/systemd/system/kubelet.service.d/10-proxy-ipvs.conf



更改kube-proxy配置
kubectl edit configmap kube-proxy -n kube-system

找到如下部分的内容41行左右。

   minSyncPeriod: 0s
      scheduler: ""
      syncPeriod: 30s
    kind: KubeProxyConfiguration
    metricsBindAddress: 127.0.0.1:10249
    mode: "ipvs"                          # 加上这个
    nodePortAddresses: null
其中mode原来是空，默认为iptables模式，改为ipvs保存退出
scheduler默认是空，默认负载均衡算法为轮训


重启验证：   
kubectl logs -n kube-system -f kube-proxy-8kzr2     #(8kzr2为ID)
I1122 06:58:15.474822       1 node.go:136] Successfully retrieved node IP: 192.168.3.167
I1122 06:58:15.474933       1 server_others.go:111] kube-proxy node IP is an IPv4 address (192.168.3.167), assume IPv4 operation
I1122 06:58:15.847846       1 server_others.go:259] Using ipvs Proxier.
W1122 06:58:15.848556       1 proxier.go:434] IPVS scheduler not specified, use rr by default
I1122 06:58:15.848926       1 server.go:650] Version: v1.19.2
I1122 06:58:15.849742       1 conntrack.go:100] Set sysctl 'net/netfilter/nf_conntrack_max
 
ipvsadm -ln  #查看ipvsadm规则
[root@master-01 ~]# ipvsadm -Ln
IP Virtual Server version 1.2.1 (size=4096)
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
TCP  10.96.0.1:443 rr
  -> 192.168.31.249:6443          Masq    1      4          0         
TCP  10.96.0.10:53 rr
  -> 10.244.184.4:53              Masq    1      0          0         
  -> 10.244.184.5:53              Masq    1      0          0         
TCP  10.96.0.10:9153 rr
  -> 10.244.184.4:9153            Masq    1      0          0         
  -> 10.244.184.5:9153            Masq    1      0          0         
UDP  10.96.0.10:53 rr
  -> 10.244.184.4:53              Masq    1      0          0         
  -> 10.244.184.5:53              Masq    1      0          0         
[root@master-01 ~]# 

```

### 8.4 kubectl 命令补全

```
yum install -y bash-completion
source <(kubectl completion bash)
echo "source <(kubectl completion bash)" >> ~/.bashrc
source  ~/.bashrc
```



### 8.5kubectl工具常用命令



```
查看帮助：kubectl -h
查看可配置的资源对象：kubectl api-resources
查看所有node信息：kubectl get node
查看特定ns中的pod : kubectl get pod -n kube-system
查看RC和service列表：kubectl get rc,svc
显示Pod的详细信息：kubectl describe pod pod-name
查看节点my-node的详细信息:   kubectl describe nodes my-node 
根据yaml创建资源：kubectl create -f pod.yaml  或 kubectl apply -f pod.yaml
#apply 可以重复执行，create 不行
基于pod.yaml定义的名称删除pod：kubectl delete -f pod.yaml 
删除所有包含某个label的pod和service：kubectl delete pod,svc -l name=label-name
删除所有Pod：kubectl delete pod --all
查看endpoint列表：kubectl get endpoints
执行pod的date命令：
kubectl exec pod-name -- date
kubectl exec pod-name -- bash
kubectl exec pod-name -- ping 10.24.51.9

获得pod中某个容器的TTY（相当于登录容器）：
kubectl exec -it pod-name -c container-name -- bash
#查看容器的日志
kubectl logs pod-name
#实时查看日志
kubectl logs -f pod-name
#若pod只有一个容器，可以不加-c
kubectl log pod-name -c container_name
查看注释：
kubectl explain pod
kubectl explain pod.apiVersion
查看节点labels：kubectl get node --show-label


kubectl创建pod实例：
kubectl create deployment nginx --image=nginx
kubectl get pod nginx-748c667d99-b542k --watch  #查看容器启动状态
kubectl get pod -n default -o wide
kubectl get deployments.apps
kubectl expose deployment nginx --port=80 --type=NodePort
kubectl get pod,svc

扩容多个副本 拉伸实例
kubectl scale deployment nginx --replicas=2
查看pods会看到两个nginx容器
kubectl get pods

如需修改端口为31000 可以使用edit选项直接指定。端口固定范围 --service-node-port-range=30000-50000。

kubectl edit service nginx

```

### 8.6 registry私用仓库

```
docker创建本地局域网私有仓库:

但有时候使用公共仓库可能不方便，这种情况下用户可以使用registry创建一个本地仓库供私人使用，使用私有仓库有许多优点：节省网络带宽，针对于每个镜像不用每个人都去中央仓库上面去下载，只需要从私有仓库中下载即可；
提供镜像资源利用，针对于公司内部使用的镜像，推送到本地的私有仓库中，以供公司内部相关人员使用。
目前Docker Registry已经升级到了v2，Registryv2使用Go语言编写，在性能和安全性上做了很多优化，重新设计了镜像的存储格式。如果需要安装registry v2，就需要下载registry:2.2的版本。Docker官方提供的工具docker-registry可以用于构建私有的镜像仓库
docker pull registry   #下载私有仓库镜像
docker run -d -p 5000:5000 registry:latest 		#运行私有仓库容器映射端口号5000
docker run -d --name=my_registry -p 5000:5000 -v /opt/data/registry:/tmp/registry docker.io/registry     #指定本地仓库路径 这样有利于路径的归纳如下

这将使用官方的   镜像来启动私有仓库。默认情况下，仓库会被创建在 容器的   目录下。你可以通过 -v 参数来将镜像文件存放在 本地的指定路径。例如下面的例子将上传的镜像放到本地的/opt/data/registry 目录

docker run -d --name=my_registry -p 5000:5000 -v /opt/data/registry:/var/lib/registry docker.io/registry


然后回到要上传的客户端主机给要上传的本地镜像"test_nginx"打标签为仓库ip地址/后面是上传仓库后的镜像名称(centos7-nginx)。如下所示：
docker tag test_nginx 192.168.3.138:5000/centos7-nginx

docker push 192.168.3.138:5000/centos7-nginx  #上载镜像
docker pull 192.168.3.138:5000/centos7-nginx  #下载镜像


设置本地docker主机使用本地局域网http私有仓库,默认为https
vi /etc/docker/daemon.json
{"insecure-registries":["192.168.3.138:5000"]}	

如下例所示：
cat > /etc/docker/daemon.json << 'EOF'
{
        "graph":"/docker",
        "storage-driver": "overlay2",
	"insecure-registries":["192.168.3.25:5000"],
        "registry-mirrors": [
               "https://q2gr04ke.mirror.aliyuncs.com",
               "http://hub-mirror.c.163.com",
               "https://docker.mirrors.ustc.edu.cn"
          ],
         "bip": "172.17.0.1/16",
         "exec-opts": ["native.cgroupdriver=systemd"],
         "live-restore": false,
         "dns" : [ "114.114.114.114","8.8.8.8" ]
}
EOF


cat > /etc/docker/daemon.json << 'EOF'
{
        "storage-driver": "overlay2",
	"insecure-registries":["192.168.3.153:5000"],
        "registry-mirrors": [
               "https://q2gr04ke.mirror.aliyuncs.com",
               "http://hub-mirror.c.163.com",
               "https://docker.mirrors.ustc.edu.cn"
          ],
         "bip": "172.17.0.1/16",
         "exec-opts": ["native.cgroupdriver=systemd"],
         "live-restore": false,
         "dns" : [ "114.114.114.114","8.8.8.8" ]
}
EOF

systemctl restart docker  #重启docker服务使设置生效

查看私有仓库镜像
curl http://192.168.3.138:5000/v2/_catalog
curl -XGET http://192.168.3.138:5000/v2/centos7-nginx/tags/list
docker pull 192.168.3.153:5000/centos7-nginx
2.11 安装registry-web

docker pull hyper/docker-registry-web

docker run -d -p 5001:8080 --name registry-web --link my_registry -e REGISTRY_URL=http://192.168.3.25:5000/v2 -e REGISTRY_NAME=192.168.3.25:5000 hyper/docker-registry-web

命令注释
docker run                                      #运行
-d                                                     #后台运行
-p 5001:8080                               #端口映射
--name registry-web                    #容器命名
--link registry                                 #连接其他容器  加入registry到host
-e REGISTRY_URL=http://registry:5000/v2    #指定仓库地址
-e REGISTRY_NAME=localhost:5000               #仓库命名
hyper/docker-registry-web                                 #被启动的镜像

curl http://127.0.0.1:5001

镜像仓库的IP为192.168.3.153实例：
docker run -d -p 5001:8080 --name registry-web --link my_registry -e REGISTRY_URL=http://192.168.3.153:5000/v2 -e REGISTRY_NAME=192.168.3.153:5000 hyper/docker-registry-web

设置本地docker主机使用本地局域网http私有仓库,默认为https
vim /etc/docker/daemon.json 
{
  "registry-mirrors": ["https://4pefdwvq.mirror.aliyuncs.com"],
  "insecure-registries": [ "192.168.3.25:5000" ],
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}

systemctl restart docker

2.12 设置容器开机自启：
docker run --restart=always --net=host --privileged=true -v /web:/usr/local/nginx/html/ -d b8ad90037e3a /bin/bash -c '/usr/local/nginx/sbin/nginx'

注： --restart=always 实用容器开机自启
restart的取值可以是以下3种情况：
no -  容器退出时，不重启容器；
on-failure - 只有在非0状态退出时才从新启动容器；
always - 无论退出状态是如何，都重启容器；
```

8.7 containerd指向本地私有仓库

修改config.toml配置文件

第61行 指定国内镜像仓库

```
 61     sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.6"
```

114行区域可以指定http私库地址 如下所示

```
    144     [plugins."io.containerd.grpc.v1.cri".registry]
    145       config_path = ""
    146 
    147       [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
    148         [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
    149           endpoint = ["https://registry.cn-hangzhou.aliyuncs.com"]
    150         [plugins."io.containerd.grpc.v1.cri".registry.mirrors."192.168.31.252:5000"]
    151           endpoint = ["http://192.168.31.252:5000"]

```

如下为完整config.toml实例

```
[root@master-01 ~]# cat config.toml 
disabled_plugins = []
imports = []
oom_score = 0
plugin_dir = ""
required_plugins = []
root = "/var/lib/containerd"
state = "/run/containerd"
temp = ""
version = 2

[cgroup]
  path = ""

[debug]
  address = ""
  format = ""
  gid = 0
  level = ""
  uid = 0

[grpc]
  address = "/run/containerd/containerd.sock"
  gid = 0
  max_recv_message_size = 16777216
  max_send_message_size = 16777216
  tcp_address = ""
  tcp_tls_ca = ""
  tcp_tls_cert = ""
  tcp_tls_key = ""
  uid = 0

[metrics]
  address = ""
  grpc_histogram = false

[plugins]

  [plugins."io.containerd.gc.v1.scheduler"]
    deletion_threshold = 0
    mutation_threshold = 100
    pause_threshold = 0.02
    schedule_delay = "0s"
    startup_delay = "100ms"

  [plugins."io.containerd.grpc.v1.cri"]
    device_ownership_from_security_context = false
    disable_apparmor = false
    disable_cgroup = false
    disable_hugetlb_controller = true
    disable_proc_mount = false
    disable_tcp_service = true
    enable_selinux = false
    enable_tls_streaming = false
    enable_unprivileged_icmp = false
    enable_unprivileged_ports = false
    ignore_image_defined_volumes = false
    max_concurrent_downloads = 3
    max_container_log_line_size = 16384
    netns_mounts_under_state_dir = false
    restrict_oom_score_adj = false
    sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.6"
    selinux_category_range = 1024
    stats_collect_period = 10
    stream_idle_timeout = "4h0m0s"
    stream_server_address = "127.0.0.1"
    stream_server_port = "0"
    systemd_cgroup = false
    tolerate_missing_hugetlb_controller = true
    unset_seccomp_profile = ""

    [plugins."io.containerd.grpc.v1.cri".cni]
      bin_dir = "/opt/cni/bin"
      conf_dir = "/etc/cni/net.d"
      conf_template = ""
      ip_pref = ""
      max_conf_num = 1

    [plugins."io.containerd.grpc.v1.cri".containerd]
      default_runtime_name = "runc"
      disable_snapshot_annotations = true
      discard_unpacked_layers = false
      ignore_rdt_not_enabled_errors = false
      no_pivot = false
      snapshotter = "overlayfs"

      [plugins."io.containerd.grpc.v1.cri".containerd.default_runtime]
        base_runtime_spec = ""
        cni_conf_dir = ""
        cni_max_conf_num = 0
        container_annotations = []
        pod_annotations = []
        privileged_without_host_devices = false
        runtime_engine = ""
        runtime_path = ""
        runtime_root = ""
        runtime_type = ""

        [plugins."io.containerd.grpc.v1.cri".containerd.default_runtime.options]

      [plugins."io.containerd.grpc.v1.cri".containerd.runtimes]

        [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
          base_runtime_spec = ""
          cni_conf_dir = ""
          cni_max_conf_num = 0
          container_annotations = []
          pod_annotations = []
          privileged_without_host_devices = false
          runtime_engine = ""
          runtime_path = ""
          runtime_root = ""
          runtime_type = "io.containerd.runc.v2"

          [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
            BinaryName = ""
            CriuImagePath = ""
            CriuPath = ""
            CriuWorkPath = ""
            IoGid = 0
            IoUid = 0
            NoNewKeyring = false
            NoPivotRoot = false
            Root = ""
            ShimCgroup = ""
            SystemdCgroup = false

      [plugins."io.containerd.grpc.v1.cri".containerd.untrusted_workload_runtime]
        base_runtime_spec = ""
        cni_conf_dir = ""
        cni_max_conf_num = 0
        container_annotations = []
        pod_annotations = []
        privileged_without_host_devices = false
        runtime_engine = ""
        runtime_path = ""
        runtime_root = ""
        runtime_type = ""

        [plugins."io.containerd.grpc.v1.cri".containerd.untrusted_workload_runtime.options]

    [plugins."io.containerd.grpc.v1.cri".image_decryption]
      key_model = "node"

    [plugins."io.containerd.grpc.v1.cri".registry]
      config_path = ""

      [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
          endpoint = ["https://registry.cn-hangzhou.aliyuncs.com"]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."192.168.31.252:5000"]
          endpoint = ["http://192.168.31.252:5000"]

  [plugins."io.containerd.internal.v1.opt"]
    path = "/opt/containerd"

  [plugins."io.containerd.internal.v1.restart"]
    interval = "10s"

  [plugins."io.containerd.internal.v1.tracing"]
    sampling_ratio = 1.0
    service_name = "containerd"

  [plugins."io.containerd.metadata.v1.bolt"]
    content_sharing_policy = "shared"

  [plugins."io.containerd.monitor.v1.cgroups"]
    no_prometheus = false

  [plugins."io.containerd.runtime.v1.linux"]
    no_shim = false
    runtime = "runc"
    runtime_root = ""
    shim = "containerd-shim"
    shim_debug = false

  [plugins."io.containerd.runtime.v2.task"]
    platforms = ["linux/amd64"]
    sched_core = false

  [plugins."io.containerd.service.v1.diff-service"]
    default = ["walking"]

  [plugins."io.containerd.service.v1.tasks-service"]
    rdt_config_file = ""

  [plugins."io.containerd.snapshotter.v1.aufs"]
    root_path = ""

  [plugins."io.containerd.snapshotter.v1.btrfs"]
    root_path = ""

  [plugins."io.containerd.snapshotter.v1.devmapper"]
    async_remove = false
    base_image_size = ""
    discard_blocks = false
    fs_options = ""
    fs_type = ""
    pool_name = ""
    root_path = ""

  [plugins."io.containerd.snapshotter.v1.native"]
    root_path = ""

  [plugins."io.containerd.snapshotter.v1.overlayfs"]
    mount_options = []
    root_path = ""
    sync_remove = false
    upperdir_label = false

  [plugins."io.containerd.snapshotter.v1.zfs"]
    root_path = ""

  [plugins."io.containerd.tracing.processor.v1.otlp"]
    endpoint = "192.168.31.252:5000"
    insecure = true
    protocol = "http"

[proxy_plugins]

[stream_processors]

  [stream_processors."io.containerd.ocicrypt.decoder.v1.tar"]
    accepts = ["application/vnd.oci.image.layer.v1.tar+encrypted"]
    args = ["--decryption-keys-path", "/etc/containerd/ocicrypt/keys"]
    env = ["OCICRYPT_KEYPROVIDER_CONFIG=/etc/containerd/ocicrypt/ocicrypt_keyprovider.conf"]
    path = "ctd-decoder"
    returns = "application/vnd.oci.image.layer.v1.tar"

  [stream_processors."io.containerd.ocicrypt.decoder.v1.tar.gzip"]
    accepts = ["application/vnd.oci.image.layer.v1.tar+gzip+encrypted"]
    args = ["--decryption-keys-path", "/etc/containerd/ocicrypt/keys"]
    env = ["OCICRYPT_KEYPROVIDER_CONFIG=/etc/containerd/ocicrypt/ocicrypt_keyprovider.conf"]
    path = "ctd-decoder"
    returns = "application/vnd.oci.image.layer.v1.tar+gzip"

[timeouts]
  "io.containerd.timeout.bolt.open" = "0s"
  "io.containerd.timeout.shim.cleanup" = "5s"
  "io.containerd.timeout.shim.load" = "5s"
  "io.containerd.timeout.shim.shutdown" = "3s"
  "io.containerd.timeout.task.state" = "2s"

[ttrpc]
  address = ""
  gid = 0
  uid = 0
[root@master-01 ~]# 

```

复制配置文件并重启containerd

```
systemctl daemon-reload && systemctl restart containerd
```

