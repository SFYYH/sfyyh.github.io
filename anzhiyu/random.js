var posts=["2024/06/23/LNMP环境准备/","2024/06/23/LNMP环境工作原理/","2024/06/23/MySql的几种安装方式/","2024/06/23/Socket套接字/","2024/06/25/Docker/","2024/06/25/Linux自有服务和软件包/","2024/06/25/Linux进程检测与空值/","2024/06/25/Mysql主从架构/","2024/06/25/Mysql数据库的备份与恢复/","2024/06/25/Mysql高可用解决方案/","2024/06/25/SpringCloud微服务以及集成Gogs-Jenkins/","2024/06/28/SpringCloud01/","2024/06/28/Eureka注册中心/","2024/06/28/Ribbon负载均衡/","2024/06/28/Nacos注册中心/","2024/06/28/负载均衡算法/","2024/06/28/Nacos安装指南/","2024/06/28/Nacos集群搭建/","2024/06/28/一键SHELL脚本/","2024/06/29/GitLab部署/","2024/06/29/持续集成-CI/","2024/06/29/持续交付-CD/","2024/06/29/代码更新方法/","2024/06/30/企业架构双点服务器HA/","2024/06/30/VRR协议详解/","2024/05/30/软件工程导论重点/","2024/07/01/Jenkins入门指南/","2024/07/03/Vue脚手架基础/","2024/07/03/Vue组件通信基础/","2024/07/03/生命周期/","2022/07/03/Vue通信组件核心问题/","2022/07/03/Vue生命周期-核心问题/","2024/07/05/ERP系统/","2024/07/05/Activiti7/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };