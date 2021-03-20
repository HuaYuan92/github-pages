## Vue
## 一 对MVVM的理解
MVVM分为Model、View、ViewModel三者。

Model：代表数据模型，数据和业务逻辑都在Model层中定义；

View：代表UI视图，负责数据的展示；

ViewModel：负责监听Model中数据的改变并且控制视图的更新，处理用户交互操作；

Model和View并无直接关联，而是通过ViewModel来进行联系的，Model和ViewModel之间有着双向数据绑定的联系。因此当Model中的数据改变时会触发View层的刷新，View中由于用户交互操作而改变的数据也会在Model中同步。

这种模式实现了Model和View的数据自动同步，因此开发者只需要专注对数据的维护操作即可，而不需要自己操作dom。
***
## 二 v-if 和v-show的区别
v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。

v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

相比之下，v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。

一般来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。
不推荐同时使用 v-if 和 v-for。请查阅风格指南以获取更多信息。

当 v-if 与 v-for 一起使用时，v-for 具有比 v-if 更高的优先级。请查阅列表渲染指南 以获取详细信息。
***
## 三 简述Vue的响应式原理 
当你把一个普通的 JavaScript 对象传给 Vue 实例的 data 选项，Vue 将遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter。Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是为什么 Vue 不支持 IE8 以及更低版本浏览器（Object.defineProperty只能劫持对象的属性，从而需要对每个对象，每个属性进行遍历，如果，属性值是对象，还需要深度遍历。Proxy可以劫持整个对象，并返回一个新的对象。Object.defineProperty本身是可以监控到数组下标的变化的，但是在 Vue 中，从性能/体验的性价比考虑，尤大大就弃用了这个特性）。

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
## 四 在组件内部实现一个双向数据绑定
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
## 五 监测某个属性值的变化
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
  
## 六 delete和vue.$delete删除数组
  
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
  
 ## 七 服务器端渲染 (SSR)
 
 与传统 SPA (单页应用程序 (Single-Page Application)) 相比，服务器端渲染 (SSR) 的优势主要在于：
 
 * 更好的 SEO，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。
 
 * 更快的内容到达时间 (time-to-content)，特别是对于缓慢的网络情况或运行缓慢的设备。无需等待所有的 JavaScript 都完成下载并执行，才显示服务器渲染的标记，所以你的用户将会更快速地看到完整渲染的页面。通常可以产生更好的用户体验，并且对于那些「内容到达时间(time-to-content) 与转化率直接相关」的应用程序而言，服务器端渲染 (SSR) 至关重要。
 
 使用服务器端渲染 (SSR) 时还需要有一些权衡之处：
 
 * 开发条件所限。浏览器特定的代码，只能在某些生命周期钩子函数 (lifecycle hook) 中使用；一些外部扩展库 (external library) 可能需要特殊处理，才能在服务器渲染应用程序中运行。
 
 * 涉及构建设置和部署的更多要求。与可以部署在任何静态文件服务器上的完全静态单页面应用程序 (SPA) 不同，服务器渲染应用程序，需要处于 Node.js server 运行环境。
 
 * 更多的服务器端负载。在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用 CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 (high traffic) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。
 ***
 
 ## 八 服务器端渲染 vs 预渲染
 
 如果你调研服务器端渲染 (SSR) 只是用来改善少数营销页面（例如 /, /about, /contact 等）的 SEO，那么你可能需要预渲染。无需使用 web 服务器实时动态编译 HTML，而是使用预渲染方式，在构建时 (build time) 简单地生成针对特定路由的静态 HTML 文件。优点是设置预渲染更简单，并可以将你的前端作为一个完全静态的站点。
 
 如果你使用 webpack，你可以使用 prerender-spa-plugin 轻松地添加预渲染。它已经被 Vue 应用程序广泛测试
 补充一点，prerender-spa-plugin这个插件有时在安装/打包时会出现问题，应该是它引用的插件出现了问题，暂时去掉了这个插件。
 ***
 
 ## 九 vue项目的优化
 
 * 将公用的JS库通过script标签外部引入，减小 app.bundel 的大小，让浏览器并行下载资源文件，提高下载速度；
 
 *  在配置 路由时，页面和组件使用懒加载的方式引入，进一步缩小 app.bundel 的体积，在调用某个组件时再加载对应的js文件
 
 * 加一个首屏loading图，提升用户体验
 ***
 
 ## 十 vue-router中hash模式和history模式对比
 
 * hash 即在地址URL中的#符号，比如：http://www.ac.com/#/home。原理是：hash虽然出现在URL中，但是不会被包括在HTTP请求中，对后端完全没有影响，因此改变hash不会重新加载页面。
 
 * history 利用了HTML5 History Interface中新增的pushState()和replaceState()的方法，这两个方法应用于浏览器的历史记录栈，在当前已有的 back、forward、go 的基础之上，它们提供了对历史记录进行修改的功能。只是当它们执行修改时，虽然改变了当前的URL，但浏览器不会立即向后端发送请求。
 
 ## 十一 路由懒加载
 
 当执行build命令构建生产包时，我之前的项目一般都会生成一个js文件，此时js文件相对较大，可能会影响页面的加载。路由的懒加载就是把不同路由对应的组件分割成不同的代码块，然后在当路由被访问时再加载对应组件，相对打包成一整个文件来说，会更加高效。
 ```
 const Foo = () => import('./Foo.vue')

 const router = new VueRouter({
   routes: [
    { path: '/foo', component: Foo }
   ]
 })
 ```
 ## 十二 父子组件双向数据绑定的实现
 
 除了子组件使用$emit（）向外传值的方式之外，我们还可以通过v-model来实现父子组件的相互传值。但是双向数据绑定又会带来维护上的问题，因为子组件可以修改父组件，且在父子组件之间都没有明显的改动来源。推荐使用.sync修饰符，组件内部以'this.$emit('update:myPropName',value)'来对myPropName进行赋值。
 ```
v-model:
 Vue.component('base-checkbox', {
   model: {
     prop: 'checked',
     event: 'change'
   },
   props: {
     checked: Boolean
   },
   template: `
     <input
       type="checkbox"
       v-bind:checked="checked"
       v-on:change="$emit('change', $event.target.checked)"
     >
   `
 })
 <base-checkbox v-model="lovingVue"></base-checkbox>
 这里的 lovingVue 的值将会传入这个名为 checked 的 prop。同时当 <base-checkbox> 触发一个 change 事件并附带一个新的值的时候，这个 lovingVue 的属性将会被更新
 .sync:
 <text-document v-bind:title.sync="doc.title"></text-document>
 this.$emit('update:title', newTitle)
 ```
 ## 十三 生命周期钩子
 * beforeCreate:在实例初始化之后，数据观测（data observer）和event/watcher事件配置之前被调用。貌似这时候啥也不能干，就静静得看着。
 * created:在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
 * beforeMount:在挂载开始之前被调用：相关的 render 函数首次被调用。 该钩子在服务器端渲染期间不被调用。
 * mounted:el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内，该钩子在服务器端渲染期间不被调用。注意 mounted 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 vm.$nextTick 替换掉 mounted:
 ```
 mounted: function () {
   this.$nextTick(function () {
     // Code that will run only after the
     // entire view has been rendered
   })
 }
 ```
 * beforeUpdate:数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端进行。
 * updated:由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或 watcher 取而代之。注意 updated 不会承诺所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以用 vm.$nextTick 替换掉 updated,
 该钩子在服务器端渲染期间不被调用。
 * activated:keep-alive 组件激活时调用。该钩子在服务器端渲染期间不被调用。
 * deactivated:keep-alive 组件停用时调用,该钩子在服务器端渲染期间不被调用。
 * beforeDestroy:实例销毁之前调用。在这一步，实例仍然完全可用,该钩子在服务器端渲染期间不被调用。
 * destroyed:Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用。
 * errorCaptured: 当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。     
  
 ## 十四  VueX的使用场景
 解决的痛点是：
 * 多个视图依赖于同一状态。
 * 来自不同视图的行为需要变更同一状态。
 
 Vuex 可以帮助我们管理共享状态，并附带了更多的概念和框架。这需要对短期和长期效益进行权衡。
 
 如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。确实是如此——如果您的应用够简单，您最好不要使用 Vuex。一个简单的 store 模式就足够您所需了。但是，如果您需要构建一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。
 
 ## 十五 react和vue对比
 相似点：
 *  使用 Virtual DOM
 *  提供了响应式 (Reactive) 和组件化 (Composable) 的视图组件。
  * 将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库。
   
 性能：
 React 和 Vue 都是非常快的，所以速度并不是在它们之中做选择的决定性因素。对于具体的数据表现，可以移步这个第三方 benchmark，它专注于渲染/更新非常简单的组件树的真实性能。  
 
 HTML/CSS:
 在 React 中，一切都是 JavaScript。不仅仅是 HTML 可以用 JSX 来表达，现在的潮流也越来越多地将 CSS 也纳入到 JavaScript 中来处理。这类方案有其优点，但也存在一些不是每个开发者都能接受的取舍. Vue 的整体思想是拥抱经典的 Web 技术，并在其上进行扩展。
 
 原生渲染：
 React Native 能使你用相同的组件模型编写有本地渲染能力的 APP (iOS 和 Android)。能同时跨多平台开发，对开发者是非常棒的。相应地，Vue 和 Weex 会进行官方合作，Weex 是阿里巴巴发起的跨平台用户界面开发框架，同时也正在 Apache 基金会进行项目孵化，Weex 允许你使用 Vue 语法开发不仅仅可以运行在浏览器端，还能被用于开发 iOS 和 Android 上的原生应用的组件。在现在，Weex 还在积极发展，成熟度也不能和 React Native 相抗衡。但是，Weex 的发展是由世界上最大的电子商务企业的需求在驱动，Vue 团队也会和 Weex 团队积极合作确保为开发者带来良好的开发体验。 
 
 ## 十六 nextTick
 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM（DOM树更新，未发生UI Render）。
 ```
 // 修改数据
 vm.msg = 'Hello'
 // DOM 还没有更新
 Vue.nextTick(function () {
   // DOM 更新了
 })
 
 // 作为一个 Promise 使用 (2.1.0 起新增，详见接下来的提示)
 Vue.nextTick()
   .then(function () {
     // DOM 更新了
   })
 ```
 ## 十七 Vue-cli 版本对比
  
 能对比个毛线...无非是封装了更多东西，越来越像create-react-app创建出来的项目目录了，能隐藏的都隐藏了。
 
 ## 十八 v-for和v-if避免用在一起
 
 因为v-for比v-if拥有更高的优先级，这意味着每个v-for的元素都会执行v-if，会相当消耗性能。看需求决定谁在外，谁在内。 
 
 ## 十九 nextTick的实现原理
 
 尽管MVVM框架并不推荐访问DOM，但有时候确实会有这样的需求，尤其是和第三方插件进行配合的时候，免不了要进行DOM操作。而nextTick就提供了一个桥梁，确保我们操作的是更新后的DOM。
 ```
 MutationObserver是HTML5新增的属性，用于监听DOM修改事件，能够监听到节点的属性、文本内容、子节点等的改动，是一个功能强大的利器，基本用法如下：
 //MO基本用法
 var observer = new MutationObserver(function(){
   //这里是回调函数
   console.log('DOM被修改了！');
 });
 var article = document.querySelector('article');
 observer.observer(article);
 
 // 以下是vue.nextTick的源码
 if (typeof MutationObserver !== 'undefined' && (isNative(MutationObserver) || MutationObserver.toString() === '[object MutationObserverConstructor]')) {
  var counter = 1
  var observer = new MutationObserver(nextTickHandler)
  var textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
      characterData: true
   })
   timerFunc = () => {
      counter = (counter + 1) % 2
      textNode.data = String(counter)
   }
 }
 简单解释一下，如果检测到浏览器支持MO，则创建一个文本节点，监听这个文本节点的改动事件，以此来触发nextTickHandler（也就是DOM更新完毕回调）的执行。后面的代码中，会执行手工修改文本节点属性，这样就能进入到回调函数了。
 
 准备的说，vue不是使用MO进行变动监听，而是使用队列控制的方式达到目的，因为每次event loop的最后，都会有一个UI render的步骤，也就是更新DOM，只要让nextTick的代码放到UI render的后面执行，就能访问到更新的DOM。
 
 那么vue是如果进行队列控制的？使用setTimeout？可以实现，但是存在很大缺陷，就是无法保证性能，极可能存在性能浪费，要弄清这个问题的话，我们必须要提到另外两个名词：microtask,macrotask。
 task队列中的任务被叫做macrotask，每一次事件循环都包含一个microtask队列，在循环结束后会依次执行队列中的microtask并移除，然后再开始下一次事件循环。在执行microtask的过程中后加入microtask队列的微任务，也会在下一次事件循环之前被执行。也就是说，macrotask总要等到microtask都执行完后才能执行，microtask有着更高的优先级。
 microtask的这一特性，简直是做队列控制的最佳选择啊！vue进行DOM更新内部也是调用nextTick来做异步队列控制。而当我们自己调用nextTick的时候，它就在更新DOM的那个microtask后追加了我们自己的回调函数，从而确保我们的代码在DOM更新后执行，同时也避免了setTimeout可能存在的多次执行问题。
 
 常见的microtask有：Promise、MutationObserver、Object.observe(废弃)，以及nodejs中的process.nextTick.
 咦？好像看到了MutationObserver，难道说vue用MO是想利用它的microtask特性，而不是想做DOM监听？对喽，就是这样的。核心是microtask，用不用MO都行的。事实上，vue在2.5版本中已经删去了MO相关的代码，因为它是HTML5新增的特性，在iOS上尚有bug。
 
 那么最优的microtask策略就是Promise了，而令人尴尬的是，Promise是ES6新增的东西，也存在兼容问题呀~ 所以vue就面临一个降级策略。
 
 vue的降级策略：上面我们讲到了，队列控制的最佳选择是microtask，而microtask的最佳选择是Promise.但如果当前环境不支持Promise，vue就不得不降级为macrotask来做队列控制了。macrotask有哪些可选的方案呢？前面提到了setTimeout是一种，但它不是理想的方案。因为setTimeout执行的最小时间间隔是约4ms的样子，略微有点延迟。还有其他的方案吗？在vue2.5的源码中，macrotask降级的方案依次是：setImmediate、MessageChannel、setTimeout.  setImmediate是最理想的方案了，可惜的是只有IE和nodejs支持。MessageChannel的onmessage回调也是microtask，但也是个新API，面临兼容性的尴尬...所以最后的兜底方案就是setTimeout了，尽管它有执行延迟，可能造成多次渲染，算是没有办法的办法了.
 
 附上vue源码：
 if (typeof Promise !== 'undefined' && isNative(Promise)) {
   var p = Promise.resolve();
   timerFunc = function () {
     p.then(flushCallbacks);
     // In problematic UIWebViews, Promise.then doesn't completely break, but
     // it can get stuck in a weird state where callbacks are pushed into the
     // microtask queue but the queue isn't being flushed, until the browser
     // needs to do some other work, e.g. handle a timer. Therefore we can
     // "force" the microtask queue to be flushed by adding an empty timer.
     if (isIOS) { setTimeout(noop); }
   };
   isUsingMicroTask = true;
 } else if (!isIE && typeof MutationObserver !== 'undefined' && (
   isNative(MutationObserver) ||
   // PhantomJS and iOS 7.x
   MutationObserver.toString() === '[object MutationObserverConstructor]'
 )) {
   // Use MutationObserver where native Promise is not available,
   // e.g. PhantomJS, iOS7, Android 4.4
   // (#6466 MutationObserver is unreliable in IE11)
   var counter = 1;
   var observer = new MutationObserver(flushCallbacks);
   var textNode = document.createTextNode(String(counter));
   observer.observe(textNode, {
     characterData: true
   });
   timerFunc = function () {
     counter = (counter + 1) % 2;
     textNode.data = String(counter);
   };
   isUsingMicroTask = true;
 } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
   // Fallback to setImmediate.
   // Techinically it leverages the (macro) task queue,
   // but it is still a better choice than setTimeout.
   timerFunc = function () {
     setImmediate(flushCallbacks);
   };
 } else {
   // Fallback to setTimeout.
   timerFunc = function () {
     setTimeout(flushCallbacks, 0);
   };
 }
```

## 二十 vue的异步更新队列
vue在更新DOM时是异步执行的，只要侦听到数据变化，vue将开启一个队列，并缓冲在同一个事件循环中发生的所有数据更新。如果同一个watcher被多次触发，只会被推入队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和DOM操作是非常重要的。然后，在下一个的事件循环'tick'中，vue刷新队列并执行实际工作。vue在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。


 
 
                 
               

                                

                                                                           

 
 
 
