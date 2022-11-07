## 使用
### 1. 获取到视频的 m3u8 文件内容保存到 index.m3u8 中
### 2. 修改 app.js 中 host 值，host 值指 m3u8 链接去除 m3u8 文件名的部分(包括'/'符号) 例如 https://cdn123456789.51551.cn:4433/73sm/asmr/1663314432/hls.m3u8 host 为 https://cdn123456789.51551.cn:4433/73sm/asmr/1663314432/
### 3. 修改 app.js 中 outputName 自定义输入视频文件名
### 4. 使用 npm 安装依赖包
```bash
    npm i request # 或者 yarn add request
    npm i fs-extra # 或者 yarn add fs-extra
```
### 5. 执行命令
```bash
    node app.js
```
## 问题
### 1. 既然我有了 m3u8 文件链接，为什么不直接使用 ffmpeg -i https://***/index.m3u8 filename.mp4 来下载呢？
> 这个程序写的比较简陋，如果丰富一下内容，比如自动获取某个网页中的 m3u8 在进行下载就不会显得多此一举。（这个我有在写，不过不够通用，没有 push 进来
> 仅供参考，可拿去自定义、增加功能
### 2. 其它问题
可以看我的博文 [ApplePine's Blog](https://www.applepine.cn/posts/m3u8_downloader/)