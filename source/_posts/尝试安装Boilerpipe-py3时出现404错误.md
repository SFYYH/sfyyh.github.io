---
title: 尝试安装Boilerpipe-py3时出现404错误
date: 2023-08-21 17:28:34
categories: "开发奇遇记"
tags: 
     - "Boilerpipe"
     - "url地址变迁"
     - "Stack Overflow"
---
## 问题提出

Boilerpipe是一个很棒的清理网页的Java程序，我以前也用过它。我今天注意到，许多用户无法安装Python包装器版本并得到404和其他错误。

```bash
C:\Users\COLIN\Downloads\boilerpipe-py3-1.2.0.0\boilerpipe-py3-1.2.0.0>python setup.py
Traceback (most recent call last):
  File "C:\Users\COLIN\Downloads\boilerpipe-py3-1.2.0.0\boilerpipe-py3-1.2.0.0\setup.py", line 33, in <module>
    download_jars(datapath=DATAPATH)
  File "C:\Users\COLIN\Downloads\boilerpipe-py3-1.2.0.0\boilerpipe-py3-1.2.0.0\setup.py", line 26, in download_jars
    urlretrieve(tgz_url, tgz_name)
  File "D:\pythonProject\python\lib\urllib\request.py", line 241, in urlretrieve
    with contextlib.closing(urlopen(url, data)) as fp:
  File "D:\pythonProject\python\lib\urllib\request.py", line 216, in urlopen
    return opener.open(url, data, timeout)
  File "D:\pythonProject\python\lib\urllib\request.py", line 525, in open
    response = meth(req, response)
  File "D:\pythonProject\python\lib\urllib\request.py", line 634, in http_response
    response = self.parent.error(
  File "D:\pythonProject\python\lib\urllib\request.py", line 563, in error
    return self._call_chain(*args)
  File "D:\pythonProject\python\lib\urllib\request.py", line 496, in _call_chain
    result = func(*args)
  File "D:\pythonProject\python\lib\urllib\request.py", line 643, in http_error_default
    raise HTTPError(req.full_url, code, msg, hdrs, fp)
urllib.error.HTTPError: HTTP Error 404: Not Found
```

## 问题解决

我也遇到了同样的问题，这是因为boilerpipe被移动了。我通过在installation tar.gz内的setup.py中将以下代码行从pypi更改为：

老行：

```python
tgz_url = 'https://boilerpipe.googlecode.com/files/boilerpipe-{0}-bin.tar.gz'.format(version)
```

新行：

```python
tgz_url = 'https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/boilerpipe/boilerpipe-{0}-bin.tar.gz'.format(version)
```

重新压缩整个文件夹，并在新的压缩目录上运行`pip install`。