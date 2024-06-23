var posts=["2024/06/23/LNMP环境准备/","2024/06/23/LNMP环境工作原理/","2024/06/23/Socket套接字/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };