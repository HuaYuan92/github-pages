## 每日一读
 1、[XSS攻防实战](https://baike.baidu.com/item/XSS%E6%94%BB%E5%87%BB/954065)
 
XSS 的全称叫跨站脚本攻击（Cross Site Scripting），攻击出现的原因一般是因为 Web 程序对用户的输入过滤不足导致的一种漏洞，攻击者可以把恶意的脚本代码注入到网页之中，当其他用户浏览时就会执行其中的恶意代码，对受害者产生各种攻击。XSS 一般分为三种类型：
* 反射型
* 存储型
* DOM型

 2、[发布订阅/观察者模式](https://juejin.im/post/6865262396672311310)

图文并茂，有案例哦

 3、[webpack与vite的区别](https://molunerfinn.com/learn-vite/)
 
 vite目前只应用于开发环境，利用的是浏览器原生ES imports;
 
 例：我需要访问页面a.html,a.js里引用b.js/c.js，现在c.js更新了：
 
 1、webpack:
 
 webpack编译，打包，启动node服务器，生成bundle.js（a,b,c）,c.js更新了,bundle.js需要重新编译打包，ws通知client，client发送ajax获取更新内容，拿到更新内容后进行刷新;
 
 [关于webpack如何更新](https://www.cnblogs.com/magicg/p/13679273.html)
 
 2、vite:
 
 vite启动node服务器，client访问a.html,对a.html进行实时编译，返回给client，引入a.js,解析到引用b.js/c.js时，再引入b.js,c.js，如果c.js更新，只返回c.js，所以更快，对环境要求更高，暂时只试用于开发环境；
 
