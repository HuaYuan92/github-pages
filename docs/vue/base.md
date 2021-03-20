## 前端基础
## 一 数据持久化
* cookie 生命期为只在设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭。 存放数据大小为4K左右 。有个数限制（各浏览器不同），一般不能超过20个。与服务器端通信：每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题。
* localStorage 生命周期是永久，这意味着除非用户显示在浏览器提供的UI上清除localStorage信息，否则这些信息将永远存在。存放数据大小为一般为5MB,而且它仅在客户端（即浏览器）中保存，不参与和服务器的通信。
* sessionStorage 为每一个数据源维持一个存储区域，在浏览器打开期间存在，包括页面重新加载。不同的浏览器存储的上限也不一样，但大多数浏览器把上限限制在5MB以下。

## 二 function传值属于值传递（堆栈概念）
* 值类型，当为函数传递参数的时候，是将此值复制一份传递给函数，所以在函数执行之后，num本身的值并没有被改变，函数中被改变的值仅仅是一个副本而已。例如`string`，12
* 引用类型，当为函数传递参数的时候，是传递的web对象的引用，也就是此对象的内存地址，所以在函数中修改属性的对象就是函数外面创建的对象本身。
```
function setName(obj)
{ 
  obj.name="青岛新锐"; 
  obj=new Object(); 
  obj.name="蚂蚁部落"; 
} 
var web=new Object(); 
setName(web); 
console.log(web.name);
```
以上代码的弹出值是:青岛新锐，很多人可能会以为将会弹出“蚂蚁部落”，下面进行一下简单的分析:
在函数外面创建一个对象，并将对象的引用赋值给变量web，web中存储的是对象在内存中的存储地址，当为函数传递参数时，就是传递的在函数外面创建的对象的地址。在函数中，为外面创建的对象创建一个自定义属性name并赋值为“青岛新锐”，然后又创建一个新的对象，并将新对象的地址赋值给obj，这个时候obj指向的并不是函数外面创建的对象，所以外面对象name属性不会被改变。简单地说，就是传入的参数是一个引用的副本，通过这个副本引用，我们可以访问到外部的对象，但是在我们手动将引用地址修改后，函数内访问的是另一个对象，而不是外部的对象。
> 重点就是我们传入的是一个值引用的副本！！！

## 三 bind,apply,call和this的关系
其实三个方法实际上的作用都是改变函数运行时this的指向，所以我要先来理一理this的指向问题。就我的理解而言，实际上ES6之后很少关注this的指向问题了。
* 方法调用模式：this指向当前对象。
```
let a =1;
let obj={
a:2,
fn:function(){
console.log(this.a)
}
}
obj.fn()
```
* 普通函数调用：此时this被绑定到window上
```
function fn1(){
    console.log(this)//window;
}
//包括函数嵌套也是一样
function fn1(){
    function fn2(){
        console.log(this)//window
    }
}
// 把函数赋值之后再调用
let a =1;
let obj = {
    a:2,
    fn:function(){
        console.log(this.a)
    }
}
let fn1=obj.fn;
fn1()//1
fn1()调用实际上就是不带任何修饰的函数调用，相当于function(){ console.log(this.a) }.call(undefined),对于传入的context是null或者undefined,那么window对象就是默认的context（严格模式下默认 context 是 undefined）。因此上面的this绑定的就是window，这也被称为隐形绑定。
```
* 构造器调用：new一个函数时，背地里会将创建一个连接到prototype成员的新对象，同时this会被绑定到那个新对象上
 ```
    function Person(name='name',age=18){
        //this都指向创建的实例
        this.name=name;
        this.age=age;
        this.sayAge=function(){
            console.log(this.age)
        }
    }
    let dot =new Person('Dot',2);
    dot.sayAge() //2
 ``` 
* call call方法的第一个参数是要绑定给this的值，后面传入的是一个参数列表。当第一个参数为null，undefined的时候，默认指向window。  
```
let obj = {
    message: 'My name is: '
}
function getName(firstName, lastName) {
    console.log(this.message + firstName + ' ' + lastName)
}
getName.call(obj, 'Dot', 'Dolby')
``` 
* apply apply接受两个参数，第一个参数是要绑定给this的值，第二个参数是一个参数数组。当第一个参数为null、undefined的时候，默认指向window。
```
let obj = {
    message: 'My name is: '
}
function getName(firstName, lastName) {
    console.log(this.message + firstName + ' ' + lastName)
}
getName.apply(obj, ['Dot', 'Dolby'])// My name is: Dot Dolby
可以看到，obj 是作为函数上下文的对象，函数 getName 中 this 指向了 obj 这个对象。参数 firstName 和 lastName 是放在数组中传入 getName 函数。
事实上apply 和 call 的用法几乎相同, 唯一的差别在于：当函数需要传递多个变量时, apply 可以接受一个数组作为参数输入, call 则是接受一系列的单独变量。
```
* bind 和call很相似，第一个参数是this的指向，从第二个参数开始是接收的参数列表。区别在于bind方法返回值是函数以及bind接收的参数列表的使用。
```
let obj = {
    name: 'Dot'
}
function printName() {
    console.log(this.name)
}
let dot = printName.bind(obj)
console.log(dot) // function () { … }
dot()  // Dot
bind 方法不会立即执行，而是返回一个改变了上下文 this 后的函数。而原函数 printName 中的 this 并没有被改变，依旧指向全局对象 window。
```


 


## 四 深究scoped模块私有化
 * scoped 主要作用再于：当一个style标签有scoped属性时，由它定义的css样式只能作用于当前的vue组件，可以使组件的样式不互相污染。
 * 实现原理：通过postcss为转译后的dom添加唯一的动态属性，css编译为对应的属性选择器，这样就使的当前的样式只作用于含有该属性的dom元素。
 * 如何对子组件进行scoped穿透：
   > 在stylus中：使用 >>> 例如：.warpper>>>.swiper-pagination
   
   > 在sass和less中，使用/deep/ 例如：.warpper /deep/ .swiper-pagination
   
 * 在组件中修改第三方组件库样式的其他方法：使用两个style标签，一个使用scoped，一个不使用，6不6 ，就是这么简单...
 
## 五 发布自己的NPM包
 * npm adduser 添加用户
 * npm publish 发布NPM包，完事...
 
## 六 将1.2版本的elementUI升级到最新版本的尝试
 * 克隆elementUI最新版
 * 改名，将elementUI改名为axx-element-ui
 * 发布axx-element-ui npm包
 * 在项目中引入axx-element-ui，修改.babelrc文件
 * 引入成功
 BUT：由于element最新版依赖的vue版本跟现有版本不同，所以有些UI组件的功能并不能使用，比如$attr这个API在vue2.4以后才能使用；尝试升级vue版本，各种报错，当前项目太大太老，要单独升级某个依赖并不可能，个人感觉只有全局依赖一起升级这条路，升级的话，还需要改原有的业务代码，实际上相当于重写当前项目，工作量还是蛮大的，暂时搁浅。
 
 ## 七 restful
 * 用URL定位资源，用HTTP描述操作：
   在设计web接口的时候，REST主要是用于定义接口名，接口名一般是用名次写，不用动词，那怎么表达“获取”或者“删除”或者“更新”这样的操作呢——用请求类型来区分。比如，我们有一个friends接口，对于“朋友”我们有增删改查四种操作，怎么定义REST接口？
   
   1、增加一个朋友，uri: generalcode.cn/v1/friends 接口类型：POST 
   
   2、删除一个朋友，uri: generalcode.cn/va/friends 接口类型：DELETE
   
   3、修改一个朋友，uri: generalcode.cn/va/friends 接口类型：PUT
   
   4、查找朋友，uri: generalcode.cn/va/friends 接口类型：GET
   
   上面我们定义的四个接口就是符合REST协议的，请注意，这几个接口都没有动词，只有名词friends，都是通过Http请求的接口类型来判断是什么业务操作。
   举个反例：generalcode.cn/va/deleteFriends 该接口用来表示删除朋友，这就是不符合REST协议的接口。
   
   用HTTP Status Code传递Server的状态信息。比如最常用的 200 表示成功，500 表示Server内部错误，403表示Bad Request等。（反例：传统web开发返回的状态码一律都是200，其实不可取。）
   
   那这种风格的接口有什么好处呢？前后端分离。前端拿到数据只负责展示和渲染，不对数据做任何处理。后端处理数据并以JSON格式传输出去，定义这样一套统一的接口，在web，ios，android三端都可以用相同的接口，是不是很爽？！
   
 ## 八 Chrome打开一个页面需要启动多少进程？分别是哪些进程？
 - 打开 1 个页面至少需要 1 个网络进程、1 个浏览器进程、1 个 GPU 进程以及 1 个渲染进程，共 4 个；最新的 Chrome 浏览器包括：1 个浏览器（Browser）主进程、1 个 GPU 进程、1 个网络（NetWork）进程、多个渲染进程和多个插件进程。
 
 - 浏览器进程：主要负责界面显示、用户交互、子进程管理，同时提供存储等功能。
 
 - 渲染进程：核心任务是将 HTML、CSS 和 JavaScript 转换为用户可以与之交互的网页，排版引擎 Blink 和 JavaScript 引擎 V8 都是运行在该进程中，默认情况下，Chrome 会为每个 Tab 标签创建一个渲染进程。出于安全考虑，渲染进程都是运行在沙箱模式下。
 
 - GPU 进程：其实，Chrome 刚开始发布的时候是没有 GPU 进程的。而 GPU 的使用初衷是为了实现 3D CSS 的效果，只是随后网页、Chrome 的 UI 界面都选择采用 GPU 来绘制，这使得 GPU 成为浏览器普遍的需求。最后，Chrome 在其多进程架构上也引入了 GPU 进程。
 
 - 网络进程：主要负责页面的网络资源加载，之前是作为一个模块运行在浏览器进程里面的，直至最近才独立出来，成为一个单独的进程。
 
 - 插件进程：主要是负责插件的运行，因插件易崩溃，所以需要通过插件进程来隔离，以保证插件进程崩溃不会对浏览器和页面造成影响。
 
 ## 九 Promise
 
 ## 十 JS事件队列
  * 所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）
  * 等待任务的回调结果进入一种任务队列(task queue)。
  * 当主执行栈中的同步任务执行完毕后才会读取任务队列，任务队列中的异步任务（即之前等待任务的回调结果）会塞入主执行栈，
  * 异步任务执行完毕后会再次进入下一个循环。
  
  在实际情况中，上述的任务队列(task queue)中的异步任务分为两种：微任务（micro task)和宏任务（macro task)。
  * micro task事件：Promises(浏览器实现的原生Promise)、MutationObserver、process.nextTick
  * macro task事件：setTimeout、setInterval、setImmediate、I/O、UI rendering
  * 这里注意：script(整体代码)即一开始在主执行栈中的同步代码本质上也属于macrotask，属于第一个执行的task
  ```
  microtask和macotask执行规则：
   *  macrotask按顺序执行，浏览器的ui绘制会插在每个macrotask之间；
   *  microtask按顺序执行，会在如下情况下执行：
      * 每个callback之后，只要没有其他的JS在主执行栈中；
      * 每个macrotask结束时
  
```
 ## 十一 Hybrid App H5与原生的交互原理
 * 单向通信
 
   1、不需要传参的通信，如页面跳转；
   2、需要传参的通信：URL传参/window传参
   ```
   因为 app 是宿主，可以直接访问 h5，所以这种调用比较简单，就是在 h5 中曝露一些全局对象（包括方法），然后在原生 app中调用这些对象。
   H5：
   window.sdk={
    double = value => value * 2
   }
  
   IOS
   NSString *func = @"window.sdk.double(10)";
   NSString *str = [webview stringByEvaluatingJavaScriptFromString:func];// 20

   ```
  
 * 双向通信
 
   上面说的单向通信的交互通常会使一个简单的方法变得非常割裂，在一些稍微复杂的场景之下，双端的维护成本很高，因此通常我们使用双向通信的时候更多一些。我们可以在回调函数中做很多事情。这里就要提到大家耳熟能详的[WebViewJavaScriptBridge](https://www.cnblogs.com/dailc/p/5931324.html)
 
   WebViewJavaScriptBridge的基本原理简单来说就是，建立一个桥梁，然后注册自己，调用他人。
   
   H5触发url scheme->Native捕获url scheme->原生分析,执行->原生调用h5
   
   URL Scheme 是一种特殊的 URL，一般用于在 Web 端唤醒 App，甚至跳转到 App 的某个页面，比如在某个手机网站上付款的时候，可以直接拉起支付宝支付页面。
   
   这里有个小例子，你可以在浏览器里面直接输入 weixin://，系统就会提示你是否要打开微信。输入 mqq:// 就会帮你唤起手机 QQ。
   
   * 把 OC 的方法注册到桥梁中，让 JS 去调用。
 
   * 把 JS 的方法注册在桥梁中，让 OC 去调用。
  
  ## 十二 为什么DOM操作影响性能
  
  在浏览器当中，dom的实现和ECMAScript的实现是分离的。
  
  例如，在IE中，ECMAScrit的实现在jscript.dll中，而DOM的实现在mshtml.dll中；在Chrome中使用WebKit中的 WebCore处理DOM和渲染，但ECMAScript是在V8引擎中实现的，其他浏览器的情况类似。
  
  因此，操作dom，就是通过js代码调用dom的接口，就相当于两个相互独立的模块发生了交互。这样，相比于在同一个模块当中互相调用，这种跨模块的调用它的性能损耗是非常高的。
  
  然而，dom操作影响性能最主要是因为它导致了浏览器的重绘（repaint）和重排（reflow）。
  
  为了可以更加深刻地理解重绘和重排对性能的影响，需要简单了解一下浏览器的渲染原理。
  
  从下载文档到渲染页面的过程中，浏览器会通过解析HTML文档来构建DOM树，解析CSS产生CSS规则树。JavaScript代码在解析过程中， 可能会修改生成的DOM树和CSS规则树。之后根据DOM树和CSS规则树构建渲染树，在这个过程中CSS会根据选择器匹配HTML元素。渲染树包括了每 个元素的大小、边距等样式属性，渲染树中不包含隐藏元素及head元素等不可见元素。最后浏览器根据元素的坐标和大小来计算每个元素的位置，并绘制这些元 素到页面上。无论何时总会有一个初始化的页面布局伴随着一次绘制。
  
  优化方法：
  * 将dom操作积累起来作批量操作
  * 合并多次的DOM操作为单次的DOM操作
  * 使用文档片段
  * 通过设置DOM元素的display样式为none来隐藏元素
  * 克隆DOM元素到内存中
  * 设置具有动画效果的DOM元素的position属性为fixed或absolute
  
  ## 十三 HTTP Request请求参数
  * HOST：HOST表示请求的目的地，也就是请求的Web服务器域名地址
  * User-Agent：User-Agent记录着HTTP客户端运行的浏览器类型的详细信息，Web服务器可通过User-Agent判断当前HTTP请求客户端浏览器的类别
  * Accept：Accept的作用是向Web服务器申明客户端浏览器可以接收的媒体类型（MIME）的资源，简单来说就是表示浏览器支持的MIME类型
  * Accept-Language：Accept-Language指定HTTP客户端浏览器用来返回信息时优先选择的语言
  * Accept-Encoding：Accept-Encoding指定客户端浏览器可以支持的Web服务器返回内容压缩编码的类型
  * Content-Type：Content-Type表示HTTP请求提交的内容类型，只有在POST方法提交时才需要设置此属性
  * Content-Length：Content-Type是请求体内容的长度，单位字节（byte），并不包含请求行和请求头的数据长度
  * Connection：Connection表示是否需要持久连接，如果Web服务器接收到Connection的属性值为Keep-Alive，或者请求所使用的协议版本是HTTP 1.1（默认持久连接），此时就会采用持久连接
  * Keep-Alive：Keep-Alive指定HTTP持久连接的时长，用来保证客户端到服务器的连接持续有效。当出现对服务器的后续请求时，Keep-Alive可以避免重建连接
  * Cookie
  * Refer：Refer包含了一个URL，表示用户从该URL页面触发访问当前请求的页面
  * Cache-Control：Cache-Control用于指定请求和响应遵循的缓存机制，在请求消息或响应消息中设置Cache-Control并不会修改另一个消息处理过程中的缓存处理过程
  
  ## 十四 HTTP Request response header
  * Set-Cookie：非常重要的header, 用于把cookie 发送到客户端浏览器， 每一个写入cookie都会生成一个Set-Cookie
  * Content-Type：WEB服务器告诉浏览器自己响应的对象的类型和字符集
  * Content-Length：指明实体正文的长度，以字节方式存储的十进制数字来表示
  * Content-Encoding：WEB服务器表明自己使用了什么压缩方法（gzip，deflate）压缩响应中的对象
  * Content-Language：WEB服务器告诉浏览器自己响应的对象的语言者
  * Server：指明HTTP服务器的软件信息
  * Connection：是否需要持久连接
  * Location：用于重定向一个新的位置, 包含新的URL地址
  
  ## 十五 [前端安全](https://zhuanlan.zhihu.com/p/83865185)
  * crsf攻击如何获取用户cookie==>在攻击者页面使用script,img,iframe等方式加载攻击对象的地址，这样就会自动带上cookie
  ## 十六 new 函数
  1、首先创建一个空的对象，空对象的__proto__属性指向构造函数的原型对象  
  2、把上面创建的空对象赋值构造函数内部的this，用构造函数内部的方法修改空对象  
  3、如果构造函数返回一个非基本类型的值，则返回这个值，否则上面创建的对象  
  ```$xslt
function _new(fn, ...arg) {
    var obj = Object.create(fn.prototype);
    const result = fn.apply(obj, ...arg);
    return Object.prototype.toString.call(result) == '[object Object]' ? result : obj;
}
```

  
  

   
