## 前端基础
### 一 数据持久化
* cookie 生命期为只在设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭。 存放数据大小为4K左右 。有个数限制（各浏览器不同），一般不能超过20个。与服务器端通信：每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题。
* localStorage 生命周期是永久，这意味着除非用户显示在浏览器提供的UI上清除localStorage信息，否则这些信息将永远存在。存放数据大小为一般为5MB,而且它仅在客户端（即浏览器）中保存，不参与和服务器的通信。
* sessionStorage 为每一个数据源维持一个存储区域，在浏览器打开期间存在，包括页面重新加载。不同的浏览器存储的上限也不一样，但大多数浏览器把上限限制在5MB以下。


### 二 function传值属于值传递
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

### 三 bind,apply,call和this的关系
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


 


### 四 深究scoped模块私有化
 * scoped 主要作用再于：当一个style标签有scoped属性时，由它定义的css样式只能作用于当前的vue组件，可以使组件的样式不互相污染。
 * 实现原理：通过postcss为转译后的dom添加唯一的动态属性，css编译为对应的属性选择器，这样就使的当前的样式只作用于含有该属性的dom元素。
 * 如何对子组件进行scoped穿透：
   > 在stylus中：使用 >>> 例如：.warpper>>>.swiper-pagination
   
   > 在sass和less中，使用/deep/ 例如：.warpper /deep/ .swiper-pagination
   
 * 在组件中修改第三方组件库样式的其他方法：使用两个style标签，一个使用scoped，一个不使用，6不6 ，就是这么简单...
 
