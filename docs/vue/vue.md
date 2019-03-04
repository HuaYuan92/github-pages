## Vue
### 一 对MVVM的理解
MVVM分为Model、View、ViewModel三者。

Model：代表数据模型，数据和业务逻辑都在Model层中定义；

View：代表UI视图，负责数据的展示；

ViewModel：负责监听Model中数据的改变并且控制视图的更新，处理用户交互操作；

Model和View并无直接关联，而是通过ViewModel来进行联系的，Model和ViewModel之间有着双向数据绑定的联系。因此当Model中的数据改变时会触发View层的刷新，View中由于用户交互操作而改变的数据也会在Model中同步。

这种模式实现了Model和View的数据自动同步，因此开发者只需要专注对数据的维护操作即可，而不需要自己操作dom。
***
### 二 v-if 和v-show的区别
v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。

v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

相比之下，v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。

一般来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。
不推荐同时使用 v-if 和 v-for。请查阅风格指南以获取更多信息。

当 v-if 与 v-for 一起使用时，v-for 具有比 v-if 更高的优先级。请查阅列表渲染指南 以获取详细信息。
***
### 三 简述Vue的响应式原理 
当你把一个普通的 JavaScript 对象传给 Vue 实例的 data 选项，Vue 将遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter。Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是为什么 Vue 不支持 IE8 以及更低版本浏览器。

这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。这里需要注意的问题是浏览器控制台在打印数据对象时 getter/setter 的格式化并不同，所以你可能需要安装 vue-devtools 来获取更加友好的检查接口。

每个组件实例都有相应的 watcher 实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。
[vue官网链接](https://cn.vuejs.org/v2/guide/reactivity.html)
受现代 JavaScript 的限制 (而且 Object.observe 也已经被废弃)，Vue 不能检测到对象属性的添加或删除。由于 Vue 会在初始化实例时对属性执行 getter/setter 转化过程，所以属性必须在 data 对象上存在才能让 Vue 转换它，这样才能让它是响应的。

Vue 不允许在已经创建的实例上动态添加新的根级响应式属性 (root-level reactive property)。然而它可以使用
 ```
 Vue.set(object, key, value)
 ```
  方法将响应属性添加到嵌套的对象上：
  ```
 Vue.set(vm.someObject, 'b', 2)
 ```
 您还可以使用 vm.$set 实例方法，这也是全局 Vue.set 方法的别名：
```
 this.$set(this.someObject,'b',2)
 ```
***
### 四 在组件内部实现一个双向数据绑定
在有些情况下，我们可能需要对一个 prop 进行“双向绑定”。不幸的是，真正的双向绑定会带来维护上的问题，因为子组件可以修改父组件，且在父组件和子组件都没有明显的改动来源。

这也是为什么我们推荐以 update:myPropName 的模式触发事件取而代之。

在一个包含 title prop 的假设的组件中，我们可以用以下方法表达对其赋新值的意图：
```
this.$emit('update:title', newTitle)
```
然后父组件可以监听那个事件并根据需要更新一个本地的数据属性。例如：
```
<text-document v-bind:title="doc.title" v-on:update:title="doc.title = $event" ></text-document>
```
为了方便起见，我们为这种模式提供一个缩写，即 .sync 修饰符：
```
<text-document v-bind:title.sync="doc.title"></text-document>
```
***
### 五 监测某个属性值的变化
比如现在需要监控data中， obj.a 的变化。Vue中监控对象属性的变化你可以这样：
```
watch: {
      obj: {
      handler (newValue, oldValue) {
        console.log('obj changed')
      },
      deep: true
    }
  }
  ```
deep属性表示深层遍历，但是这么写会监控obj的所有属性变化，并不是我们想要的效果，所以做点修改

```
watch: {
'obj.a': {
      handler (newName, oldName) {
        console.log('obj.a changed')
      }
   }
  }
  ```
  还有一种方法，可以通过computed 来实现，只需要：
  ```
  computed: {
      a1 () {
  return this.obj.a
      }
  }
  ```
  ***
  
### 六 delete和vue.$delete删除数组
  
  delete只是被删除的元素变成了 empty/undefined 其他的元素的键值还是不变。
  
  Vue.$delete 直接删除了数组 改变了数组的键值。
  ```
  let a=[1,2,3,4];
  let b=[5,6,7,8];
  delete a[1]
  a=[1,undefined,3,4];
  vue.$delete(b,1)
  b=[5,7,8]
  ```
  ****
  
 ### 七 服务器端渲染 (SSR)
 
 与传统 SPA (单页应用程序 (Single-Page Application)) 相比，服务器端渲染 (SSR) 的优势主要在于：
 
 * 更好的 SEO，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。
 
 * 更快的内容到达时间 (time-to-content)，特别是对于缓慢的网络情况或运行缓慢的设备。无需等待所有的 JavaScript 都完成下载并执行，才显示服务器渲染的标记，所以你的用户将会更快速地看到完整渲染的页面。通常可以产生更好的用户体验，并且对于那些「内容到达时间(time-to-content) 与转化率直接相关」的应用程序而言，服务器端渲染 (SSR) 至关重要。
 
 使用服务器端渲染 (SSR) 时还需要有一些权衡之处：
 
 * 开发条件所限。浏览器特定的代码，只能在某些生命周期钩子函数 (lifecycle hook) 中使用；一些外部扩展库 (external library) 可能需要特殊处理，才能在服务器渲染应用程序中运行。
 
 * 涉及构建设置和部署的更多要求。与可以部署在任何静态文件服务器上的完全静态单页面应用程序 (SPA) 不同，服务器渲染应用程序，需要处于 Node.js server 运行环境。
 
 * 更多的服务器端负载。在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用 CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 (high traffic) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。
 ***
 
 ### 八 服务器端渲染 vs 预渲染
 
 如果你调研服务器端渲染 (SSR) 只是用来改善少数营销页面（例如 /, /about, /contact 等）的 SEO，那么你可能需要预渲染。无需使用 web 服务器实时动态编译 HTML，而是使用预渲染方式，在构建时 (build time) 简单地生成针对特定路由的静态 HTML 文件。优点是设置预渲染更简单，并可以将你的前端作为一个完全静态的站点。
 
 如果你使用 webpack，你可以使用 prerender-spa-plugin 轻松地添加预渲染。它已经被 Vue 应用程序广泛测试
 ***
 
 ### 九 vue项目的优化
 
 * 将公用的JS库通过script标签外部引入，减小 app.bundel 的大小，让浏览器并行下载资源文件，提高下载速度；
 
 *  在配置 路由时，页面和组件使用懒加载的方式引入，进一步缩小 app.bundel 的体积，在调用某个组件时再加载对应的js文件
 
 * 加一个首屏loading图，提升用户体验
 ***
 
 ### 十 vue-router中hash模式和history模式对比
 
 * hash 即在地址URL中的#符号，比如：http://www.ac.com/#/home。原理是：hash虽然出现在URL中，但是不会被包括在HTTP请求中，对后端完全没有影响，因此改变hash不会重新加载页面。
 
 * history 利用了HTML5 History Interface中新增的pushState()和replaceState()的方法，这两个方法应用于浏览器的历史记录栈，在当前已有的 back、forward、go 的基础之上，它们提供了对历史记录进行修改的功能。只是当它们执行修改时，虽然改变了当前的URL，但浏览器不会立即向后端发送请求。
 
 ### 十一 路由懒加载
 
 当执行build命令构建生产包时，我之前的项目一般都会生成一个js文件，此时js文件相对较大，可能会影响页面的加载。路由的懒加载就是把不同路由对应的组件分割成不同的代码块，然后在当路由被访问时再加载对应组件，相对打包成一整个文件来说，会更加高效。
 ```
 const Foo = () => import('./Foo.vue')

 const router = new VueRouter({
   routes: [
    { path: '/foo', component: Foo }
   ]
 })
 ```
 
 
