## 算法与数据结构
### 一 如何分析、统计算法的执行效率和资源消耗
[github地址](https://github.com/sisterAn/JavaScript-Algorithms/issues/1)

一、为什么引入复杂度分析

我们知道，好的数据结构与算法能够大大缩短代码的执行时间与存储空间，那么我们如何去衡量它喃？本节就主要介绍算法性能的衡量指标—复杂度分析。

判断一段代码执行的效率最简单最直观的方式就是把它放在机器上执行一遍，自然就会得到算法的执行时间与占用内存大小。那么为什么还要引入复杂度分析喃？

这主要是因为，通过机器上运行代码来统计算法的性能，有很大的局限性，它容易受测试环境、数据规模影响：

统计结果易受测试环境影响：不同系统、处理器的机器测试结果可能出现很大的不同
统计结果易受数据本身、数据规模影响：不同的数据、不同长度的数据都可能对测试结果产生巨大的影响
而这些都不是我们想要看到的。我们需要的是不受外在因素影响的、大致的估计算法执行效率的方法。这就是使用复杂度分析的原因。

二、如何表示复杂度
如何表示算法复杂度，具体来讲就是代码执行的时间、执行消耗的存储空间。例如：
```
function cal(n) {
    let sum = 0; // 1 unit_time
    let i = 0; // 1 unit_time
    for(; i <= n; i++) { // n unit_time
        sum += i; // n unit_time
    }
    return sum
}
```
从 CPU 的角度看，每段代码不过是读写数据或操作数据，尽管每次操作 CPU 执行的个数、执行的时间都不同，但我们粗咯把每次执行的时间都一致，称为 unit_time 。

所以上述代码总共执行 (2n+2)*unit_time 时间，即：T(n)=(2n+2)*unit_time ，所以，我们可以写成：

T(n) = O(f(n))
其中：

n：表示数据规模的大小
f(n)：表示每行代码执行的次数总和
O：表示代码的执行时间 T(n) 与 f(n) 表达式成正比
当 n 很大时，例如 10000，甚至更大，T(n) = O(f(n)) 可以表示为 T(n) = O(n) 。

这就是大 O 时间复杂度表示法。大 O 时间复杂度实际上并不具体表示代码真正的执行时间，而是表示代码执行时间随数据规模增长的变化趋势，所以，也叫作渐进时间复杂度（asymptotic time complexity），简称时间复杂度。

三、时间复杂度
当 n 无限大时，时间复杂度 T(n) 受 n 的最高数量级影响最大，与f(n) 中的常量、低阶、系数关系就不那么大了。所以我们分析代码的时间复杂度时，仅仅关注代码执行次数最多的那段就可以了。

看一个例子：
```
function fun1(n) {
    let sum = 0,i = 0; 
    for(; i <= n; i++) {
        sum += i; 
    }
    return sum
}
function fun2(n) {
    let sum = 0, sum1 = 0, i = 0, j = 0; 
    for(; i <= n; i++) { // 循环1
        sum += i; 
    }
    for(i = 0; i <= n; i++) { // 循环2
        for(j = 0; j <= n; j++) { 
            sum += i * j; 
        }
    }
    return sum
}
function fun3(n) {
    let sum = 0, i = 0; 
    for(; i <= n; i++) { 
        sum += fun(i); 
    }
    return sum
```
fun1 中第1行都是常量，对 n 的影响不大，所以总的时间复杂度要看第2、3行的循环，即时间复杂度为： O(n) 。

fun2 中循环1的时间复杂度为 O(n) ，循环2的时间复杂度为 O(n2)，当 n 趋于无穷大时，总体的时间复杂度要趋于 O(n2) ，即上面代码的时间复杂度是 O(n2)。

fun3 的时间复杂度是 O(n * T(fun)) = O(n*n) ，即 O(n2) 。

所以：T(c+n)=O(n)，T(m+n)=O(max(m, n))，T(n) = T1(n) T2(m) = O(nm)，其中 c 为常量

常见复杂度（按数量阶递增）
多项式量级：

常量阶： O(1)：当算法中不存在循环语句、递归语句，即使有成千上万行的代码，其时间复杂度也是Ο(1)
对数阶：O(logn): 简单介绍一下
```
let i=1;
while (i <= n)  {
  i = i * 2;
}
```
每次循环 i 都乘以 2 ，直至 i > n ，即执行过程是：20、21、22、…、2k、…、2x、 n
所以总执行次数 x ，可以写成 2x = n ，则时间复杂度为 O(log2n) 。这里是 2 ，也可以是其他常量 k ，时间复杂度也是： O(log3n) = O(log32 * log2n) = O(log2n)
线性阶：O(n)
线性对数阶：O(nlogn)
平方阶、立方阶、….、k次方阶：O(n2)、O(n3)、…、O(nk)
非多项式量阶：

指数阶：O(2k)
阶乘阶：O(n!)
四、空间复杂度
时间复杂度表示算法的执行时间与数据规模之间的增长关系。类比一下，空间复杂度表示算法的存储空间与数据规模之间的增长关系。例如：
```
function fun(n) {
    let a = [];
    for (let i = 0; i < n; i++) {
        a.push(i);
    }
    return a;
}
```
以上代码我们可以清晰的看出代码执行的空间为 O(1+n) = O(n)，即为 i 及数组 a 占用的储存空间。

所以，空间复杂度分析比时间复杂度分析要简单很多。

五、平均时间复杂度
时间复杂度受数据本身影响，还分为：

最好时间复杂度：在最理想的情况下，执行这段代码的时间复杂度
最坏时间复杂度：在最糟糕的情况下，执行这段代码的时间复杂度
平均时间复杂度：所有情况下，求一个平均值，可以省略掉系数、低阶、常量

### 二 从Chrome V8源码看JavaScript数组
[github地址](https://github.com/sisterAn/JavaScript-Algorithms/issues/2)

一、数组（基础）
一种最基础的数据结构，每种编程语言都有，它编号从 0 开始，代表一组连续的储存结构，用来储存同一种类型的数据。
```
let arr = [1, 2, 3]
```

它的这种特定的存储结构（连续存储空间存储同一类型数据）决定了：

优点

随机访问：可以通过下标随机访问数组中的任意位置上的数据
缺点

对数据的删除和插入不是很友好
查找： 根据下标随机访问的时间复杂度为 O(1)；

插入或删除： 时间复杂度为 O(n)；

在 JavaScript 中的数组几乎是万能的，它不光可以作为一个普通的数组使用，可以作为栈或队列使用。

数组：
```
let array = [1, 2, 3]
栈：

let stack = [1, 2, 3]
// 进栈
stack.push(4)
// 出栈
stcak.pop()
队列：

let queue = [1, 2, 3]
// 进队
queue.push(4)
// 出队
queue.shift()
```
二、JavaScript 中，数组可以保存不同类型值
看一下 Chrome v8 源码：
```
// The JSArray describes JavaScript Arrays
//  Such an array can be in one of two modes:
//    - fast, backing storage is a FixedArray and length <= elements.length();
//       Please note: push and pop can be used to grow and shrink the array.
//    - slow, backing storage is a HashTable with numbers as keys.
class JSArray: public JSObject {
 public:
  // [length]: The length property.
  DECL_ACCESSORS(length, Object)
    
  // ...
   
  // Number of element slots to pre-allocate for an empty array.
  static const int kPreallocatedArrayElements = 4;
};
```
我们可以看到 JSArray 是继承自 JSObject 的，所以在 JavaScript 中，数组可以是一个特殊的对象，内部也是以 key-value 形式存储数据，所以 JavaScript 中的数组可以存放不同类型的值。

三、JavaScript 中，数组的存储
```
// The JSArray describes JavaScript Arrays
//  Such an array can be in one of two modes:
//    - fast, backing storage is a FixedArray and length <= elements.length();
//       Please note: push and pop can be used to grow and shrink the array.
//    - slow, backing storage is a HashTable with numbers as keys.
class JSArray: public JSObject {
 public:
  // [length]: The length property.
  DECL_ACCESSORS(length, Object)
    
  // ...
   
  // Number of element slots to pre-allocate for an empty array.
  static const int kPreallocatedArrayElements = 4;
};
```
JSArray 继承于 JSObject ，从注释上看，它有两种存储方式：

fast：存储结构是 FixedArray ，并且数组长度 <= elements.length() ，push 或 pop 时可能会伴随着动态扩容或减容
slow：存储结构是 HashTable（哈希表），并且数组下标作为 key
fast 模式下数组在源码里面叫 FastElements ，而 slow 模式下的叫做 SlowElements 。

1. 快数组（FastElements）
FixedArray 是 V8 实现的一个类似于数组的类，它表示一段连续的内存，可以使用索引直接定位。新创建的空数组默认就是快数组。当数组满（数组的长度达到数组在内存中申请的内存容量最大值）的时候，继续 push 时， JSArray 会进行动态的扩容，以存储更多的元素。

2. 慢数组（SlowElements）
慢数组以哈希表的形式存储在内存空间里，它不需要开辟连续的存储空间，但需要额外维护一个哈希表，与快数组相比，性能相对较差。
```
// src/objects/dictionary.h
class EXPORT_TEMPLATE_DECLARE(V8_EXPORT_PRIVATE) Dictionary
    : public HashTable<Derived, Shape> {
  using DerivedHashTable = HashTable<Derived, Shape>;

 public:
  using Key = typename Shape::Key;
  // Returns the value at entry.
  inline Object ValueAt(InternalIndex entry);
  inline Object ValueAt(const Isolate* isolate, InternalIndex entry);
  
  // ...
};
```
从源码中可以看出，它的内部就是一个 HashTable。

3. 什么时候会从 fast 转变为 slow 喃？
从 Chrome V8 源码上看，
```
// src/objects/js-objects.h
static const uint32_t kMaxGap = 1024;

// src/objects/dictionary.h
// JSObjects prefer dictionary elements if the dictionary saves this much
// memory compared to a fast elements backing store.
static const uint32_t kPreferFastElementsSizeFactor = 3;

// src/objects/js-objects-inl.h
// If the fast-case backing storage takes up much more memory than a dictionary
// backing storage would, the object should have slow elements.
// static
static inline bool ShouldConvertToSlowElements(uint32_t used_elements,
                                               uint32_t new_capacity) {
  uint32_t size_threshold = NumberDictionary::kPreferFastElementsSizeFactor *
                            NumberDictionary::ComputeCapacity(used_elements) *
                            NumberDictionary::kEntrySize;
  // 快数组新容量是扩容后的容量3倍之多时，也会被转成慢数组
  return size_threshold <= new_capacity;
}

static inline bool ShouldConvertToSlowElements(JSObject object,
                                               uint32_t capacity,
                                               uint32_t index,
                                               uint32_t* new_capacity) {
  STATIC_ASSERT(JSObject::kMaxUncheckedOldFastElementsLength <=
                JSObject::kMaxUncheckedFastElementsLength);
  if (index < capacity) {
    *new_capacity = capacity;
    return false;
  }
  // 当加入的索引值（例如例3中的2000）比当前容量capacity 大于等于 1024时，
  // 返回true，转为慢数组
  if (index - capacity >= JSObject::kMaxGap) return true;
  *new_capacity = JSObject::NewElementsCapacity(index + 1);
  DCHECK_LT(index, *new_capacity);
  // TODO(ulan): Check if it works with young large objects.
  if (*new_capacity <= JSObject::kMaxUncheckedOldFastElementsLength ||
      (*new_capacity <= JSObject::kMaxUncheckedFastElementsLength &&
       ObjectInYoungGeneration(object))) {
    return false;
  }
  return ShouldConvertToSlowElements(object.GetFastElementsUsage(),
                                     *new_capacity);
}
```
所以，当处于以下情况时，快数组会被转变为慢数组：

当加入的索引值 index 比当前容量 capacity 差值大于等于 1024 时（index - capacity >= 1024）
快数组新容量是扩容后的容量 3 倍之多时
例如：向快数组里增加一个大索引同类型值
```
var arr = [1, 2, 3]
arr[2000] = 10;
```
当往 arr 增加一个 2000 的索引时，arr 被转成慢数组。节省了大量的内存空间（从索引为 2 到索引为 2000）。

4. 什么时候会从 slow 转变为 fast 喃？
我们已经知道在什么时候会出现由快变慢，那由慢变快就很简单了
```
static bool ShouldConvertToFastElements(JSObject object,
                                        NumberDictionary dictionary,
                                        uint32_t index,
                                        uint32_t* new_capacity) {
  // If properties with non-standard attributes or accessors were added, we
  // cannot go back to fast elements.
  if (dictionary.requires_slow_elements()) return false;
  // Adding a property with this index will require slow elements.
  if (index >= static_cast<uint32_t>(Smi::kMaxValue)) return false;
  if (object.IsJSArray()) {
    Object length = JSArray::cast(object).length();
    if (!length.IsSmi()) return false;
    *new_capacity = static_cast<uint32_t>(Smi::ToInt(length));
  } else if (object.IsJSArgumentsObject()) {
    return false;
  } else {
    *new_capacity = dictionary.max_number_key() + 1;
  }
  *new_capacity = Max(index + 1, *new_capacity);
  uint32_t dictionary_size = static_cast<uint32_t>(dictionary.Capacity()) *
                             NumberDictionary::kEntrySize;
  // Turn fast if the dictionary only saves 50% space.
  return 2 * dictionary_size >= *new_capacity;
}
```
当慢数组的元素可存放在快数组中且长度在 smi 之间且仅节省了50%的空间，则会转变为快数组

四、JavaScript 中，数组的动态扩容与减容（FastElements）
默认空数组初始化大小为 4 :
```
// Number of element slots to pre-allocate for an empty array.
static const int kPreallocatedArrayElements = 4;
```
在 JavaScript 中，当数组执行 push 操作时，一旦发现数组内存不足，将进行扩容。

在 Chrome 源码中， push 的操作是用汇编实现的，在 c++ 里嵌入的汇编，以提高执行效率，并且在汇编的基础上用 c++ 封装了一层，在编译执行的时候，会将这些 c++ 代码转成汇编代码。

计算新容量的函数：
```
// js-objects.h
static const uint32_t kMinAddedElementsCapacity = 16;

// code-stub-assembler.cc
Node* CodeStubAssembler::CalculateNewElementsCapacity(Node* old_capacity,
                                                      ParameterMode mode) {
  CSA_SLOW_ASSERT(this, MatchesParameterMode(old_capacity, mode));
  Node* half_old_capacity = WordOrSmiShr(old_capacity, 1, mode);
  Node* new_capacity = IntPtrOrSmiAdd(half_old_capacity, old_capacity, mode);
  Node* padding =
      IntPtrOrSmiConstant(JSObject::kMinAddedElementsCapacity, mode);
  return IntPtrOrSmiAdd(new_capacity, padding, mode);
}
```
所以扩容后新容量计公式为：

new_capacity = old_capacity /2 + old_capacity + 16

即老的容量的 1.5 倍加上 16 。初始化为 4 个，当 push 第 5 个的时候，容量将会变成：

new_capacity = 4 / 2 + 4 + 16 = 22

接着申请一块这么大的内存，把老的数据拷过去，把新元素放在当前 length 位置，然后将数组的 length + 1，并返回 length。

所以，扩容可以分为以下几步：

push 操作时，发现数组内存不足
申请 new_capacity = old_capacity /2 + old_capacity + 16 那么长度的内存空间
将数组拷贝到新内存中
把新元素放在当前 length 位置
数组的 length + 1
返回 length
整个过程，用户是无感知的，不像 C，需用用户手动申请内存空间。

当数组执行 pop 操作时，会判断 pop 后数组的容量，是否需要进行减容。

不同于数组的 push 使用汇编实现的， pop 使用 c++ 实现的。

判断是否进行减容：
```
if (2 * length <= capacity) {
  // If more than half the elements won't be used, trim the array.
  isolate->heap()->RightTrimFixedArray(*backing_store, capacity - length);
} else {
  // Otherwise, fill the unused tail with holes.
  BackingStore::cast(*backing_store)->FillWithHoles(length, old_length);
}
```
所以，当数组 pop 后，如果数组容量大于等于 length 的 2 倍，则进行容量调整，使用 RightTrimFixedArray 函数，计算出需要释放的空间大小，做好标记，等待 GC 回收；如果数组容量小于 length 的 2 倍，则用 holes 对象填充。

所以，减容可以分为以下几步：

pop 操作时，获取数组 length
获取 length - 1 上的元素（要删除的元素）
数组 length - 1
判断数组的总容量是否大于等于 length - 1 的 2 倍
是的话，使用 RightTrimFixedArray 函数，计算出需要释放的空间大小，并做好标记，等待 GC 回收
不是的话，用 holes 对象填充
返回要删除的元素
五、解答开篇问题
JavaScript 中， JSArray 继承自 JSObject ，或者说它就是一个特殊的对象，内部是以 key-value 形式存储数据，所以 JavaScript 中的数组可以存放不同类型的值。它有两种存储方式，快数组与慢数组，初始化空数组时，使用快数组，快数组使用连续的内存空间，当数组长度达到最大时，JSArray 会进行动态的扩容，以存储更多的元素，相对慢数组，性能要好得多。当数组中 hole 太多时，会转变成慢数组，即以哈希表的方式（ key-value 的形式）存储数据，以节省内存空间。

六、最后附赠一道前端面试题（腾讯）：数组扁平化、去重、排序
关于 Array 的属性、方法这里不再做介绍，详看 MDN Array 。

面试题：

已知如下数组：var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];

编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组

答案：
```
var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10]
// 扁平化
let flatArr = arr.flat(4)
// 去重
let disArr = Array.from(new Set(flatArr))
// 排序
let result = disArr.sort(function(a, b) {
    return a-b
})
console.log(result)
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
```
