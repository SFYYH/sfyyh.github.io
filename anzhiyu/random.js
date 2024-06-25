var posts=["2024/06/23/LNMP环境准备/","2024/06/23/LNMP环境工作原理/","2024/06/23/MySql的几种安装方式/","2024/06/23/Socket套接字/","2024/06/25/Docker/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };