## bug-list
## 一 js报Uncaught SyntaxError: Unexpected token <错误 
vue项目 报Uncaught SyntaxError: Unexpected token < 错误，一般是路径有问题（这里说是当js引用的文件是项目路径下的文件夹时,会报这个错误）。当时出现这个问题 是因为求助我的人他用了CDN 导致  (缓存)   访问了不存在的js，然后这个404错误又重新指向了一个提示的自定义页面，由于脚本里面不允许出现标签因为标签带了<>符号，所以，就会抛出这个异常 从而报错。

还有一个原因，可能是nginx配置与代码静态资源打包方式不匹配
[Nginx解决VUE的history模式下刷新404报错](https://www.jianshu.com/p/5714ec0b9102)

当然了，最直接的，就是先看你的引用路径对不对，这次的问题就是在本地build之后，dist目录下的index不能被自动提交到Git上导致的，此次采用的是对index.html进行单独提交
***
## 二 做某个项目时热更新突然失效
具体表现是css书写完成，必须刷新页面才能看到结果，按理说vue-cli3.0生成的脚手架中应该配置了热更新，但却没有生效。

具体解决办法是：vue.config.js中直接显式声明开启热更新：
```
module.exports={
    devServer:{
        hot:true
    }
}

```
## 三 记录下遇到的一个问题
host:8088/uniccat曾经在其他项目中用过，这次在另一个项目中用到相同端口，相同Url时出现大批报错；
具体变现是：如果由8088/tools跳到8088/uniccat就不会报错，在8088/uniccat刷新页面就会大面积报错：
```
Uncaught SyntaxError: Unexpected token <
```
据目击者判断，可能是由于引用路径问题，于是核查引用的文件，发现报错的全部都是第一个项目中的文件，在当前项目中完全没有加载过......
最后改了url就没事了。是由于浏览器缓存问题？可是我强刷了啊，啊啊啊啊



