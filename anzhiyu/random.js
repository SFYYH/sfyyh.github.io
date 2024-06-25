var posts=["2024/06/23/LNMP环境准备/","2024/06/23/LNMP环境工作原理/","2024/06/23/MySql的几种安装方式/","2024/06/23/Socket套接字/","2024/06/25/Docker/","2024/06/25/Linux自有服务和软件包/","2024/06/25/Linux进程检测与空值/","2024/06/25/Mysql主从架构/","2024/06/25/Mysql数据库的备份与恢复/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };